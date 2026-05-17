import { describe, it, expect } from "vitest";
import { todayIso, monthIsoOf, groupByDay, groupByMonth, search } from "../src/dates.js";

describe("todayIso", () => {
  it("returns YYYY-MM-DD format", () => {
    const iso = todayIso();
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("uses the date components of the given Date", () => {
    const d = new Date(2026, 4, 17); // months are 0-based; this is May 17 local
    expect(todayIso(d)).toBe("2026-05-17");
  });

  it("zero-pads single-digit months and days", () => {
    const d = new Date(2026, 0, 3);
    expect(todayIso(d)).toBe("2026-01-03");
  });
});

describe("monthIsoOf", () => {
  it("strips the day", () => {
    expect(monthIsoOf("2026-05-17")).toBe("2026-05");
  });
});

const SAMPLE = [
  { id: "a", url: "https://a.com", title: "Alpha",   note: "",      dateIso: "2026-05-17", at: "2026-05-17T01:00:00Z" },
  { id: "b", url: "https://b.com", title: "Beta",    note: "メモ",  dateIso: "2026-05-17", at: "2026-05-17T05:00:00Z" },
  { id: "c", url: "https://c.com", title: "Gamma",   note: "",      dateIso: "2026-05-16", at: "2026-05-16T22:00:00Z" },
  { id: "d", url: "https://d.com", title: "Delta",   note: "",      dateIso: "2026-04-30", at: "2026-04-30T03:00:00Z" },
];

describe("groupByDay", () => {
  it("groups entries by dateIso", () => {
    const m = groupByDay(SAMPLE);
    expect([...m.keys()]).toEqual(["2026-05-17", "2026-05-16", "2026-04-30"]);
    expect(m.get("2026-05-17").length).toBe(2);
  });

  it("within a day, sorts newest first", () => {
    const m = groupByDay(SAMPLE);
    const ids = m.get("2026-05-17").map((e) => e.id);
    expect(ids).toEqual(["b", "a"]);
  });
});

describe("groupByMonth", () => {
  it("groups entries by YYYY-MM", () => {
    const m = groupByMonth(SAMPLE);
    expect([...m.keys()]).toEqual(["2026-05", "2026-04"]);
    expect(m.get("2026-05").length).toBe(3);
  });
});

describe("search", () => {
  it("returns empty when query is empty", () => {
    expect(search(SAMPLE, "")).toEqual([]);
    expect(search(SAMPLE, "   ")).toEqual([]);
  });

  it("matches title substring case-insensitively", () => {
    expect(search(SAMPLE, "alpha").map((e) => e.id)).toEqual(["a"]);
    expect(search(SAMPLE, "BETA").map((e) => e.id)).toEqual(["b"]);
  });

  it("matches URL substring", () => {
    expect(search(SAMPLE, "b.com").map((e) => e.id)).toEqual(["b"]);
  });

  it("matches note text", () => {
    expect(search(SAMPLE, "メモ").map((e) => e.id)).toEqual(["b"]);
  });

  it("returns multiple matches", () => {
    expect(search(SAMPLE, "https").length).toBe(4);
  });
});
