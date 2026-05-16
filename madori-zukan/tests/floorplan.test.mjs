import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { renderFloorplan, calcGeometry, roomSqm, roomTatami, totalSqm } from "../modules/floorplan.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const homes = JSON.parse(readFileSync(resolve(__dirname, "../data/homes.json"), "utf8")).homes;

test("dataset has 8 homes", () => {
  assert.equal(homes.length, 8);
});

test("every home has at least 5 rooms", () => {
  for (const h of homes) {
    assert.ok(h.rooms.length >= 5, `${h.id} only has ${h.rooms.length} rooms`);
  }
});

test("calcGeometry produces non-zero dimensions", () => {
  for (const h of homes) {
    const g = calcGeometry(h);
    assert.ok(g.width > 0, `${h.id} width=${g.width}`);
    assert.ok(g.height > 0, `${h.id} height=${g.height}`);
  }
});

test("renderFloorplan returns SVG string", () => {
  for (const h of homes) {
    const svg = renderFloorplan(h);
    assert.match(svg, /^<svg/);
    assert.match(svg, /<\/svg>$/);
    assert.ok(svg.includes(h.rooms[0].name), `home ${h.id} svg missing room name`);
  }
});

test("rooms have positive area", () => {
  for (const h of homes) {
    for (const r of h.rooms) {
      assert.ok(r.w > 0 && r.h > 0, `${h.id}.${r.name} has zero size`);
      assert.ok(r.w * r.h <= 200, `${h.id}.${r.name} suspiciously large`);
    }
  }
});

test("room types are known", () => {
  const allowed = new Set([
    "entry", "corridor", "living", "dining", "kitchen",
    "bedroom", "bath", "wc", "work", "garden", "japanese", "closet",
  ]);
  for (const h of homes) {
    for (const r of h.rooms) {
      assert.ok(allowed.has(r.type), `${h.id}.${r.name} unknown type ${r.type}`);
    }
  }
});

test("totalSqm excludes garden", () => {
  const home = {
    rooms: [
      { name: "A", floor: 1, x: 0, y: 0, w: 4, h: 4, type: "living" },
      { name: "Garden", floor: 1, x: 0, y: 5, w: 10, h: 5, type: "garden" },
    ],
  };
  assert.equal(totalSqm(home), 16);
});

test("roomTatami converts to 畳", () => {
  // 1.62㎡ = 1 畳
  const r = { w: 1.62, h: 1 };
  assert.ok(Math.abs(roomTatami(r) - 1.0) < 0.05);
});

test("renderFloorplan with mini scale stays valid SVG", () => {
  const svg = renderFloorplan(homes[0], { scale: 12, showAnnotations: false });
  assert.match(svg, /viewBox=/);
});

test("each home has characters", () => {
  for (const h of homes) {
    assert.ok(Array.isArray(h.characters) && h.characters.length > 0, `${h.id} has no characters`);
  }
});
