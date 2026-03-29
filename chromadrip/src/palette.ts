/**
 * ChromaDrip — Mood-based palette generation for 2035 smart fabrics.
 */

export type Mood =
  | "serene" | "energized" | "melancholy" | "focused"
  | "playful" | "mysterious" | "romantic" | "fierce"
  | "dreamy" | "rebellious" | "zen" | "electric";

export type Season = "spring" | "summer" | "autumn" | "winter";

export type FabricType = "neon_mesh" | "liquid_crystal" | "bio_silk" | "aurora_weave" | "void_fiber";

export interface Color {
  hex: string;
  r: number;
  g: number;
  b: number;
  name: string;
  glow: number; // 0-1 bioluminescence intensity
}

export interface Palette {
  colors: Color[];
  mood: Mood;
  season: Season;
  hour: number;
  fabric: FabricType;
  name: string;
  description: string;
}

// Base hue ranges for each mood (in degrees, 0-360)
const MOOD_HUES: Record<Mood, { base: number; spread: number; saturation: number; lightness: number }> = {
  serene:     { base: 200, spread: 30, saturation: 40, lightness: 60 },
  energized:  { base: 30, spread: 40, saturation: 80, lightness: 55 },
  melancholy: { base: 240, spread: 20, saturation: 30, lightness: 35 },
  focused:    { base: 210, spread: 15, saturation: 50, lightness: 45 },
  playful:    { base: 320, spread: 60, saturation: 70, lightness: 65 },
  mysterious: { base: 270, spread: 25, saturation: 45, lightness: 30 },
  romantic:   { base: 340, spread: 30, saturation: 55, lightness: 55 },
  fierce:     { base: 0, spread: 20, saturation: 85, lightness: 45 },
  dreamy:     { base: 280, spread: 40, saturation: 35, lightness: 70 },
  rebellious: { base: 160, spread: 50, saturation: 75, lightness: 40 },
  zen:        { base: 150, spread: 20, saturation: 25, lightness: 65 },
  electric:   { base: 55, spread: 30, saturation: 90, lightness: 50 },
};

const SEASON_SHIFT: Record<Season, { hueShift: number; satMod: number; lightMod: number }> = {
  spring: { hueShift: 10, satMod: 1.1, lightMod: 1.15 },
  summer: { hueShift: -10, satMod: 1.2, lightMod: 1.0 },
  autumn: { hueShift: -20, satMod: 0.85, lightMod: 0.9 },
  winter: { hueShift: 20, satMod: 0.7, lightMod: 0.8 },
};

const FABRIC_GLOW: Record<FabricType, { glowMod: number; label: string }> = {
  neon_mesh:      { glowMod: 0.9, label: "Neon Mesh" },
  liquid_crystal: { glowMod: 0.7, label: "Liquid Crystal" },
  bio_silk:       { glowMod: 0.4, label: "Bio-Silk" },
  aurora_weave:   { glowMod: 0.8, label: "Aurora Weave" },
  void_fiber:     { glowMod: 0.2, label: "Void Fiber" },
};

const COLOR_NAMES = [
  "Midnight Pulse", "Dawn Ember", "Neon Dew", "Plasma Drift",
  "Starfall", "Velvet Haze", "Quantum Blush", "Deep Current",
  "Solar Whisper", "Lunar Glow", "Void Silk", "Petal Circuit",
  "Storm Thread", "Frost Byte", "Bio Amber", "Aurora Thread",
  "Echo Violet", "Drift Coral", "Shade Moss", "Crystal Noir",
];

export const MOODS: Mood[] = [
  "serene", "energized", "melancholy", "focused", "playful",
  "mysterious", "romantic", "fierce", "dreamy", "rebellious", "zen", "electric",
];

export const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];
export const FABRICS: FabricType[] = ["neon_mesh", "liquid_crystal", "bio_silk", "aurora_weave", "void_fiber"];

export function generatePalette(mood: Mood, season: Season, hour: number, fabric: FabricType): Palette {
  const moodConfig = MOOD_HUES[mood];
  const seasonConfig = SEASON_SHIFT[season];
  const fabricConfig = FABRIC_GLOW[fabric];

  // Night shift: hours 0-6 boost glow, shift hue toward cooler tones
  const isNight = hour >= 22 || hour < 6;
  const nightShift = isNight ? 15 : 0;
  const nightGlow = isNight ? 0.3 : 0;

  const colors: Color[] = [];
  for (let i = 0; i < 5; i++) {
    const hueOffset = (i - 2) * (moodConfig.spread / 4);
    const hue = (moodConfig.base + hueOffset + seasonConfig.hueShift + nightShift + 360) % 360;
    const sat = clamp(moodConfig.saturation * seasonConfig.satMod + (i * 3), 10, 100);
    const light = clamp(moodConfig.lightness * seasonConfig.lightMod + (i * 5) - 10, 10, 90);
    const glow = clamp(fabricConfig.glowMod * (0.5 + i * 0.1) + nightGlow, 0, 1);

    const { r, g, b } = hslToRgb(hue, sat, light);
    const hex = rgbToHex(r, g, b);
    const name = COLOR_NAMES[(Math.floor(hue / 20) + i + MOODS.indexOf(mood)) % COLOR_NAMES.length];

    colors.push({ hex, r, g, b, name, glow: Math.round(glow * 100) / 100 });
  }

  const paletteName = `${capitalize(mood)} ${capitalize(season)} ${fabricConfig.label}`;
  const timeDesc = isNight ? "bioluminescent night mode" : "daylight reactive";
  const description = `A ${mood} palette for ${season} 2035, optimized for ${fabricConfig.label} in ${timeDesc}. ${
    isNight ? "Enhanced glow for after-dark wear." : "UV-reactive for outdoor visibility."
  }`;

  return { colors, mood, season, hour, fabric, name: paletteName, description };
}

export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getMoodEmoji(mood: Mood): string {
  const emojis: Record<Mood, string> = {
    serene: "\u{1F30A}", energized: "\u{26A1}", melancholy: "\u{1F319}", focused: "\u{1F3AF}",
    playful: "\u{1F388}", mysterious: "\u{1F52E}", romantic: "\u{1F495}", fierce: "\u{1F525}",
    dreamy: "\u{2601}\u{FE0F}", rebellious: "\u{1F47E}", zen: "\u{1F343}", electric: "\u{1F4A5}",
  };
  return emojis[mood] || "\u{1F3A8}";
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
