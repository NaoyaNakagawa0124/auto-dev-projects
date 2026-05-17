// Render tests run with chalk colors disabled so output is plain ASCII.
process.env.FORCE_COLOR = "0";

import { describe, it, expect } from "vitest";

const { render, formatCard, formatHeader, visualWidth, padToVisualWidth, CARD_WIDTH } = await import("../src/render.js");
const { byId, NEWS } = await import("../src/news.js");

describe("visualWidth", () => {
  it("counts ASCII as 1 each", () => {
    expect(visualWidth("hello")).toBe(5);
  });
  it("counts kana / kanji as 2 each", () => {
    expect(visualWidth("夜更け")).toBe(6);
  });
  it("mixes correctly", () => {
    expect(visualWidth("ABC 夜")).toBe(6);  // 3 + 1 + 2
  });
});

describe("padToVisualWidth", () => {
  it("pads to width with spaces", () => {
    expect(padToVisualWidth("ab", 5)).toBe("ab   ");
  });
  it("returns text untouched when exact", () => {
    expect(padToVisualWidth("hello", 5)).toBe("hello");
  });
  it("truncates with … when too long", () => {
    const out = padToVisualWidth("夜更け 早朝 までゲーム", 10);
    expect(visualWidth(out)).toBeLessThanOrEqual(10);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("formatHeader", () => {
  it("includes the date stamp + tier label", () => {
    const out = formatHeader(new Date(2026, 4, 17, 2, 14));
    expect(out).toContain("2026-05-17, 02:14");
    expect(out).toContain("深夜");
    expect(out).toContain("INDIE  RELEASES");
  });
});

describe("formatCard", () => {
  it("returns a multi-line block with top + bottom rules", () => {
    const card = formatCard(byId("hollow-frequencies"), 0, new Date(2026, 4, 17, 2));
    const lines = card.split("\n");
    expect(lines.length).toBeGreaterThan(5);
    expect(lines[0].startsWith("┌")).toBe(true);
    expect(lines[lines.length - 1].startsWith("└")).toBe(true);
  });

  it("contains the title and Japanese subtitle", () => {
    const card = formatCard(byId("hollow-frequencies"), 0, new Date(2026, 4, 17, 2));
    expect(card).toContain("Hollow Frequencies");
    expect(card).toContain("電波");
  });

  it("includes the sleep / breakfast trades", () => {
    const card = formatCard(byId("hollow-frequencies"), 0, new Date(2026, 4, 17, 2));
    expect(card).toContain("睡眠");
    expect(card).toContain("朝食");
  });
});

describe("render", () => {
  it("contains the header + N cards", () => {
    const items = NEWS.slice(0, 3);
    const out = render(new Date(2026, 4, 17, 2), items);
    expect(out).toContain("INDIE  RELEASES");
    for (const n of items) {
      expect(out).toContain(n.title);
    }
  });

  it("ends with the goodnight line", () => {
    const out = render(new Date(2026, 4, 17, 2), NEWS.slice(0, 1));
    expect(out).toContain("おやすみなさい");
  });
});
