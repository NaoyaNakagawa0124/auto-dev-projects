import { describe, it, expect } from "vitest";
import { auditAll, findBanned } from "../src/banned.js";
import { DOGS, PHRASES } from "../src/characters.js";
import { INGREDIENTS } from "../src/ingredients.js";

describe("banned.findBanned", () => {
  it("returns null when clean", () => {
    expect(findBanned("お利口 ポチ")).toBe(null);
    expect(findBanned("私 は 命 を 賭ける")).toBe(null);
  });

  it("flags banned words", () => {
    expect(findBanned("あなた を 殺す")).toBe("殺す");
    expect(findBanned("飼い主 失格")).toBe("飼い主 失格");
  });
});

describe("character phrases", () => {
  it("no phrase contains banned words", () => {
    const all = [];
    for (const voice of Object.values(PHRASES)) {
      for (const key of Object.keys(voice)) {
        const v = voice[key];
        if (Array.isArray(v)) all.push(...v);
        else if (typeof v === "string") all.push(v);
      }
    }
    const hits = auditAll(all);
    expect(hits).toEqual([]);
  });

  it("dog names are clean", () => {
    const names = Object.values(DOGS).map((d) => d.name);
    expect(auditAll(names)).toEqual([]);
  });

  it("dog descriptions are clean", () => {
    const descs = Object.values(DOGS).flatMap((d) => [d.breed, d.sign]);
    expect(auditAll(descs)).toEqual([]);
  });
});

describe("ingredient descriptions", () => {
  it("danger warnings are factual but not melodramatic", () => {
    const warnings = INGREDIENTS.filter((e) => e.warning).map((e) => e.warning);
    expect(warnings.length).toBeGreaterThan(0);
    const hits = auditAll(warnings);
    expect(hits).toEqual([]);
  });

  it("ingredient names are clean", () => {
    const names = INGREDIENTS.map((e) => e.name);
    expect(auditAll(names)).toEqual([]);
  });
});
