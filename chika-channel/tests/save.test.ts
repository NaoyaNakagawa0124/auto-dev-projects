import { expect, test } from "bun:test";
import { addStation } from "../src/game/network.ts";
import { newGame } from "../src/game/game.ts";
import { deserialize, serialize } from "../src/game/save.ts";

test("serialize and deserialize round-trip", () => {
  const g = newGame();
  addStation(g.network, { topic: "cooking", vibe: 4, x: 0.5, y: 0.5 });
  const raw = serialize(g);
  expect(typeof raw).toBe("string");
  const restored = deserialize(raw);
  expect(restored).not.toBeNull();
  expect(restored!.network.stations.length).toBe(1);
  expect(restored!.network.stations[0]!.topic).toBe("cooking");
});

test("deserialize null / empty returns null", () => {
  expect(deserialize(null)).toBeNull();
  expect(deserialize(undefined)).toBeNull();
  expect(deserialize("")).toBeNull();
});

test("deserialize garbage returns null", () => {
  expect(deserialize("not json {{")).toBeNull();
  expect(deserialize("[]")).toBeNull();      // wrong shape
  expect(deserialize("null")).toBeNull();
});

test("deserialize missing required keys returns null", () => {
  expect(deserialize(JSON.stringify({ network: {} }))).toBeNull();  // no day, no subs
});
