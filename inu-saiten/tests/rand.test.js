import { describe, it, expect } from "vitest";
import { makeRng, seedFromString } from "../src/rand.js";

describe("seedFromString", () => {
  it("returns same number for same string", () => {
    expect(seedFromString("hello")).toBe(seedFromString("hello"));
  });

  it("differs for different strings", () => {
    expect(seedFromString("hello")).not.toBe(seedFromString("world"));
  });

  it("never returns 0", () => {
    expect(seedFromString("")).not.toBe(0);
  });
});

describe("makeRng", () => {
  it("deterministic for same seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    for (let i = 0; i < 10; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it("float in [0,1)", () => {
    const r = makeRng(7);
    for (let i = 0; i < 100; i++) {
      const v = r.float();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("pick returns one of the array", () => {
    const r = makeRng(1);
    const arr = ["a", "b", "c"];
    for (let i = 0; i < 20; i++) {
      expect(arr).toContain(r.pick(arr));
    }
  });

  it("pick on empty returns undefined", () => {
    expect(makeRng(1).pick([])).toBe(undefined);
  });
});
