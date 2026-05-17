// Pure game logic. Knows nothing about p5.js or DOM.

import { CARDS } from "./cards.js";
import { CONSTELLATIONS } from "./constellations.js";
import { makeRng, shuffleInPlace } from "./rand.js";

export class GameSession {
  constructor(seed = 1) {
    this.rng = makeRng(seed);
    this.deck = shuffleInPlace([...CARDS], this.rng);
    this.cardIdx = 0;

    this.constellations = CONSTELLATIONS.map(c => ({
      id: c.id,
      jp: c.jp,
      total: c.points.length,
      filled: 0,            // count of stars lit
      done: false,
      finishedAt: null,
    }));
    this.constellationIdx = 0;

    this.hitsTotal = 0;
    this.missesTotal = 0;
    this.startedAt = Date.now();
  }

  // Card currently being shown.
  currentCard() {
    if (this.cardIdx >= this.deck.length) return null;
    return this.deck[this.cardIdx];
  }

  // Currently being filled (or just-completed) constellation.
  currentConstellation() {
    return this.constellations[this.constellationIdx] || null;
  }

  isFinished() {
    return this.cardIdx >= this.deck.length
        || this.constellations.every(c => c.done);
  }

  // Player remembered the card -> light the next star in the current
  // constellation. If that finishes the constellation, advance.
  hit() {
    if (this.isFinished()) return { result: "finished" };
    const c = this.currentConstellation();
    if (!c) return { result: "finished" };
    c.filled += 1;
    this.hitsTotal += 1;
    const result = { result: "lit", constellationId: c.id, starIndex: c.filled - 1 };
    if (c.filled >= c.total) {
      c.done = true;
      c.finishedAt = Date.now();
      result.completed = c.id;
      this.constellationIdx += 1;
    }
    this.cardIdx += 1;
    return result;
  }

  // Player did not recall — advance the card, leave stars alone.
  miss() {
    if (this.isFinished()) return { result: "finished" };
    this.missesTotal += 1;
    this.cardIdx += 1;
    return { result: "miss" };
  }

  completedConstellations() {
    return this.constellations.filter(c => c.done);
  }

  summary() {
    return {
      hits: this.hitsTotal,
      misses: this.missesTotal,
      cardsSeen: this.cardIdx,
      completed: this.completedConstellations().map(c => ({ id: c.id, jp: c.jp })),
      durationMs: Date.now() - this.startedAt,
    };
  }
}

// Friendly one-line wrap-ups, banned-word-free. Tested.
export const CLOSERS = [
  "今夜 は 静か に 集まりました。",
  "夜 が 深く なりました。 ここまで で 十分 です。",
  "また 別 の 夜 に。 おやすみなさい。",
  "今夜 の 星座 は、 ずっと 残ります。",
];

export function closerFor(summary, seed = 0) {
  const rng = makeRng(seed);
  return CLOSERS[Math.floor(rng() * CLOSERS.length)];
}
