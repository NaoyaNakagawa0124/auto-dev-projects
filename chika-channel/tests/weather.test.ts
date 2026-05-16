import { expect, test } from "bun:test";
import { getWeather, nextWeather, WEATHERS } from "../src/game/weather.ts";
import { RNG } from "../src/game/rng.ts";

test("all seven weathers defined", () => {
  expect(Object.keys(WEATHERS).length).toBe(7);
});

test("nextWeather is deterministic for same seed", () => {
  const a = nextWeather(1, new RNG(42));
  const b = nextWeather(1, new RNG(42));
  expect(a.key).toBe(b.key);
});

test("nextWeather returns valid keys", () => {
  for (let s = 1; s < 20; s++) {
    const w = nextWeather(1, new RNG(s));
    expect(WEATHERS[w.key]).toBe(w);
  }
});

test("getWeather returns the same instance", () => {
  expect(getWeather("vlog_season")).toBe(WEATHERS.vlog_season);
});

test("calm has empty multipliers", () => {
  expect(Object.keys(WEATHERS.calm.topic_multipliers).length).toBe(0);
  expect(WEATHERS.calm.reset_ages).toBe(false);
});

test("algo_reset resets ages", () => {
  expect(WEATHERS.algo_reset.reset_ages).toBe(true);
});

test("thumb_war has low_vibe_penalty", () => {
  expect(WEATHERS.thumb_war.low_vibe_penalty).toBeDefined();
});
