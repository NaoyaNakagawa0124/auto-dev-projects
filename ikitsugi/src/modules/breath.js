// 呼吸エンジン — pure logic, no DOM or Chrome APIs.

/** @typedef {{ inhale:number, hold_in:number, exhale:number, hold_out:number }} BreathPattern */

/** @type {Record<string, BreathPattern>} */
export const PATTERNS = {
  box:  { inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 }, // box / square breathing
  r478: { inhale: 4, hold_in: 7, exhale: 8, hold_out: 0 }, // 4-7-8 relaxation
  f448: { inhale: 4, hold_in: 4, exhale: 8, hold_out: 0 }, // 4-4-8 focus
};

export const PATTERN_LABELS_JP = {
  box:  "ボックス呼吸 (4-4-4-4)",
  r478: "リラックス呼吸 (4-7-8)",
  f448: "集中呼吸 (4-4-8)",
};

export const PHASE_LABELS_JP = {
  inhale: "吸う",
  hold_in: "止める",
  exhale: "吐く",
  hold_out: "止める",
};

export function getPattern(id) {
  return PATTERNS[id] ?? PATTERNS.box;
}

/** Total cycle length in seconds. */
export function cycleLength(pattern) {
  return pattern.inhale + pattern.hold_in + pattern.exhale + pattern.hold_out;
}

/** Compute the phase at time `t` (seconds, can wrap past the cycle). */
export function phaseAt(pattern, t) {
  const len = cycleLength(pattern);
  if (len <= 0) return "inhale";
  let local = t % len;
  if (local < 0) local += len;
  if (local < pattern.inhale) return "inhale";
  if (local < pattern.inhale + pattern.hold_in) return "hold_in";
  if (local < pattern.inhale + pattern.hold_in + pattern.exhale) return "exhale";
  return "hold_out";
}

/** Compute how far into the current phase the player is, 0..1. */
export function phaseProgress(pattern, t) {
  const len = cycleLength(pattern);
  if (len <= 0) return 0;
  let local = t % len;
  if (local < 0) local += len;
  if (local < pattern.inhale) return local / pattern.inhale;
  local -= pattern.inhale;
  if (local < pattern.hold_in) return pattern.hold_in === 0 ? 0 : local / pattern.hold_in;
  local -= pattern.hold_in;
  if (local < pattern.exhale) return local / pattern.exhale;
  local -= pattern.exhale;
  return pattern.hold_out === 0 ? 0 : local / pattern.hold_out;
}

/** Compute a 0..1 "fullness" scale for the lung. 0 = empty, 1 = full. */
export function fullnessAt(pattern, t) {
  const phase = phaseAt(pattern, t);
  const p = phaseProgress(pattern, t);
  switch (phase) {
    case "inhale":   return p;                   // 0 → 1
    case "hold_in":  return 1;                   // stay full
    case "exhale":   return 1 - p;               // 1 → 0
    case "hold_out": return 0;                   // stay empty
  }
  return 0;
}

/** Map fullness to a visual radius scale (0.4..1.0 by default). */
export function scaleAt(pattern, t, opts = {}) {
  const min = opts.min ?? 0.4;
  const max = opts.max ?? 1.0;
  return min + (max - min) * fullnessAt(pattern, t);
}

/** Color at phase — amber on inhale, blue on exhale. */
export function colorAt(pattern, t) {
  const phase = phaseAt(pattern, t);
  const p = phaseProgress(pattern, t);
  // inhale: blue→amber; exhale: amber→blue; holds: blend
  const amber = [245, 200, 74];
  const blue  = [130, 192, 255];
  let mix = 0.5;
  if (phase === "inhale") mix = p;
  else if (phase === "exhale") mix = 1 - p;
  else if (phase === "hold_in") mix = 1;
  else if (phase === "hold_out") mix = 0;
  const r = Math.round(blue[0] * (1 - mix) + amber[0] * mix);
  const g = Math.round(blue[1] * (1 - mix) + amber[1] * mix);
  const b = Math.round(blue[2] * (1 - mix) + amber[2] * mix);
  return `rgb(${r}, ${g}, ${b})`;
}

/** How many full cycles fit into `seconds`? */
export function cyclesIn(pattern, seconds) {
  const len = cycleLength(pattern);
  if (len <= 0) return 0;
  return Math.floor(seconds / len);
}
