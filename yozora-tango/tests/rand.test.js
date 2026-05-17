import { describe, it, expect } from "vitest";
import { makeRng, shuffleInPlace } from "../src/rand.js";

describe("rand", () => {
  it("produces deterministic sequences for the same seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it("produces different sequences for tiny different seeds", () => {
    expect(makeRng(1)()).not.toBe(makeRng(2)());
  });

  it("shuffleInPlace preserves elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const before = [...arr];
    shuffleInPlace(arr, makeRng(7));
    expect(arr.sort()).toEqual(before.sort());
  });

  it("output is in [0, 1)", () => {
    const r = makeRng(99);
    for (let i = 0; i < 500; i++) {
      const x = r();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});
