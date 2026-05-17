import { describe, it, expect } from "vitest";
import {
  computeStats,
  daysBetween,
  phaseFor,
  ensureInstallDate,
  incrementVisits,
  resetMove,
  INITIAL_BOXES,
} from "../src/stats.js";

function memStorage(initial = {}) {
  const store = { ...initial };
  return {
    get: (k) => store[k],
    set: (k, v) => { store[k] = v; },
    dump: () => ({ ...store }),
  };
}

describe("daysBetween", () => {
  it("is 0 for same instant", () => {
    expect(daysBetween(1000, 1000)).toBe(0);
  });
  it("returns floored day count", () => {
    const start = new Date("2026-05-10T00:00:00Z").getTime();
    const end   = new Date("2026-05-17T12:00:00Z").getTime();
    expect(daysBetween(start, end)).toBe(7);
  });
  it("clamps negative to 0", () => {
    expect(daysBetween(2000, 1000)).toBe(0);
  });
});

describe("phaseFor", () => {
  it("returns fresh for 0-6", () => {
    for (const d of [0, 1, 6]) expect(phaseFor(d)).toBe("fresh");
  });
  it("returns settling for 7-29", () => {
    for (const d of [7, 15, 29]) expect(phaseFor(d)).toBe("settling");
  });
  it("returns stale for 30-89", () => {
    for (const d of [30, 60, 89]) expect(phaseFor(d)).toBe("stale");
  });
  it("returns ghost for 90+", () => {
    for (const d of [90, 200, 1000]) expect(phaseFor(d)).toBe("ghost");
  });
});

describe("computeStats", () => {
  it("is deterministic for the same input", () => {
    const a = computeStats({ installedAt: 0, visits: 10, now: 7 * 86_400_000 });
    const b = computeStats({ installedAt: 0, visits: 10, now: 7 * 86_400_000 });
    expect(a).toEqual(b);
  });
  it("starts at INITIAL_BOXES on day 0 with zero visits", () => {
    const s = computeStats({ installedAt: 1000, visits: 0, now: 1000 });
    expect(s.daysSinceMove).toBe(0);
    expect(s.boxesRemaining).toBe(INITIAL_BOXES);
    expect(s.phase).toBe("fresh");
  });
  it("can go negative when visits are large", () => {
    const s = computeStats({ installedAt: 0, visits: 50, now: 7 * 86_400_000 });
    expect(s.boxesRemaining).toBeLessThan(0);
  });
  it("accrues boxes slowly over time even with zero visits", () => {
    const day7  = computeStats({ installedAt: 0, visits: 0, now: 7 * 86_400_000 });
    const day30 = computeStats({ installedAt: 0, visits: 0, now: 30 * 86_400_000 });
    expect(day30.boxesRemaining).toBeGreaterThanOrEqual(day7.boxesRemaining);
  });
  it("phase shifts as days accumulate", () => {
    const day100 = computeStats({ installedAt: 0, visits: 0, now: 100 * 86_400_000 });
    expect(day100.phase).toBe("ghost");
  });
});

describe("storage helpers", () => {
  it("ensureInstallDate writes the first time and reads thereafter", () => {
    const s = memStorage();
    const first = ensureInstallDate(s, 12345);
    expect(first).toBe(12345);
    expect(ensureInstallDate(s, 99999)).toBe(12345);
  });
  it("ensureInstallDate replaces an invalid stored value", () => {
    const s = memStorage({ installedAt: "garbage" });
    const v = ensureInstallDate(s, 7777);
    expect(v).toBe(7777);
  });
  it("incrementVisits starts from 0 and adds 1", () => {
    const s = memStorage();
    expect(incrementVisits(s)).toBe(1);
    expect(incrementVisits(s)).toBe(2);
    expect(incrementVisits(s)).toBe(3);
  });
  it("resetMove sets installedAt to now and clears visits", () => {
    const s = memStorage({ installedAt: 100, visits: 50 });
    resetMove(s, 500);
    expect(s.get("installedAt")).toBe(500);
    expect(s.get("visits")).toBe(0);
    expect(s.get("recent")).toEqual([]);
  });
});
