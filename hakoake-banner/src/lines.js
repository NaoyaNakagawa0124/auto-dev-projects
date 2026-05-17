// 50 absurd-but-gentle banner lines, grouped by phase.

export const BANNED_WORDS = [
  "絶対", "必ず", "神", "最強", "ヤバい", "失敗", "ダメ人間",
  "お疲れさま", "がんばれ", "努力", "天才", "すごい",
];

// fresh: 0-6 days — boxes still everywhere, the new place still feels rented
const FRESH = [
  "玄関 の 段ボール、 まだ そこ に います。",
  "リビング の 床 は、 段ボール 色 です。",
  "今 開けた 箱 が、 また 別 の 箱 に 戻って いきます。",
  "椅子 と して 使って いる 箱 は、 1 軍 です。",
  "ガス は 開通 しました。 心 は まだ です。",
  "シャワー の 水圧 は、 まだ 信用 して いません。",
  "新居 の 換気扇 が、 旧居 を 思い出させます。",
  "段ボール の 中 で、 季節 が 1 つ 進み ました。",
  "「とりあえず」 の 置き場 が、 5 ヶ所 増えて います。",
  "電子レンジ の 中 に、 何故 か リモコン が います。",
  "「明日 開ける」 が、 続いて います。",
  "新しい 鍵 の 重さ、 まだ 慣れません。",
];

// settling: 7-29 days — you can find most things but not everything
const SETTLING = [
  "ダンボール、 もう そろそろ 開けません か。",
  "1 個 だけ 開ければ、 「家」 と 呼べる かも しれません。",
  "ガムテープ の 切れ端 が、 床 に 5 枚 います。",
  "「お風呂 道具」 と 書いた 箱、 まだ 玄関 です。",
  "鍋 が ある 棚 を、 ようやく 1 つ 決め ました。",
  "リモコン と 充電器 の 置き場 を 検討 中 です。",
  "新居 の 蛇口 の 音 を、 1 度 だけ 褒めました。",
  "「あと これ だけ」 が、 4 回 リピート しています。",
  "リビング の 真ん中 の 箱 が、 ローテーブル 化 しました。",
  "近所 の コンビニ は、 もう 把握 しました。",
  "玄関 マット を、 やっと 1 枚 買い ました。",
  "段ボール を 1 個 だけ、 ベランダ に 追い やり ました。",
  "観葉植物 が、 まだ 部屋 を 「家」 と 認識 して いません。",
];

// stale: 30-89 days — boxes you stopped looking at have become furniture
const STALE = [
  "ダンボール が、 立派 な 家具 に なりました。",
  "「冬物」 と 書かれた 箱 が、 まだ 夏 を 過ごして います。",
  "あの 箱、 中身 を もう 忘れて います。",
  "椅子 と して 使って いる 箱 が、 沈み 始めました。",
  "段ボール 越し の 月 を、 何度 か 見上げました。",
  "「とりあえず」 が、 「とりあえず」 の まま 1 ヶ月 経ちました。",
  "未開封 の 箱 と、 共同生活 が 始まりました。",
  "段ボール、 鳴いて いません か。",
  "新居 の 床 が、 段ボール 抜き で 何 平米 か 不明 です。",
  "次 引っ越す 時 の 荷物 が、 すでに 揃って います。",
  "鍵 を、 ようやく 「うち の 鍵」 と 呼びました。",
  "玄関 の 段ボール、 もう 表札 です。",
  "クローゼット の 半分 が、 まだ 段ボール です。",
];

// ghost: 90+ days — you may no longer exist as a moving subject
const GHOST = [
  "あなた は 引っ越して いない 可能性 が あります。",
  "段ボール は、 別 の 次元 に 移って いる か も しれません。",
  "「箱」 と は、 何 の こと でし た か。",
  "新居 の 概念 が、 ゆっくり 溶けて います。",
  "鏡 の 向こう の 段ボール が、 こちら を 見ています。",
  "あの 箱 は、 もう 家 の 一部 です。",
  "あなた の 「引っ越し」 は、 永遠 に 続く プロジェクト 化 しました。",
  "段ボール 紀元 N 日目 に 到達 しました。",
  "「片付ける」 と いう 言葉 を、 1 ヶ月 発して いません。",
  "段ボール の 中 の あなた、 元気 です か。",
  "新居、 と は、 何 だった の でしょう。",
  "箱 を 開けた 記憶 が、 もう 古典 です。",
];

export const LINES = [
  ...FRESH.map((t, i)    => ({ id: `f${i + 1}`, phase: "fresh",    text: t })),
  ...SETTLING.map((t, i) => ({ id: `s${i + 1}`, phase: "settling", text: t })),
  ...STALE.map((t, i)    => ({ id: `t${i + 1}`, phase: "stale",    text: t })),
  ...GHOST.map((t, i)    => ({ id: `g${i + 1}`, phase: "ghost",    text: t })),
];

export function byPhase(phase) {
  return LINES.filter(l => l.phase === phase);
}

export function pickLine(seed, phase) {
  const pool = byPhase(phase);
  if (pool.length === 0) throw new Error(`no lines for phase ${phase}`);
  // xorshift-ish deterministic index from seed.
  let s = (((seed | 0) ^ 0x9e3779b1) | 0) || 0x9e3779b1;
  for (let i = 0; i < 3; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
  }
  const idx = ((s >>> 0) % pool.length);
  return pool[idx];
}
