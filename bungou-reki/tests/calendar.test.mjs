import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Calendar logic test (Node doesn't have fetch for relative file paths, so inline-load)
import { anniversariesOn, summonsForDate, daysInMonth, anniversariesForMonth } from "../src/modules/calendar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authors = JSON.parse(readFileSync(resolve(__dirname, "../src/data/authors.json"), "utf8")).authors;

test("daysInMonth basic months", () => {
  assert.equal(daysInMonth(2026, 1), 31);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.equal(daysInMonth(2024, 2), 29);
  assert.equal(daysInMonth(2026, 4), 30);
});

test("May 16 returns Terkel and Rich", () => {
  const hits = anniversariesOn(authors, 2026, "05-16");
  const ids = hits.map(h => h.author.id);
  assert.ok(ids.includes("terkel"), "terkel missing");
  assert.ok(ids.includes("rich"), "rich missing");
});

test("summonsForDate falls back to nearby dates", () => {
  // Feb 29 in non-leap year still returns something via near-day fallback
  const hits = summonsForDate(authors, "2026-02-28");
  assert.ok(hits.length > 0);
});

test("summonsForDate today (May 16) has entries", () => {
  const hits = summonsForDate(authors, "2026-05-16");
  assert.ok(hits.length >= 2);
});

test("anniversariesForMonth returns correct length", () => {
  assert.equal(anniversariesForMonth(authors, 2026, 2).length, 28);
  assert.equal(anniversariesForMonth(authors, 2024, 2).length, 29);
  assert.equal(anniversariesForMonth(authors, 2026, 5).length, 31);
});

test("author dataset has 50+ entries", () => {
  assert.ok(authors.length >= 50, `got only ${authors.length}`);
});

test("all author dates are well-formed", () => {
  for (const a of authors) {
    assert.match(a.born, /^\d{4}-\d{2}-\d{2}$/, `${a.id} born malformed`);
    if (a.died !== null) {
      assert.match(a.died, /^\d{4}-\d{2}-\d{2}$/, `${a.id} died malformed`);
    }
  }
});

test("all stats are 0-99", () => {
  for (const a of authors) {
    for (const k of ["literary", "prolific", "influence", "longevity"]) {
      const v = a.stats[k];
      assert.ok(v >= 0 && v <= 99, `${a.id}.${k}=${v} out of range`);
    }
  }
});
