// Absurd-but-gentle conversions between play hours and the player's night.

// At 2 AM, every hour of play costs ~1 hour of sleep.
// At 4 AM, only 0.4 hour (you weren't going to sleep anyway).
// At 22:00, 1.2 (you'd have gone to bed earlier).
export function sleepHoursTraded(hoursToPlay, hour) {
  if (!(hoursToPlay >= 0)) throw new Error("hoursToPlay must be >= 0");
  const factor = sleepFactor(hour);
  return Math.round(hoursToPlay * factor * 10) / 10;
}

export function sleepFactor(hour) {
  if (hour < 0 || hour > 23) throw new Error("hour out of range");
  if (hour >= 22 || hour <= 0)    return 1.2;
  if (hour >= 1  && hour <= 2)    return 1.0;
  if (hour === 3)                 return 0.7;
  if (hour >= 4  && hour <= 5)    return 0.4;
  return 0.5;  // daytime — small notional trade-off
}

// One breakfast == one morning hour the player won't get back.
export function breakfastsLost(hoursToPlay) {
  if (!(hoursToPlay >= 0)) throw new Error("hoursToPlay must be >= 0");
  return Math.round(hoursToPlay);
}

// Short one-liner the user can carry to a colleague the next morning.
// Deterministic given a news item — no randomness so tests stay simple.
const TEMPLATES = Object.freeze([
  (n) => `朝、 同僚 に 「${n.genre} の 〇〇 が 出た」 と 言える 1 本 です。`,
  (n) => `休憩 時間 に 「${n.title}」 と 呟いて みる の も いい です。`,
  (n) => `${n.genre} は 通勤 の 雑談 で 1 人 だけ 知ってる と お得 です。`,
  (n) => `「${n.jp}」 を 知って いる の は、 今夜 起きて いる あなた だけ です。`,
]);

export function commentsToTell(news) {
  // Hash the id into a stable index so the same news always picks the same template.
  let h = 0;
  for (let i = 0; i < news.id.length; i++) {
    h = (h * 31 + news.id.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % TEMPLATES.length;
  return TEMPLATES[idx](news);
}
