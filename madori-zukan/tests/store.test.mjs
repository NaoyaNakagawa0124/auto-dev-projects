import { test, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

// Polyfill localStorage for node
globalThis.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] ?? null; },
  setItem(k, v) { this._data[k] = String(v); },
  removeItem(k) { delete this._data[k]; },
};

const { Archive } = await import("../modules/store.js");

beforeEach(() => { globalThis.localStorage._data = {}; });

test("toggleWatched switches state", () => {
  const a = new Archive();
  assert.equal(a.toggleWatched("nobita"), true);
  assert.ok(a.isWatched("nobita"));
  assert.equal(a.toggleWatched("nobita"), false);
  assert.ok(!a.isWatched("nobita"));
});

test("toggleFavorite switches state", () => {
  const a = new Archive();
  assert.equal(a.toggleFavorite("forger"), true);
  assert.ok(a.isFavorite("forger"));
  assert.equal(a.toggleFavorite("forger"), false);
});

test("save/load round trips", () => {
  const a = new Archive();
  a.toggleWatched("nobita");
  a.toggleFavorite("kamado");
  a.save();
  const b = new Archive();
  b.load();
  assert.ok(b.isWatched("nobita"));
  assert.ok(b.isFavorite("kamado"));
});

test("stats compute correctly", () => {
  const a = new Archive();
  const homes = [
    { id: "x", total_sqm: 100, tags: ["昭和"] },
    { id: "y", total_sqm: 50, tags: ["平成"] },
    { id: "z", total_sqm: 30, tags: ["昭和"] },
  ];
  a.toggleWatched("x");
  a.toggleWatched("z");
  a.toggleFavorite("z");
  const s = a.stats(homes);
  assert.equal(s.watched_count, 2);
  assert.equal(s.favorite_count, 1);
  assert.equal(s.total_sqm, 130);
  assert.equal(s.eras["昭和"], 2);
});

test("watched without favorite still tracked", () => {
  const a = new Archive();
  a.toggleWatched("a");
  assert.ok(a.isWatched("a"));
  assert.ok(!a.isFavorite("a"));
});

test("visited_count increments only on add", () => {
  const a = new Archive();
  a.toggleWatched("nobita");
  assert.equal(a.visited_count.nobita, 1);
  a.toggleWatched("nobita"); // off
  a.toggleWatched("nobita"); // on again
  assert.equal(a.visited_count.nobita, 2);
});
