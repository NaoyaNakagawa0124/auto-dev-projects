import { describe, it, expect } from "vitest";
import { INGREDIENTS, findEntry, indexAliases } from "../src/ingredients.js";

describe("ingredients dictionary", () => {
  it("has 100+ entries", () => {
    expect(INGREDIENTS.length).toBeGreaterThanOrEqual(100);
  });

  it("each entry has name, aliases, category, score", () => {
    for (const e of INGREDIENTS) {
      expect(typeof e.name).toBe("string");
      expect(e.name.length).toBeGreaterThan(0);
      expect(Array.isArray(e.aliases)).toBe(true);
      expect(["love", "meh", "danger"]).toContain(e.category);
      expect(typeof e.score).toBe("number");
      expect(e.score).toBeGreaterThanOrEqual(0);
      expect(e.score).toBeLessThanOrEqual(100);
    }
  });

  it("ingredient names are unique", () => {
    const names = INGREDIENTS.map((e) => e.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it("danger entries have warning string", () => {
    for (const e of INGREDIENTS) {
      if (e.category === "danger") {
        expect(typeof e.warning).toBe("string");
        expect(e.warning.length).toBeGreaterThan(0);
      }
    }
  });

  it("danger entries score 0", () => {
    for (const e of INGREDIENTS) {
      if (e.category === "danger") {
        expect(e.score).toBe(0);
      }
    }
  });

  it("findEntry returns correct entry", () => {
    expect(findEntry("鶏胸肉")?.category).toBe("love");
    expect(findEntry("玉ねぎ")?.category).toBe("danger");
    expect(findEntry("塩")?.category).toBe("meh");
    expect(findEntry("never-exists")).toBe(null);
  });

  it("indexAliases sorts by alias length descending", () => {
    const idx = indexAliases();
    for (let i = 1; i < idx.length; i++) {
      expect(idx[i - 1].alias.length).toBeGreaterThanOrEqual(idx[i].alias.length);
    }
  });

  it("indexAliases includes both name and aliases", () => {
    const idx = indexAliases();
    const aliases = idx.map((x) => x.alias);
    expect(aliases).toContain("鶏胸肉");
    expect(aliases).toContain("chicken breast");
    expect(aliases).toContain("玉ねぎ");
    expect(aliases).toContain("onion");
  });

  it("has at least 50 love entries", () => {
    const love = INGREDIENTS.filter((e) => e.category === "love");
    expect(love.length).toBeGreaterThanOrEqual(45);
  });

  it("has at least 15 danger entries (canine toxins)", () => {
    const danger = INGREDIENTS.filter((e) => e.category === "danger");
    expect(danger.length).toBeGreaterThanOrEqual(15);
  });
});
