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
    required this.isWarmPoolReady,
  });

  final int totalFamilies;
  final int activeFamilies;
  final int warmFamilies;
  final int activeRemaining;
  final bool isWarmPoolReady;
}

class FontPoolManager {
  FontPoolManager({
    this.batchSize = 10,
    this.lowWatermark = 3,
    this.preloadConcurrency = 3,
    Random? random,
  }) : _random = random ?? Random();

  final int batchSize;
  final int lowWatermark;
  final int preloadConcurrency;
  final Random _random;

  final Queue<String> _catalogQueue = Queue<String>();

  List<String> _allFamilies = <String>[];

  List<String> _activeFamilies = <String>[];
  List<String> _warmFamilies = <String>[];

  final List<String> _activeDeck = <String>[];

  Future<void>? _warmupFuture;

  bool _isInitialized = false;

  FontPoolSnapshot get snapshot => FontPoolSnapshot(
    totalFamilies: _allFamilies.length,
    activeFamilies: _activeFamilies.length,
    warmFamilies: _warmFamilies.length,
    activeRemaining: _activeDeck.length,
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

    _warmupFuture = _prepareWarmPool();
    _isInitialized = true;
  }

  Future<FontPair> nextPair() async {
    if (!_isInitialized) {
      await initialize();
    }

    if (_activeDeck.length < 2) {
      await _swapWarmPool(force: true);
    } else if (_activeDeck.length <= lowWatermark) {
      unawaited(_swapWarmPool(force: false));
    }

    final String first = _drawFromActiveDeck();
    String second = _drawFromActiveDeck();

    if (first == second) {
      await _swapWarmPool(force: true);
      second = _drawFromActiveDeck();
    }

    return FontPair(primary: first, secondary: second);
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

  Future<void> _swapWarmPool({required bool force}) async {
    if (!force && _activeDeck.length > lowWatermark) {
      return;
    }

    await (_warmupFuture ?? Future<void>.value());

    if (_warmFamilies.isEmpty) {
      _activeFamilies = await _pickAndPreloadBatch(
        count: batchSize,
        avoid: <String>{},
      );
    } else {
      _activeFamilies = List<String>.from(_warmFamilies);
    }

    _warmFamilies = <String>[];
    _resetActiveDeck();
    _warmupFuture = _prepareWarmPool();
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

  Future<void> _preloadFamily(String family) async {
    final TextStyle style = GoogleFonts.getFont(
      family,
      textStyle: const TextStyle(fontSize: 16),
    );

    try {
      await GoogleFonts.pendingFonts([style]);
    } catch (_) {
      // Preloading failure should not block the app. Rendering falls back safely.
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

    final String next = _catalogQueue.removeFirst();
    return next;
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
