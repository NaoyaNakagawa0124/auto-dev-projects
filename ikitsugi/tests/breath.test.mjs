import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  PATTERNS, getPattern, cycleLength, phaseAt, phaseProgress,
  fullnessAt, scaleAt, colorAt, cyclesIn,
} from "../src/modules/breath.js";

test("cycleLength: box = 16, r478 = 19, f448 = 16", () => {
  assert.equal(cycleLength(PATTERNS.box), 16);
  assert.equal(cycleLength(PATTERNS.r478), 19);
  assert.equal(cycleLength(PATTERNS.f448), 16);
});

test("phaseAt: box transitions cleanly", () => {
  const p = PATTERNS.box;
  assert.equal(phaseAt(p, 0), "inhale");
  assert.equal(phaseAt(p, 3.9), "inhale");
  assert.equal(phaseAt(p, 4.0), "hold_in");
  assert.equal(phaseAt(p, 7.9), "hold_in");
  assert.equal(phaseAt(p, 8.0), "exhale");
  assert.equal(phaseAt(p, 11.9), "exhale");
  assert.equal(phaseAt(p, 12.0), "hold_out");
  assert.equal(phaseAt(p, 15.9), "hold_out");
});

test("phaseAt: wraps around cycle", () => {
  const p = PATTERNS.box;
  assert.equal(phaseAt(p, 16.0), "inhale"); // back to start
  assert.equal(phaseAt(p, 32.0), "inhale");
  assert.equal(phaseAt(p, 100.5), phaseAt(p, 100.5 % 16));
});

test("phaseAt: r478 (no hold_out)", () => {
  const p = PATTERNS.r478;
  assert.equal(phaseAt(p, 0), "inhale");
  assert.equal(phaseAt(p, 4.5), "hold_in");
  assert.equal(phaseAt(p, 11.5), "exhale");
  assert.equal(phaseAt(p, 18.999), "exhale");
});

test("phaseProgress: 0..1 within phase", () => {
  const p = PATTERNS.box;
  assert.ok(Math.abs(phaseProgress(p, 0)) < 1e-9);
  assert.ok(Math.abs(phaseProgress(p, 2) - 0.5) < 1e-9);
  assert.ok(Math.abs(phaseProgress(p, 4) - 0) < 1e-9); // start of next phase
  assert.ok(Math.abs(phaseProgress(p, 6) - 0.5) < 1e-9);
});

test("fullnessAt: rises during inhale, falls during exhale", () => {
  const p = PATTERNS.box;
  assert.equal(fullnessAt(p, 0), 0);
  assert.equal(fullnessAt(p, 2), 0.5);
  assert.equal(fullnessAt(p, 4), 1);
  assert.equal(fullnessAt(p, 8), 1);
  assert.equal(fullnessAt(p, 10), 0.5);
  assert.equal(fullnessAt(p, 12), 0);
});

test("fullnessAt: hold_in stays at 1", () => {
  const p = PATTERNS.box;
  for (let t = 4; t < 8; t += 0.5) {
    assert.equal(fullnessAt(p, t), 1);
  }
});

test("scaleAt: maps 0..1 fullness to min..max", () => {
  const p = PATTERNS.box;
  // default min=0.4, max=1.0
  assert.ok(Math.abs(scaleAt(p, 0) - 0.4) < 1e-9);
  assert.ok(Math.abs(scaleAt(p, 4) - 1.0) < 1e-9);
  // custom range
  assert.ok(Math.abs(scaleAt(p, 0, { min: 0, max: 2 }) - 0) < 1e-9);
  assert.ok(Math.abs(scaleAt(p, 4, { min: 0, max: 2 }) - 2) < 1e-9);
});

test("colorAt: blue→amber on inhale", () => {
  const p = PATTERNS.box;
  const c0 = colorAt(p, 0);    // pure blue
  const c4 = colorAt(p, 4);    // pure amber (start of hold_in)
  const c8 = colorAt(p, 8);    // amber (start of exhale)
  const c12 = colorAt(p, 12);  // blue (start of hold_out)
  assert.match(c0, /^rgb\(/);
  assert.notEqual(c0, c4);
  assert.equal(c4, c8); // both amber
  assert.equal(c0, c12); // both blue
});

test("cyclesIn: counts whole cycles", () => {
  const p = PATTERNS.box;
  assert.equal(cyclesIn(p, 60), 3); // 60/16 = 3.75 → 3
  assert.equal(cyclesIn(p, 16), 1);
  assert.equal(cyclesIn(p, 15), 0);
});

test("getPattern falls back to box on unknown id", () => {
  assert.deepEqual(getPattern("does-not-exist"), PATTERNS.box);
  assert.deepEqual(getPattern("box"), PATTERNS.box);
});

test("cycleLength handles 0-length pattern safely", () => {
  const zero = { inhale: 0, hold_in: 0, exhale: 0, hold_out: 0 };
  assert.equal(cycleLength(zero), 0);
  assert.equal(phaseAt(zero, 100), "inhale");
  assert.equal(fullnessAt(zero, 0), 0);
});
