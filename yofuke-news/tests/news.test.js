import { describe, it, expect } from "vitest";
import { NEWS, BANNED_WORDS, byId, GENRES } from "../src/news.js";

describe("news", () => {
  it("has exactly 12 items", () => {
    expect(NEWS.length).toBe(12);
  });

  it("all ids are unique", () => {
    const ids = NEWS.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all titles are unique", () => {
    const titles = NEWS.map((n) => n.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("prices fall in 0..12000 yen", () => {
    for (const n of NEWS) {
      expect(n.price_jpy).toBeGreaterThanOrEqual(0);
      expect(n.price_jpy).toBeLessThanOrEqual(12000);
    }
  });

  it("hours_to_clear in 1..100", () => {
    for (const n of NEWS) {
      expect(n.hours_to_clear).toBeGreaterThanOrEqual(1);
      expect(n.hours_to_clear).toBeLessThanOrEqual(100);
    }
  });

  it("release_kind is one of three", () => {
    for (const n of NEWS) {
      expect(["released", "demo", "early-access"]).toContain(n.release_kind);
    }
  });

  it("short_blurb is 10..80 chars", () => {
    for (const n of NEWS) {
      expect(n.short_blurb.length).toBeGreaterThanOrEqual(10);
      expect(n.short_blurb.length).toBeLessThanOrEqual(80);
    }
  });

  it("no banned word in any visible field", () => {
    for (const n of NEWS) {
      for (const w of BANNED_WORDS) {
        expect(n.title.includes(w)).toBe(false);
        expect(n.jp.includes(w)).toBe(false);
        expect(n.genre.includes(w)).toBe(false);
        expect(n.short_blurb.includes(w)).toBe(false);
      }
    }
  });

  it("byId returns the item or null", () => {
    expect(byId("hollow-frequencies").title).toBe("Hollow Frequencies");
    expect(byId("nope-not-real")).toBe(null);
  });

  it("GENRES contains at least 5 distinct genres", () => {
    expect(GENRES.length).toBeGreaterThanOrEqual(5);
  });
});
