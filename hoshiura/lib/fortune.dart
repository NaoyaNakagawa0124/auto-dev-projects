/// 運勢生成エンジン — 星座とカラーに基づく占い結果を生成
library;

import 'constellations.dart';

class Fortune {
  final Constellation constellation;
  final int overallLuck;    // 1-5
  final int loveLuck;       // 1-5
  final int workLuck;       // 1-5
  final int moneyLuck;      // 1-5
  final int healthLuck;     // 1-5
  final String message;
  final String advice;
  final String luckyColor;
  final String luckyNumber;
  final int cosmicEnergy;   // 0-100

  const Fortune({
    required this.constellation,
    required this.overallLuck,
    required this.loveLuck,
    required this.workLuck,
    required this.moneyLuck,
    required this.healthLuck,
    required this.message,
    required this.advice,
    required this.luckyColor,
    required this.luckyNumber,
    required this.cosmicEnergy,
  });
}

/// Messages pool for fortune generation
const _messages = {
  5: [
    '宇宙のエネルギーがあなたに集中しています。最高の一日になるでしょう。',
    '星々があなたの味方です。大胆に行動してください。',
    '銀河の祝福を受けています。何をしても上手くいく日。',
    '星座のパワーが最大に高まっています。チャンスを掴んで！',
  ],
  4: [
    '星のめぐりが良い方向に。積極的に動いて吉。',
    '宇宙からの後押しを感じられる日。新しいことにトライ！',
    '良い流れが来ています。直感を信じて進みましょう。',
    '星の配置があなたを導いています。流れに乗って。',
  ],
  3: [
    '穏やかな星回り。日常を大切に過ごしましょう。',
    '平穏な宇宙エネルギー。着実に一歩ずつ前進を。',
    'バランスの取れた一日。焦らず自分のペースで。',
    '星は静かにあなたを見守っています。',
  ],
  2: [
    '少し星の巡りが滞り気味。無理はせず休息を。',
    '宇宙エネルギーが弱め。充電期間と思って過ごしましょう。',
    '小さなつまずきに注意。慎重に行動して吉。',
    '今は準備の時。次の好機に備えましょう。',
  ],
  1: [
    '星が静まっている日。無理をせず自分を大切に。',
    '今日は内省の日。自分と向き合う時間に。',
    '宇宙のリズムが変わる前の静けさ。明日に期待を。',
    '星は休息を勧めています。心身をいたわりましょう。',
  ],
};

const _advice = [
  '東の空を見上げてみてください。新しいインスピレーションが生まれます。',
  '今日は暖色系の服を選ぶと運気アップ。',
  '夜空の星を5分間眺めると、心が整います。',
  '大切な人に感謝のメッセージを送ると良いことが起きます。',
  'いつもと違う道を通ってみると、発見があるかも。',
  '深呼吸を3回。宇宙のエネルギーを取り込みましょう。',
  '今日のラッキーフードは温かいスープ。体を温めて。',
  '午後3時に一息つくと、良いアイデアが浮かびます。',
  '写真を撮る時は少し上を向いて。空の色が幸運を呼びます。',
  '青い小物を身につけると冷静さが増します。',
  '朝日を浴びると一日の運勢が安定します。',
  '手書きで何かを書くと、クリエイティブなエネルギーが高まります。',
];

const _luckyColors = [
  'スターライトシルバー',
  'ネビュラピンク',
  'オーロラグリーン',
  'コスミックブルー',
  'ギャラクシーパープル',
  'サンセットオレンジ',
  'ムーンライトホワイト',
  'ミッドナイトネイビー',
  'マーズレッド',
  'サターンゴールド',
  'アースグリーン',
  'ヴィーナスピンク',
];

/// Generate a fortune based on constellation and a seed value
Fortune generateFortune(Constellation constellation, int seed) {
  // Deterministic pseudo-random from seed
  int hash = seed;
  int next() {
    hash = ((hash * 1103515245 + 12345) & 0x7FFFFFFF);
    return hash;
  }

  final overall = (next() % 5) + 1;
  final love = (next() % 5) + 1;
  final work = (next() % 5) + 1;
  final money = (next() % 5) + 1;
  final health = (next() % 5) + 1;

  final msgs = _messages[overall]!;
  final message = msgs[next() % msgs.length];
  final advice = _advice[next() % _advice.length];
  final luckyColor = _luckyColors[next() % _luckyColors.length];
  final luckyNumber = '${(next() % 99) + 1}';
  final cosmicEnergy = (next() % 51) + 50; // 50-100

  return Fortune(
    constellation: constellation,
    overallLuck: overall,
    loveLuck: love,
    workLuck: work,
    moneyLuck: money,
    healthLuck: health,
    message: message,
    advice: advice,
    luckyColor: luckyColor,
    luckyNumber: luckyNumber,
    cosmicEnergy: cosmicEnergy,
  );
}

/// Generate a fortune from RGB color values
Fortune fortuneFromColor(int r, int g, int b, {int? seed}) {
  final constellation = findMatchingConstellation(r, g, b);
  final s = seed ?? (r * 1000000 + g * 1000 + b + DateTime.now().day);
  return generateFortune(constellation, s);
}

/// Generate stars string for display (★☆)
String luckStars(int level) {
  return '★' * level + '☆' * (5 - level);
}
