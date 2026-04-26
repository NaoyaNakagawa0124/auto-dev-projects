/**
 * Constellation data — mirrors Dart lib/constellations.dart
 */
const CONSTELLATIONS = [
  { name: '牡羊座', symbol: '♈', element: '火', period: '3/21〜4/19', primary: [220,50,50], secondary: [255,120,50], traits: ['情熱的','行動力','リーダーシップ','勇敢'], luckyItem: '赤いアクセサリー' },
  { name: '牡牛座', symbol: '♉', element: '地', period: '4/20〜5/20', primary: [120,180,80], secondary: [180,140,80], traits: ['安定志向','忍耐力','美的センス','堅実'], luckyItem: '観葉植物' },
  { name: '双子座', symbol: '♊', element: '風', period: '5/21〜6/21', primary: [255,220,50], secondary: [200,255,150], traits: ['知的好奇心','社交的','柔軟性','多才'], luckyItem: '黄色い手帳' },
  { name: '蟹座', symbol: '♋', element: '水', period: '6/22〜7/22', primary: [200,220,240], secondary: [150,180,220], traits: ['家庭的','感受性','思いやり','直感力'], luckyItem: '真珠のアクセサリー' },
  { name: '獅子座', symbol: '♌', element: '火', period: '7/23〜8/22', primary: [255,180,0], secondary: [255,100,0], traits: ['カリスマ性','創造力','自信','寛大'], luckyItem: 'ゴールドのリング' },
  { name: '乙女座', symbol: '♍', element: '地', period: '8/23〜9/22', primary: [100,140,100], secondary: [180,160,120], traits: ['分析力','几帳面','実用的','奉仕精神'], luckyItem: 'ラベンダーのサシェ' },
  { name: '天秤座', symbol: '♎', element: '風', period: '9/23〜10/23', primary: [200,150,200], secondary: [240,200,220], traits: ['バランス感覚','社交性','公平','洗練'], luckyItem: 'ローズクォーツ' },
  { name: '蠍座', symbol: '♏', element: '水', period: '10/24〜11/22', primary: [100,0,50], secondary: [50,0,80], traits: ['洞察力','集中力','神秘的','情熱'], luckyItem: 'ガーネットの石' },
  { name: '射手座', symbol: '♐', element: '火', period: '11/23〜12/21', primary: [100,50,200], secondary: [150,100,255], traits: ['冒険心','楽観的','哲学的','自由'], luckyItem: 'ターコイズのブレスレット' },
  { name: '山羊座', symbol: '♑', element: '地', period: '12/22〜1/19', primary: [60,60,70], secondary: [100,80,60], traits: ['責任感','忍耐力','野心','規律'], luckyItem: 'レザーの財布' },
  { name: '水瓶座', symbol: '♒', element: '風', period: '1/20〜2/18', primary: [50,150,220], secondary: [0,200,200], traits: ['独創性','人道的','革新','自由'], luckyItem: 'アメジストのペンダント' },
  { name: '魚座', symbol: '♓', element: '水', period: '2/19〜3/20', primary: [100,200,180], secondary: [150,180,220], traits: ['共感力','想像力','直感','優しさ'], luckyItem: 'アクアマリンの指輪' },
];

const MESSAGES = {
  5: ['宇宙のエネルギーがあなたに集中しています。最高の一日になるでしょう。','星々があなたの味方です。大胆に行動してください。','銀河の祝福を受けています。何をしても上手くいく日。','星座のパワーが最大に高まっています。チャンスを掴んで！'],
  4: ['星のめぐりが良い方向に。積極的に動いて吉。','宇宙からの後押しを感じられる日。新しいことにトライ！','良い流れが来ています。直感を信じて進みましょう。','星の配置があなたを導いています。流れに乗って。'],
  3: ['穏やかな星回り。日常を大切に過ごしましょう。','平穏な宇宙エネルギー。着実に一歩ずつ前進を。','バランスの取れた一日。焦らず自分のペースで。','星は静かにあなたを見守っています。'],
  2: ['少し星の巡りが滞り気味。無理はせず休息を。','宇宙エネルギーが弱め。充電期間と思って過ごしましょう。','小さなつまずきに注意。慎重に行動して吉。','今は準備の時。次の好機に備えましょう。'],
  1: ['星が静まっている日。無理をせず自分を大切に。','今日は内省の日。自分と向き合う時間に。','宇宙のリズムが変わる前の静けさ。明日に期待を。','星は休息を勧めています。心身をいたわりましょう。'],
};

const ADVICE = [
  '東の空を見上げてみてください。新しいインスピレーションが生まれます。',
  '今日は暖色系の服を選ぶと運気アップ。',
  '夜空の星を5分間眺めると、心が整います。',
  '大切な人に感謝のメッセージを送ると良いことが起きます。',
  '深呼吸を3回。宇宙のエネルギーを取り込みましょう。',
  '写真を撮る時は少し上を向いて。空の色が幸運を呼びます。',
  '手書きで何かを書くと、クリエイティブなエネルギーが高まります。',
];

const LUCKY_COLORS = [
  'スターライトシルバー','ネビュラピンク','オーロラグリーン','コスミックブルー',
  'ギャラクシーパープル','サンセットオレンジ','ムーンライトホワイト','ミッドナイトネイビー',
];

function findConstellation(r, g, b) {
  let best = CONSTELLATIONS[0];
  let bestDist = Infinity;
  for (const c of CONSTELLATIONS) {
    const d1 = (r-c.primary[0])**2 + (g-c.primary[1])**2 + (b-c.primary[2])**2;
    const d2 = (r-c.secondary[0])**2 + (g-c.secondary[1])**2 + (b-c.secondary[2])**2;
    const dist = d1 * 0.6 + d2 * 0.4;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best;
}

function generateFortune(constellation, r, g, b) {
  let seed = r * 1000000 + g * 1000 + b + new Date().getDate();
  const next = () => { seed = ((seed * 1103515245 + 12345) & 0x7FFFFFFF); return seed; };

  const overall = (next() % 5) + 1;
  const love = (next() % 5) + 1;
  const work = (next() % 5) + 1;
  const money = (next() % 5) + 1;
  const health = (next() % 5) + 1;
  const msgs = MESSAGES[overall];
  const message = msgs[next() % msgs.length];
  const advice = ADVICE[next() % ADVICE.length];
  const luckyColor = LUCKY_COLORS[next() % LUCKY_COLORS.length];
  const luckyNumber = (next() % 99) + 1;
  const cosmicEnergy = (next() % 51) + 50;

  return { constellation, overall, love, work, money, health, message, advice, luckyColor, luckyNumber, cosmicEnergy };
}

function luckStars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
