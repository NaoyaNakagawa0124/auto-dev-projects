import { describe, it, expect } from "vitest";
import {
  layoutGrid, formatHeaderDate, shiftDate, dateSeed,
  makeRng, shuffleInPlace,
} from "../src/layout.js";
import { HEADLINES, leadStory } from "../src/headlines.js";

describe("layoutGrid", () => {
  it("returns a lead and two columns", () => {
    const grid = layoutGrid(new Date("2026-05-17"));
    expect(grid.lead).not.toBe(null);
    expect(grid.columns.length).toBe(2);
  });

  it("the lead is always priority 1", () => {
    const grid = layoutGrid(new Date("2026-05-17"));
    expect(grid.lead.priority).toBe(1);
    expect(grid.lead.id).toBe(leadStory().id);
  });

  it("places all 12 stories exactly once", () => {
    const grid = layoutGrid(new Date("2026-05-17"));
    const placed = [grid.lead, ...grid.columns[0], ...grid.columns[1]];
    expect(placed.length).toBe(HEADLINES.length);
    expect(new Set(placed.map((s) => s.id)).size).toBe(HEADLINES.length);
  });

  it("is deterministic for the same date", () => {
    const a = layoutGrid(new Date("2026-05-17"));
    const b = layoutGrid(new Date("2026-05-17"));
    expect(a.columns[0].map((s) => s.id)).toEqual(b.columns[0].map((s) => s.id));
    expect(a.columns[1].map((s) => s.id)).toEqual(b.columns[1].map((s) => s.id));
  });

  it("yields different orderings for different dates", () => {
    const a = layoutGrid(new Date("2026-05-17"));
    const b = layoutGrid(new Date("2026-05-18"));
    const aIds = a.columns[0].map((s) => s.id).join("|");
    const bIds = b.columns[0].map((s) => s.id).join("|");
    expect(aIds).not.toBe(bIds);
  });

  it("distributes 11 non-lead stories across the two columns roughly evenly", () => {
    const grid = layoutGrid(new Date("2026-05-17"));
    const total = grid.columns[0].length + grid.columns[1].length;
    expect(total).toBe(11);
    // Round-robin → 6 and 5 (or 5 and 6).
    const diff = Math.abs(grid.columns[0].length - grid.columns[1].length);
    expect(diff).toBeLessThanOrEqual(1);
  });
});

describe("formatHeaderDate", () => {
  it("renders 2026-05-17 as a Japanese paper header (Sunday)", () => {
    const out = formatHeaderDate(new Date("2026-05-17T00:00:00Z"));
    expect(out).toContain("2026");
    expect(out).toContain("5");
    expect(out).toContain("17");
    expect(out).toContain("日"); // 2026-05-17 is a Sunday
  });

  it("includes the day-of-week glyph", () => {
    for (const iso of ["2026-05-11", "2026-05-12", "2026-05-13", "2026-05-14",
                       "2026-05-15", "2026-05-16", "2026-05-17"]) {
      const out = formatHeaderDate(new Date(`${iso}T00:00:00Z`));
      expect(/\((日|月|火|水|木|金|土)\)/.test(out)).toBe(true);
    }
  });
});

describe("shiftDate", () => {
  it("adds days correctly", () => {
    const d = shiftDate(new Date("2026-05-17T00:00:00Z"), 1);
    expect(d.toISOString().slice(0, 10)).toBe("2026-05-18");
  });

  it("subtracts days correctly", () => {
    const d = shiftDate(new Date("2026-05-17T00:00:00Z"), -3);
    expect(d.toISOString().slice(0, 10)).toBe("2026-05-14");
  });
});

describe("dateSeed", () => {
  it("packs Y/M/D into a sortable integer", () => {
    expect(dateSeed(new Date("2026-05-17T00:00:00Z"))).toBe(20260517);
    expect(dateSeed(new Date("2025-12-31T00:00:00Z"))).toBe(20251231);
  });
});

describe("rng helpers", () => {
  it("makeRng is deterministic", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    expect(a()).toBe(b());
  });

  it("shuffleInPlace preserves elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const before = [...arr];
    shuffleInPlace(arr, makeRng(7));
    expect(arr.sort()).toEqual(before.sort());
  });
});
