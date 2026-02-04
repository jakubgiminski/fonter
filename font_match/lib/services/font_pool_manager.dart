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
  final Random _random;

  final Queue<String> _catalogQueue = Queue<String>();
  final Queue<FontPair> _readyPairs = Queue<FontPair>();

  final Set<String> _preloadedFamilies = <String>{};
  final Map<String, Future<void>> _inflightPreloads = <String, Future<void>>{};

  List<String> _allFamilies = <String>[];
  List<String> _activeFamilies = <String>[];
  List<String> _warmFamilies = <String>[];

  final List<String> _activeDeck = <String>[];

  Future<void>? _warmupFuture;

  bool _isInitialized = false;
  bool _isMaintaining = false;
  bool _maintenanceQueued = false;

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

    FontPair pair;
    if (_readyPairs.isNotEmpty) {
      pair = _readyPairs.removeFirst();
    } else {
      // Emergency path: never block a tap while warm pool is still loading.
      pair = _drawFallbackPair();
    }

    _scheduleMaintenance();
    return pair;
  }

  TextStyle styleFor(
    String family, {
    double size = 32,
    FontWeight weight = FontWeight.w500,
    Color? color,
  }) {
    return GoogleFonts.getFont(
      family,
      textStyle: TextStyle(fontSize: size, fontWeight: weight, color: color),
    );
  }

  void _scheduleMaintenance() {
    if (_isMaintaining) {
      _maintenanceQueued = true;
      return;
    }

    _isMaintaining = true;
    unawaited(
      Future<void>(() async {
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

  FontPair _drawFallbackPair() {
    _ensureDeckForTapPath();

    if (_activeDeck.length < 2) {
      // Last-resort fallback should still avoid blocking UI.
      final String first = _allFamilies[_random.nextInt(_allFamilies.length)];
      String second = first;
      while (second == first) {
        second = _allFamilies[_random.nextInt(_allFamilies.length)];
      }
      return FontPair(primary: first, secondary: second);
    }

    return _drawPairFromActiveDeck();
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

    _warmupFuture = _prepareWarmPool().catchError((_) {}).whenComplete(() {
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
    final Set<String> selected = <String>{};

    int retries = 0;
    final int maxRetries = _allFamilies.length * 2;

    while (selected.length < count && retries < maxRetries) {
      retries += 1;
      final String candidate = _nextCatalogFamily();
      if (avoid.contains(candidate) || selected.contains(candidate)) {
        continue;
      }
      selected.add(candidate);
    }

    if (selected.length < count) {
      final List<String> extras = _allFamilies.toList()..shuffle(_random);
      for (final String candidate in extras) {
        if (selected.length == count) {
          break;
        }
        if (avoid.contains(candidate) || selected.contains(candidate)) {
          continue;
        }
        selected.add(candidate);
      }
    }

    final List<String> families = selected.toList(growable: false);
    await _preloadFamilies(families);
    return families;
  }

  Future<void> _preloadFamilies(List<String> families) async {
    if (families.isEmpty) {
      return;
    }

    final int chunkSize = preloadConcurrency.clamp(1, families.length);

    for (int index = 0; index < families.length; index += chunkSize) {
      final List<String> chunk = families
          .skip(index)
          .take(chunkSize)
          .toList(growable: false);
      await Future.wait(chunk.map(_preloadFamily));
    }
  }

  Future<void> _preloadFamily(String family) {
    if (_preloadedFamilies.contains(family)) {
      return Future<void>.value();
    }

    final Future<void>? inflight = _inflightPreloads[family];
    if (inflight != null) {
      return inflight;
    }

    final Future<void> future = _preloadFamilyInternal(family);
    _inflightPreloads[family] = future;

    return future.whenComplete(() {
      _inflightPreloads.remove(family);
    });
  }

  Future<void> _preloadFamilyInternal(String family) async {
    final List<TextStyle> styles = <TextStyle>[
      GoogleFonts.getFont(family, textStyle: _primaryPreviewStyle),
      GoogleFonts.getFont(family, textStyle: _secondaryPreviewStyle),
    ];

    try {
      await GoogleFonts.pendingFonts(styles);
      _preloadedFamilies.add(family);
    } catch (_) {
      // Keep UI responsive even if one family fails to preload.
    }
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
