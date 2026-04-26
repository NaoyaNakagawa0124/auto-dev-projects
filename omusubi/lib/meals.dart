/// 食事ログ & ストリーク管理
library;

class MealEntry {
  final String food;
  final String person; // "A" or "B"
  final DateTime timestamp;
  final String? note;

  MealEntry({
    required this.food,
    required this.person,
    required this.timestamp,
    this.note,
  });

  Map<String, dynamic> toJson() => {
    'food': food,
    'person': person,
    'timestamp': timestamp.toIso8601String(),
    'note': note,
  };

  factory MealEntry.fromJson(Map<String, dynamic> json) => MealEntry(
    food: json['food'] as String,
    person: json['person'] as String,
    timestamp: DateTime.parse(json['timestamp'] as String),
    note: json['note'] as String?,
  );

  String get timeLabel {
    final h = timestamp.hour;
    if (h >= 5 && h < 10) return '朝食';
    if (h >= 10 && h < 15) return '昼食';
    if (h >= 15 && h < 18) return 'おやつ';
    if (h >= 18 && h < 22) return '夕食';
    return '夜食';
  }
}

class MealLog {
  final List<MealEntry> entries;

  MealLog([List<MealEntry>? initial]) : entries = initial ?? [];

  void add(MealEntry entry) => entries.add(entry);

  List<MealEntry> getByDate(DateTime date) {
    return entries.where((e) =>
      e.timestamp.year == date.year &&
      e.timestamp.month == date.month &&
      e.timestamp.day == date.day
    ).toList();
  }

  List<MealEntry> getByPerson(String person) {
    return entries.where((e) => e.person == person).toList();
  }

  /// Check if both persons logged a meal within the same 2-hour window
  List<TogetherMeal> findTogetherMeals() {
    final result = <TogetherMeal>[];
    final mealsA = entries.where((e) => e.person == 'A').toList();
    final mealsB = entries.where((e) => e.person == 'B').toList();

    for (final a in mealsA) {
      for (final b in mealsB) {
        final diff = a.timestamp.difference(b.timestamp).inMinutes.abs();
        if (diff <= 120) { // Within 2 hours
          result.add(TogetherMeal(a, b));
        }
      }
    }
    return result;
  }

  /// Calculate "一緒にごはん" streak (consecutive days with together meals)
  int calculateStreak() {
    final togetherDays = <String>{};
    for (final tm in findTogetherMeals()) {
      final d = tm.mealA.timestamp;
      togetherDays.add('${d.year}-${d.month}-${d.day}');
    }

    if (togetherDays.isEmpty) return 0;

    // Sort dates and count consecutive days backwards from today
    final today = DateTime.now();
    int streak = 0;
    for (int i = 0; i < 365; i++) {
      final check = today.subtract(Duration(days: i));
      final key = '${check.year}-${check.month}-${check.day}';
      if (togetherDays.contains(key)) {
        streak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }

    return streak;
  }

  /// Get food frequency ranking
  Map<String, int> getFoodRanking() {
    final counts = <String, int>{};
    for (final e in entries) {
      counts[e.food] = (counts[e.food] ?? 0) + 1;
    }
    return Map.fromEntries(
      counts.entries.toList()..sort((a, b) => b.value.compareTo(a.value))
    );
  }

  /// Get total meals per person
  Map<String, int> getMealCounts() {
    return {
      'A': entries.where((e) => e.person == 'A').length,
      'B': entries.where((e) => e.person == 'B').length,
    };
  }

  /// Get meal type distribution
  Map<String, int> getMealTypeDistribution() {
    final counts = <String, int>{};
    for (final e in entries) {
      final label = e.timeLabel;
      counts[label] = (counts[label] ?? 0) + 1;
    }
    return counts;
  }
}

class TogetherMeal {
  final MealEntry mealA;
  final MealEntry mealB;

  TogetherMeal(this.mealA, this.mealB);

  Duration get timeDifference =>
    mealA.timestamp.difference(mealB.timestamp).abs() > Duration.zero
      ? mealA.timestamp.difference(mealB.timestamp).abs()
      : Duration.zero;
}

/// Recipe suggestions for cooking together
class Recipe {
  final String name;
  final String emoji;
  final String difficulty;
  final int minutes;
  final List<String> ingredients;
  final String tip;

  const Recipe({
    required this.name,
    required this.emoji,
    required this.difficulty,
    required this.minutes,
    required this.ingredients,
    required this.tip,
  });
}

const recipes = [
  Recipe(name: 'おにぎり', emoji: '🍙', difficulty: '簡単', minutes: 15,
    ingredients: ['ご飯', '塩', '海苔', '好きな具材'],
    tip: '同じ具材で握って、食べ比べしてみよう！'),
  Recipe(name: 'カレーライス', emoji: '🍛', difficulty: '普通', minutes: 45,
    ingredients: ['カレールー', '肉', 'じゃがいも', 'にんじん', '玉ねぎ'],
    tip: '同じルーを使えば、離れていても同じ味に！'),
  Recipe(name: 'パスタ・ナポリタン', emoji: '🍝', difficulty: '簡単', minutes: 20,
    ingredients: ['スパゲッティ', 'ケチャップ', 'ウインナー', 'ピーマン', '玉ねぎ'],
    tip: '懐かしい味を二人で楽しもう'),
  Recipe(name: 'オムライス', emoji: '🍳', difficulty: '普通', minutes: 30,
    ingredients: ['ご飯', '卵', 'ケチャップ', '鶏肉', '玉ねぎ'],
    tip: 'ケチャップでメッセージを書いて写真を送り合おう！'),
  Recipe(name: '味噌汁', emoji: '🍲', difficulty: '簡単', minutes: 15,
    ingredients: ['味噌', 'だし', '豆腐', 'わかめ', 'ネギ'],
    tip: '好きな具材を当てっこゲームにしても楽しい'),
  Recipe(name: 'ホットケーキ', emoji: '🥞', difficulty: '簡単', minutes: 20,
    ingredients: ['ホットケーキミックス', '卵', '牛乳', 'バター'],
    tip: '焼き上がりの写真を送り合おう。上手に焼けたかな？'),
  Recipe(name: '豚キムチ', emoji: '🥘', difficulty: '簡単', minutes: 15,
    ingredients: ['豚バラ', 'キムチ', 'もやし', 'ニラ'],
    tip: 'ピリ辛で元気が出る！同時に「辛い！」って言い合おう'),
  Recipe(name: 'チャーハン', emoji: '🍚', difficulty: '簡単', minutes: 15,
    ingredients: ['ご飯', '卵', 'ネギ', 'チャーシュー', '醤油'],
    tip: '冷蔵庫の残り物で勝負！何が入ったか当てっこ'),
];

/// Suggest a recipe based on seed
Recipe suggestRecipe(int seed) {
  return recipes[seed % recipes.length];
}
