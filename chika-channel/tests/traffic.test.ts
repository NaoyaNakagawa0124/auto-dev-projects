import { expect, test } from "bun:test";
import { addStation, createLine, emptyNetwork } from "../src/game/network.ts";
import { ageDecay, applyDay, lineBonus, simulateDay, vibeMultiplier, weatherMultiplier } from "../src/game/traffic.ts";
import { WEATHERS } from "../src/game/weather.ts";

test("ageDecay is 1.0 at day 0 and decreases", () => {
  expect(ageDecay(0)).toBe(1.0);
  expect(ageDecay(7)).toBeLessThan(1.0);
  expect(ageDecay(7)).toBeGreaterThan(0);
  expect(ageDecay(30)).toBeLessThan(ageDecay(7));
});

test("vibeMultiplier monotonic and clamped", () => {
  expect(vibeMultiplier(1)).toBeLessThan(vibeMultiplier(5));
  expect(vibeMultiplier(0)).toBe(vibeMultiplier(1));
  expect(vibeMultiplier(99)).toBe(vibeMultiplier(5));
});

test("lineBonus rewards matching-topic lines and transfers", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  expect(lineBonus(a, n)).toBe(1.0);  // no lines
  const matched = createLine(n, "cooking", [a.id, b.id]);
  expect(lineBonus(a, n)).toBeCloseTo(1.30);
  // add a second matching line
  const c = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  createLine(n, "cooking", [a.id, c.id]);
  // now a is on 2 cooking lines → 1 + 0.30 + 0.30 + 0.50 transfer = 2.10
  expect(lineBonus(a, n)).toBeCloseTo(2.10);
});

test("weatherMultiplier respects topic multipliers and low-vibe penalty", () => {
  const n = emptyNetwork();
  const s = addStation(n, { topic: "vlog", vibe: 1, x: 0, y: 0 });
  expect(weatherMultiplier(s, WEATHERS.calm)).toBe(1.0);
  expect(weatherMultiplier(s, WEATHERS.vlog_season)).toBe(2.0);
  // thumb_war: low vibe penalty
  const thumb = WEATHERS.thumb_war;
  expect(weatherMultiplier(s, thumb)).toBe(0.7);
});

test("simulateDay returns positive views and subs for a real network", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  createLine(n, "cooking", [a.id, b.id]);
  const result = simulateDay(n, WEATHERS.calm);
  expect(result.views).toBeGreaterThan(0);
  expect(result.subscribers_delta).toBeGreaterThanOrEqual(0);
  expect(result.per_station[a.id]).toBeGreaterThan(0);
  expect(result.per_station[b.id]).toBeGreaterThan(0);
});

test("simulateDay zero views for empty network", () => {
  const result = simulateDay(emptyNetwork(), WEATHERS.calm);
  expect(result.views).toBe(0);
  expect(result.subscribers_delta).toBe(0);
});

test("applyDay increments ages by 1 unless reset", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  expect(a.age_days).toBe(0);
  const r1 = simulateDay(n, WEATHERS.calm);
  applyDay(n, r1);
  expect(a.age_days).toBe(1);
  // algo_reset → age 0
  const r2 = simulateDay(n, WEATHERS.algo_reset);
  applyDay(n, r2);
  expect(a.age_days).toBe(0);
});

test("transfer stations boost subscribers_delta", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  const c = addStation(n, { topic: "vlog", vibe: 4, x: 0, y: 0 });
  createLine(n, "cooking", [a.id, b.id]);
  createLine(n, "vlog", [a.id, c.id]);  // a is transfer
  const withTransfer = simulateDay(n, WEATHERS.calm).subscribers_delta;

  // Compare to a network where a is not a transfer
  const n2 = emptyNetwork();
  const a2 = addStation(n2, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  const b2 = addStation(n2, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  addStation(n2, { topic: "vlog", vibe: 4, x: 0, y: 0 });
  createLine(n2, "cooking", [a2.id, b2.id]);
  const withoutTransfer = simulateDay(n2, WEATHERS.calm).subscribers_delta;

  expect(withTransfer).toBeGreaterThan(withoutTransfer);
});
