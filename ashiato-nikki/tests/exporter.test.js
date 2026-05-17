import { describe, it, expect } from "vitest";
import { toJson, toMarkdown, BANNED_WORDS } from "../src/exporter.js";

const SAMPLE = [
  { id: "a", url: "https://a.com", title: "Alpha",   note: "",       dateIso: "2026-05-17", at: "2026-05-17T01:00:00Z" },
  { id: "b", url: "https://b.com", title: "Beta",    note: "メモ",   dateIso: "2026-05-17", at: "2026-05-17T05:00:00Z" },
  { id: "c", url: "https://c.com", title: "Gamma",   note: "",       dateIso: "2026-05-16", at: "2026-05-16T22:00:00Z" },
  { id: "d", url: "https://d.com", title: "Delta",   note: "",       dateIso: "2026-04-30", at: "2026-04-30T03:00:00Z" },
];

describe("toJson", () => {
  it("emits parseable JSON with a version", () => {
    const s = toJson(SAMPLE);
    const parsed = JSON.parse(s);
    expect(parsed.version).toBe(1);
    expect(Array.isArray(parsed.entries)).toBe(true);
    expect(parsed.entries.length).toBe(4);
  });

  it("preserves all entry fields", () => {
    const parsed = JSON.parse(toJson(SAMPLE));
    expect(parsed.entries[1].note).toBe("メモ");
  });
});

describe("toMarkdown", () => {
  it("renders a header and month sections", () => {
    const md = toMarkdown(SAMPLE);
    expect(md).toContain("# 足跡日記");
    expect(md).toContain("## 2026-05");
    expect(md).toContain("## 2026-04");
  });

  it("renders day sections within months", () => {
    const md = toMarkdown(SAMPLE);
    expect(md).toContain("### 2026-05-17");
    expect(md).toContain("### 2026-05-16");
  });

  it("links each entry by its url", () => {
    const md = toMarkdown(SAMPLE);
    expect(md).toContain("(https://a.com)");
    expect(md).toContain("(https://b.com)");
  });

  it("falls back to (無題) when title is empty", () => {
    const md = toMarkdown([{ ...SAMPLE[0], title: "" }]);
    expect(md).toContain("(無題)");
  });

  it("returns a friendly empty-state message for no entries", () => {
    const md = toMarkdown([]);
    expect(md).toContain("# 足跡日記");
    expect(md).toContain("まだ");
  });

  it("contains no banned words", () => {
    const md = toMarkdown(SAMPLE);
    for (const w of BANNED_WORDS) {
      expect(md.includes(w)).toBe(false);
    }
  });
});

describe("BANNED_WORDS", () => {
  it("exposes the audit list", () => {
    expect(BANNED_WORDS.length).toBeGreaterThan(5);
    expect(BANNED_WORDS).toContain("がんばれ");
    expect(BANNED_WORDS).toContain("連勝");
  });
});
