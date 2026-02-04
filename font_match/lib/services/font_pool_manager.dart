import 'dart:async';
import 'dart:collection';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../models/font_pair.dart';

class FontPoolSnapshot {
  const FontPoolSnapshot({
    required this.totalFamilies,
    required this.activeFamilies,
    required this.warmFamilies,
    required this.activeRemaining,
    required this.readyPairs,
    required this.isWarmPoolReady,
  });

  final int totalFamilies;
  final int activeFamilies;
  final int warmFamilies;
  final int activeRemaining;
  final int readyPairs;
  final bool isWarmPoolReady;
}

class FontPoolManager {
  FontPoolManager({
    this.batchSize = 10,
    this.lowWatermark = 3,
    this.preloadConcurrency = 3,
    this.readyPairTarget = 6,
    this.familyLoadTimeout = const Duration(milliseconds: 1500),
    this.interactionCooldown = const Duration(milliseconds: 450),
    Random? random,
  }) : _random = random ?? Random();

  static const TextStyle _primaryPreviewStyle = TextStyle(
    fontSize: 30,
    fontWeight: FontWeight.w600,
  );

  static const TextStyle _secondaryPreviewStyle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w500,
  );

  final int batchSize;
  final int lowWatermark;
  final int preloadConcurrency;
  final int readyPairTarget;
  final Duration familyLoadTimeout;
  final Duration interactionCooldown;
  final Random _random;

  final Queue<String> _catalogQueue = Queue<String>();
  final Queue<FontPair> _readyPairs = Queue<FontPair>();

  final Set<String> _preloadedFamilies = <String>{};
  final Map<String, Future<bool>> _inflightPreloads = <String, Future<bool>>{};
  final Map<String, _PreviewStyles> _previewStyles = <String, _PreviewStyles>{};

  List<String> _allFamilies = <String>[];
  List<String> _activeFamilies = <String>[];
  List<String> _warmFamilies = <String>[];

  final List<String> _activeDeck = <String>[];

  Future<void>? _warmupFuture;

  FontPair? _lastServedPair;

  bool _isInitialized = false;
  bool _isMaintaining = false;
  bool _maintenanceQueued = false;
  bool _maintenanceDispatchScheduled = false;
  DateTime _lastInteractionAt = DateTime.fromMillisecondsSinceEpoch(0);

  FontPoolSnapshot get snapshot => FontPoolSnapshot(
    totalFamilies: _allFamilies.length,
    activeFamilies: _activeFamilies.length,
    warmFamilies: _warmFamilies.length,
    activeRemaining: _activeDeck.length,
    readyPairs: _readyPairs.length,
    isWarmPoolReady: _warmFamilies.isNotEmpty,
  );

  Future<void> initialize() async {
    if (_isInitialized) {
      return;
    }

    _allFamilies = GoogleFonts.asMap().keys.toList(growable: false);
    if (_allFamilies.length < 2) {
      throw StateError('Expected at least two Google Font families.');
    }

    _refillCatalogQueue();

    _activeFamilies = await _pickAndPreloadBatch(
      count: batchSize,
      avoid: <String>{},
    );

    if (_activeFamilies.length < 2) {
      throw StateError('Could not preload enough fonts to start.');
    }

    _resetActiveDeck();
    _startWarmupIfNeeded();
    _fillReadyPairsSync();

    _isInitialized = true;
    _scheduleMaintenance();
  }

  Future<FontPair> nextPair() async {
    if (!_isInitialized) {
      await initialize();
    }

    final FontPair? pair = _readyPairs.isNotEmpty
        ? _readyPairs.removeFirst()
        : _lastServedPair ?? _drawFallbackPair();

    if (pair == null) {
      throw StateError('No font pair available.');
    }

    _lastInteractionAt = DateTime.now();
    _lastServedPair = pair;
    _scheduleMaintenance();
    return pair;
  }

  TextStyle styleFor(
    String family, {
    double size = 32,
    FontWeight weight = FontWeight.w500,
    Color? color,
  }) {
    final _PreviewStyles? cached = _previewStyles[family];
    if (cached == null) {
      return TextStyle(fontSize: size, fontWeight: weight, color: color);
    }

    final bool isPrimary =
        size == _primaryPreviewStyle.fontSize &&
        weight == _primaryPreviewStyle.fontWeight;
    final bool isSecondary =
        size == _secondaryPreviewStyle.fontSize &&
        weight == _secondaryPreviewStyle.fontWeight;

    final TextStyle baseStyle = isPrimary
        ? cached.primary
        : isSecondary
        ? cached.secondary
        : cached.primary.copyWith(fontSize: size, fontWeight: weight);

    if (color == null) {
      return baseStyle;
    }

    return baseStyle.copyWith(color: color);
  }

  void _scheduleMaintenance() {
    if (_isMaintaining) {
      _maintenanceQueued = true;
      return;
    }

    if (_maintenanceDispatchScheduled) {
      return;
    }

    final Duration remainingCooldown = _remainingInteractionCooldown();
    if (remainingCooldown > Duration.zero) {
      _maintenanceDispatchScheduled = true;
      unawaited(
        Future<void>.delayed(remainingCooldown, () {
          _maintenanceDispatchScheduled = false;
          _scheduleMaintenance();
        }),
      );
      return;
    }

    _maintenanceDispatchScheduled = true;
    unawaited(
      Future<void>.delayed(const Duration(milliseconds: 1), () async {
        _maintenanceDispatchScheduled = false;
        if (_isMaintaining) {
          _maintenanceQueued = true;
          return;
        }

        _isMaintaining = true;
        do {
          _maintenanceQueued = false;
          await _runMaintenance();
        } while (_maintenanceQueued);

        _isMaintaining = false;
      }),
    );
  }

  Future<void> _runMaintenance() async {
    _startWarmupIfNeeded();

    if (_activeDeck.length <= lowWatermark && _warmFamilies.isNotEmpty) {
      _activateWarmPool();
    }

    _fillReadyPairsSync();

    if (_readyPairs.length < readyPairTarget && _activeDeck.length < 2) {
      await _waitForWarmPoolIfNeeded();
      _fillReadyPairsSync();
    }

    _startWarmupIfNeeded();
  }

  void _fillReadyPairsSync() {
    while (_readyPairs.length < readyPairTarget) {
      _ensureDeckForTapPath();
      if (_activeDeck.length < 2) {
        break;
      }

      final FontPair pair = _drawPairFromActiveDeck();
      _readyPairs.addLast(pair);

      if (_activeDeck.length <= lowWatermark) {
        if (_warmFamilies.isNotEmpty) {
          _activateWarmPool();
        }
        _startWarmupIfNeeded();
      }
    }
  }

  FontPair? _drawFallbackPair() {
    _ensureDeckForTapPath();
    if (_activeDeck.length >= 2) {
      return _drawPairFromActiveDeck();
    }

    final List<String> loaded = _preloadedFamilies.toList(growable: false);
    if (loaded.length < 2) {
      return null;
    }

    final String first = loaded[_random.nextInt(loaded.length)];
    String second = first;
    while (second == first) {
      second = loaded[_random.nextInt(loaded.length)];
    }

    return FontPair(primary: first, secondary: second);
  }

  void _ensureDeckForTapPath() {
    if (_activeDeck.length >= 2) {
      return;
    }

    if (_warmFamilies.isNotEmpty) {
      _activateWarmPool();
      return;
    }

    if (_activeFamilies.length >= 2) {
      _resetActiveDeck();
    }
  }

  FontPair _drawPairFromActiveDeck() {
    final String first = _drawFromActiveDeck();
    String second = _drawFromActiveDeck();

    if (first == second) {
      _ensureDeckForTapPath();
      if (_activeDeck.isNotEmpty) {
        second = _drawFromActiveDeck();
      }
    }

    return FontPair(primary: first, secondary: second);
  }

  Future<void> _waitForWarmPoolIfNeeded() async {
    final Future<void>? warmup = _warmupFuture;
    if (warmup == null) {
      return;
    }

    try {
      await warmup;
    } catch (_) {
      return;
    }

    if (_warmFamilies.isNotEmpty) {
      _activateWarmPool();
    }
  }

  void _activateWarmPool() {
    _activeFamilies = List<String>.from(_warmFamilies);
    _warmFamilies = <String>[];
    _resetActiveDeck();
    _startWarmupIfNeeded();
  }

  void _startWarmupIfNeeded() {
    if (_warmFamilies.isNotEmpty || _warmupFuture != null) {
      return;
    }

    _warmupFuture = Future<void>.delayed(const Duration(milliseconds: 1))
        .then((_) => _prepareWarmPool())
        .catchError((_) {})
        .whenComplete(() {
          _warmupFuture = null;
          _scheduleMaintenance();
        });
  }

  Future<void> _prepareWarmPool() async {
    _warmFamilies = await _pickAndPreloadBatch(
      count: batchSize,
      avoid: _activeFamilies.toSet(),
    );
  }

  Future<List<String>> _pickAndPreloadBatch({
    required int count,
    required Set<String> avoid,
  }) async {
    final int target = min(count, _allFamilies.length);
    final Set<String> loaded = <String>{};
    final Set<String> attempted = <String>{};

    final int maxAttempts = _allFamilies.length * 2;

    while (loaded.length < target && attempted.length < maxAttempts) {
      await _waitForInteractionCooldown();

      final List<String> chunk = _takeCandidateChunk(
        attempted: attempted,
        avoid: avoid,
      );

      if (chunk.isEmpty) {
        break;
      }

      final List<bool> results = await Future.wait(chunk.map(_preloadFamily));
      for (int index = 0; index < chunk.length; index += 1) {
        if (results[index]) {
          loaded.add(chunk[index]);
        }
      }

      // Yield so batch prep doesn't monopolize the UI isolate on web.
      await Future<void>.delayed(Duration.zero);
    }

    if (loaded.length < target) {
      final List<String> fallback =
          _preloadedFamilies
              .where((String family) => !avoid.contains(family))
              .toList()
            ..shuffle(_random);

      for (final String family in fallback) {
        if (loaded.length == target) {
          break;
        }
        loaded.add(family);
      }
    }

    final List<String> result = loaded.toList(growable: false)
      ..shuffle(_random);
    return result;
  }

  List<String> _takeCandidateChunk({
    required Set<String> attempted,
    required Set<String> avoid,
  }) {
    final List<String> chunk = <String>[];
    final int chunkTarget = preloadConcurrency.clamp(1, batchSize);

    while (chunk.length < chunkTarget &&
        attempted.length < _allFamilies.length) {
      final String candidate = _nextCatalogFamily();
      if (avoid.contains(candidate) || attempted.contains(candidate)) {
        continue;
      }

      attempted.add(candidate);
      chunk.add(candidate);
    }

    return chunk;
  }

  Future<bool> _preloadFamily(String family) {
    if (_preloadedFamilies.contains(family)) {
      return Future<bool>.value(true);
    }

    final Future<bool>? inflight = _inflightPreloads[family];
    if (inflight != null) {
      return inflight;
    }

    final Future<bool> future = _preloadFamilyInternal(family);
    _inflightPreloads[family] = future;

    return future.whenComplete(() {
      _inflightPreloads.remove(family);
    });
  }

  Future<bool> _preloadFamilyInternal(String family) async {
    final List<TextStyle> styles = <TextStyle>[
      GoogleFonts.getFont(family, textStyle: _primaryPreviewStyle),
      GoogleFonts.getFont(family, textStyle: _secondaryPreviewStyle),
    ];

    try {
      await GoogleFonts.pendingFonts(styles).timeout(familyLoadTimeout);
      final _PreviewStyles previewStyles = _PreviewStyles(
        primary: styles[0],
        secondary: styles[1],
      );
      await _waitForInteractionCooldown();
      await _primeTextLayout(previewStyles.primary);
      await _waitForInteractionCooldown();
      await _primeTextLayout(previewStyles.secondary);
      _previewStyles[family] = previewStyles;
      _preloadedFamilies.add(family);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<void> _primeTextLayout(TextStyle style) async {
    final TextPainter painter = TextPainter(
      text: TextSpan(
        text: 'The quick brown fox jumps over the lazy dog',
        style: style,
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();

    painter.dispose();

    // Yield to keep interaction frames responsive during warm-up.
    await Future<void>.delayed(Duration.zero);
  }

  Future<void> _waitForInteractionCooldown() async {
    final Duration remaining = _remainingInteractionCooldown();
    if (remaining <= Duration.zero) {
      return;
    }

    await Future<void>.delayed(remaining);
  }

  Duration _remainingInteractionCooldown() {
    final Duration elapsed = DateTime.now().difference(_lastInteractionAt);
    if (elapsed >= interactionCooldown) {
      return Duration.zero;
    }
    return interactionCooldown - elapsed;
  }

  String _drawFromActiveDeck() {
    if (_activeDeck.isEmpty) {
      _activeDeck.addAll(_activeFamilies..shuffle(_random));
    }

    return _activeDeck.removeLast();
  }

  String _nextCatalogFamily() {
    if (_catalogQueue.isEmpty) {
      _refillCatalogQueue();
    }

    return _catalogQueue.removeFirst();
  }

  void _refillCatalogQueue() {
    final List<String> shuffled = _allFamilies.toList()..shuffle(_random);
    _catalogQueue.addAll(shuffled);
  }

  void _resetActiveDeck() {
    _activeDeck
      ..clear()
      ..addAll(_activeFamilies..shuffle(_random));
  }
}

class _PreviewStyles {
  const _PreviewStyles({required this.primary, required this.secondary});

  final TextStyle primary;
  final TextStyle secondary;
}
