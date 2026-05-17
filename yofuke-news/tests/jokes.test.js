import { describe, it, expect } from "vitest";
import { sleepHoursTraded, sleepFactor, breakfastsLost, commentsToTell } from "../src/jokes.js";
import { byId, NEWS, BANNED_WORDS } from "../src/news.js";

describe("sleepFactor", () => {
  it("returns 1.2 for late evening (22, 23, 0)", () => {
    expect(sleepFactor(22)).toBe(1.2);
    expect(sleepFactor(23)).toBe(1.2);
    expect(sleepFactor(0)).toBe(1.2);
  });

  it("returns 1.0 for 1-2 AM", () => {
    expect(sleepFactor(1)).toBe(1.0);
    expect(sleepFactor(2)).toBe(1.0);
  });

  it("returns 0.7 for 3 AM", () => {
    expect(sleepFactor(3)).toBe(0.7);
  });

  it("returns 0.4 for 4-5 AM", () => {
    expect(sleepFactor(4)).toBe(0.4);
    expect(sleepFactor(5)).toBe(0.4);
  });

  it("returns 0.5 for daytime (6-21)", () => {
    for (const h of [6, 9, 12, 17, 21]) {
      expect(sleepFactor(h)).toBe(0.5);
    }
  });

  it("throws on out-of-range hours", () => {
    expect(() => sleepFactor(24)).toThrow();
    expect(() => sleepFactor(-1)).toThrow();
  });
});

describe("sleepHoursTraded", () => {
  it("multiplies hoursToPlay by the sleep factor", () => {
    expect(sleepHoursTraded(10, 2)).toBe(10.0); // 10 * 1.0
    expect(sleepHoursTraded(10, 3)).toBe(7.0);  // 10 * 0.7
    expect(sleepHoursTraded(10, 4)).toBe(4.0);  // 10 * 0.4
  });

  it("rounds to one decimal", () => {
    // 7 * 0.7 = 4.9 — stays 4.9, doesn't get rounded to 5.
    expect(sleepHoursTraded(7, 3)).toBe(4.9);
  });

  it("throws on negative hoursToPlay", () => {
    expect(() => sleepHoursTraded(-1, 2)).toThrow();
  });
});

describe("breakfastsLost", () => {
  it("rounds hoursToPlay to nearest integer", () => {
    expect(breakfastsLost(12)).toBe(12);
    expect(breakfastsLost(12.4)).toBe(12);
    expect(breakfastsLost(12.6)).toBe(13);
  });
});

describe("commentsToTell", () => {
  it("returns a string for every news item", () => {
    for (const n of NEWS) {
      const out = commentsToTell(n);
      expect(typeof out).toBe("string");
      expect(out.length).toBeGreaterThan(8);
    }
  });

  it("is deterministic for the same news", () => {
    const n = byId("hollow-frequencies");
    expect(commentsToTell(n)).toBe(commentsToTell(n));
  });

  it("does not contain banned words", () => {
    for (const n of NEWS) {
      const out = commentsToTell(n);
      for (const w of BANNED_WORDS) {
        expect(out.includes(w)).toBe(false);
      }
    }
  });
});
