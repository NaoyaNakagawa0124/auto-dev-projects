import { DISHES, ESCAPES } from "./cards.js";
import { makeRng, shuffleInPlace } from "./rand.js";

// Deterministic. Returns `n` cards: at least one escape card and the rest
// dishes (shuffled). If `n` is larger than what we have, we cap at total.
export function pickHand(seed, n) {
  const rng = makeRng(seed);
  const totalAvail = DISHES.length + ESCAPES.length;
  const size = Math.min(Math.max(n | 0, 2), totalAvail);

  const dishes = shuffleInPlace([...DISHES], rng);
  const escapes = shuffleInPlace([...ESCAPES], rng);

  const escapeCount = size <= 6 ? 1 : 2;
  const dishCount = size - escapeCount;

  const hand = [
    ...dishes.slice(0, dishCount).map(c => ({ ...c, kind: "dish" })),
    ...escapes.slice(0, escapeCount).map(c => ({ ...c, kind: "escape" })),
  ];

  return shuffleInPlace(hand, rng);
}
