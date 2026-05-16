import { test } from "node:test";
import { strict as assert } from "node:assert";
import { DEFAULTS, normalize } from "../src/modules/settings.js";

test("DEFAULTS frozen-ish", () => {
  assert.equal(DEFAULTS.pattern, "f448");
  assert.equal(DEFAULTS.enabled, true);
  assert.equal(DEFAULTS.position, "bottom-right");
});

test("normalize returns defaults for empty input", () => {
  const r = normalize();
  assert.deepEqual(r, DEFAULTS);
});

test("normalize sanitizes invalid pattern", () => {
  const r = normalize({ pattern: "nope" });
  assert.equal(r.pattern, DEFAULTS.pattern);
});

test("normalize clamps dot_size", () => {
  assert.equal(normalize({ dot_size: 10 }).dot_size, 18);
  assert.equal(normalize({ dot_size: 100 }).dot_size, 48);
  assert.equal(normalize({ dot_size: 30 }).dot_size, 30);
});

test("normalize sanitizes position", () => {
  assert.equal(normalize({ position: "middle" }).position, "bottom-right");
  assert.equal(normalize({ position: "top-left" }).position, "top-left");
});

test("normalize coerces booleans", () => {
  const r = normalize({ enabled: 0, hide_on_fullscreen: 1, show_label: "yes" });
  assert.equal(r.enabled, false);
  assert.equal(r.hide_on_fullscreen, true);
  assert.equal(r.show_label, true);
});
