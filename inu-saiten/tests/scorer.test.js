import { describe, it, expect } from "vitest";
import { scoreIngredients, starsFromScore, starsToText } from "../src/scorer.js";

function L(name, score) {
  return { name, category: "love", score };
}
function M(name, score) {
  return { name, category: "meh", score };
}
function D(name) {
  return { name, category: "danger", score: 0 };
}

describe("scorer.scoreIngredients", () => {
  it("returns null for empty input", () => {
    expect(scoreIngredients([])).toBe(null);
  });

  it("all-love recipe scores high", () => {
    const r = scoreIngredients([L("鶏胸肉", 95), L("ささみ", 90), L("鶏もも肉", 92)]);
    expect(r.score).toBeGreaterThanOrEqual(95);
    expect(r.dangerCount).toBe(0);
    expect(r.loveCount).toBe(3);
  });

  it("one danger caps at 80", () => {
    const r = scoreIngredients([L("鶏胸肉", 95), L("ささみ", 90), D("玉ねぎ")]);
    expect(r.score).toBeLessThanOrEqual(80);
    expect(r.dangerCount).toBe(1);
    expect(r.capped).toBe(true);
  });

  it("two dangers cap at 60", () => {
    const r = scoreIngredients([L("鶏胸肉", 95), D("玉ねぎ"), D("ニンニク")]);
    expect(r.score).toBeLessThanOrEqual(60);
    expect(r.dangerCount).toBe(2);
    expect(r.capped).toBe(true);
  });

  it("three+ dangers cap at 50", () => {
    const r = scoreIngredients([
      L("鶏胸肉", 95),
      D("玉ねぎ"),
      D("ニンニク"),
      D("チョコレート"),
    ]);
    expect(r.score).toBeLessThanOrEqual(50);
    expect(r.dangerCount).toBe(3);
  });

  it("meh-only stays around 40-60", () => {
    const r = scoreIngredients([M("塩", 10), M("砂糖", 25), M("醤油", 30)]);
    expect(r.score).toBeGreaterThanOrEqual(40);
    expect(r.score).toBeLessThanOrEqual(60);
  });

  it("danger-only depresses score", () => {
    const r = scoreIngredients([D("玉ねぎ"), D("ニンニク")]);
    expect(r.score).toBeLessThanOrEqual(40);
  });

  it("love avg 90+ adds bonus", () => {
    const r = scoreIngredients([L("鶏胸肉", 95), L("ささみ", 90), L("鶏もも肉", 92)]);
    expect(r.score).toBeGreaterThanOrEqual(95);
  });

  it("score is in 0-100 range", () => {
    const inputs = [
      [L("a", 50)],
      [L("a", 95), L("b", 95), L("c", 95), D("x"), D("y"), D("z")],
      [M("a", 10), M("b", 10)],
      [D("x")],
    ];
    for (const ingr of inputs) {
      const r = scoreIngredients(ingr);
      if (r) {
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("stars computed correctly", () => {
    expect(scoreIngredients([L("a", 95), L("b", 95)]).stars).toBe(5);
  });
});

describe("scorer.starsFromScore", () => {
  it("maps to 5 levels", () => {
    expect(starsFromScore(100)).toBe(5);
    expect(starsFromScore(90)).toBe(5);
    expect(starsFromScore(80)).toBe(4);
    expect(starsFromScore(75)).toBe(4);
    expect(starsFromScore(74)).toBe(3);
    expect(starsFromScore(55)).toBe(3);
    expect(starsFromScore(54)).toBe(2);
    expect(starsFromScore(35)).toBe(2);
    expect(starsFromScore(34)).toBe(1);
    expect(starsFromScore(0)).toBe(1);
  });
});

describe("scorer.starsToText", () => {
  it("uses ★ and ☆", () => {
    expect(starsToText(3)).toBe("★★★☆☆");
    expect(starsToText(5)).toBe("★★★★★");
    expect(starsToText(0)).toBe("☆☆☆☆☆");
  });
});
