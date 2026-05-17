import { describe, it, expect } from "vitest";
import { tierFor, pickNewsForNow, formatStamp } from "../src/clock.js";
import { NEWS } from "../src/news.js";

describe("tierFor", () => {
  it("maps 22-23 and 0 to evening", () => {
    for (const h of [22, 23, 0]) expect(tierFor(h)).toBe("evening");
  });

  it("maps 1-2 to deep", () => {
    for (const h of [1, 2]) expect(tierFor(h)).toBe("deep");
  });

  it("maps 3-5 to predawn", () => {
    for (const h of [3, 4, 5]) expect(tierFor(h)).toBe("predawn");
  });

  it("maps 6-21 to day", () => {
    for (const h of [6, 9, 12, 17, 21]) expect(tierFor(h)).toBe("day");
  });

  it("throws on out-of-range hours", () => {
    expect(() => tierFor(24)).toThrow();
    expect(() => tierFor(-1)).toThrow();
  });
});

describe("pickNewsForNow", () => {
  it("returns the requested number of items", () => {
    const d = new Date(2026, 4, 17, 2);
    expect(pickNewsForNow(d, 5).length).toBe(5);
    expect(pickNewsForNow(d, 12).length).toBe(12);
  });

  it("caps n at the size of NEWS", () => {
    const d = new Date(2026, 4, 17, 2);
    expect(pickNewsForNow(d, 50).length).toBe(NEWS.length);
  });

  it("returns empty when n <= 0", () => {
    expect(pickNewsForNow(new Date(), 0)).toEqual([]);
    expect(pickNewsForNow(new Date(), -3)).toEqual([]);
  });

  it("is deterministic for the same date + hour", () => {
    const a = pickNewsForNow(new Date(2026, 4, 17, 2));
    const b = pickNewsForNow(new Date(2026, 4, 17, 2));
    expect(a.map((n) => n.id)).toEqual(b.map((n) => n.id));
  });

  it("returns different orderings for different hours", () => {
    const a = pickNewsForNow(new Date(2026, 4, 17, 2));
    const b = pickNewsForNow(new Date(2026, 4, 17, 4));
    expect(a.map((n) => n.id).join("|")).not.toBe(b.map((n) => n.id).join("|"));
  });

  it("returns different orderings for different days", () => {
    const a = pickNewsForNow(new Date(2026, 4, 17, 2));
    const b = pickNewsForNow(new Date(2026, 4, 18, 2));
    expect(a.map((n) => n.id).join("|")).not.toBe(b.map((n) => n.id).join("|"));
  });

  it("never repeats a news item within a single pick", () => {
    const picked = pickNewsForNow(new Date(2026, 4, 17, 2), 12);
    expect(new Set(picked.map((n) => n.id)).size).toBe(12);
  });
});

describe("formatStamp", () => {
  it("renders YYYY-MM-DD, HH:MM", () => {
    expect(formatStamp(new Date(2026, 4, 17, 2, 14))).toBe("2026-05-17, 02:14");
  });
});
