import { describe, it, expect } from "vitest";
import { makeRng, shuffleInPlace, pickIndex } from "../src/rand.js";

describe("rand", () => {
  it("produces deterministic sequence for the same seed", () => {
    const r1 = makeRng(42);
    const r2 = makeRng(42);
    for (let i = 0; i < 10; i++) {
      expect(r1()).toBe(r2());
    }
  });

  it("produces different sequences for different seeds", () => {
    const r1 = makeRng(1);
    const r2 = makeRng(2);
    expect(r1()).not.toBe(r2());
  });

  it("shuffleInPlace returns same elements", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const before = [...arr];
    shuffleInPlace(arr, makeRng(7));
    expect(arr.sort()).toEqual(before.sort());
  });

  it("pickIndex stays within bounds", () => {
    const rng = makeRng(99);
    for (let i = 0; i < 1000; i++) {
      const idx = pickIndex(rng, 5);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(5);
    }
  });
});
