import { describe, it, expect } from "vitest";
import { GameSession, CLOSERS, closerFor } from "../src/game.js";
import { CARDS } from "../src/cards.js";
import { BANNED_WORDS } from "../src/cards.js";

describe("GameSession", () => {
  it("starts with a current card", () => {
    const s = new GameSession(1);
    expect(s.currentCard()).not.toBe(null);
    expect(s.isFinished()).toBe(false);
  });

  it("two sessions with same seed see the same first card", () => {
    const a = new GameSession(7);
    const b = new GameSession(7);
    expect(a.currentCard().id).toBe(b.currentCard().id);
  });

  it("two sessions with different seeds (usually) see different first cards", () => {
    // Try several seed pairs — should diverge for at least one pair.
    let diverged = false;
    for (let s = 1; s <= 10 && !diverged; s++) {
      const a = new GameSession(s).currentCard().id;
      const b = new GameSession(s + 100).currentCard().id;
      if (a !== b) diverged = true;
    }
    expect(diverged).toBe(true);
  });

  it("hit() lights a star and advances the card", () => {
    const s = new GameSession(1);
    const before = s.currentCard().id;
    const res = s.hit();
    expect(res.result).toBe("lit");
    expect(s.currentCard().id).not.toBe(before);
  });

  it("miss() does not light a star", () => {
    const s = new GameSession(1);
    const constBefore = s.currentConstellation().filled;
    s.miss();
    expect(s.currentConstellation()?.filled || 0).toBe(constBefore);
  });

  it("completing first constellation advances constellationIdx", () => {
    const s = new GameSession(1);
    const firstId = s.currentConstellation().id;
    const total = s.currentConstellation().total;
    let lastResult = null;
    for (let i = 0; i < total; i++) {
      lastResult = s.hit();
    }
    expect(lastResult.completed).toBe(firstId);
    expect(s.currentConstellation().id).not.toBe(firstId);
  });

  it("completing all 5 constellations finishes the session", () => {
    const s = new GameSession(1);
    let safety = 0;
    while (!s.isFinished() && safety++ < 100) s.hit();
    expect(s.isFinished()).toBe(true);
    expect(s.completedConstellations().length).toBe(5);
  });

  it("summary contains all expected fields", () => {
    const s = new GameSession(1);
    s.hit(); s.miss(); s.hit();
    const sum = s.summary();
    expect(sum.hits).toBe(2);
    expect(sum.misses).toBe(1);
    expect(sum.cardsSeen).toBe(3);
    expect(Array.isArray(sum.completed)).toBe(true);
    expect(sum.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("running out of cards also finishes the session", () => {
    const s = new GameSession(1);
    while (s.currentCard()) s.miss();
    expect(s.isFinished()).toBe(true);
  });

  it("hit/miss after finished return finished marker", () => {
    const s = new GameSession(1);
    while (!s.isFinished()) s.hit();
    expect(s.hit().result).toBe("finished");
    expect(s.miss().result).toBe("finished");
  });
});

describe("closers", () => {
  it("CLOSERS contain no banned words", () => {
    for (const c of CLOSERS) {
      for (const w of BANNED_WORDS) {
        expect(c.includes(w)).toBe(false);
      }
    }
  });

  it("closerFor is deterministic for same seed", () => {
    const sum = { hits: 5, misses: 1, cardsSeen: 6, completed: [], durationMs: 100 };
    expect(closerFor(sum, 1)).toBe(closerFor(sum, 1));
  });

  it("closerFor returns one of the CLOSERS", () => {
    const sum = { hits: 0, misses: 0, cardsSeen: 0, completed: [], durationMs: 0 };
    const out = closerFor(sum, 3);
    expect(CLOSERS).toContain(out);
  });
});
