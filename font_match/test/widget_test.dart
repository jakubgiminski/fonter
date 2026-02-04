import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:font_match/main.dart';
import 'package:font_match/models/font_pair.dart';
import 'package:font_match/services/font_pool_manager.dart';

void main() {
  testWidgets('Shuffles font pairs', (WidgetTester tester) async {
    final FakeFontPoolManager manager = FakeFontPoolManager();

    await tester.pumpWidget(
      MaterialApp(home: FontMatchPage(fontPool: manager)),
    );

    await tester.pumpAndSettle();

    expect(find.text('Shuffle Pair'), findsOneWidget);
    expect(find.text('Merriweather'), findsOneWidget);
    expect(find.text('Roboto'), findsOneWidget);

    await tester.tap(find.text('Shuffle Pair'));
    await tester.pumpAndSettle();

    expect(find.text('Lora'), findsOneWidget);
    expect(find.text('Inter'), findsOneWidget);
  });
}

class FakeFontPoolManager extends FontPoolManager {
  FakeFontPoolManager() : super(batchSize: 10);

  final List<FontPair> _pairs = const <FontPair>[
    FontPair(primary: 'Merriweather', secondary: 'Roboto'),
    FontPair(primary: 'Lora', secondary: 'Inter'),
  ];

  int _index = 0;

  @override
  Future<void> initialize() async {}

  @override
  FontPoolSnapshot get snapshot => const FontPoolSnapshot(
    totalFamilies: 1400,
    activeFamilies: 10,
    warmFamilies: 10,
    activeRemaining: 8,
    readyPairs: 6,
    isWarmPoolReady: true,
  );

  @override
  Future<FontPair?> nextPair() async {
    final FontPair pair = _pairs[_index % _pairs.length];
    _index += 1;
    return pair;
  }

  @override
  TextStyle styleFor(
    String family, {
    double size = 32,
    FontWeight weight = FontWeight.w500,
    Color? color,
  }) {
    return TextStyle(fontSize: size, fontWeight: weight, color: color);
  }
}
