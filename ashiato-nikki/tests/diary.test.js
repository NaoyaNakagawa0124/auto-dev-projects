import { describe, it, expect } from "vitest";
import { memoryStorage } from "../src/storage.js";
import { addEntry, listEntries, entriesForDay, removeEntry, clearAll } from "../src/diary.js";

describe("diary", () => {
  it("addEntry returns a stored entry", async () => {
    const s = memoryStorage();
    const e = await addEntry(s, { url: "https://a.com", title: "A" });
    expect(e.url).toBe("https://a.com");
    const list = await listEntries(s);
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(e.id);
  });

  it("listEntries returns newest first", async () => {
    const s = memoryStorage();
    await addEntry(s, { url: "https://a.com", at: new Date(2026, 4, 17, 9) });
    await addEntry(s, { url: "https://b.com", at: new Date(2026, 4, 17, 10) });
    await addEntry(s, { url: "https://c.com", at: new Date(2026, 4, 17, 8) });
    const list = await listEntries(s);
    expect(list.map((e) => e.url)).toEqual([
      "https://b.com",
      "https://a.com",
      "https://c.com",
    ]);
  });

  it("entriesForDay filters by ISO date", async () => {
    const s = memoryStorage();
    await addEntry(s, { url: "https://a.com", at: new Date(2026, 4, 17, 9) });
    await addEntry(s, { url: "https://b.com", at: new Date(2026, 4, 18, 9) });
    const today = await entriesForDay(s, "2026-05-17");
    expect(today.length).toBe(1);
    expect(today[0].url).toBe("https://a.com");
  });

  it("removeEntry deletes by id and reports change", async () => {
    const s = memoryStorage();
    const e = await addEntry(s, { url: "https://a.com" });
    const removed = await removeEntry(s, e.id);
    expect(removed).toBe(true);
    expect(await listEntries(s)).toEqual([]);
  });

  it("removeEntry on unknown id returns false", async () => {
    const s = memoryStorage();
    expect(await removeEntry(s, "not-real")).toBe(false);
  });

  it("clearAll empties everything", async () => {
    const s = memoryStorage();
    await addEntry(s, { url: "https://a.com" });
    await addEntry(s, { url: "https://b.com" });
    await clearAll(s);
    expect(await listEntries(s)).toEqual([]);
  });

  it("silently drops invalid entries from storage", async () => {
    const s = memoryStorage();
    // Inject a corrupt entry directly.
    await s.set("ashiato-nikki:entries", [
      { id: "bogus" },
      ...(await listEntries(s)),
    ]);
    const list = await listEntries(s);
    expect(list).toEqual([]);
  });
});
