// Tests for the pure helper exported from src/main.js.
// We stub out Electron because requiring src/main.js pulls it in.

import { describe, it, expect, vi } from "vitest";

// Stub Electron before importing the SUT.
vi.mock("electron", () => ({
  app:       { whenReady: () => Promise.resolve(), on: () => {} },
  BrowserWindow: class {},
  ipcMain:   { handle: () => {} },
}));

const { payloadForDate } = await import("../src/main.js");

describe("payloadForDate", () => {
  it("returns the expected shape", () => {
    const p = payloadForDate(new Date("2026-05-17"));
    expect(typeof p.header).toBe("string");
    expect(p.isoDate).toBe("2026-05-17");
    expect(p.lead).not.toBe(null);
    expect(p.columns.length).toBe(2);
    expect(p.legend.region["north-america"]).toBe("北米");
    expect(p.legend.category["politics"]).toBe("政治");
  });

  it("is deterministic for the same date", () => {
    const a = payloadForDate(new Date("2026-05-17"));
    const b = payloadForDate(new Date("2026-05-17"));
    expect(a.columns[0].map(s => s.id)).toEqual(b.columns[0].map(s => s.id));
  });
});
