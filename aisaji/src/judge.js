import { makeRng } from "./rand.js";

// One-line closers. Quiet, no superlatives, no scoring, no future promises.
// These pass the banned-word audit in tests.
export const CLOSERS = [
  "今夜は ここまでで 十分です。",
  "お疲れさま。 まずは 一口、 ゆっくり。",
  "決まりました。 あとは 食べるだけ。",
  "ふたりの 匙加減で 決まりです。",
  "今日は ここで おしまい。",
  "急がなくて だいじょうぶ。",
];

// Result of a 90-second round.
// `leftOks` / `rightOks` are Sets of card ids that each side approved.
// `candidates` is the hand that was shown (Array<Card>).
// If `seed` is provided, RNG is deterministic.
export function judge({ candidates, leftOks, rightOks, seed = 1 }) {
  const both = candidates.filter(c => leftOks.has(c.id) && rightOks.has(c.id));
  const rng = makeRng(seed);

  if (both.length === 0) {
    return {
      kind: "noone",
      card: null,
      message: "今夜は 二人とも 違う気分でした。 外食 か、 茶漬け で どうですか。",
      closer: CLOSERS[Math.floor(rng() * CLOSERS.length)],
    };
  }
  const idx = Math.floor(rng() * both.length);
  return {
    kind: "decided",
    card: both[idx],
    message: `今夜は ${both[idx].name}。`,
    closer: CLOSERS[Math.floor(rng() * CLOSERS.length)],
  };
}

// Banned words that must not appear in CLOSERS or generated messages.
// We export this so the test file can audit, and the project README is
// the source of truth for the tone we're protecting.
export const BANNED_WORDS = [
  "頑張", "努力", "達成", "ナイス", "すごい",
  "天才", "クリア", "連勝", "完璧", "完了",
];
