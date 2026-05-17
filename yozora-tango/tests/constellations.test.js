import { describe, it, expect } from "vitest";
import { CONSTELLATIONS, totalPointCount, constellationById } from "../src/constellations.js";

describe("constellations", () => {
  it("has exactly 5 constellations", () => {
    expect(CONSTELLATIONS.length).toBe(5);
  });

  it("all ids are unique", () => {
    const ids = CONSTELLATIONS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all jp names are unique", () => {
    const jp = CONSTELLATIONS.map(c => c.jp);
    expect(new Set(jp).size).toBe(jp.length);
  });

  it("each constellation has 4-7 points", () => {
    for (const c of CONSTELLATIONS) {
      expect(c.points.length).toBeGreaterThanOrEqual(4);
      expect(c.points.length).toBeLessThanOrEqual(7);
    }
  });

  it("all points are inside the 0..1 unit square", () => {
    for (const c of CONSTELLATIONS) {
      for (const p of c.points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it("edges reference valid point indices", () => {
    for (const c of CONSTELLATIONS) {
      for (const [a, b] of c.edges) {
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThan(c.points.length);
        expect(b).toBeLessThan(c.points.length);
        expect(a).not.toBe(b);
      }
    }
  });

  it("each constellation is connected (every point reachable from index 0)", () => {
    for (const c of CONSTELLATIONS) {
      const seen = new Set([0]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [a, b] of c.edges) {
          if (seen.has(a) && !seen.has(b)) { seen.add(b); changed = true; }
          if (seen.has(b) && !seen.has(a)) { seen.add(a); changed = true; }
        }
      }
      expect(seen.size).toBe(c.points.length);
    }
  });

  it("total point count is 28", () => {
    expect(totalPointCount()).toBe(28);
  });

  it("totalPointCount is less than card deck size", () => {
    // Sanity: a session must be able to finish within the deck of 30 cards.
    expect(totalPointCount()).toBeLessThanOrEqual(30);
  });

  it("constellationById finds known and returns null otherwise", () => {
    expect(constellationById("orion").jp).toBe("オリオン");
    expect(constellationById("not-real")).toBe(null);
  });
});
