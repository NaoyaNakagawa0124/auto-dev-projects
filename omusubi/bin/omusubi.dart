#!/usr/bin/env dart
/// 🍙 おむすび — CLI インターフェース
import '../lib/mascot.dart';
import '../lib/meals.dart';

const _reset = '\x1b[0m';
const _bold = '\x1b[1m';
const _dim = '\x1b[2m';
const _pink = '\x1b[38;5;211m';
const _green = '\x1b[32m';
const _yellow = '\x1b[33m';
const _cyan = '\x1b[36m';
const _gray = '\x1b[90m';

void main(List<String> args) {
  print('');
  _banner();

  if (args.isEmpty) { _help(); return; }

  final cmd = args[0];
  switch (cmd) {
    case 'log':
      if (args.length < 2) { print('  ${_pink}使い方: omusubi log <食事名>${_reset}'); return; }
      _logMeal(args.sublist(1).join(' '));
      break;
    case 'status':
      _showStatus();
      break;
    case 'suggest':
      _suggestRecipe();
      break;
    case 'mascot':
      _showMascot();
      break;
    case 'help': case '--help': case '-h':
      _help();
      break;
    default:
      print('  不明なコマンド: $cmd');
      _help();
  }
}

void _banner() {
  print('$_pink  ┌────────────────────────────┐$_reset');
  print('$_pink  │$_reset $_bold🍙 おむすび$_reset                $_pink│$_reset');
  print('$_pink  │$_reset ${_dim}遠距離カップル食事共有$_reset      $_pink│$_reset');
  print('$_pink  └────────────────────────────┘$_reset');
  print('');
}

void _logMeal(String food) {
  final reaction = getReaction(food);
  final entry = MealEntry(
    food: food,
    person: 'A',
    timestamp: DateTime.now(),
  );

  print(getMascotArt(reaction.mood));
  print('  ${reaction.emoji} ${_bold}${reaction.message}$_reset');
  print('');
  print('  ${_dim}記録: ${entry.timeLabel} — $food$_reset');
  print('  ${_dim}時刻: ${_formatTime(entry.timestamp)}$_reset');
  print('');
  print('  ${_green}✓ 食事を記録しました！$_reset');
  print('');
}

void _showStatus() {
  // Demo status with sample data
  final log = MealLog([
    MealEntry(food: 'トースト', person: 'A', timestamp: DateTime.now().subtract(const Duration(hours: 5))),
    MealEntry(food: 'サンドイッチ', person: 'B', timestamp: DateTime.now().subtract(const Duration(hours: 4))),
    MealEntry(food: 'カレーライス', person: 'A', timestamp: DateTime.now().subtract(const Duration(hours: 1))),
    MealEntry(food: 'カレーライス', person: 'B', timestamp: DateTime.now()),
  ]);

  final together = log.findTogetherMeals();
  final streak = log.calculateStreak();
  final counts = log.getMealCounts();

  print('  ${_bold}📊 ステータス$_reset');
  print('  ${_dim}──────────────────────$_reset');
  print('');
  print('  記録数: ${_cyan}A: ${counts['A']}食$_reset  ${_pink}B: ${counts['B']}食$_reset');
  print('  一緒にごはん: ${_yellow}${together.length}回$_reset');
  print('  ストリーク: ${_green}$streak日連続$_reset');
  print('');
  print('  ${_dim}${getStreakMessage(streak)}$_reset');
  print('');
}

void _suggestRecipe() {
  final recipe = suggestRecipe(DateTime.now().day);

  print('  ${_bold}👨‍🍳 今日のおすすめレシピ$_reset');
  print('  ${_dim}──────────────────────$_reset');
  print('');
  print('  ${recipe.emoji} ${_bold}${recipe.name}$_reset');
  print('  ${_dim}難易度: ${recipe.difficulty}  時間: ${recipe.minutes}分$_reset');
  print('');
  print('  材料:');
  for (final i in recipe.ingredients) {
    print('    ・$i');
  }
  print('');
  print('  ${_yellow}💡 ${recipe.tip}$_reset');
  print('');
}

void _showMascot() {
  print(getMascotArt(MascotMood.happy));
  print('  ${_pink}やっほー！おむすびだよ！$_reset');
  print('  ${_dim}今日も二人で一緒にごはん食べようね！$_reset');
  print('');
}

void _help() {
  print('  ${_bold}コマンド$_reset');
  print('');
  print('  ${_cyan}log$_reset <食事名>   食事を記録');
  print('  ${_cyan}status$_reset         ステータス表示');
  print('  ${_cyan}suggest$_reset        レシピ提案');
  print('  ${_cyan}mascot$_reset         おむすびに会う');
  print('  ${_cyan}help$_reset           このヘルプ');
  print('');
  print('  ${_dim}例: dart run bin/omusubi.dart log カレーライス$_reset');
  print('');
}

String _formatTime(DateTime dt) {
  return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
}
