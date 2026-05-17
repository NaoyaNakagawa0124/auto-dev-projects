import { describe, it, expect } from "vitest";
import {
  detectSite,
  detectIngredientsFromText,
  detectAndSort,
  KNOWN_SITES,
} from "../src/detector.js";

describe("detector.detectSite", () => {
  it("matches known hosts", () => {
    expect(detectSite("cookpad.com")).toBe("cookpad");
    expect(detectSite("www.cookpad.com")).toBe("cookpad");
    expect(detectSite("kurashiru.com")).toBe("kurashiru");
    expect(detectSite("cooking.nytimes.com")).toBe("nyt-cooking");
  });

  it("returns null for unknown hosts", () => {
    expect(detectSite("example.com")).toBe(null);
    expect(detectSite("totally.random.site")).toBe(null);
  });

  it("known site map has expected entries", () => {
    expect(Object.keys(KNOWN_SITES).length).toBeGreaterThanOrEqual(5);
  });
});

describe("detector.detectIngredientsFromText", () => {
  it("finds simple Japanese ingredients", () => {
    const list = detectIngredientsFromText("材料: 鶏胸肉 200g、 塩 少々");
    const names = list.map((e) => e.name);
    expect(names).toContain("鶏胸肉");
    expect(names).toContain("塩");
  });

  it("finds dangerous ingredients", () => {
    const list = detectIngredientsFromText("玉ねぎ 1 個、 ニンニク 2 片");
    const danger = list.filter((e) => e.category === "danger").map((e) => e.name);
    expect(danger).toContain("玉ねぎ");
    expect(danger).toContain("ニンニク");
  });

  it("finds English ingredients case-insensitive", () => {
    const list = detectIngredientsFromText("CHICKEN BREAST and ONION");
    const names = list.map((e) => e.name);
    expect(names).toContain("鶏胸肉");
    expect(names).toContain("玉ねぎ");
  });

  it("returns no duplicates", () => {
    const list = detectIngredientsFromText("鶏胸肉 200g。 鶏胸肉 をさらに 100g 追加");
    const chickenCount = list.filter((e) => e.name === "鶏胸肉").length;
    expect(chickenCount).toBe(1);
  });

  it("returns empty list for irrelevant text", () => {
    const list = detectIngredientsFromText("これ は ただ の 説明 文 です");
    expect(list).toEqual([]);
  });

  it("returns empty list for empty input", () => {
    expect(detectIngredientsFromText("")).toEqual([]);
    expect(detectIngredientsFromText(null)).toEqual([]);
  });

  it("prefers longer alias matches (specificity)", () => {
    // 鶏胸肉 should win over 鶏 (if 鶏 were a separate entry, but it's not)
    // This tests that 鶏ガラスープ doesn't get blocked by 鶏ガラ
    const list = detectIngredientsFromText("鶏ガラスープ 適量");
    const names = list.map((e) => e.name);
    expect(names).toContain("鶏ガラスープ");
  });
});

describe("detector.detectAndSort", () => {
  it("orders love before danger before meh", () => {
    const text = "塩 少々、 鶏胸肉 200g、 玉ねぎ 1 個";
    const sorted = detectAndSort(text);
    const cats = sorted.map((e) => e.category);
    const loveIdx = cats.indexOf("love");
    const dangerIdx = cats.indexOf("danger");
    const mehIdx = cats.indexOf("meh");
    expect(loveIdx).toBeLessThan(dangerIdx);
    expect(dangerIdx).toBeLessThan(mehIdx);
  });

  it("within same category, higher score comes first", () => {
    const text = "塩、 砂糖、 醤油"; // all meh: 10, 25, 30
    const sorted = detectAndSort(text);
    expect(sorted[0].name).toBe("醤油");
    expect(sorted[sorted.length - 1].name).toBe("塩");
  });
});
