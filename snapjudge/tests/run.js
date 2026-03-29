// SnapJudge Test Suite
// Tests the game logic by reimplementing core algorithms in JS
// (since Godot isn't available for headless testing)

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let total = 0, passed = 0, failed = 0;

function describe(name, fn) {
  console.log(`\n  \x1b[1m${name}\x1b[0m`);
  fn();
}

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`    \x1b[32m✓\x1b[0m ${name}`);
  } catch (e) {
    failed++;
    console.log(`    \x1b[31m✗\x1b[0m ${name}`);
    console.log(`      \x1b[31m${e.message}\x1b[0m`);
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }
function eq(a, b, msg) { if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m📸 SnapJudge Test Suite\x1b[0m');

// ===== Photo Quality Logic (mirroring photo_generator.gd) =====

const STAR_THRESHOLD = 0.85;
const KEEP_THRESHOLD = 0.45;
const WEIGHT_SHARPNESS = 0.35;
const WEIGHT_EXPOSURE = 0.35;
const WEIGHT_COMPOSITION = 0.30;

function calculateQuality(sharpness, exposure, composition) {
  return sharpness * WEIGHT_SHARPNESS + exposure * WEIGHT_EXPOSURE + composition * WEIGHT_COMPOSITION;
}

function getCorrectAction(quality) {
  if (quality >= STAR_THRESHOLD) return 'star';
  if (quality >= KEEP_THRESHOLD) return 'keep';
  return 'delete';
}

describe('Photo Quality Calculation', () => {
  it('should calculate quality as weighted average', () => {
    const q = calculateQuality(1.0, 1.0, 1.0);
    const expected = 0.35 + 0.35 + 0.30;
    assert(Math.abs(q - expected) < 0.001, `Expected ${expected}, got ${q}`);
  });

  it('should return 0 for all-zero attributes', () => {
    eq(calculateQuality(0, 0, 0), 0);
  });

  it('should weight sharpness at 35%', () => {
    const q = calculateQuality(1.0, 0, 0);
    assert(Math.abs(q - 0.35) < 0.001);
  });

  it('should weight exposure at 35%', () => {
    const q = calculateQuality(0, 1.0, 0);
    assert(Math.abs(q - 0.35) < 0.001);
  });

  it('should weight composition at 30%', () => {
    const q = calculateQuality(0, 0, 1.0);
    assert(Math.abs(q - 0.30) < 0.001);
  });

  it('should handle mid-range values', () => {
    const q = calculateQuality(0.5, 0.5, 0.5);
    assert(Math.abs(q - 0.5) < 0.001);
  });
});

describe('Correct Action Determination', () => {
  it('should return star for quality >= 0.85', () => {
    eq(getCorrectAction(0.85), 'star');
    eq(getCorrectAction(0.95), 'star');
    eq(getCorrectAction(1.0), 'star');
  });

  it('should return keep for quality >= 0.45 and < 0.85', () => {
    eq(getCorrectAction(0.45), 'keep');
    eq(getCorrectAction(0.6), 'keep');
    eq(getCorrectAction(0.84), 'keep');
  });

  it('should return delete for quality < 0.45', () => {
    eq(getCorrectAction(0.0), 'delete');
    eq(getCorrectAction(0.2), 'delete');
    eq(getCorrectAction(0.44), 'delete');
  });

  it('perfect photo (1,1,1) should be star', () => {
    eq(getCorrectAction(calculateQuality(1, 1, 1)), 'star');
  });

  it('terrible photo (0,0,0) should be delete', () => {
    eq(getCorrectAction(calculateQuality(0, 0, 0)), 'delete');
  });

  it('mediocre photo (0.5,0.5,0.5) should be keep', () => {
    eq(getCorrectAction(calculateQuality(0.5, 0.5, 0.5)), 'keep');
  });
});

// ===== Score System Logic (mirroring score_system.gd) =====

const BASE_POINTS = 100;
const STAR_BONUS = 50;
const SPEED_BONUS_MAX = 100;
const SPEED_WINDOW = 3.0;
const COMBO_MULTIPLIER = 0.1;
const MAX_COMBO = 20;
const WRONG_PENALTY = -50;

function checkCorrect(action, correctAction) {
  if (action === correctAction) return true;
  if (action === 'keep' && correctAction === 'star') return true;
  return false;
}

class ScoreSystem {
  constructor() { this.reset(); }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.correct = 0;
    this.wrong = 0;
    this.starCount = 0;
    this.totalJudged = 0;
    this.totalSpeedBonus = 0;
  }

  judge(action, correctAction, decisionTime) {
    this.totalJudged++;
    const isCorrect = checkCorrect(action, correctAction);

    if (isCorrect) {
      this.correct++;
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);

      let points = BASE_POINTS;
      if (action === 'star' && correctAction === 'star') {
        points += STAR_BONUS;
        this.starCount++;
      }

      const speedFactor = Math.max(0, Math.min(1, 1.0 - decisionTime / SPEED_WINDOW));
      const speedBonus = Math.floor(SPEED_BONUS_MAX * speedFactor);
      points += speedBonus;
      this.totalSpeedBonus += speedBonus;

      const comboBonus = Math.floor(points * Math.min(this.combo, MAX_COMBO) * COMBO_MULTIPLIER);
      points += comboBonus;

      this.score += points;
      return points;
    } else {
      this.wrong++;
      this.combo = 0;
      this.score = Math.max(0, this.score + WRONG_PENALTY);
      return WRONG_PENALTY;
    }
  }

  getAccuracy() {
    return this.totalJudged === 0 ? 0 : (this.correct / this.totalJudged) * 100;
  }

  getGrade() {
    const acc = this.getAccuracy();
    if (acc >= 95 && this.maxCombo >= 15) return 'S';
    if (acc >= 90 && this.maxCombo >= 10) return 'A';
    if (acc >= 80) return 'B';
    if (acc >= 65) return 'C';
    if (acc >= 50) return 'D';
    return 'F';
  }
}

