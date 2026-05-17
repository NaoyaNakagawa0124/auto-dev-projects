import { describe, it, expect } from "vitest";
import { makeEntry, isValidEntry, MAX_NOTE_LEN, MAX_URL_LEN } from "../src/entry.js";

describe("makeEntry", () => {
  it("creates a valid entry with required fields", () => {
    const e = makeEntry({ url: "https://example.com", title: "Example" });
    expect(isValidEntry(e)).toBe(true);
    expect(e.url).toBe("https://example.com");
    expect(e.title).toBe("Example");
    expect(e.note).toBe("");
  });

  it("throws when url is missing", () => {
    expect(() => makeEntry({})).toThrow(/url is required/);
    expect(() => makeEntry({ url: "" })).toThrow();
  });

  it("trims overly long notes to MAX_NOTE_LEN", () => {
    const longNote = "a".repeat(MAX_NOTE_LEN + 100);
    const e = makeEntry({ url: "https://example.com", note: longNote });
    expect(e.note.length).toBe(MAX_NOTE_LEN);
  });

  it("throws on URL longer than MAX_URL_LEN", () => {
    const longUrl = "https://" + "a".repeat(MAX_URL_LEN);
    expect(() => makeEntry({ url: longUrl })).toThrow(/url too long/);
  });

  it("respects explicit id", () => {
    const e = makeEntry({ url: "https://x", id: "fixed-id" });
    expect(e.id).toBe("fixed-id");
  });

  it("sets dateIso from at", () => {
    const at = new Date(2026, 4, 17, 12, 0, 0);
    const e = makeEntry({ url: "https://x", at });
    expect(e.dateIso).toBe("2026-05-17");
  });

  it("creates unique ids by default", () => {
    const a = makeEntry({ url: "https://x" });
    const b = makeEntry({ url: "https://y" });
    expect(a.id).not.toBe(b.id);
  });
});

describe("isValidEntry", () => {
  it("accepts a complete entry", () => {
    const e = makeEntry({ url: "https://example.com" });
    expect(isValidEntry(e)).toBe(true);
  });

  it("rejects null / not-an-object", () => {
    expect(isValidEntry(null)).toBe(false);
    expect(isValidEntry("string")).toBe(false);
    expect(isValidEntry(123)).toBe(false);
  });

  it("rejects entries missing fields", () => {
    expect(isValidEntry({ id: "a" })).toBe(false);
  });

  it("rejects malformed dateIso", () => {
    const e = makeEntry({ url: "https://example.com" });
    expect(isValidEntry({ ...e, dateIso: "2026/05/17" })).toBe(false);
  });

  it("rejects invalid timestamp", () => {
    const e = makeEntry({ url: "https://example.com" });
    expect(isValidEntry({ ...e, at: "not a date" })).toBe(false);
  });
});
