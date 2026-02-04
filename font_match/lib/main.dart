import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

import 'models/font_pair.dart';
import 'services/font_pool_manager.dart';

void main() {
  runApp(const FontMatchApp());
}

class FontMatchApp extends StatelessWidget {
  const FontMatchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Font Match',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2D7C7A)),
        useMaterial3: true,
      ),
      home: FontMatchPage(),
    );
  }
}

class FontMatchPage extends StatefulWidget {
  FontMatchPage({super.key, FontPoolManager? fontPool})
    : fontPool =
          fontPool ??
          FontPoolManager(
            batchSize: kIsWeb ? 20 : 10,
            lowWatermark: kIsWeb ? 8 : 3,
            preloadConcurrency: kIsWeb ? 2 : 3,
            readyPairTarget: kIsWeb ? 12 : 6,
          );

  final FontPoolManager fontPool;

  @override
  State<FontMatchPage> createState() => _FontMatchPageState();
}

class _FontMatchPageState extends State<FontMatchPage> {
  FontPair? _pair;
  bool _isInitializing = true;
  bool _isShuffling = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      await _fontPool.initialize();
      final FontPair initialPair = await _fontPool.nextPair();
      if (!mounted) {
        return;
      }

      setState(() {
        _pair = initialPair;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }

      setState(() {
        _error = 'Unable to load Google Fonts. Please try again.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isInitializing = false;
        });
      }
    }
  }

  Future<void> _shufflePair() async {
    if (_isShuffling || _isInitializing) {
      return;
    }

    setState(() {
      _isShuffling = true;
      _error = null;
    });

    try {
      final FontPair nextPair = await _fontPool.nextPair();
      if (!mounted) {
        return;
      }

      setState(() {
        _pair = nextPair;
      });
    } catch (error) {
      if (!mounted) {
        return;
      }

      setState(() {
        _error = 'Could not generate a new pair.';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isShuffling = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final FontPoolSnapshot snapshot = _fontPool.snapshot;

    return Scaffold(
      appBar: AppBar(title: const Text('Font Match')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: _isInitializing
              ? const Center(child: CircularProgressIndicator())
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      'Tap shuffle to instantly try a new random Google Font pair.',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 20),
                    Expanded(
                      child: _pair == null
                          ? _ErrorCard(
                              message: _error ?? 'No pair available yet.',
                            )
                          : _PairPreview(
                              pair: _pair!,
                              styleFor: _fontPool.styleFor,
                            ),
                    ),
                    if (_error != null) ...<Widget>[
                      const SizedBox(height: 12),
                      Text(
                        _error!,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                    ],
                    const SizedBox(height: 14),
                    Text(
                      'Loaded: ${snapshot.totalFamilies} families · '
                      'Active ${snapshot.activeFamilies} · '
                      'Warm ${snapshot.warmFamilies} · '
                      'Ready ${snapshot.readyPairs} · '
                      'Remaining ${snapshot.activeRemaining} '
                      '(${snapshot.isWarmPoolReady ? 'warm ready' : 'warming'})',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: _isShuffling ? null : _shufflePair,
                      icon: _isShuffling
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.shuffle),
                      label: Text(
                        _isShuffling ? 'Shuffling...' : 'Shuffle Pair',
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  FontPoolManager get _fontPool => widget.fontPool;
}

class _PairPreview extends StatelessWidget {
  const _PairPreview({required this.pair, required this.styleFor});

  final FontPair pair;
  final TextStyle Function(
    String family, {
    double size,
    FontWeight weight,
    Color? color,
  })
  styleFor;

  static const String sampleText =
      'The quick brown fox jumps over the lazy dog';

  @override
  Widget build(BuildContext context) {
    final ColorScheme colors = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(pair.primary, style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: 8),
          Text(
            sampleText,
            style: styleFor(pair.primary, size: 30, weight: FontWeight.w600),
          ),
          const SizedBox(height: 24),
          Text(pair.secondary, style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: 8),
          Text(
            sampleText,
            style: styleFor(pair.secondary, size: 24, weight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}

class _ErrorCard extends StatelessWidget {
  const _ErrorCard({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(message, textAlign: TextAlign.center));
  }
}
