import { describe, it, expect } from "vitest";
import { LINES, BANNED_WORDS, byPhase, pickLine } from "../src/lines.js";

describe("lines", () => {
  it("has exactly 50 lines", () => {
    expect(LINES.length).toBe(50);
  });

  it("line ids are unique", () => {
    const ids = LINES.map(l => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("line texts are unique", () => {
    const t = LINES.map(l => l.text);
    expect(new Set(t).size).toBe(t.length);
  });

  it("every line belongs to one of the four phases", () => {
    const phases = new Set(["fresh", "settling", "stale", "ghost"]);
    for (const l of LINES) expect(phases.has(l.phase)).toBe(true);
  });

  it("each phase has at least 10 lines", () => {
    for (const p of ["fresh", "settling", "stale", "ghost"]) {
      expect(byPhase(p).length).toBeGreaterThanOrEqual(10);
    }
  });

  it("phase counts sum to 50", () => {
    const total = ["fresh", "settling", "stale", "ghost"]
      .map(p => byPhase(p).length)
      .reduce((a, b) => a + b, 0);
    expect(total).toBe(50);
  });

  it("no line contains any banned word", () => {
    for (const l of LINES) {
      for (const w of BANNED_WORDS) {
        expect(l.text.includes(w)).toBe(false);
      }
    }
  });

  it("each line ends in a Japanese period", () => {
    for (const l of LINES) expect(l.text.endsWith("。")).toBe(true);
  });

  it("each line is at most 60 chars", () => {
    for (const l of LINES) expect(l.text.length).toBeLessThanOrEqual(60);
  });

  it("pickLine returns a line in the requested phase", () => {
    for (const p of ["fresh", "settling", "stale", "ghost"]) {
      const l = pickLine(123, p);
      expect(l.phase).toBe(p);
    }
  });

  it("pickLine is deterministic for the same seed+phase", () => {
    expect(pickLine(42, "fresh").id).toBe(pickLine(42, "fresh").id);
  });

  it("pickLine spreads across multiple seeds (smoke)", () => {
    const ids = new Set();
    for (let s = 1; s < 30; s++) ids.add(pickLine(s, "stale").id);
    expect(ids.size).toBeGreaterThanOrEqual(3);
  });
});
