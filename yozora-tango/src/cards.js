// 30 vocabulary cards — mid-level English vocab with Japanese translation.
// The set is small on purpose: a 5-minute session shouldn't outrun the deck.

export const CARDS = [
  { id: "abandon",     en: "abandon",     jp: "見捨てる",         hint: "v." },
  { id: "absorb",      en: "absorb",      jp: "吸収する",         hint: "v." },
  { id: "acquire",     en: "acquire",     jp: "獲得する",         hint: "v." },
  { id: "ample",       en: "ample",       jp: "十分な",           hint: "adj." },
  { id: "bewilder",    en: "bewilder",    jp: "途方に暮れさせる", hint: "v." },
  { id: "candid",      en: "candid",      jp: "率直な",           hint: "adj." },
  { id: "compel",      en: "compel",      jp: "強いる",           hint: "v." },
  { id: "concise",     en: "concise",     jp: "簡潔な",           hint: "adj." },
  { id: "deceive",     en: "deceive",     jp: "だます",           hint: "v." },
  { id: "delicate",    en: "delicate",    jp: "繊細な",           hint: "adj." },
  { id: "diminish",    en: "diminish",    jp: "減少する",         hint: "v." },
  { id: "elaborate",   en: "elaborate",   jp: "凝った / 詳述する",hint: "adj./v." },
  { id: "embark",      en: "embark",      jp: "乗り出す",         hint: "v." },
  { id: "enhance",     en: "enhance",     jp: "高める",           hint: "v." },
  { id: "feasible",    en: "feasible",    jp: "実現可能な",       hint: "adj." },
  { id: "fragile",     en: "fragile",     jp: "壊れやすい",       hint: "adj." },
  { id: "gauge",       en: "gauge",       jp: "測る",             hint: "v." },
  { id: "hesitate",    en: "hesitate",    jp: "ためらう",         hint: "v." },
  { id: "implicit",    en: "implicit",    jp: "暗黙の",           hint: "adj." },
  { id: "linger",      en: "linger",      jp: "とどまる",         hint: "v." },
  { id: "meticulous",  en: "meticulous",  jp: "几帳面な",         hint: "adj." },
  { id: "navigate",    en: "navigate",    jp: "進路をとる",       hint: "v." },
  { id: "obscure",     en: "obscure",     jp: "あいまいな",       hint: "adj." },
  { id: "perceive",    en: "perceive",    jp: "知覚する",         hint: "v." },
  { id: "prudent",     en: "prudent",     jp: "慎重な",           hint: "adj." },
  { id: "resilient",   en: "resilient",   jp: "回復力のある",     hint: "adj." },
  { id: "scrutinize",  en: "scrutinize",  jp: "精査する",         hint: "v." },
  { id: "subtle",      en: "subtle",      jp: "微妙な",           hint: "adj." },
  { id: "tangible",    en: "tangible",    jp: "明白な / 有形の",  hint: "adj." },
  { id: "vivid",       en: "vivid",       jp: "鮮明な",           hint: "adj." },
];

export const BANNED_WORDS = [
  "連勝", "達成", "完璧", "神レベル", "最強", "革命的",
];

export function cardById(id) {
  return CARDS.find(c => c.id === id) || null;
}
