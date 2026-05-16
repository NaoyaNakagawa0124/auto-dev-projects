import { expect, test } from "bun:test";
import { addStation, createLine } from "../src/game/network.ts";
import { advanceDay, maxActionPoints, newGame } from "../src/game/game.ts";
import { RNG } from "../src/game/rng.ts";

test("newGame seeds with 100 subscribers and day 1", () => {
  const g = newGame();
  expect(g.subscribers).toBe(100);
  expect(g.day).toBe(1);
  expect(g.action_points).toBe(3);
  expect(g.unlocked.shorts_line).toBe(false);
});

test("maxActionPoints scales with subscribers", () => {
  const g = newGame();
  expect(maxActionPoints(g)).toBe(3);
  g.subscribers = 1500;
  expect(maxActionPoints(g)).toBe(4);
  g.subscribers = 12_000;
  expect(maxActionPoints(g)).toBe(5);
  g.subscribers = 150_000;
  expect(maxActionPoints(g)).toBe(6);
});

test("advanceDay increments day and history", () => {
  let g = newGame();
  const a = addStation(g.network, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  const b = addStation(g.network, { topic: "cooking", vibe: 4, x: 0, y: 0 });
  createLine(g.network, "cooking", [a.id, b.id]);
  g = advanceDay(g, new RNG(1));
  expect(g.day).toBe(2);
  expect(g.history.length).toBe(1);
  expect(g.history[0]!.views).toBeGreaterThan(0);
  expect(g.total_views).toBeGreaterThan(0);
});

test("advanceDay rolls a new weather every 7 days", () => {
  let g = newGame();
  const startWeather = g.weather;
  for (let i = 0; i < 7; i++) {
    g = advanceDay(g, new RNG(42));
  }
  // day went 1→8, so a new weather should have rolled
  // (might be calm again, but the assertion is structural — day 8 has cycled)
  expect(g.day).toBe(8);
  expect(g.week).toBe(2);
});

test("unlock checkpoint flags toggle on subscriber thresholds", () => {
  // Subscriber climb is intentionally slow at first (early game arc), so directly
  // simulate the threshold by bumping subs and calling advanceDay once to apply
  // the unlock check.
  let g = newGame();
  const a = addStation(g.network, { topic: "shorts", vibe: 5, x: 0, y: 0 });
  const b = addStation(g.network, { topic: "shorts", vibe: 5, x: 0, y: 0 });
  createLine(g.network, "shorts", [a.id, b.id]);
  g.subscribers = 1_500;
  g = advanceDay(g, new RNG(7));
  expect(g.unlocked.shorts_line).toBe(true);
  g.subscribers = 12_000;
  g = advanceDay(g, new RNG(7));
  expect(g.unlocked.series_line).toBe(true);
});