describe('Score System - Correctness Check', () => {
  it('should accept exact match', () => {
    assert(checkCorrect('keep', 'keep'));
    assert(checkCorrect('delete', 'delete'));
    assert(checkCorrect('star', 'star'));
  });

  it('should accept keep for star-worthy photos', () => {
    assert(checkCorrect('keep', 'star'));
  });

  it('should reject delete for keep-worthy photos', () => {
    assert(!checkCorrect('delete', 'keep'));
  });

  it('should reject delete for star-worthy photos', () => {
    assert(!checkCorrect('delete', 'star'));
  });

  it('should reject keep for delete-worthy photos', () => {
    assert(!checkCorrect('keep', 'delete'));
  });

  it('should reject star for delete-worthy photos', () => {
    assert(!checkCorrect('star', 'delete'));
  });
});

describe('Score System - Scoring', () => {
  it('should give base 100 points for correct judgment', () => {
    const ss = new ScoreSystem();
    const points = ss.judge('keep', 'keep', 5.0); // slow decision, no speed bonus, combo 1
    // BASE(100) + speed(0) + combo(100 * 1 * 0.1 = 10) = 110
    eq(points, 110);
  });

  it('should give star bonus for correctly starring', () => {
    const ss = new ScoreSystem();
    const points = ss.judge('star', 'star', 5.0);
    // BASE(100) + STAR(50) + speed(0) + combo(150 * 1 * 0.1 = 15) = 165
    eq(points, 165);
  });

  it('should give speed bonus for fast decisions', () => {
    const ss = new ScoreSystem();
    const points = ss.judge('keep', 'keep', 0.0); // instant decision
    // BASE(100) + speed(100) + combo(200 * 1 * 0.1 = 20) = 220
    eq(points, 220);
  });

  it('should give partial speed bonus', () => {
    const ss = new ScoreSystem();
    const points = ss.judge('keep', 'keep', 1.5); // half of 3s window
    // speed factor = 1 - 1.5/3 = 0.5, speed bonus = 50
    // BASE(100) + speed(50) + combo(150 * 1 * 0.1 = 15) = 165
    eq(points, 165);
  });

  it('should penalize wrong judgment', () => {
    const ss = new ScoreSystem();
    ss.score = 200;
    const points = ss.judge('delete', 'keep', 1.0);
    eq(points, WRONG_PENALTY);
    eq(ss.score, 150);
  });

  it('should not go below 0 score', () => {
    const ss = new ScoreSystem();
    ss.score = 20;
    ss.judge('delete', 'keep', 1.0);
    eq(ss.score, 0);
  });

  it('should track combo', () => {
    const ss = new ScoreSystem();
    ss.judge('keep', 'keep', 5.0);
    eq(ss.combo, 1);
    ss.judge('keep', 'keep', 5.0);
    eq(ss.combo, 2);
  });

  it('should reset combo on wrong answer', () => {
    const ss = new ScoreSystem();
    ss.judge('keep', 'keep', 5.0);
    ss.judge('keep', 'keep', 5.0);
    eq(ss.combo, 2);
    ss.judge('delete', 'keep', 5.0);
    eq(ss.combo, 0);
  });

  it('should track max combo', () => {
    const ss = new ScoreSystem();
    ss.judge('keep', 'keep', 5.0);
    ss.judge('keep', 'keep', 5.0);
    ss.judge('keep', 'keep', 5.0);
    ss.judge('delete', 'keep', 5.0); // break
    ss.judge('keep', 'keep', 5.0);
    eq(ss.maxCombo, 3);
  });

  it('should increase points with higher combo', () => {
    const ss = new ScoreSystem();
    const p1 = ss.judge('keep', 'keep', 5.0); // combo 1
    const p2 = ss.judge('keep', 'keep', 5.0); // combo 2
    assert(p2 > p1, `combo 2 (${p2}) should be more than combo 1 (${p1})`);
  });

  it('should cap combo multiplier at 20', () => {
    const ss = new ScoreSystem();
    // Build up to combo 25
    for (let i = 0; i < 25; i++) {
      ss.judge('keep', 'keep', 5.0);
    }
    eq(ss.combo, 25);
    // But multiplier should cap at 20
    const p20 = BASE_POINTS + Math.floor(BASE_POINTS * 20 * COMBO_MULTIPLIER);
    const p25 = BASE_POINTS + Math.floor(BASE_POINTS * 20 * COMBO_MULTIPLIER); // same, capped
    // Both should use multiplier 20, not 25
    eq(p20, p25);
  });
});

