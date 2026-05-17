import { describe, it, expect } from "vitest";
import { buildOverlayHtml } from "../src/formatter.js";
import { buildReview } from "../src/reviewer.js";

function L(name, score) { return { name, category: "love", score }; }
function D(name) { return { name, category: "danger", score: 0 }; }
function M(name, score) { return { name, category: "meh", score }; }

describe("formatter.buildOverlayHtml", () => {
  it("returns empty string for empty review", () => {
    const r = buildReview({ entries: [], dogId: "pochi", seedKey: "x" });
    expect(buildOverlayHtml(r)).toBe("");
  });

  it("contains the dog name and review paragraph", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), D("玉ねぎ")],
      dogId: "pochi",
      seedKey: "x",
    });
    const html = buildOverlayHtml(r);
    expect(html).toContain("お利口 ポチ");
    expect(html).toContain(r.paragraph);
    expect(html).toContain("鶏胸肉");
  });

  it("includes star text and points", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), L("ささみ", 90)],
      dogId: "pochi",
      seedKey: "x",
    });
    const html = buildOverlayHtml(r);
    expect(html).toMatch(/★+☆*/);
    expect(html).toContain("/ 100");
  });

  it("includes disclaimer footer", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95)],
      dogId: "pochi",
      seedKey: "x",
    });
    const html = buildOverlayHtml(r);
    expect(html).toContain("コメディ 拡張");
    expect(html).toContain("飼育 助言 で は");
  });

  it("escapes dangerous HTML in ingredient names", () => {
    // direct call with fake injected entry
    const fakeReview = {
      empty: false,
      score: 50,
      stars: 3,
      starsText: "★★★☆☆",
      dog: { name: '<img src=x onerror=alert(1)>', breed: "x", sign: "y" },
      paragraph: "<script>alert(1)</script>",
      lovePicks: [{ name: "<script>", score: 50 }],
      dangerPicks: [],
      mehPicks: [],
    };
    const html = buildOverlayHtml(fakeReview);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("close button has data-inu-close attribute", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95)],
      dogId: "pochi",
      seedKey: "x",
    });
    const html = buildOverlayHtml(r);
    expect(html).toContain("data-inu-close");
  });

  it("includes meh chips when present", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), M("塩", 10), M("醤油", 30)],
      dogId: "pochi",
      seedKey: "x",
    });
    const html = buildOverlayHtml(r);
    expect(html).toContain("醤油");
  });
});
