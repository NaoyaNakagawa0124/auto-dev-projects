import { describe, it, expect } from "vitest";
import { pickHand } from "../src/pickHand.js";

describe("pickHand", () => {
  it("returns the requested size", () => {
    expect(pickHand(1, 8).length).toBe(8);
    expect(pickHand(1, 12).length).toBe(12);
  });

  it("is deterministic for the same seed", () => {
    const a = pickHand(123, 10).map(c => c.id);
    const b = pickHand(123, 10).map(c => c.id);
    expect(a).toEqual(b);
  });

  it("produces different hands for different seeds", () => {
    const a = pickHand(1, 10).map(c => c.id);
    const b = pickHand(2, 10).map(c => c.id);
    expect(a).not.toEqual(b);
  });

  it("contains no duplicate cards", () => {
    const hand = pickHand(7, 12);
    const ids = hand.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("always contains at least one escape card", () => {
    for (let seed = 1; seed < 25; seed++) {
      const hand = pickHand(seed, 10);
      const escapes = hand.filter(c => c.kind === "escape");
      expect(escapes.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("clamps minimum size to 2", () => {
    expect(pickHand(1, 0).length).toBe(2);
    expect(pickHand(1, 1).length).toBe(2);
  });
});