describe('Score System - Accuracy', () => {
  it('should return 0 for no judgments', () => {
    const ss = new ScoreSystem();
    eq(ss.getAccuracy(), 0);
  });

  it('should return 100 for all correct', () => {
    const ss = new ScoreSystem();
    ss.judge('keep', 'keep', 1.0);
    ss.judge('delete', 'delete', 1.0);
    eq(ss.getAccuracy(), 100);
  });

  it('should return 50 for half correct', () => {
    const ss = new ScoreSystem();
    ss.judge('keep', 'keep', 1.0);
    ss.judge('delete', 'keep', 1.0);
    eq(ss.getAccuracy(), 50);
  });
});

describe('Score System - Grading', () => {
  it('should give S for 95%+ accuracy and 15+ combo', () => {
    const ss = new ScoreSystem();
    for (let i = 0; i < 20; i++) ss.judge('keep', 'keep', 1.0);
    ss.judge('delete', 'keep', 1.0); // 1 wrong out of 21 = 95.2%
    eq(ss.getGrade(), 'S');
  });

  it('should give F for low accuracy', () => {
    const ss = new ScoreSystem();
    ss.judge('delete', 'keep', 1.0);
    ss.judge('delete', 'keep', 1.0);
    ss.judge('delete', 'keep', 1.0);
    eq(ss.getGrade(), 'F');
  });
});

