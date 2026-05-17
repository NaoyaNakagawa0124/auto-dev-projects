// Time-of-day tier and news selection based on (date, hour).

import { NEWS } from "./news.js";
import { makeRng, shuffleInPlace, dateSeed } from "./rand.js";


export function tierFor(hour) {
  if (hour < 0 || hour > 23) throw new Error("hour out of range");
  if (hour >= 22 || hour <= 0) return "evening";   // 22, 23, 0
  if (hour >= 1 && hour <= 2)  return "deep";      // 1, 2
  if (hour >= 3 && hour <= 5)  return "predawn";   // 3, 4, 5
  return "day";                                    // 6..21
}


export function pickNewsForNow(date, n = 5) {
  if (n <= 0) return [];
  const cap = Math.min(n, NEWS.length);
  // Mix the date seed with the hour so 3 AM-runs differ from 4 AM-runs.
  const seed = dateSeed(date) * 100 + date.getHours();
  const rng = makeRng(seed);
  const deck = shuffleInPlace([...NEWS], rng);
  return deck.slice(0, cap);
}


export function formatStamp(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const H = String(date.getHours()).padStart(2, "0");
  const M = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}, ${H}:${M}`;
}
