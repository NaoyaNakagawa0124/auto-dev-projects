// ChakraForge Unit Tests (Node.js)
// Tests the pure logic functions extracted from sketch.js

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// ===== Replicate core logic for testing =====

const TECHNIQUES = {
  flame:     { name: "Flame",     unlockXP: 0,  rank: "Apprentice", color: [255, 68, 68] },
  lightning: { name: "Lightning", unlockXP: 10, rank: "Initiate",   color: [100, 180, 255] },
  void:      { name: "Void",      unlockXP: 25, rank: "Adept",      color: [168, 85, 247] },
  sakura:    { name: "Sakura",    unlockXP: 50, rank: "Sage",       color: [255, 150, 180] },
  cosmic:    { name: "Cosmic",    unlockXP: 80, rank: "Master",     color: [0, 221, 170] },
};

const TECHNIQUE_KEYS = ["flame", "lightning", "void", "sakura", "cosmic"];

function getCurrentRank(unlockedTechniques) {
  let rank = "Apprentice";
  for (const key of TECHNIQUE_KEYS) {
    if (unlockedTechniques.includes(key)) {
      rank = TECHNIQUES[key].rank;
    }
  }
  return rank;
}

function getNextUnlock(unlockedTechniques) {
  for (const key of TECHNIQUE_KEYS) {
    if (!unlockedTechniques.includes(key)) {
      return { key, tech: TECHNIQUES[key] };
    }
  }
  return null;
}

function getUnlocksForXP(xp) {
  const unlocked = [];
  for (const key of TECHNIQUE_KEYS) {
    if (xp >= TECHNIQUES[key].unlockXP) {
      unlocked.push(key);
    }
  }
  return unlocked;
}

function constrainValue(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ===== Tests =====

describe("Technique Definitions", () => {
  assert(TECHNIQUE_KEYS.length === 5, "should have 5 techniques");
  assert(TECHNIQUES.flame.unlockXP === 0, "flame unlocks at 0 XP");
  assert(TECHNIQUES.cosmic.unlockXP === 80, "cosmic unlocks at 80 XP");
  assert(TECHNIQUES.flame.rank === "Apprentice", "flame rank is Apprentice");
  assert(TECHNIQUES.cosmic.rank === "Master", "cosmic rank is Master");
});

describe("Unlock Order", () => {
  const thresholds = TECHNIQUE_KEYS.map((k) => TECHNIQUES[k].unlockXP);
  for (let i = 1; i < thresholds.length; i++) {
    assert(thresholds[i] > thresholds[i - 1], `${TECHNIQUE_KEYS[i]} unlocks after ${TECHNIQUE_KEYS[i - 1]}`);
  }
});

describe("getCurrentRank", () => {
  assert(getCurrentRank(["flame"]) === "Apprentice", "only flame = Apprentice");
  assert(getCurrentRank(["flame", "lightning"]) === "Initiate", "flame+lightning = Initiate");
  assert(getCurrentRank(["flame", "lightning", "void"]) === "Adept", "through void = Adept");
  assert(getCurrentRank(["flame", "lightning", "void", "sakura", "cosmic"]) === "Master", "all unlocked = Master");
});

describe("getNextUnlock", () => {
  const next1 = getNextUnlock(["flame"]);
  assert(next1.key === "lightning", "after flame, next is lightning");
  assert(next1.tech.unlockXP === 10, "lightning unlocks at 10 XP");

  const next2 = getNextUnlock(["flame", "lightning", "void"]);
  assert(next2.key === "sakura", "after void, next is sakura");

  const next3 = getNextUnlock(["flame", "lightning", "void", "sakura", "cosmic"]);
  assert(next3 === null, "all unlocked returns null");
});

describe("getUnlocksForXP", () => {
  assert(getUnlocksForXP(0).length === 1, "0 XP unlocks only flame");
  assert(getUnlocksForXP(0)[0] === "flame", "0 XP includes flame");
  assert(getUnlocksForXP(10).length === 2, "10 XP unlocks flame + lightning");
  assert(getUnlocksForXP(25).includes("void"), "25 XP includes void");
  assert(getUnlocksForXP(80).length === 5, "80 XP unlocks all");
  assert(getUnlocksForXP(79).length === 4, "79 XP unlocks all except cosmic");
});

describe("Intensity Constraints", () => {
  assert(constrainValue(50, 10, 100) === 50, "50 stays at 50");
  assert(constrainValue(5, 10, 100) === 10, "5 clamps to 10");
  assert(constrainValue(150, 10, 100) === 100, "150 clamps to 100");
  assert(constrainValue(10, 10, 100) === 10, "10 stays at boundary");
  assert(constrainValue(100, 10, 100) === 100, "100 stays at boundary");
});

describe("Color Definitions", () => {
  for (const key of TECHNIQUE_KEYS) {
    const c = TECHNIQUES[key].color;
    assert(Array.isArray(c) && c.length === 3, `${key} has RGB color array`);
    assert(c.every((v) => v >= 0 && v <= 255), `${key} colors in valid range`);
  }
});

// ===== Results =====
console.log(`\n${"=".repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log("=".repeat(40));

process.exit(failed > 0 ? 1 : 0);
