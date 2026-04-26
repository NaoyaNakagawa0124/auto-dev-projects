import 'package:test/test.dart';
import '../lib/constellations.dart';
import '../lib/fortune.dart';

void main() {
  group('星座データベース', () {
    test('12星座が存在', () {
      expect(constellations.length, equals(12));
    });

    test('全星座に必須フィールドあり', () {
      for (final c in constellations) {
        expect(c.name.isNotEmpty, isTrue, reason: '${c.symbol}: name');
        expect(c.symbol.isNotEmpty, isTrue, reason: '${c.name}: symbol');
        expect(c.element.isNotEmpty, isTrue, reason: '${c.name}: element');
        expect(c.period.isNotEmpty, isTrue, reason: '${c.name}: period');
        expect(c.primaryColor.length, equals(3), reason: '${c.name}: primaryColor');
        expect(c.secondaryColor.length, equals(3), reason: '${c.name}: secondaryColor');
        expect(c.traits.isNotEmpty, isTrue, reason: '${c.name}: traits');
        expect(c.luckyItem.isNotEmpty, isTrue, reason: '${c.name}: luckyItem');
      }
    });

    test('エレメントは火地風水の4種', () {
      final elements = constellations.map((c) => c.element).toSet();
      expect(elements, containsAll(['火', '地', '風', '水']));
      expect(elements.length, equals(4));
    });

    test('各エレメントに3星座', () {
      for (final element in ['火', '地', '風', '水']) {
        final count = constellations.where((c) => c.element == element).length;
        expect(count, equals(3), reason: '$element のエレメント');
      }
    });

    test('RGB値が0-255範囲', () {
      for (final c in constellations) {
        for (final v in [...c.primaryColor, ...c.secondaryColor]) {
          expect(v, greaterThanOrEqualTo(0), reason: '${c.name}');
          expect(v, lessThanOrEqualTo(255), reason: '${c.name}');
        }
      }
    });

    test('星座名は全て日本語', () {
      for (final c in constellations) {
        expect(c.name, matches(RegExp(r'[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]+')));
      }
    });
  });

  group('カラーマッチング', () {
    test('赤色 → 牡羊座', () {
      final c = findMatchingConstellation(220, 50, 50);
      expect(c.name, equals('牡羊座'));
    });

    test('緑色 → 牡牛座', () {
      final c = findMatchingConstellation(120, 180, 80);
      expect(c.name, equals('牡牛座'));
    });

    test('黄色 → 双子座', () {
      final c = findMatchingConstellation(255, 220, 50);
      expect(c.name, equals('双子座'));
    });

    test('ゴールド → 獅子座', () {
      final c = findMatchingConstellation(255, 180, 0);
      expect(c.name, equals('獅子座'));
    });

    test('ダークレッド → 蠍座', () {
      final c = findMatchingConstellation(100, 0, 50);
      expect(c.name, equals('蠍座'));
    });

    test('ブルー → 水瓶座', () {
      final c = findMatchingConstellation(50, 150, 220);
      expect(c.name, equals('水瓶座'));
    });

    test('常に有効な星座を返す', () {
      // Test edge cases
      for (int r = 0; r <= 255; r += 85) {
        for (int g = 0; g <= 255; g += 85) {
          for (int b = 0; b <= 255; b += 85) {
            final c = findMatchingConstellation(r, g, b);
            expect(c, isNotNull);
            expect(constellations.contains(c), isTrue);
          }
        }
      }
    });

    test('色距離は常に非負', () {
      for (final c in constellations) {
        final dist = c.colorDistance(128, 128, 128);
        expect(dist, greaterThanOrEqualTo(0));
      }
    });
  });

  group('星座検索', () {
    test('名前で検索', () {
      final c = getConstellationByName('牡羊座');
      expect(c, isNotNull);
      expect(c!.symbol, equals('♈'));
    });

    test('存在しない名前 → null', () {
      final c = getConstellationByName('宇宙座');
      expect(c, isNull);
    });

    test('全星座名リスト', () {
      final names = getAllConstellationNames();
      expect(names.length, equals(12));
      expect(names, contains('牡羊座'));
      expect(names, contains('魚座'));
    });
  });

  group('運勢生成', () {
    test('運勢が生成される', () {
      final c = constellations[0];
      final f = generateFortune(c, 42);
      expect(f.constellation, equals(c));
      expect(f.overallLuck, inInclusiveRange(1, 5));
      expect(f.loveLuck, inInclusiveRange(1, 5));
      expect(f.workLuck, inInclusiveRange(1, 5));
      expect(f.moneyLuck, inInclusiveRange(1, 5));
      expect(f.healthLuck, inInclusiveRange(1, 5));
      expect(f.message.isNotEmpty, isTrue);
      expect(f.advice.isNotEmpty, isTrue);
      expect(f.luckyColor.isNotEmpty, isTrue);
      expect(f.cosmicEnergy, inInclusiveRange(50, 100));
    });

    test('同じシードで同じ結果', () {
      final c = constellations[0];
      final f1 = generateFortune(c, 12345);
      final f2 = generateFortune(c, 12345);
      expect(f1.overallLuck, equals(f2.overallLuck));
      expect(f1.message, equals(f2.message));
      expect(f1.luckyColor, equals(f2.luckyColor));
    });

    test('異なるシードで異なる結果が出得る', () {
      final c = constellations[0];
      final results = <String>{};
      for (int s = 0; s < 100; s++) {
        final f = generateFortune(c, s);
        results.add(f.message);
      }
      expect(results.length, greaterThan(1));
    });

    test('カラーから運勢生成', () {
      final f = fortuneFromColor(200, 50, 50, seed: 42);
      expect(f.constellation.name, isNotEmpty);
      expect(f.overallLuck, inInclusiveRange(1, 5));
    });

    test('全星座に対して運勢生成可能', () {
      for (final c in constellations) {
        final f = generateFortune(c, 1);
        expect(f.constellation, equals(c));
        expect(f.message.isNotEmpty, isTrue);
      }
    });
  });

  group('表示ヘルパー', () {
    test('★表示 レベル5', () {
      expect(luckStars(5), equals('★★★★★'));
    });

    test('★表示 レベル3', () {
      expect(luckStars(3), equals('★★★☆☆'));
    });

    test('★表示 レベル1', () {
      expect(luckStars(1), equals('★☆☆☆☆'));
    });

    test('★表示 レベル0', () {
      expect(luckStars(0), equals('☆☆☆☆☆'));
    });
  });

  group('データ整合性', () {
    test('メッセージが全レベルに存在', () {
      // Test that fortune generation doesn't crash for any luck level
      for (final c in constellations) {
        for (int s = 0; s < 50; s++) {
          final f = generateFortune(c, s);
          expect(f.message.isNotEmpty, isTrue);
        }
      }
    });

    test('全ラッキーアイテムが日本語', () {
      for (final c in constellations) {
        expect(c.luckyItem, matches(RegExp(r'[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]')));
      }
    });

    test('特性が全て日本語', () {
      for (final c in constellations) {
        for (final t in c.traits) {
          expect(t, matches(RegExp(r'[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]')));
        }
      }
    });
  });
}
