import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import {
  newState, click, buyUpgrade, step, tryStartViral,
  autoIncomePerSec, upgradeCost, formatYen, progressFraction,
} from "../src/modules/game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config = JSON.parse(readFileSync(resolve(__dirname, "../src/data/hustles.json"), "utf8"));

test("config sanity", () => {
  assert.equal(config.hustles.length, 8);
  assert.equal(config.viral_multiplier, 3.0);
});

test("upgradeCost grows geometrically", () => {
  assert.ok(Math.abs(upgradeCost(100, 1.15, 0) - 100) < 1e-6);
  assert.ok(Math.abs(upgradeCost(100, 1.15, 1) - 115) < 1e-6);
  assert.ok(Math.abs(upgradeCost(100, 1.15, 5) - 100 * Math.pow(1.15, 5)) < 1e-6);
});

test("click adds reward", () => {
  const s = newState(config);
  click(config, s, "blog");
  assert.equal(s.cash, 10);
  assert.equal(s.total_clicks, 1);
});

test("click multiplied by viral", () => {
  const s = newState(config);
  s.viral = { hustle_id: "blog", seconds_left: 30, multiplier: 3 };
  click(config, s, "blog");
  assert.equal(s.cash, 30);
});

test("click on unknown id is a no-op", () => {
  const s = newState(config);
  assert.equal(click(config, s, "nope"), false);
  assert.equal(s.cash, 0);
});

test("buyUpgrade requires cash", () => {
  const s = newState(config);
  assert.equal(buyUpgrade(config, s, "blog"), null);
  s.cash = 100;
  assert.equal(buyUpgrade(config, s, "blog"), 1);
});

test("buyUpgrade increments cost geometrically", () => {
  const s = newState(config);
  s.cash = 1_000_000;
  buyUpgrade(config, s, "blog");
  const after1 = s.cash;
  buyUpgrade(config, s, "blog");
  const after2 = s.cash;
  assert.ok(after1 - after2 > 50, "second upgrade should cost more than the first base");
});

test("autoIncomePerSec sums upgrades", () => {
  const s = newState(config);
  s.hustles[0].upgrades = 2;  // 0.5 * 2 = 1
  s.hustles[1].upgrades = 1;  // 0.8 * 1 = 0.8
  const expected = 0.5 * 2 + 0.8 * 1;
  assert.ok(Math.abs(autoIncomePerSec(config, s) - expected) < 1e-6);
});

test("autoIncomePerSec applies viral only to target", () => {
  const s = newState(config);
  s.hustles[0].upgrades = 1;
  s.hustles[1].upgrades = 1;
  s.viral = { hustle_id: "blog", seconds_left: 10, multiplier: 3 };
  const expected = 0.5 * 3 + 0.8;
  assert.ok(Math.abs(autoIncomePerSec(config, s) - expected) < 1e-6);
});

test("step advances cash", () => {
  const s = newState(config);
  s.hustles[0].upgrades = 10; // 5/sec
  step(config, s, 1000);
  assert.ok(Math.abs(s.cash - 5) < 1e-6);
});

test("step decrements and clears viral", () => {
  const s = newState(config);
  s.viral = { hustle_id: "blog", seconds_left: 2, multiplier: 3 };
  step(config, s, 1000);
  assert.ok(Math.abs(s.viral.seconds_left - 1) < 1e-6);
  step(config, s, 2000);
  assert.equal(s.viral.hustle_id, null);
});

test("step ignores progress when won", () => {
  const s = newState(config);
  s.cash = config.win_target + 10;
  step(config, s, 0); // triggers win check
  assert.ok(s.won);
  s.hustles[0].upgrades = 100;
  const before = s.cash;
  step(config, s, 5000);
  assert.equal(s.cash, before);
});

test("tryStartViral respects period gating", () => {
  const s = newState(config);
  s.time_since_last_viral = 10;
  assert.equal(tryStartViral(config, s, 0.5), null);
  s.time_since_last_viral = config.viral_period_sec + 1;
  const result = tryStartViral(config, s, 0.5);
  assert.notEqual(result, null);
  assert.ok(s.viral.seconds_left > 0);
});

test("tryStartViral picks deterministically", () => {
  const a = newState(config); a.time_since_last_viral = 200;
  const b = newState(config); b.time_since_last_viral = 200;
  const ra = tryStartViral(config, a, 0.42);
  const rb = tryStartViral(config, b, 0.42);
  assert.equal(ra, rb);
});

test("formatYen ranges", () => {
  assert.equal(formatYen(0), "¥0");
  assert.equal(formatYen(999), "¥999");
  assert.match(formatYen(1500), /K/);
  assert.match(formatYen(2_500_000), /M/);
  assert.match(formatYen(123_456_789), /億/);
});

test("progressFraction caps at 1", () => {
  const s = newState(config);
  s.cash = config.win_target * 2;
  assert.equal(progressFraction(config, s), 1);
});

test("winning sets won flag via step", () => {
  const s = newState(config);
  s.cash = config.win_target;
  step(config, s, 0);
  assert.ok(s.won);
});
