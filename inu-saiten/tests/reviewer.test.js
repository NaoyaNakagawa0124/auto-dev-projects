import { describe, it, expect } from "vitest";
import { DOG_IDS, getDog, PHRASES } from "../src/characters.js";
import { buildReview } from "../src/reviewer.js";

function L(name, score) {
  return { name, category: "love", score };
}
function M(name, score) {
  return { name, category: "meh", score };
}
function D(name) {
  return { name, category: "danger", score: 0 };
}

describe("characters", () => {
  it("has 4 dogs", () => {
    expect(DOG_IDS.length).toBe(4);
    expect(DOG_IDS).toEqual(["pochi", "maro", "taro", "john"]);
  });

  it("each dog has voice that maps to phrase pool", () => {
    for (const id of DOG_IDS) {
      const d = getDog(id);
      expect(PHRASES[d.voice]).toBeDefined();
      expect(Array.isArray(PHRASES[d.voice].open_great)).toBe(true);
    }
  });

  it("getDog falls back to pochi for unknown id", () => {
    expect(getDog("unknown")?.id).toBe("pochi");
  });
});

describe("reviewer.buildReview", () => {
  it("returns empty review for no entries", () => {
    const r = buildReview({ entries: [], dogId: "pochi", seedKey: "x" });
    expect(r.empty).toBe(true);
  });

  it("includes love picks", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), L("ささみ", 90), M("塩", 10)],
      dogId: "pochi",
      seedKey: "url1",
    });
    expect(r.empty).toBe(false);
    expect(r.lovePicks.map((e) => e.name)).toContain("鶏胸肉");
  });

  it("includes danger picks", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), D("玉ねぎ")],
      dogId: "pochi",
      seedKey: "url1",
    });
    expect(r.dangerPicks.map((e) => e.name)).toContain("玉ねぎ");
  });

  it("paragraph mentions a love ingredient name", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95)],
      dogId: "pochi",
      seedKey: "url1",
    });
    expect(r.paragraph).toContain("鶏胸肉");
  });

  it("paragraph mentions a danger ingredient name", () => {
    const r = buildReview({
      entries: [L("鶏胸肉", 95), D("玉ねぎ")],
      dogId: "maro",
      seedKey: "url2",
    });
    expect(r.paragraph).toContain("玉ねぎ");
  });

  it("paragraph ends with the dog sign-off", () => {
    for (const id of DOG_IDS) {
      const r = buildReview({
        entries: [L("鶏胸肉", 95), D("玉ねぎ")],
        dogId: id,
        seedKey: "url",
      });
      const sign = PHRASES[getDog(id).voice].sign;
      expect(r.paragraph.endsWith(sign)).toBe(true);
    }
  });

  it("deterministic for same (entries, dog, seedKey)", () => {
    const args = {
      entries: [L("鶏胸肉", 95), L("ささみ", 90), D("玉ねぎ"), M("塩", 10)],
      dogId: "pochi",
      seedKey: "https://example.com/r/123",
    };
    const a = buildReview(args);
    const b = buildReview(args);
    expect(a.paragraph).toBe(b.paragraph);
    expect(a.score).toBe(b.score);
  });

  it("varies by seedKey", () => {
    const e = [L("鶏胸肉", 95), L("ささみ", 90), L("鶏もも肉", 92), L("鶏ガラ", 85), D("玉ねぎ")];
    const paragraphs = new Set();
    for (let i = 0; i < 6; i++) {
      const r = buildReview({ entries: e, dogId: "pochi", seedKey: "seed-" + i });
      paragraphs.add(r.paragraph);
    }
    expect(paragraphs.size).toBeGreaterThanOrEqual(2);
  });

  it("taro's bias raises score", () => {
    const e = [L("鶏胸肉", 60)];
    const pochi = buildReview({ entries: e, dogId: "pochi", seedKey: "x" });
    const taro = buildReview({ entries: e, dogId: "taro", seedKey: "x" });
    expect(taro.score).toBeGreaterThan(pochi.score);
  });

  it("score within 0-100", () => {
    const e = [L("a", 100), L("b", 100), L("c", 100)];
    const r = buildReview({ entries: e, dogId: "taro", seedKey: "y" });
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });

  it("counts include love/meh/danger", () => {
    const r = buildReview({
      entries: [L("a", 50), M("b", 20), D("c"), L("d", 70)],
      dogId: "pochi",
      seedKey: "z",
    });
    expect(r.counts.love).toBe(2);
    expect(r.counts.meh).toBe(1);
    expect(r.counts.danger).toBe(1);
    expect(r.counts.total).toBe(4);
  });
});
