import { describe, it, expect } from "vitest";
import { DISHES, ESCAPES, ALL_CARDS, TONES, cardById } from "../src/cards.js";

describe("cards", () => {
  it("has exactly 40 home-cooked dishes", () => {
    expect(DISHES.length).toBe(40);
  });

  it("has exactly 4 escape cards", () => {
    expect(ESCAPES.length).toBe(4);
  });

  it("all card ids are unique", () => {
    const ids = ALL_CARDS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all card glyphs are 1-2 chars", () => {
    for (const c of ALL_CARDS) {
      // Use [...str].length to count graphemes, since CJK takes 1 codepoint each.
      expect([...c.glyph].length).toBeGreaterThanOrEqual(1);
      expect([...c.glyph].length).toBeLessThanOrEqual(2);
    }
  });

  it("every card tone is in the palette", () => {
    for (const c of ALL_CARDS) {
      expect(TONES).toContain(c.tone);
    }
  });

  it("every escape card has tone=escape", () => {
    for (const c of ESCAPES) {
      expect(c.tone).toBe("escape");
    }
  });

  it("cardById returns the right card or null", () => {
    expect(cardById("curry").name).toBe("カレー");
    expect(cardById("nope-not-real")).toBe(null);
  });
});
