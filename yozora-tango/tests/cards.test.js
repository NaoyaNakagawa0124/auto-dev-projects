import { describe, it, expect } from "vitest";
import { CARDS, BANNED_WORDS, cardById } from "../src/cards.js";

describe("cards", () => {
  it("has exactly 30 cards", () => {
    expect(CARDS.length).toBe(30);
  });

  it("all card ids are unique", () => {
    const ids = CARDS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all english words are unique", () => {
    const en = CARDS.map(c => c.en);
    expect(new Set(en).size).toBe(en.length);
  });

  it("all jp translations are unique", () => {
    const jp = CARDS.map(c => c.jp);
    expect(new Set(jp).size).toBe(jp.length);
  });

  it("each card has english that is at least 3 chars", () => {
    for (const c of CARDS) expect(c.en.length).toBeGreaterThanOrEqual(3);
  });

  it("each card has jp translation under 20 chars", () => {
    for (const c of CARDS) expect(c.jp.length).toBeLessThanOrEqual(20);
  });

  it("each card has a hint", () => {
    for (const c of CARDS) expect(c.hint.length).toBeGreaterThan(0);
  });

  it("no banned words in any jp translation", () => {
    for (const c of CARDS) {
      for (const w of BANNED_WORDS) {
        expect(c.jp.includes(w)).toBe(false);
      }
    }
  });

  it("cardById finds known cards and returns null for unknown", () => {
    expect(cardById("abandon").en).toBe("abandon");
    expect(cardById("not-a-real-id")).toBe(null);
  });
});
