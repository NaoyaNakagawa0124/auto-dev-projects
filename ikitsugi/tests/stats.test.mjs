import { test } from "node:test";
import { strict as assert } from "node:assert";
import { emptyStats, recordSession, todayKey, todaySessions, streak, recent } from "../src/modules/stats.js";

test("emptyStats has zero counters", () => {
  const s = emptyStats();
  assert.equal(s.sessions, 0);
  assert.equal(s.cycles, 0);
  assert.deepEqual(s.by_day, {});
});

test("recordSession accumulates", () => {
  const s = emptyStats();
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-17T10:00:00Z" });
  recordSession(s, { duration_sec: 60, cycles: 5, ts: "2026-05-17T11:00:00Z" });
  assert.equal(s.sessions, 2);
  assert.equal(s.cycles, 9);
  const day = s.by_day["2026-05-17"];
  assert.equal(day.sessions, 2);
  assert.equal(day.cycles, 9);
  assert.equal(day.duration_sec, 120);
});

test("todaySessions returns count for today", () => {
  const s = emptyStats();
  const now = new Date("2026-05-17T10:00:00Z");
  recordSession(s, { duration_sec: 60, cycles: 4, ts: now.toISOString() });
  assert.equal(todaySessions(s, now), 1);
  assert.equal(todaySessions(s, new Date("2026-05-18T10:00:00Z")), 0);
});

test("streak counts consecutive days backward", () => {
  const s = emptyStats();
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-15T10:00:00Z" });
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-16T10:00:00Z" });
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-17T10:00:00Z" });
  assert.equal(streak(s, new Date("2026-05-17T22:00:00Z")), 3);
});

test("streak breaks on skipped day", () => {
  const s = emptyStats();
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-14T10:00:00Z" });
  // skip 15
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-16T10:00:00Z" });
  recordSession(s, { duration_sec: 60, cycles: 4, ts: "2026-05-17T10:00:00Z" });
  assert.equal(streak(s, new Date("2026-05-17T22:00:00Z")), 2);
});

test("recent returns most recent N days", () => {
  const s = emptyStats();
  for (const d of ["2026-05-10", "2026-05-12", "2026-05-15", "2026-05-17"]) {
    recordSession(s, { duration_sec: 60, cycles: 2, ts: `${d}T10:00:00Z` });
  }
  const r = recent(s, 3);
  assert.equal(r.length, 3);
  assert.equal(r[0].date, "2026-05-17");
  assert.equal(r[2].date, "2026-05-12");
});

test("todayKey uses UTC ISO date", () => {
  assert.equal(todayKey(new Date("2026-05-17T23:59:59Z")), "2026-05-17");
});
