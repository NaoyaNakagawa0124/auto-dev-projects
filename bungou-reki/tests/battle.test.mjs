import { test } from "node:test";
import { strict as assert } from "node:assert";
import { resolveBattle, opponentForSeed } from "../src/modules/battle.js";

function mkAuthor(id, lit, pro, inf, lon = 50, color = "#000") {
  return {
    id, name: id, name_en: id, country: "テスト", era: "テスト",
    born: "2000-01-01", died: null, works: [], color, epithet: "",
    stats: { literary: lit, prolific: pro, influence: inf, longevity: lon },
  };
}

test("resolveBattle rejects wrong sizes", () => {
  const a = mkAuthor("a", 50, 50, 50);
  assert.throws(() => resolveBattle([a], [a, a, a]));
  assert.throws(() => resolveBattle([a, a, a], [a, a]));
});

test("resolveBattle stronger deck wins all", () => {
  const strong = mkAuthor("s", 90, 90, 90);
  const weak = mkAuthor("w", 10, 10, 10);
  const r = resolveBattle([strong, strong, strong], [weak, weak, weak]);
  assert.equal(r.player_wins, 3);
  assert.equal(r.opponent_wins, 0);
  assert.equal(r.player_won, true);
  assert.equal(r.xp_gained, 50);
});

test("resolveBattle draws don't credit either", () => {
  const a = mkAuthor("a", 50, 50, 50);
  const b = mkAuthor("b", 50, 50, 50);
  const r = resolveBattle([a, a, a], [b, b, b]);
  assert.equal(r.player_wins, 0);
  assert.equal(r.opponent_wins, 0);
  for (const round of r.rounds) assert.equal(round.outcome, "draw");
});

test("xp_targets records winning cards only", () => {
  const w1 = mkAuthor("w1", 99, 1, 1);
  const ll = mkAuthor("ll", 1, 1, 1);
  const w3 = mkAuthor("w3", 1, 1, 99);
  const opp = mkAuthor("op", 50, 50, 50);
  const r = resolveBattle([w1, ll, w3], [opp, opp, opp]);
  assert.deepEqual(r.xp_targets, ["w1", "w3"]);
});

test("opponentForSeed is deterministic", () => {
  const authors = [...Array(20).keys()].map(i => mkAuthor(`a${i}`, i * 5, i * 4, i * 3));
  const a = opponentForSeed(authors, 42n, []);
  const b = opponentForSeed(authors, 42n, []);
  assert.equal(a.length, 3);
  assert.deepEqual(a.map(x => x.id), b.map(x => x.id));
});

test("opponentForSeed excludes player IDs", () => {
  const authors = [...Array(20).keys()].map(i => mkAuthor(`a${i}`, i * 5, i * 4, i * 3));
  const exclude = ["a0", "a1", "a2"];
  const r = opponentForSeed(authors, 7n, exclude);
  for (const card of r) assert.equal(exclude.includes(card.id), false);
});
