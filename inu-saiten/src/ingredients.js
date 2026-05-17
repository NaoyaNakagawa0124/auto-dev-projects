// Ingredient dictionary. category: love / meh / danger. score: 0-100 (dog's enthusiasm).
// danger = known canine toxicity (factual). love/meh are humorous projections only.

export const INGREDIENTS = [
  // ─── LOVE (50+ entries) — meats, broths, certain veggies, certain fats ───
  { name: "鶏胸肉", aliases: ["鶏むね肉", "むね肉", "chicken breast"], category: "love", score: 95 },
  { name: "ささみ", aliases: ["鶏ささみ", "chicken tender"], category: "love", score: 90 },
  { name: "鶏もも肉", aliases: ["もも肉", "chicken thigh"], category: "love", score: 92 },
  { name: "鶏ガラ", aliases: ["chicken bone"], category: "love", score: 85 },
  { name: "鶏ひき肉", aliases: ["鶏挽肉", "ground chicken"], category: "love", score: 88 },
  { name: "豚肉", aliases: ["豚バラ", "pork", "豚もも"], category: "love", score: 80 },
  { name: "豚ひき肉", aliases: ["豚挽肉", "ground pork"], category: "love", score: 78 },
  { name: "牛肉", aliases: ["牛もも", "beef"], category: "love", score: 88 },
  { name: "牛ひき肉", aliases: ["牛挽肉", "ground beef"], category: "love", score: 85 },
  { name: "ラム肉", aliases: ["羊肉", "lamb"], category: "love", score: 75 },
  { name: "鴨肉", aliases: ["合鴨", "duck"], category: "love", score: 80 },
  { name: "鮭", aliases: ["サーモン", "salmon"], category: "love", score: 85 },
  { name: "鯛", aliases: ["タイ", "snapper"], category: "love", score: 70 },
  { name: "鯵", aliases: ["アジ", "horse mackerel"], category: "love", score: 70 },
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
  { name: "魚介出汁", aliases: ["和風だし", "鰹節", "かつお節", "dashi", "bonito"], category: "love", score: 80 },
  { name: "鶏ガラスープ", aliases: ["鶏がら出汁", "chicken stock"], category: "love", score: 82 },
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
  { name: "きゅうり", aliases: ["胡瓜", "cucumber"], category: "love", score: 50 },
  { name: "トマト (赤熟)", aliases: ["tomato"], category: "love", score: 58 },
  { name: "豆腐", aliases: ["tofu"], category: "love", score: 62 },
  { name: "納豆", aliases: ["natto"], category: "love", score: 60 },

  // ─── MEH (30+ entries) — neutral seasonings, grains, oils ───
  { name: "薄力粉", aliases: ["小麦粉", "flour"], category: "meh", score: 15 },
  { name: "強力粉", aliases: ["bread flour"], category: "meh", score: 15 },
  { name: "片栗粉", aliases: ["potato starch"], category: "meh", score: 20 },
  { name: "コーンスターチ", aliases: ["corn starch"], category: "meh", score: 20 },
  { name: "砂糖", aliases: ["上白糖", "sugar", "グラニュー糖"], category: "meh", score: 25 },
  { name: "三温糖", aliases: ["brown sugar"], category: "meh", score: 25 },
  { name: "塩", aliases: ["食塩", "salt"], category: "meh", score: 10 },
  { name: "胡椒", aliases: ["コショウ", "pepper", "黒胡椒"], category: "meh", score: 10 },
  { name: "醤油", aliases: ["しょうゆ", "soy sauce"], category: "meh", score: 30 },
  { name: "味噌", aliases: ["miso"], category: "meh", score: 25 },
  { name: "酢", aliases: ["米酢", "穀物酢", "vinegar"], category: "meh", score: 15 },
  { name: "みりん", aliases: ["mirin"], category: "meh", score: 20 },
  { name: "料理酒", aliases: ["sake"], category: "meh", score: 18 },
  { name: "サラダ油", aliases: ["vegetable oil"], category: "meh", score: 22 },
  { name: "オリーブ油", aliases: ["オリーブオイル", "olive oil"], category: "meh", score: 35 },
  { name: "ごま油", aliases: ["胡麻油", "sesame oil"], category: "meh", score: 30 },
  { name: "ベーキングパウダー", aliases: ["baking powder"], category: "meh", score: 8 },
  { name: "重曹", aliases: ["baking soda"], category: "meh", score: 8 },
  { name: "ドライイースト", aliases: ["yeast"], category: "meh", score: 10 },
  { name: "パン粉", aliases: ["bread crumbs"], category: "meh", score: 25 },
  { name: "豆乳", aliases: ["soy milk"], category: "meh", score: 40 },
  { name: "アーモンドミルク", aliases: ["almond milk"], category: "meh", score: 35 },
  { name: "海苔", aliases: ["のり", "焼海苔", "nori"], category: "meh", score: 35 },
  { name: "わかめ", aliases: ["若布", "wakame"], category: "meh", score: 30 },
  { name: "昆布", aliases: ["konbu", "kombu"], category: "meh", score: 35 },
  { name: "ピーマン", aliases: ["bell pepper"], category: "meh", score: 25 },
  { name: "パプリカ", aliases: ["paprika"], category: "meh", score: 25 },
  { name: "セロリ", aliases: ["celery"], category: "meh", score: 20 },
  { name: "レタス", aliases: ["lettuce"], category: "meh", score: 30 },
  { name: "もやし", aliases: ["bean sprout"], category: "meh", score: 20 },
  { name: "なす", aliases: ["茄子", "eggplant"], category: "meh", score: 22 },
  { name: "大根", aliases: ["daikon", "radish"], category: "meh", score: 25 },
  { name: "蓮根", aliases: ["れんこん", "レンコン", "lotus root"], category: "meh", score: 25 },
  { name: "ごぼう", aliases: ["牛蒡", "burdock"], category: "meh", score: 20 },

  // ─── DANGER (15+ entries) — KNOWN canine toxins ───
  { name: "玉ねぎ", aliases: ["タマネギ", "オニオン", "onion"], category: "danger", score: 0, warning: "犬 に 有毒 — 量 に 関わらず 摂取 注意" },
  { name: "長ねぎ", aliases: ["青ねぎ", "白ねぎ", "leek", "green onion"], category: "danger", score: 0, warning: "犬 に 有毒 (ネギ 属)" },
  { name: "ニンニク", aliases: ["にんにく", "garlic"], category: "danger", score: 0, warning: "犬 に 有毒 (ネギ 属)" },
  { name: "ニラ", aliases: ["韮", "chinese chive"], category: "danger", score: 0, warning: "犬 に 有毒 (ネギ 属)" },
  { name: "らっきょう", aliases: ["ラッキョウ", "shallot"], category: "danger", score: 0, warning: "犬 に 有毒 (ネギ 属)" },
  { name: "あさつき", aliases: ["浅葱", "chive"], category: "danger", score: 0, warning: "犬 に 有毒 (ネギ 属)" },
  { name: "チョコレート", aliases: ["chocolate", "ココア", "cocoa"], category: "danger", score: 0, warning: "犬 に 有毒 (テオブロミン)" },
  { name: "ぶどう", aliases: ["ブドウ", "葡萄", "grape", "レーズン", "raisin", "干しぶどう"], category: "danger", score: 0, warning: "犬 に 有毒 (急性 腎 障害)" },
  { name: "アボカド", aliases: ["avocado"], category: "danger", score: 0, warning: "犬 に 有毒 (ペルシン)" },
  { name: "マカダミアナッツ", aliases: ["マカデミアナッツ", "macadamia"], category: "danger", score: 0, warning: "犬 に 有毒" },
  { name: "キシリトール", aliases: ["xylitol"], category: "danger", score: 0, warning: "犬 に 有毒 (急性 低 血糖)" },
  { name: "カフェイン", aliases: ["コーヒー", "coffee", "紅茶葉", "緑茶葉", "matcha"], category: "danger", score: 0, warning: "犬 に 有毒" },
  { name: "アルコール", aliases: ["ワイン", "ビール", "wine", "beer"], category: "danger", score: 0, warning: "犬 に 有毒" },
  { name: "生 イカ", aliases: ["生いか", "raw squid"], category: "danger", score: 0, warning: "犬 に 注意 (チアミナーゼ)" },
  { name: "アーモンド", aliases: ["almond"], category: "danger", score: 0, warning: "犬 に 注意 (消化 不良)" },
  { name: "ナツメグ", aliases: ["nutmeg"], category: "danger", score: 0, warning: "犬 に 注意" },
];

/**
 * Returns flat list of (alias, entry) for fast matching.
 */
export function indexAliases() {
  const out = [];
  for (const e of INGREDIENTS) {
    out.push({ alias: e.name, entry: e });
    for (const a of e.aliases) {
      out.push({ alias: a, entry: e });
    }
  }
  // longest first so "鶏胸肉" beats "鶏" matches
  out.sort((a, b) => b.alias.length - a.alias.length);
  return out;
}

export function findEntry(name) {
  return INGREDIENTS.find((e) => e.name === name) || null;
}
