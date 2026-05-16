import { describe, it, expect } from "vitest";
import { judge, CLOSERS, BANNED_WORDS } from "../src/judge.js";
import { pickHand } from "../src/pickHand.js";

describe("judge", () => {
  it("returns kind=noone when no card has both oks", () => {
    const hand = pickHand(1, 6);
    const result = judge({
      candidates: hand,
      leftOks: new Set([hand[0].id]),
      rightOks: new Set([hand[1].id]),
      seed: 1,
    });
    expect(result.kind).toBe("noone");
    expect(result.card).toBe(null);
  });

  it("returns kind=decided when exactly one card has both oks", () => {
    const hand = pickHand(1, 6);
    const targetId = hand[2].id;
    const result = judge({
      candidates: hand,
      leftOks: new Set([targetId]),
      rightOks: new Set([targetId]),
      seed: 1,
    });
    expect(result.kind).toBe("decided");
    expect(result.card.id).toBe(targetId);
  });

  it("picks deterministically among multiple both-ok cards", () => {
    const hand = pickHand(1, 6);
    const both = new Set([hand[0].id, hand[1].id, hand[2].id]);
    const a = judge({
      candidates: hand,
      leftOks: both,
      rightOks: both,
      seed: 42,
    });
    const b = judge({
      candidates: hand,
      leftOks: both,
      rightOks: both,
      seed: 42,
    });
    expect(a.card.id).toBe(b.card.id);
  });

  it("different seeds give different picks among ties (usually)", () => {
    const hand = pickHand(1, 6);
    const both = new Set([hand[0].id, hand[1].id, hand[2].id, hand[3].id]);
    const picks = new Set();
    for (let s = 1; s <= 20; s++) {
      picks.add(judge({ candidates: hand, leftOks: both, rightOks: both, seed: s }).card.id);
    }
    expect(picks.size).toBeGreaterThanOrEqual(2);
  });

  it("CLOSERS contain no banned words", () => {
    for (const line of CLOSERS) {
      for (const w of BANNED_WORDS) {
        expect(line.includes(w)).toBe(false);
      }
    }
  });

  it("noone message contains no banned words", () => {
    const hand = pickHand(1, 6);
    const result = judge({
      candidates: hand,
      leftOks: new Set([hand[0].id]),
      rightOks: new Set([hand[1].id]),
      seed: 1,
    });
    for (const w of BANNED_WORDS) {
      expect(result.message.includes(w)).toBe(false);
    }
  });

  it("decided message names the actual dish", () => {
    const hand = pickHand(1, 6);
    const targetId = hand[2].id;
    const result = judge({
      candidates: hand,
      leftOks: new Set([targetId]),
      rightOks: new Set([targetId]),
      seed: 1,
    });
    expect(result.message).toContain(hand[2].name);
  });
});
