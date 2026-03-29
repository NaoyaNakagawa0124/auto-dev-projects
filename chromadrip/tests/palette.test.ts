import { describe, test, expect } from "bun:test";
import {
  generatePalette, MOODS, SEASONS, FABRICS,
  getMoodEmoji, getCurrentSeason,
  type Mood, type Season, type FabricType,
} from "../src/palette";

describe("Palette Generation", () => {
  test("generates 5 colors", () => {
    const p = generatePalette("serene", "spring", 2, "neon_mesh");
    expect(p.colors.length).toBe(5);
  });

  test("colors have valid hex", () => {
    const p = generatePalette("fierce", "summer", 14, "bio_silk");
    for (const c of p.colors) {
      expect(c.hex).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  test("colors have valid RGB", () => {
    const p = generatePalette("dreamy", "winter", 3, "aurora_weave");
    for (const c of p.colors) {
      expect(c.r).toBeGreaterThanOrEqual(0);
      expect(c.r).toBeLessThanOrEqual(255);
      expect(c.g).toBeGreaterThanOrEqual(0);
      expect(c.g).toBeLessThanOrEqual(255);
      expect(c.b).toBeGreaterThanOrEqual(0);
      expect(c.b).toBeLessThanOrEqual(255);
    }
  });

  test("colors have glow 0-1", () => {
    const p = generatePalette("electric", "autumn", 1, "neon_mesh");
    for (const c of p.colors) {
      expect(c.glow).toBeGreaterThanOrEqual(0);
      expect(c.glow).toBeLessThanOrEqual(1);
    }
  });

  test("colors have names", () => {
    const p = generatePalette("zen", "spring", 12, "void_fiber");
    for (const c of p.colors) {
      expect(c.name.length).toBeGreaterThan(0);
    }
  });

  test("palette has metadata", () => {
    const p = generatePalette("romantic", "winter", 23, "liquid_crystal");
    expect(p.mood).toBe("romantic");
    expect(p.season).toBe("winter");
    expect(p.hour).toBe(23);
    expect(p.fabric).toBe("liquid_crystal");
    expect(p.name.length).toBeGreaterThan(0);
    expect(p.description.length).toBeGreaterThan(0);
  });

  test("night hours enhance glow", () => {
    const day = generatePalette("serene", "summer", 14, "neon_mesh");
    const night = generatePalette("serene", "summer", 2, "neon_mesh");
    const avgGlowDay = day.colors.reduce((s, c) => s + c.glow, 0) / 5;
    const avgGlowNight = night.colors.reduce((s, c) => s + c.glow, 0) / 5;
    expect(avgGlowNight).toBeGreaterThan(avgGlowDay);
  });

  test("night description mentions bioluminescent", () => {
    const p = generatePalette("mysterious", "winter", 3, "aurora_weave");
    expect(p.description.toLowerCase()).toContain("glow");
  });

  test("different moods produce different palettes", () => {
    const p1 = generatePalette("serene", "spring", 12, "bio_silk");
    const p2 = generatePalette("fierce", "spring", 12, "bio_silk");
    const hexes1 = p1.colors.map(c => c.hex).join(",");
    const hexes2 = p2.colors.map(c => c.hex).join(",");
    expect(hexes1).not.toBe(hexes2);
  });

  test("different seasons produce different palettes", () => {
    const p1 = generatePalette("zen", "spring", 12, "neon_mesh");
    const p2 = generatePalette("zen", "winter", 12, "neon_mesh");
    expect(p1.colors[0].hex).not.toBe(p2.colors[0].hex);
  });

  test("different fabrics have different glow", () => {
    const neon = generatePalette("energized", "summer", 2, "neon_mesh");
    const voidF = generatePalette("energized", "summer", 2, "void_fiber");
    const glowNeon = neon.colors.reduce((s, c) => s + c.glow, 0);
    const glowVoid = voidF.colors.reduce((s, c) => s + c.glow, 0);
    expect(glowNeon).toBeGreaterThan(glowVoid);
  });
});

describe("Constants", () => {
  test("12 moods", () => {
    expect(MOODS.length).toBe(12);
  });

  test("4 seasons", () => {
    expect(SEASONS.length).toBe(4);
  });

  test("5 fabrics", () => {
    expect(FABRICS.length).toBe(5);
  });

  test("all moods have emojis", () => {
    for (const m of MOODS) {
      expect(getMoodEmoji(m).length).toBeGreaterThan(0);
    }
  });

  test("getCurrentSeason returns valid", () => {
    expect(SEASONS).toContain(getCurrentSeason());
  });
});

describe("All Combinations", () => {
  test("every mood generates valid palette", () => {
    for (const mood of MOODS) {
      const p = generatePalette(mood, "summer", 14, "neon_mesh");
      expect(p.colors.length).toBe(5);
      expect(p.mood).toBe(mood);
    }
  });

  test("every season generates valid palette", () => {
    for (const season of SEASONS) {
      const p = generatePalette("serene", season, 14, "bio_silk");
      expect(p.colors.length).toBe(5);
    }
  });

  test("every fabric generates valid palette", () => {
    for (const fabric of FABRICS) {
      const p = generatePalette("electric", "winter", 3, fabric);
      expect(p.colors.length).toBe(5);
    }
  });

  test("every hour 0-23 generates valid palette", () => {
    for (let h = 0; h < 24; h++) {
      const p = generatePalette("dreamy", "autumn", h, "aurora_weave");
      expect(p.colors.length).toBe(5);
    }
  });
});
