import { beforeEach, expect, test } from "bun:test";
import {
  addStation, createLine, emptyNetwork, extendLine, isTransferStation,
  removeLine, removeStation, resetIdCounter, topicCounts,
} from "../src/game/network.ts";

beforeEach(() => resetIdCounter());

test("emptyNetwork has no stations or lines", () => {
  const n = emptyNetwork();
  expect(n.stations).toEqual([]);
  expect(n.lines).toEqual([]);
});

test("addStation appends and returns the station", () => {
  const n = emptyNetwork();
  const s = addStation(n, { topic: "cooking", vibe: 3, x: 0.5, y: 0.5 });
  expect(s.id).toBeTruthy();
  expect(n.stations.length).toBe(1);
  expect(s.vibe).toBe(3);
});

test("addStation clamps vibe to 1..5", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "vlog", vibe: 0, x: 0, y: 0 });
  const b = addStation(n, { topic: "vlog", vibe: 99, x: 0, y: 0 });
  expect(a.vibe).toBe(1);
  expect(b.vibe).toBe(5);
});

test("createLine requires >=2 station ids and existing stations", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  expect(() => createLine(n, "cooking", [a.id])).toThrow();
  expect(() => createLine(n, "cooking", [a.id, "nope"])).toThrow();
});

test("createLine wires station.line_ids back-reference", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const line = createLine(n, "cooking", [a.id, b.id]);
  expect(a.line_ids).toContain(line.id);
  expect(b.line_ids).toContain(line.id);
});

test("extendLine appends and avoids dupes", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const c = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const line = createLine(n, "cooking", [a.id, b.id]);
  expect(extendLine(n, line.id, c.id)).toBe(true);
  expect(line.station_ids).toEqual([a.id, b.id, c.id]);
  expect(extendLine(n, line.id, c.id)).toBe(false);  // dup
});

test("removeStation also drops it from lines and prunes empty lines", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  createLine(n, "cooking", [a.id, b.id]);
  expect(removeStation(n, a.id)).toBe(true);
  // line had only [a,b] → after removing a, only b → prune
  expect(n.lines.length).toBe(0);
  expect(b.line_ids).toEqual([]);
});

test("isTransferStation true only when on >= 2 lines", () => {
  const n = emptyNetwork();
  const a = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const b = addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  const c = addStation(n, { topic: "vlog", vibe: 3, x: 0, y: 0 });
  createLine(n, "cooking", [a.id, b.id]);
  expect(isTransferStation(a)).toBe(false);
  createLine(n, "vlog", [a.id, c.id]);
  expect(isTransferStation(a)).toBe(true);
});

test("topicCounts sums per topic", () => {
  const n = emptyNetwork();
  addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  addStation(n, { topic: "cooking", vibe: 3, x: 0, y: 0 });
  addStation(n, { topic: "vlog", vibe: 3, x: 0, y: 0 });
  const counts = topicCounts(n);
  expect(counts.cooking).toBe(2);
  expect(counts.vlog).toBe(1);
});
