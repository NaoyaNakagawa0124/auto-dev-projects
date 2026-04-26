/// おむすびマスコット — リアクション & ASCII アート
library;

const mascotHappy = r'''
    ╭───╮
   ╱ ◕‿◕ ╲
  ╱ ─────── ╲
 ╱───────────╲
 ╰─────────── ╯
    おむすび
''';

const mascotNormal = r'''
    ╭───╮
   ╱ ◕ ◕ ╲
  ╱ ─────── ╲
 ╱───────────╲
 ╰─────────── ╯
    おむすび
''';

const mascotSad = r'''
    ╭───╮
   ╱ ◕_◕ ╲
  ╱ ─────── ╲
 ╱───────────╲
 ╰─────────── ╯
    おむすび
''';

const mascotExcited = r'''
    ╭───╮
   ╱ ★‿★ ╲
  ╱ ─────── ╲
 ╱───────────╲
 ╰─────────── ╯
   おむすび!!
''';

/// Mascot mood based on context
enum MascotMood { happy, normal, sad, excited }

String getMascotArt(MascotMood mood) {
  switch (mood) {
    case MascotMood.happy: return mascotHappy;
    case MascotMood.normal: return mascotNormal;
    case MascotMood.sad: return mascotSad;
    case MascotMood.excited: return mascotExcited;
  }
}

/// Food-based reactions
class MascotReaction {
  final String message;
  final MascotMood mood;
  final String emoji;

  const MascotReaction(this.message, this.mood, this.emoji);
}

/// Get mascot reaction based on food name
MascotReaction getReaction(String food, {bool isTogetherMeal = false}) {
  final lower = food.toLowerCase();

  if (isTogetherMeal) {
    return const MascotReaction(
      '二人で一緒にごはん！最高だね！',
      MascotMood.excited,
      '💕',
    );
  }

  // Rice-related
  if (lower.contains('おにぎり') || lower.contains('おむすび')) {
    return const MascotReaction(
      'おっ、仲間だ！おにぎり美味しいよね！',
      MascotMood.excited,
      '🍙',
    );
  }

  // Categories
  if (_matchesAny(lower, ['カレー', 'curry'])) {
    return const MascotReaction('カレーの日だね！みんな大好きカレー！', MascotMood.happy, '🍛');
  }
  if (_matchesAny(lower, ['ラーメン', 'ramen', 'つけ麺'])) {
    return const MascotReaction('ラーメン！体があったまるね〜', MascotMood.happy, '🍜');
  }
  if (_matchesAny(lower, ['寿司', 'すし', 'sushi'])) {
    return const MascotReaction('お寿司！贅沢だね〜いいな〜', MascotMood.excited, '🍣');
  }
  if (_matchesAny(lower, ['パスタ', 'スパゲッティ', 'pasta'])) {
    return const MascotReaction('パスタおしゃれだね！', MascotMood.happy, '🍝');
  }
  if (_matchesAny(lower, ['ピザ', 'pizza'])) {
    return const MascotReaction('ピザ！シェアしたいな〜', MascotMood.happy, '🍕');
  }
  if (_matchesAny(lower, ['ハンバーグ', 'ハンバーガー', 'burger'])) {
    return const MascotReaction('がっつり系だね！元気出る！', MascotMood.happy, '🍔');
  }
  if (_matchesAny(lower, ['サラダ', 'salad'])) {
    return const MascotReaction('ヘルシー！体に気をつけてるんだね', MascotMood.normal, '🥗');
  }
  if (_matchesAny(lower, ['ケーキ', 'スイーツ', 'デザート', 'アイス'])) {
    return const MascotReaction('甘いもの！幸せだよね〜', MascotMood.happy, '🍰');
  }
  if (_matchesAny(lower, ['鍋', 'なべ'])) {
    return const MascotReaction('お鍋！一緒に食べたいな...', MascotMood.sad, '🍲');
  }
  if (_matchesAny(lower, ['コンビニ', 'カップ麺'])) {
    return const MascotReaction('たまにはいいけど...ちゃんと食べてる？', MascotMood.sad, '🏪');
  }
  if (_matchesAny(lower, ['弁当', 'べんとう'])) {
    return const MascotReaction('お弁当！手作り？愛情こもってるね', MascotMood.happy, '🍱');
  }
  if (_matchesAny(lower, ['朝ごはん', '朝食', 'モーニング'])) {
    return const MascotReaction('朝ごはん大事！えらい！', MascotMood.happy, '☀️');
  }

  // Default
  return MascotReaction('${food}だね！おいしそう！', MascotMood.normal, '😋');
}

bool _matchesAny(String text, List<String> keywords) {
  return keywords.any((k) => text.contains(k));
}

/// Streak-based messages
String getStreakMessage(int streak) {
  if (streak >= 30) return '30日連続！二人の絆は最強だよ！';
  if (streak >= 14) return '2週間連続！すごい！おむすびも嬉しいよ！';
  if (streak >= 7) return '1週間連続！この調子で続けよう！';
  if (streak >= 3) return '3日連続！いい感じだね！';
  if (streak >= 1) return '一緒にごはん！今日もいい日だね！';
  return '今日は一緒にごはんできるかな？';
}
