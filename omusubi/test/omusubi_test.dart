import 'package:test/test.dart';
import '../lib/mascot.dart';
import '../lib/meals.dart';

void main() {
  group('マスコット', () {
    test('ASCII アート4種', () {
      expect(getMascotArt(MascotMood.happy).contains('◕'), isTrue);
      expect(getMascotArt(MascotMood.normal).contains('◕'), isTrue);
      expect(getMascotArt(MascotMood.sad).contains('◕'), isTrue);
      expect(getMascotArt(MascotMood.excited).contains('★'), isTrue);
    });

    test('おにぎりリアクション: excited', () {
      final r = getReaction('おにぎり弁当');
      expect(r.mood, equals(MascotMood.excited));
      expect(r.emoji, equals('🍙'));
    });

    test('カレーリアクション', () {
      final r = getReaction('カレーライス');
      expect(r.mood, equals(MascotMood.happy));
      expect(r.emoji, equals('🍛'));
    });

    test('ラーメンリアクション', () {
      final r = getReaction('味噌ラーメン');
      expect(r.emoji, equals('🍜'));
    });

    test('寿司リアクション: excited', () {
      final r = getReaction('お寿司');
      expect(r.mood, equals(MascotMood.excited));
    });

    test('コンビニリアクション: sad', () {
      final r = getReaction('コンビニ弁当');
      expect(r.mood, equals(MascotMood.sad));
    });

    test('鍋リアクション: sad', () {
      final r = getReaction('キムチ鍋');
      expect(r.mood, equals(MascotMood.sad));
    });

    test('一緒にごはんリアクション', () {
      final r = getReaction('何でも', isTogetherMeal: true);
      expect(r.mood, equals(MascotMood.excited));
      expect(r.emoji, equals('💕'));
    });

    test('デフォルトリアクション', () {
      final r = getReaction('謎の料理XYZ');
      expect(r.mood, equals(MascotMood.normal));
      expect(r.message.contains('謎の料理XYZ'), isTrue);
    });

    test('ストリークメッセージ', () {
      expect(getStreakMessage(0).isNotEmpty, isTrue);
      expect(getStreakMessage(1).isNotEmpty, isTrue);
      expect(getStreakMessage(7).contains('1週間'), isTrue);
      expect(getStreakMessage(14).contains('2週間'), isTrue);
      expect(getStreakMessage(30).contains('30日'), isTrue);
    });
  });

  group('食事ログ', () {
    test('MealEntry作成', () {
      final e = MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0));
      expect(e.food, equals('カレー'));
      expect(e.person, equals('A'));
      expect(e.timeLabel, equals('昼食'));
    });

    test('時間帯ラベル: 朝食', () {
      final e = MealEntry(food: 'トースト', person: 'A', timestamp: DateTime(2026, 4, 26, 7, 0));
      expect(e.timeLabel, equals('朝食'));
    });

    test('時間帯ラベル: おやつ', () {
      final e = MealEntry(food: 'ケーキ', person: 'A', timestamp: DateTime(2026, 4, 26, 16, 0));
      expect(e.timeLabel, equals('おやつ'));
    });

    test('時間帯ラベル: 夕食', () {
      final e = MealEntry(food: 'ステーキ', person: 'A', timestamp: DateTime(2026, 4, 26, 19, 0));
      expect(e.timeLabel, equals('夕食'));
    });

    test('時間帯ラベル: 夜食', () {
      final e = MealEntry(food: 'ラーメン', person: 'A', timestamp: DateTime(2026, 4, 26, 23, 0));
      expect(e.timeLabel, equals('夜食'));
    });

    test('JSON変換', () {
      final e = MealEntry(food: 'パスタ', person: 'B', timestamp: DateTime(2026, 4, 26, 12, 0), note: 'おいしい');
      final json = e.toJson();
      expect(json['food'], equals('パスタ'));
      expect(json['person'], equals('B'));
      expect(json['note'], equals('おいしい'));

      final restored = MealEntry.fromJson(json);
      expect(restored.food, equals('パスタ'));
      expect(restored.person, equals('B'));
      expect(restored.note, equals('おいしい'));
    });
  });

  group('MealLog', () {
    test('追加と取得', () {
      final log = MealLog();
      log.add(MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)));
      expect(log.entries.length, equals(1));
    });

    test('日付でフィルタ', () {
      final log = MealLog([
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'パスタ', person: 'A', timestamp: DateTime(2026, 4, 27, 12, 0)),
      ]);
      final result = log.getByDate(DateTime(2026, 4, 26));
      expect(result.length, equals(1));
      expect(result[0].food, equals('カレー'));
    });

    test('人物でフィルタ', () {
      final log = MealLog([
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'パスタ', person: 'B', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'ラーメン', person: 'A', timestamp: DateTime(2026, 4, 26, 19, 0)),
      ]);
      expect(log.getByPerson('A').length, equals(2));
      expect(log.getByPerson('B').length, equals(1));
    });

    test('一緒にごはん判定: 2時間以内', () {
      final log = MealLog([
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'カレー', person: 'B', timestamp: DateTime(2026, 4, 26, 12, 30)),
      ]);
      expect(log.findTogetherMeals().length, equals(1));
    });

    test('一緒にごはん判定: 2時間超えは不一致', () {
      final log = MealLog([
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 8, 0)),
        MealEntry(food: 'パスタ', person: 'B', timestamp: DateTime(2026, 4, 26, 19, 0)),
      ]);
      expect(log.findTogetherMeals().length, equals(0));
    });

    test('食事ランキング', () {
      final log = MealLog([
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'カレー', person: 'B', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'パスタ', person: 'A', timestamp: DateTime(2026, 4, 27, 12, 0)),
      ]);
      final ranking = log.getFoodRanking();
      expect(ranking.keys.first, equals('カレー'));
      expect(ranking['カレー'], equals(2));
    });

    test('食事カウント', () {
      final log = MealLog([
        MealEntry(food: 'A1', person: 'A', timestamp: DateTime(2026, 4, 26, 8, 0)),
        MealEntry(food: 'A2', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'B1', person: 'B', timestamp: DateTime(2026, 4, 26, 12, 0)),
      ]);
      final counts = log.getMealCounts();
      expect(counts['A'], equals(2));
      expect(counts['B'], equals(1));
    });

    test('食事タイプ分布', () {
      final log = MealLog([
        MealEntry(food: 'トースト', person: 'A', timestamp: DateTime(2026, 4, 26, 7, 0)),
        MealEntry(food: 'カレー', person: 'A', timestamp: DateTime(2026, 4, 26, 12, 0)),
        MealEntry(food: 'ステーキ', person: 'A', timestamp: DateTime(2026, 4, 26, 19, 0)),
      ]);
      final dist = log.getMealTypeDistribution();
      expect(dist['朝食'], equals(1));
      expect(dist['昼食'], equals(1));
      expect(dist['夕食'], equals(1));
    });

    test('空ログのストリーク: 0', () {
      final log = MealLog();
      expect(log.calculateStreak(), equals(0));
    });
  });

  group('レシピ', () {
    test('レシピが8つ以上', () {
      expect(recipes.length, greaterThanOrEqualTo(8));
    });

    test('レシピに必須フィールド', () {
      for (final r in recipes) {
        expect(r.name.isNotEmpty, isTrue);
        expect(r.emoji.isNotEmpty, isTrue);
        expect(r.difficulty.isNotEmpty, isTrue);
        expect(r.minutes, greaterThan(0));
        expect(r.ingredients.isNotEmpty, isTrue);
        expect(r.tip.isNotEmpty, isTrue);
      }
    });

    test('レシピ提案: 決定論的', () {
      final r1 = suggestRecipe(42);
      final r2 = suggestRecipe(42);
      expect(r1.name, equals(r2.name));
    });

    test('レシピ提案: 異なるシードで異なる結果', () {
      final names = <String>{};
      for (int i = 0; i < 8; i++) {
        names.add(suggestRecipe(i).name);
      }
      expect(names.length, greaterThan(1));
    });
  });

  group('データ整合性', () {
    test('全リアクションメッセージが日本語', () {
      for (final food in ['カレー', 'ラーメン', 'お寿司', 'パスタ', 'ケーキ', 'サラダ', 'お鍋', 'コンビニ']) {
        final r = getReaction(food);
        expect(r.message, matches(RegExp(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]')));
      }
    });

    test('全レシピ名が日本語', () {
      for (final r in recipes) {
        expect(r.name, matches(RegExp(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]')));
      }
    });

    test('全レシピtipが日本語', () {
      for (final r in recipes) {
        expect(r.tip, matches(RegExp(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]')));
      }
    });
  });
}