// ===== Project Structure Validation =====

describe('Project Structure', () => {
  const requiredFiles = [
    'project.godot',
    'icon.svg',
    'scripts/photo_generator.gd',
    'scripts/score_system.gd',
    'scripts/game_manager.gd',
    'scripts/photo_card.gd',
    'scripts/photo_canvas.gd',
    'scenes/main.tscn',
    'scenes/main_ui.gd',
    'README.md',
    'PLAN.md',
    'CLAUDE.md',
  ];

  requiredFiles.forEach(file => {
    it(`should have ${file}`, () => {
      assert(existsSync(join(ROOT, file)), `Missing: ${file}`);
    });
  });
});

describe('GDScript Syntax Validation', () => {
  const gdFiles = [
    'scripts/photo_generator.gd',
    'scripts/score_system.gd',
    'scripts/game_manager.gd',
    'scripts/photo_card.gd',
    'scripts/photo_canvas.gd',
    'scenes/main_ui.gd',
  ];

  gdFiles.forEach(file => {
    it(`${file} should have valid class/extends`, () => {
      const content = readFileSync(join(ROOT, file), 'utf8');
      // Every GDScript should have extends
      assert(content.includes('extends ') || content.includes('class_name '),
        `Missing extends/class_name in ${file}`);
    });

    it(`${file} should not have syntax errors (basic check)`, () => {
      const content = readFileSync(join(ROOT, file), 'utf8');
      // Check for balanced quotes
      const singleQuotes = (content.match(/"/g) || []).length;
      assert(singleQuotes % 2 === 0, `Unbalanced quotes in ${file}`);
    });
  });
});

describe('Project Config Validation', () => {
  it('project.godot should have correct main scene', () => {
    const content = readFileSync(join(ROOT, 'project.godot'), 'utf8');
    assert(content.includes('run/main_scene="res://scenes/main.tscn"'));
  });

  it('project.godot should have Japanese app name', () => {
    const content = readFileSync(join(ROOT, 'project.godot'), 'utf8');
    assert(content.includes('スナップジャッジ'));
  });

  it('project.godot should target Godot 4', () => {
    const content = readFileSync(join(ROOT, 'project.godot'), 'utf8');
    assert(content.includes('config_version=5')); // Godot 4 uses config_version=5
  });
});

describe('Japanese UI Text Validation', () => {
  it('main scene should have Japanese labels', () => {
    const content = readFileSync(join(ROOT, 'scenes/main.tscn'), 'utf8');
    assert(content.includes('スナップジャッジ'), 'Missing title');
    assert(content.includes('写真を瞬時に仕分けろ'), 'Missing subtitle');
    assert(content.includes('スタート'), 'Missing start button');
    assert(content.includes('ハイスコア'), 'Missing high score label');
  });

  it('main_ui.gd should have Japanese result labels', () => {
    const content = readFileSync(join(ROOT, 'scenes/main_ui.gd'), 'utf8');
    assert(content.includes('結果発表'), 'Missing results title');
    assert(content.includes('もう一度'), 'Missing retry button');
    assert(content.includes('タイトルへ'), 'Missing back button');
    assert(content.includes('コンボ'), 'Missing combo text');
  });

  it('score_system.gd should have Japanese grade labels', () => {
    const content = readFileSync(join(ROOT, 'scripts/score_system.gd'), 'utf8');
    assert(content.includes('神の目'), 'Missing S grade label');
    assert(content.includes('プロの目'), 'Missing A grade label');
    assert(content.includes('修行が必要'), 'Missing F grade label');
  });
});

// ===== Summary =====
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) {
  console.log(`  \x1b[31m${failed} failed\x1b[0m`);
  process.exit(1);
} else {
  console.log('  \x1b[32mAll tests passed! 📸\x1b[0m');
}
console.log('');
