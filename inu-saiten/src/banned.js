export const BANNED_WORDS = [
  "殺す",
  "死ぬ",
  "致命",
  "劇毒",
  "クソ",
  "無能",
  "飼い主 失格",
  "飼い主失格",
  "お前",
];

export function findBanned(s) {
  for (const w of BANNED_WORDS) {
    if (s.includes(w)) return w;
  }
  return null;
}

export function auditAll(strings) {
  const hits = [];
  for (const s of strings) {
    const hit = findBanned(s);
    if (hit) hits.push({ value: s, hit });
  }
  return hits;
}
