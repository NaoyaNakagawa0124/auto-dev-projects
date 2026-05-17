/**
 * Score a list of detected ingredient entries.
 * Returns { score: 0-100, stars: 1-5, dangerCount, loveCount, mehCount, capped }.
 *
 * Rules:
 * - danger >= 1 caps at 80
 * - danger >= 2 caps at 60
 * - danger >= 3 caps at 50
 * - love avg >= 80 → +5 bonus; >= 90 → +10
 * - meh-only baseline lands 40-60
 * - empty → null
 */
export function scoreIngredients(entries) {
  if (!entries.length) return null;
  const love = entries.filter((e) => e.category === "love");
  const meh = entries.filter((e) => e.category === "meh");
  const danger = entries.filter((e) => e.category === "danger");

  let base;
  if (love.length === 0 && meh.length > 0 && danger.length === 0) {
    // meh only: clamp around 40-60 based on count
    base = 40 + Math.min(20, meh.length * 3);
  } else if (love.length === 0 && danger.length > 0) {
    base = 30; // depressing recipe
  } else if (love.length === 0) {
    base = 50;
  } else {
    const loveAvg = love.reduce((s, e) => s + e.score, 0) / love.length;
    base = Math.round(loveAvg);
    if (loveAvg >= 90) base += 10;
    else if (loveAvg >= 80) base += 5;
  }

  // Penalize for many meh
  if (meh.length >= 8 && love.length > 0) {
    base -= 3;
  }

  // Reward variety in love
  if (love.length >= 4) {
    base += 3;
  }

  // Cap from danger
  let cap = 100;
  if (danger.length >= 3) cap = 50;
  else if (danger.length === 2) cap = 60;
  else if (danger.length === 1) cap = 80;
  const capped = base > cap;
  const finalScore = Math.max(0, Math.min(100, Math.min(base, cap)));

  return {
    score: finalScore,
    stars: starsFromScore(finalScore),
    loveCount: love.length,
    mehCount: meh.length,
    dangerCount: danger.length,
    capped,
  };
}

export function starsFromScore(score) {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 55) return 3;
  if (score >= 35) return 2;
  return 1;
}

export function starsToText(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}
