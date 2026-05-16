// Card pool. Each card has a 1-2 character glyph for the tile and a tone
// that picks a palette color. We keep dishes deliberately ordinary —
// the point of aisaji is to remove decision pressure, not to inspire.

export const TONES = ["rice", "meat", "fish", "veg", "soup", "sweet", "escape"];

export const DISHES = [
  { id: "curry",         name: "カレー",         glyph: "カ", tone: "meat" },
  { id: "oyakodon",      name: "親子丼",         glyph: "親", tone: "rice" },
  { id: "saba-shio",     name: "鯖の塩焼き",     glyph: "鯖", tone: "fish" },
  { id: "buta-shoga",    name: "豚の生姜焼き",   glyph: "豚", tone: "meat" },
  { id: "hambagu",       name: "ハンバーグ",     glyph: "ハ", tone: "meat" },
  { id: "yakizakana",    name: "焼き魚定食",     glyph: "焼", tone: "fish" },
  { id: "nikujaga",      name: "肉じゃが",       glyph: "肉", tone: "meat" },
  { id: "tamagoyaki",    name: "玉子焼きと白米", glyph: "玉", tone: "rice" },
  { id: "katsudon",      name: "かつ丼",         glyph: "か", tone: "rice" },
  { id: "ramen",         name: "ラーメン",       glyph: "ラ", tone: "soup" },
  { id: "udon",          name: "うどん",         glyph: "う", tone: "soup" },
  { id: "soba",          name: "そば",           glyph: "そ", tone: "soup" },
  { id: "yakisoba",      name: "焼きそば",       glyph: "焼", tone: "veg" },
  { id: "omurice",       name: "オムライス",     glyph: "オ", tone: "rice" },
  { id: "gyudon",        name: "牛丼",           glyph: "牛", tone: "rice" },
  { id: "tenpura",       name: "天ぷら定食",     glyph: "天", tone: "fish" },
  { id: "miso-soup",     name: "具だくさん味噌汁", glyph: "汁", tone: "soup" },
  { id: "salad-bowl",    name: "野菜たっぷりボウル", glyph: "野", tone: "veg" },
  { id: "natto-meshi",   name: "納豆ご飯",       glyph: "納", tone: "rice" },
  { id: "yasai-itame",   name: "野菜炒め",       glyph: "炒", tone: "veg" },
  { id: "gyoza",         name: "焼き餃子",       glyph: "餃", tone: "meat" },
  { id: "karaage",       name: "唐揚げ",         glyph: "唐", tone: "meat" },
  { id: "sushi-mori",    name: "ちらし寿司",     glyph: "寿", tone: "fish" },
  { id: "donburi-mix",   name: "海鮮丼",         glyph: "海", tone: "fish" },
  { id: "ohitashi",      name: "お浸しと焼き魚", glyph: "浸", tone: "veg" },
  { id: "yudofu",        name: "湯豆腐",         glyph: "豆", tone: "veg" },
  { id: "shabu-shabu",   name: "しゃぶしゃぶ",   glyph: "しゃ", tone: "meat" },
  { id: "ochazuke",      name: "鮭茶漬け",       glyph: "茶", tone: "rice" },
  { id: "onigiri-plate", name: "おにぎりと汁",   glyph: "握", tone: "rice" },
  { id: "tonjiru",       name: "豚汁定食",       glyph: "汁", tone: "soup" },
  { id: "ham-eggs",      name: "ハムエッグごはん", glyph: "ハム", tone: "rice" },
  { id: "pasta-tomato",  name: "トマトパスタ",   glyph: "ト", tone: "veg" },
  { id: "pasta-cream",   name: "クリームパスタ", glyph: "ク", tone: "meat" },
  { id: "kinpira",       name: "きんぴらと玄米", glyph: "金", tone: "veg" },
  { id: "gohan-tsukemono", name: "ご飯と漬物",   glyph: "漬", tone: "rice" },
  { id: "tofu-don",      name: "豆腐丼",         glyph: "豆", tone: "veg" },
  { id: "subuta",        name: "酢豚",           glyph: "酢", tone: "meat" },
  { id: "tamago-soup",   name: "玉子スープと餅", glyph: "玉", tone: "soup" },
  { id: "sandwich",      name: "厚切りサンド",   glyph: "サ", tone: "veg" },
  { id: "stew",          name: "ビーフシチュー", glyph: "シ", tone: "meat" },
];

export const ESCAPES = [
  { id: "esc-eatout",    name: "今夜は外食でいい",     glyph: "外", tone: "escape" },
  { id: "esc-frozen",    name: "冷凍餃子で済ませる",   glyph: "冷", tone: "escape" },
  { id: "esc-delivery",  name: "ピザ宅配を呼ぶ",       glyph: "宅", tone: "escape" },
  { id: "esc-ochazuke",  name: "茶漬けでいい",         glyph: "茶", tone: "escape" },
];

export const ALL_CARDS = [
  ...DISHES.map(c => ({ ...c, kind: "dish" })),
  ...ESCAPES.map(c => ({ ...c, kind: "escape" })),
];

export function cardById(id) {
  return ALL_CARDS.find(c => c.id === id) || null;
}
