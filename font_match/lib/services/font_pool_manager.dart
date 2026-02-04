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

class FontPoolManager extends ChangeNotifier {
  FontPoolManager({
    this.batchSize = 10,
    this.familyLoadTimeout = const Duration(milliseconds: 1500),
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
  final Duration familyLoadTimeout;
  final Random _random;

  final Queue<String> _catalogQueue = Queue<String>();
  final Set<String> _preloadedFamilies = <String>{};
  final Map<String, _PreviewStyles> _previewStyles = <String, _PreviewStyles>{};

  List<String> _allFamilies = <String>[];
  List<String> _activeFamilies = <String>[];
  final List<String> _activeDeck = <String>[];

  bool _isInitialized = false;
  bool _isLoadingBatch = false;
  Future<void>? _batchLoadFuture;

  FontPoolSnapshot get snapshot => FontPoolSnapshot(
    totalFamilies: _allFamilies.length,
    activeFamilies: _activeFamilies.length,
    warmFamilies: _preloadedFamilies.length,
    activeRemaining: _activeDeck.length,
    readyPairs: _activeDeck.length ~/ 2,
    isWarmPoolReady: !_isLoadingBatch,
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
    await _ensureBatchLoaded();

    if (_activeFamilies.length < 2) {
      throw StateError('Could not preload enough fonts to start.');
    }

    _isInitialized = true;
    notifyListeners();
  }

  Future<FontPair?> nextPair() async {
    if (!_isInitialized) {
      await initialize();
    }

    if (_activeDeck.length < 2) {
      await _ensureBatchLoaded();
    }

    if (_activeDeck.length < 2) {
      notifyListeners();
      return null;
    }

    final FontPair pair = _drawPairFromActiveDeck();

    // Load a fresh batch as soon as the current one is exhausted.
    if (_activeDeck.length < 2) {
      await _ensureBatchLoaded();
    }

    notifyListeners();
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

  Future<void> _ensureBatchLoaded() {
    final Future<void>? inflight = _batchLoadFuture;
    if (inflight != null) {
      return inflight;
    }

    final Future<void> future = _loadBatchInternal();
    _batchLoadFuture = future;

    return future.whenComplete(() {
      _batchLoadFuture = null;
    });
  }

  Future<void> _loadBatchInternal() async {
    _isLoadingBatch = true;
    notifyListeners();

    try {
      _activeFamilies = await _pickAndPreloadBatch(count: batchSize);
      _resetActiveDeck();
    } finally {
      _isLoadingBatch = false;
      notifyListeners();
    }
  }

  Future<List<String>> _pickAndPreloadBatch({required int count}) async {
    final int target = min(count, _allFamilies.length);
    final Set<String> loaded = <String>{};
    final int maxAttempts = _allFamilies.length * 2;
    int attempts = 0;

    while (loaded.length < target && attempts < maxAttempts) {
      final String candidate = _nextCatalogFamily();
      attempts += 1;

      final bool loadedFamily = await _preloadFamily(candidate);
      if (loadedFamily) {
        loaded.add(candidate);
      }

      // Yield so browser main-thread work can paint between loads.
      await Future<void>.delayed(Duration.zero);
    }

    if (loaded.length < target) {
      final List<String> fallback = _preloadedFamilies.toList()
        ..shuffle(_random);
      for (final String family in fallback) {
        if (loaded.length == target) {
          break;
        }
        loaded.add(family);
      }
    }

    return loaded.toList(growable: false)..shuffle(_random);
  }

  Future<bool> _preloadFamily(String family) async {
    if (_preloadedFamilies.contains(family)) {
      return true;
    }

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

      await _primeTextLayout(previewStyles.primary);
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
    await Future<void>.delayed(Duration.zero);
  }

  FontPair _drawPairFromActiveDeck() {
    if (_activeDeck.length < 2) {
      throw StateError('Not enough loaded fonts to draw a pair.');
    }

    final String first = _activeDeck.removeLast();
    final String second = _activeDeck.removeLast();
    return FontPair(primary: first, secondary: second);
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
    final List<String> shuffled = _activeFamilies.toList()..shuffle(_random);
    _activeDeck
      ..clear()
      ..addAll(shuffled);
  }
}

class _PreviewStyles {
  const _PreviewStyles({required this.primary, required this.secondary});

  final TextStyle primary;
  final TextStyle secondary;
}
