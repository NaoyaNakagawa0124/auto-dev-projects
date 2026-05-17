// inu-saiten content script — bundles src/ logic as a single classic-script file.
// Because content_scripts can't be ES modules in MV3, we inline what we need.
// The pure logic lives in src/ for tests; this file mirrors it for the runtime.

(() => {
  if (window.__inuSaitenLoaded) return;
  window.__inuSaitenLoaded = true;

  // ─── BANNED for runtime introspection (kept identical to src/banned.js) ───

  // ─── Ingredients (subset embedded; full dictionary mirrors src/ingredients.js) ───
  const INGREDIENTS = [
    { name: "鶏胸肉", aliases: ["鶏むね肉", "むね肉", "chicken breast"], category: "love", score: 95 },
    { name: "ささみ", aliases: ["鶏ささみ", "chicken tender"], category: "love", score: 90 },
    { name: "鶏もも肉", aliases: ["もも肉", "chicken thigh"], category: "love", score: 92 },
    { name: "鶏ガラ", aliases: ["chicken bone"], category: "love", score: 85 },
    { name: "鶏ガラスープ", aliases: ["鶏がら出汁", "chicken stock"], category: "love", score: 82 },
    { name: "鶏ひき肉", aliases: ["鶏挽肉", "ground chicken"], category: "love", score: 88 },
    { name: "豚肉", aliases: ["豚バラ", "pork", "豚もも"], category: "love", score: 80 },
    { name: "豚ひき肉", aliases: ["豚挽肉", "ground pork"], category: "love", score: 78 },
    { name: "牛肉", aliases: ["牛もも", "beef"], category: "love", score: 88 },
    { name: "牛ひき肉", aliases: ["牛挽肉", "ground beef"], category: "love", score: 85 },
    { name: "ラム肉", aliases: ["羊肉", "lamb"], category: "love", score: 75 },
    { name: "鴨肉", aliases: ["合鴨", "duck"], category: "love", score: 80 },
    { name: "鮭", aliases: ["サーモン", "salmon"], category: "love", score: 85 },
    { name: "鯛", aliases: ["タイ", "snapper"], category: "love", score: 70 },
    { name: "鯵", aliases: ["アジ"], category: "love", score: 70 },
    { name: "鰯", aliases: ["イワシ", "sardine"], category: "love", score: 72 },
    { name: "白身魚", aliases: ["タラ", "鱈", "cod"], category: "love", score: 75 },
    { name: "ツナ缶", aliases: ["ツナ", "tuna"], category: "love", score: 78 },
    { name: "卵", aliases: ["egg", "全卵"], category: "love", score: 80 },
    { name: "うずら卵", aliases: ["ウズラの卵", "quail egg"], category: "love", score: 72 },
    { name: "鶏レバー", aliases: ["レバー", "chicken liver"], category: "love", score: 82 },
    { name: "砂肝", aliases: ["砂ずり", "gizzard"], category: "love", score: 75 },
    { name: "ベーコン", aliases: ["bacon"], category: "love", score: 78 },
    { name: "ハム", aliases: ["ham"], category: "love", score: 70 },
    { name: "ソーセージ", aliases: ["ウインナー", "sausage"], category: "love", score: 72 },
    { name: "魚介出汁", aliases: ["和風だし", "鰹節", "かつお節", "bonito", "dashi"], category: "love", score: 80 },
    { name: "ヨーグルト", aliases: ["yogurt", "プレーンヨーグルト"], category: "love", score: 65 },
    { name: "チーズ", aliases: ["cheese", "モッツァレラ", "チェダー"], category: "love", score: 78 },
    { name: "バター", aliases: ["butter"], category: "love", score: 70 },
    { name: "りんご", aliases: ["リンゴ", "林檎", "apple"], category: "love", score: 68 },
    { name: "バナナ", aliases: ["banana"], category: "love", score: 70 },
    { name: "ブルーベリー", aliases: ["blueberry"], category: "love", score: 72 },
    { name: "イチゴ", aliases: ["苺", "strawberry"], category: "love", score: 68 },
    { name: "メロン", aliases: ["melon"], category: "love", score: 60 },
    { name: "スイカ", aliases: ["西瓜", "watermelon"], category: "love", score: 65 },
    { name: "梨", aliases: ["ナシ", "pear"], category: "love", score: 60 },
    { name: "桃", aliases: ["モモ", "peach"], category: "love", score: 62 },
    { name: "オートミール", aliases: ["oatmeal", "オーツ"], category: "love", score: 65 },
    { name: "玄米", aliases: ["brown rice"], category: "love", score: 60 },
    { name: "白米", aliases: ["ご飯", "白ご飯", "rice"], category: "love", score: 55 },
    { name: "さつまいも", aliases: ["薩摩芋", "さつま芋", "sweet potato"], category: "love", score: 80 },
    { name: "じゃがいも", aliases: ["ジャガイモ", "馬鈴薯", "potato"], category: "love", score: 60 },
    { name: "にんじん", aliases: ["人参", "carrot"], category: "love", score: 70 },
    { name: "かぼちゃ", aliases: ["南瓜", "pumpkin", "squash"], category: "love", score: 75 },
    { name: "ブロッコリー", aliases: ["broccoli"], category: "love", score: 60 },
    { name: "キャベツ", aliases: ["cabbage"], category: "love", score: 55 },
    { name: "白菜", aliases: ["napa cabbage"], category: "love", score: 55 },
    { name: "豆腐", aliases: ["tofu"], category: "love", score: 62 },
    { name: "薄力粉", aliases: ["小麦粉", "flour"], category: "meh", score: 15 },
    { name: "強力粉", aliases: ["bread flour"], category: "meh", score: 15 },
    { name: "片栗粉", aliases: ["potato starch"], category: "meh", score: 20 },
    { name: "砂糖", aliases: ["上白糖", "sugar", "グラニュー糖"], category: "meh", score: 25 },
    { name: "塩", aliases: ["食塩", "salt"], category: "meh", score: 10 },
    { name: "胡椒", aliases: ["コショウ", "pepper"], category: "meh", score: 10 },
    { name: "醤油", aliases: ["しょうゆ", "soy sauce"], category: "meh", score: 30 },
    { name: "味噌", aliases: ["miso"], category: "meh", score: 25 },
    { name: "酢", aliases: ["米酢", "穀物酢", "vinegar"], category: "meh", score: 15 },
    { name: "みりん", aliases: ["mirin"], category: "meh", score: 20 },
    { name: "料理酒", aliases: ["sake"], category: "meh", score: 18 },
    { name: "サラダ油", aliases: ["vegetable oil"], category: "meh", score: 22 },
    { name: "オリーブ油", aliases: ["オリーブオイル", "olive oil"], category: "meh", score: 35 },
    { name: "ごま油", aliases: ["胡麻油", "sesame oil"], category: "meh", score: 30 },
    { name: "海苔", aliases: ["のり", "焼海苔", "nori"], category: "meh", score: 35 },
    { name: "玉ねぎ", aliases: ["タマネギ", "オニオン", "onion"], category: "danger", score: 0, warning: "犬 に 有毒 — ネギ 属" },
    { name: "長ねぎ", aliases: ["青ねぎ", "白ねぎ", "leek", "green onion"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "ニンニク", aliases: ["にんにく", "garlic"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "ニラ", aliases: ["韮", "chinese chive"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "らっきょう", aliases: ["ラッキョウ", "shallot"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "あさつき", aliases: ["浅葱", "chive"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "チョコレート", aliases: ["chocolate", "ココア", "cocoa"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "ぶどう", aliases: ["ブドウ", "葡萄", "grape", "レーズン", "raisin", "干しぶどう"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "アボカド", aliases: ["avocado"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "マカダミアナッツ", aliases: ["マカデミアナッツ", "macadamia"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "キシリトール", aliases: ["xylitol"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "カフェイン", aliases: ["コーヒー", "coffee", "紅茶葉", "緑茶葉", "matcha"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "アルコール", aliases: ["ワイン", "ビール", "wine", "beer"], category: "danger", score: 0, warning: "犬 に 有毒" },
    { name: "アーモンド", aliases: ["almond"], category: "danger", score: 0, warning: "犬 に 注意" },
    { name: "ナツメグ", aliases: ["nutmeg"], category: "danger", score: 0, warning: "犬 に 注意" },
  ];

  const DOGS = {
    pochi: { id: "pochi", name: "お利口 ポチ", breed: "ボーダー コリー", sign: "5 歳、 几帳面 で 採点 が 厳しい", bias: -3, voice: "polite" },
    maro: { id: "maro", name: "シニア マロ", breed: "柴犬", sign: "12 歳、 達観 して 何 でも 受け入れる", bias: 0, voice: "wise" },
    taro: { id: "taro", name: "ヤンチャ タロウ", breed: "トイ プードル", sign: "1 歳、 全肯定 で 評点 が 甘め", bias: 10, voice: "excited" },
    john: { id: "john", name: "哲学者 ジョン", breed: "ラブラドール", sign: "8 歳、 内省 的", bias: -1, voice: "philosophical" },
  };

  const PHRASES = {
    polite: {
      open_great: ["肉 が 主役 で 大 賛同 です。", "材料 の バランス が 礼儀 正しい。", "数字 で 言えば、 90 点 を 確実 に 出せる 構成 です。"],
      open_mid: ["悪く は ない 構成 です が、 主役 が 弱い。", "材料 表 を 拝見 し ました。 まあ 及第 点 で しょう。", "肉 の 比率 が 控えめ で、 物足り なさ が 残り ます。"],
      open_bad: ["申し上げ にくい です が、 私 の 評価 は 厳しい です。", "肉 の 影 が 薄く、 主役 不在 の 構成 と 判断 し ます。", "私 の お気持ち と し ては、 う〜ん、 で すね。"],
      danger: ["{name} が 入って いる の が 残念 で 部屋 の 隅 に 退避 し ました。", "{name} は 私 に は 合い ません。 距離 を 取り ます。", "{name} の せい で 私 は 別 室 待機 と なり ます。"],
      love_brag: ["{name} の 香り だけ で 私 は 1 日 を 過ごせ ます。", "{name} に 関して は、 私 は 命 を 賭ける 所存 です。", "{name} は 私 の 朝 ご飯 の 夢 を 1 週間 占領 し ます。"],
      meh_resign: ["{name} は 正直 どう でも 良い ので、 飼い主 様 で どうぞ。", "{name} に 関し て は コメント を 控え させて 頂き ます。"],
      sign: "— お利口 ポチ",
    },
    wise: {
      open_great: ["うん、 これ は 立派 な もの じゃ。", "若い 頃 を 思い出す、 こう いう レシピ。", "肉 と 出汁 が 揃って いれば、 もう 文句 は ない の じゃ。"],
      open_mid: ["まあ、 こう いう 日 も ある の じゃろう。", "悪い と は 言わ ん が、 私 の 心 は 動か ない の じゃ。", "12 年 生き て 来た 私 から すれば、 中央 値 と いう こと じゃ。"],
      open_bad: ["ふむ。 私 は もう 飼い主 を 見つめる だけ じゃ。", "私 の 残り 時間 を こう いう レシピ に 使う の は、 一考 を 要する の じゃ。", "今日 の 夕飯 は、 私 の お皿 に 期待 し ない 方 が 良い の じゃ。"],
      danger: ["{name} が 見える な。 私 は そっと 別 部屋 へ 移動 する の じゃ。", "{name} か。 飼い主 よ、 こちら に は 来ない で くれ。", "{name} は 私 の 寿命 に 関わる の じゃ、 そっと 警報 を 鳴らす。"],
      love_brag: ["{name} か。 12 年 生き て 来た 価値 が ある と いう もの。", "{name} は、 私 の 残り 全部 を 賭けて も 惜しく ない の じゃ。", "{name} の 匂い を 嗅ぐ ため だけ に、 私 は 今日 を 生き て いる の じゃ。"],
      meh_resign: ["{name} は、 まあ あって も 無くて も。", "{name} に 私 の 老 後 を 委ね る 訳 に は い か ぬ。"],
      sign: "— シニア マロ",
    },
    excited: {
      open_great: ["やった!! やった!! 100 点 で 良い ?", "もう 全部 美味しい、 全部 私 に 関係 ある、 早く!!", "嬉しい!! 飼い主 様、 本当 に 嬉しい です!!"],
      open_mid: ["ええっ と… でも、 美味しい よ ね?", "ちょっと 物足り ない けど、 私 は OK!! 全部 OK!!", "うん!! 美味しい!! 多分!!"],
      open_bad: ["う〜ん でも 食べる よ ね? 私、 食べる よ ね?", "美味しい は ず!! きっと そう!!", "飼い主 様 が 作る から、 きっと 美味しい!!"],
      danger: ["{name} は ダメ なん だ よ ね、 知って る、 でも 匂い だけ…", "{name} が 入って て も、 私 は 諦め ない!!", "{name} の せい で 別 室 に 行く けど、 また 戻る!!"],
      love_brag: ["{name}!!! ぜ ったい くれる よ ね!?!?!?", "{name} は 私 の 全 て です!!! ぜ ったい くれる よ ね!?", "{name} が ある の で 私 は もう ハイ テンション!!"],
      meh_resign: ["{name} は… 興味 ない けど、 でも、 ね、 飼い主 様 が!", "{name} で も 食べ る!! 私 は 食べ る!!"],
      sign: "— ヤンチャ タロウ",
    },
    philosophical: {
      open_great: ["肉 と は、 つまり、 生命 の 形 だ。 この レシピ は それ を 理解 して いる。", "私 が この 世 に 生まれた 意味 を、 この レシピ が 教えて くれた。", "良い 構成。 私 は しばし 沈黙 する。"],
      open_mid: ["中庸。 中庸 は 美徳 だ、 と 古人 は 言った が、 私 は そう 思わ ない。", "肉 と 野菜 の 比率 を、 私 は 1 日 考える。", "私 の 期待 は、 確率 的 に 言って 50% で 裏切ら れる。"],
      open_bad: ["この レシピ は、 私 の 存在 意義 を 問い直す。", "私 と は 何 か。 この レシピ の 前 で、 私 は 答え を 失う。", "肉 の 不在 は、 私 に とって 哲学 的 危機 で ある。"],
      danger: ["{name} の 存在 は、 私 を 形而上 学 的 危機 に 陥れる。", "{name}。 私 は それ を 認識 し、 そして 距離 を 取る。", "{name} と 私 の 関係 は、 残念 ながら 並列 で ある。"],
      love_brag: ["{name}。 これ こそ が、 私 の 存在 を 肯定 する 唯一 の 命題 だ。", "{name} の 香り を 嗅ぐ こと は、 私 に とって 哲学 で ある。", "{name}。 これ が ある 限り、 私 は 生 を 肯定 する。"],
      meh_resign: ["{name} は、 私 に は 関係 が ない、 と 私 は 思う、 多分。", "{name}。 これ は 私 の 哲学 体系 に 関係 し ない。"],
      sign: "— 哲学者 ジョン",
    },
  };

  // ─── Logic copies ───

  function indexAliases() {
    const out = [];
    for (const e of INGREDIENTS) {
      out.push({ alias: e.name, entry: e });
      for (const a of e.aliases) out.push({ alias: a, entry: e });
    }
    out.sort((a, b) => b.alias.length - a.alias.length);
    return out;
  }
  const ALIAS_INDEX = indexAliases();

  function detectIngredientsFromText(text) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const found = new Map();
    for (const { alias, entry } of ALIAS_INDEX) {
      if (lower.includes(alias.toLowerCase())) {
        if (!found.has(entry.name)) found.set(entry.name, entry);
      }
    }
    return Array.from(found.values());
  }

  function scoreIngredients(entries) {
    if (!entries.length) return null;
    const love = entries.filter((e) => e.category === "love");
    const meh = entries.filter((e) => e.category === "meh");
    const danger = entries.filter((e) => e.category === "danger");
    let base;
    if (love.length === 0 && meh.length > 0 && danger.length === 0) {
      base = 40 + Math.min(20, meh.length * 3);
    } else if (love.length === 0 && danger.length > 0) {
      base = 30;
    } else if (love.length === 0) {
      base = 50;
    } else {
      const loveAvg = love.reduce((s, e) => s + e.score, 0) / love.length;
      base = Math.round(loveAvg);
      if (loveAvg >= 90) base += 10;
      else if (loveAvg >= 80) base += 5;
    }
    if (meh.length >= 8 && love.length > 0) base -= 3;
    if (love.length >= 4) base += 3;
    let cap = 100;
    if (danger.length >= 3) cap = 50;
    else if (danger.length === 2) cap = 60;
    else if (danger.length === 1) cap = 80;
    const finalScore = Math.max(0, Math.min(100, Math.min(base, cap)));
    return { score: finalScore, stars: starsFromScore(finalScore), loveCount: love.length, mehCount: meh.length, dangerCount: danger.length };
  }
  function starsFromScore(s) {
    if (s >= 90) return 5;
    if (s >= 75) return 4;
    if (s >= 55) return 3;
    if (s >= 35) return 2;
    return 1;
  }
  function starsToText(s) {
    return "★".repeat(s) + "☆".repeat(5 - s);
  }

  function seedFromString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) || 1;
  }
  function step(s) { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return s | 0; }
  function makeRng(seed) {
    let state = seed >>> 0 || 1;
    for (let i = 0; i < 10; i++) state = step(state);
    return {
      pick(arr) { state = step(state); return arr[(state >>> 0) % arr.length]; },
    };
  }

  function applyBias(score, dog) {
    return Math.max(0, Math.min(100, score + dog.bias));
  }

  function buildReview({ entries, dogId, seedKey }) {
    const dog = DOGS[dogId] || DOGS.pochi;
    const scored = scoreIngredients(entries);
    if (!scored) return { empty: true };
    const biased = applyBias(scored.score, dog);
    const voice = PHRASES[dog.voice];
    const rng = makeRng(seedFromString(seedKey + "|" + dog.id));
    const love = entries.filter((e) => e.category === "love").sort((a, b) => b.score - a.score);
    const danger = entries.filter((e) => e.category === "danger");
    const meh = entries.filter((e) => e.category === "meh").sort((a, b) => b.score - a.score);
    const opener = biased >= 80 ? rng.pick(voice.open_great) : biased >= 50 ? rng.pick(voice.open_mid) : rng.pick(voice.open_bad);
    const sentences = [opener];
    if (love.length) sentences.push(rng.pick(voice.love_brag).replace("{name}", love[0].name));
    if (danger.length) sentences.push(rng.pick(voice.danger).replace("{name}", danger[0].name));
    if (meh.length >= 2 && love.length === 0) sentences.push(rng.pick(voice.meh_resign).replace("{name}", meh[0].name));
    sentences.push(voice.sign);
    return {
      empty: false,
      score: biased,
      stars: scored.stars,
      starsText: starsToText(scored.stars),
      dog,
      paragraph: sentences.join(" "),
      lovePicks: love.slice(0, 4),
      dangerPicks: danger.slice(0, 4),
      mehPicks: meh.slice(0, 4),
      counts: { love: love.length, danger: danger.length, meh: meh.length, total: entries.length },
    };
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildOverlayHtml(r) {
    if (!r || r.empty) return "";
    const loveChips = r.lovePicks.map((e) => `<span class="inu-saiten-chip inu-saiten-chip--love">${escapeHtml(e.name)} <em>(${e.score})</em></span>`).join("");
    const dangerChips = r.dangerPicks.map((e) => `<span class="inu-saiten-chip inu-saiten-chip--danger">${escapeHtml(e.name)}</span>`).join("");
    const mehChips = r.mehPicks.map((e) => `<span class="inu-saiten-chip inu-saiten-chip--meh">${escapeHtml(e.name)} <em>(${e.score})</em></span>`).join("");
    return `
<div class="inu-saiten-card" role="dialog" aria-label="犬 が 採点 した レシピ 評価">
  <div class="inu-saiten-card__head">
    <div class="inu-saiten-card__brand">
      <span class="inu-saiten-card__mark">🐕</span>
      <div>
        <div class="inu-saiten-card__title">あなた の 犬 の 評価</div>
        <div class="inu-saiten-card__sub">${escapeHtml(r.dog.name)} · ${escapeHtml(r.dog.breed)} · ${escapeHtml(r.dog.sign)}</div>
      </div>
    </div>
    <div class="inu-saiten-card__score">
      <div class="inu-saiten-card__stars" aria-label="${r.stars} 星">${r.starsText}</div>
      <div class="inu-saiten-card__points">${r.score} / 100</div>
    </div>
    <button class="inu-saiten-card__close" aria-label="閉じる" data-inu-close>×</button>
  </div>
  <div class="inu-saiten-card__body">
    <blockquote class="inu-saiten-card__quote">${escapeHtml(r.paragraph)}</blockquote>
    ${loveChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">🐕 命 を 賭ける</span><div class="inu-saiten-row__chips">${loveChips}</div></div>` : ""}
    ${dangerChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">⚠️ 部屋 の 隅 に 退避</span><div class="inu-saiten-row__chips">${dangerChips}</div></div>` : ""}
    ${mehChips ? `<div class="inu-saiten-row"><span class="inu-saiten-row__label">😴 正直 どう でも</span><div class="inu-saiten-row__chips">${mehChips}</div></div>` : ""}
    <div class="inu-saiten-card__foot">これ は コメディ 拡張 で あって、 飼育 助言 で は あり ません。</div>
  </div>
</div>`.trim();
  }

  // ─── Runtime glue ───

  const SETTINGS_KEY = "inu-saiten:settings";
  const HISTORY_KEY = "inu-saiten:history";

  function getStorage() {
    return (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local)
      ? chrome.storage.local
      : null;
  }

  function loadSettings() {
    return new Promise((resolve) => {
      const s = getStorage();
      if (!s) return resolve({ dog: "pochi", enabled: true });
      s.get([SETTINGS_KEY], (res) => {
        resolve(res[SETTINGS_KEY] || { dog: "pochi", enabled: true });
      });
    });
  }

  function pushHistory(entry) {
    const s = getStorage();
    if (!s) return;
    s.get([HISTORY_KEY], (res) => {
      const list = res[HISTORY_KEY] || [];
      list.unshift(entry);
      while (list.length > 20) list.pop();
      s.set({ [HISTORY_KEY]: list });
    });
  }

  // Extract a recipe-shaped text blob from the page
  function extractPageText() {
    // Prefer common selectors; fall back to body text.
    const selectors = [
      '[itemprop="recipeIngredient"]',
      '[itemprop="ingredients"]',
      ".ingredient",
      ".ingredients",
      ".recipe-ingredient",
      ".recipe-ingredients",
      "#ingredients",
      ".ingredients_list",
      ".materials",
      ".material",
      "table.ingredients",
    ];
    const collected = [];
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        const t = (el.innerText || el.textContent || "").trim();
        if (t) collected.push(t);
      }
    }
    if (collected.length > 0) return collected.join("\n");
    // Generic: any li containing a unit-ish marker
    const liHits = [];
    for (const li of document.querySelectorAll("li")) {
      const t = (li.innerText || "").trim();
      if (!t || t.length > 80) continue;
      if (/(\d+\s*(g|kg|ml|cc|個|枚|本|杯|匙|大さじ|小さじ|片))/.test(t)) {
        liHits.push(t);
      }
    }
    if (liHits.length >= 3) return liHits.join("\n");
    // Last-resort: body text but limit length
    const body = (document.body && document.body.innerText) || "";
    return body.slice(0, 4000);
  }

  function injectStyle(css) {
    const id = "inu-saiten-style";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function injectCard(html) {
    const id = "inu-saiten-host";
    document.getElementById(id)?.remove();
    const host = document.createElement("div");
    host.id = id;
    host.innerHTML = html;
    document.body.appendChild(host);
    host.querySelector("[data-inu-close]")?.addEventListener("click", () => {
      host.remove();
      sessionStorage.setItem("inu-saiten:dismissed:" + location.pathname, "1");
    });
  }

  async function run() {
    if (sessionStorage.getItem("inu-saiten:dismissed:" + location.pathname)) return;
    const settings = await loadSettings();
    if (!settings.enabled) return;
    const text = extractPageText();
    if (!text) return;
    const entries = detectIngredientsFromText(text);
    if (entries.length < 2) return; // not enough signal
    const review = buildReview({ entries, dogId: settings.dog || "pochi", seedKey: location.href });
    const html = buildOverlayHtml(review);
    if (!html) return;
    injectCard(html);
    pushHistory({
      url: location.href,
      title: document.title.slice(0, 120),
      score: review.score,
      dog: review.dog.id,
      timestamp: Date.now(),
    });
  }

  // Run once page is idle (a bit after load to let JS-rendered ingredient lists land)
  if (document.readyState === "complete") setTimeout(run, 600);
  else window.addEventListener("load", () => setTimeout(run, 600));
})();
