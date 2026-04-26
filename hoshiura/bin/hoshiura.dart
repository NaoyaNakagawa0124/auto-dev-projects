#!/usr/bin/env dart
/// 星占 (Hoshiura) — CLI インターフェース
import '../lib/constellations.dart';
import '../lib/fortune.dart';

const _reset = '\x1b[0m';
const _bold = '\x1b[1m';
const _dim = '\x1b[2m';
const _italic = '\x1b[3m';
const _magenta = '\x1b[35m';
const _cyan = '\x1b[36m';
const _yellow = '\x1b[33m';
const _blue = '\x1b[34m';
const _white = '\x1b[37m';
const _gray = '\x1b[90m';

void main(List<String> args) {
  print('');
  _printBanner();

  int r, g, b;

  // Parse --rgb argument
  final rgbArg = args.where((a) => a.startsWith('--rgb')).firstOrNull;
  if (rgbArg != null) {
    final parts = rgbArg.replaceFirst('--rgb=', '').replaceFirst('--rgb', '').split(',');
    if (args.indexOf(rgbArg) + 1 < args.length && parts.length < 3) {
      final nextArg = args[args.indexOf(rgbArg) + 1];
      final rgb = nextArg.split(',');
      r = int.parse(rgb[0]);
      g = int.parse(rgb[1]);
      b = int.parse(rgb[2]);
    } else if (parts.length == 3) {
      r = int.parse(parts[0]);
      g = int.parse(parts[1]);
      b = int.parse(parts[2]);
    } else {
      print('  $_magenta使い方: dart run bin/hoshiura.dart --rgb 180,100,220$_reset');
      return;
    }
  } else {
    // Random color for demo
    final now = DateTime.now();
    r = (now.millisecond * 13 + now.second * 7) % 256;
    g = (now.millisecond * 7 + now.minute * 11) % 256;
    b = (now.millisecond * 3 + now.hour * 17) % 256;
    print('  ${_gray}ランダムカラーで占い: RGB($r, $g, $b)$_reset');
  }

  print('');
  _printColorBox(r, g, b);

  final fortune = fortuneFromColor(r, g, b);

  print('');
  _printConstellation(fortune.constellation);
  print('');
  _printFortune(fortune);
  print('');
}

void _printBanner() {
  print('$_cyan  ┌────────────────────────────┐$_reset');
  print('$_cyan  │$_reset $_bold${_white}✨ 星占 (Hoshiura)$_reset          $_cyan│$_reset');
  print('$_cyan  │$_reset ${_dim}写真カラー×星座占い$_reset        $_cyan│$_reset');
  print('$_cyan  └────────────────────────────┘$_reset');
}

void _printColorBox(int r, int g, int b) {
  // Approximate ANSI 256 color
  final code = 16 + (r ~/ 51) * 36 + (g ~/ 51) * 6 + (b ~/ 51);
  print('  \x1b[48;5;${code}m     \x1b[0m  分析カラー: RGB($r, $g, $b)');
}

void _printConstellation(Constellation c) {
  print('  ${_gray}── 星座判定 ──$_reset');
  print('');
  print('  $_bold${c.symbol} ${c.name}$_reset  ${_dim}(${c.period})$_reset');
  print('  ${_gray}エレメント: ${c.element}$_reset');
  print('  ${_gray}特性: ${c.traits.join('・')}$_reset');
  print('  ${_gray}ラッキーアイテム: ${c.luckyItem}$_reset');
}

void _printFortune(Fortune f) {
  print('  ${_gray}── 今日の運勢 ──$_reset');
  print('');
  print('  $_yellow総合運   ${luckStars(f.overallLuck)}$_reset');
  print('  $_magenta恋愛運   ${luckStars(f.loveLuck)}$_reset');
  print('  $_cyan仕事運   ${luckStars(f.workLuck)}$_reset');
  print('  $_bold金運     ${luckStars(f.moneyLuck)}$_reset');
  print('  $_white健康運   ${luckStars(f.healthLuck)}$_reset');
  print('');
  print('  $_italic${f.message}$_reset');
  print('');
  print('  ${_dim}💡 ${f.advice}$_reset');
  print('');
  print('  ${_gray}ラッキーカラー: ${f.luckyColor}$_reset');
  print('  ${_gray}ラッキーナンバー: ${f.luckyNumber}$_reset');
  print('  ${_gray}コスミックエネルギー: ${f.cosmicEnergy}%$_reset');
  print('');
  print('  ${_dim}━━━━━━━━━━━━━━━━━━━━━━━━$_reset');
  print('  ${_dim}星占 — 写真の色から星を読む$_reset');
}
