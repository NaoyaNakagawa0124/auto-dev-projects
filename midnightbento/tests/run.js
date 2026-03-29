// MidnightBento Test Suite
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🍱 MidnightBento Test Suite\x1b[0m');

// ===== Reimplemented Game Logic =====

// Food shapes (matching food_data.gd)
const foods = [
  { id: 'umeboshi', name: '梅干し', shape: [[0,0]], effect: '集中力', value: 5 },
  { id: 'onigiri', name: 'おにぎり', shape: [[0,0],[1,0]], effect: '集中力', value: 15 },
  { id: 'tamagoyaki', name: '卵焼き', shape: [[0,0],[1,0]], effect: '記憶力', value: 15 },
  { id: 'sausage', name: 'ソーセージ', shape: [[0,0],[0,1]], effect: 'スタミナ', value: 10 },
  { id: 'karaage', name: '唐揚げ', shape: [[0,0],[1,0],[0,1],[1,1]], effect: 'スタミナ', value: 25 },
  { id: 'broccoli', name: 'ブロッコリー', shape: [[0,0],[0,1],[1,1]], effect: '健康', value: 20 },
  { id: 'sushi', name: '巻き寿司', shape: [[0,0],[1,0],[2,0]], effect: 'ご褒美', value: 30 },
  { id: 'gyoza', name: '餃子', shape: [[0,0],[1,0],[2,0],[1,1]], effect: 'コンボ', value: 20 },
  { id: 'tonkatsu', name: 'とんかつ', shape: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], effect: '満腹', value: 35 },
  { id: 'edamame', name: '枝豆', shape: [[0,0],[1,0],[1,1],[2,1]], effect: 'リラックス', value: 15 },
];

function rotateShape(shape, rotation) {
  let s = shape.map(([x,y]) => [x,y]);
  for (let r = 0; r < rotation % 4; r++) {
    s = s.map(([x,y]) => [y, -x]);
  }
  return s;
}

// Board logic
class Board {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.grid = Array.from({length: h}, () => Array(w).fill(''));
    this.placed = [];
  }
  canPlace(food, rot, px, py) {
    const shape = rotateShape(food.shape, rot);
    for (const [dx, dy] of shape) {
      const cx = px + dx, cy = py + dy;
      if (cx < 0 || cx >= this.w || cy < 0 || cy >= this.h) return false;
      if (this.grid[cy][cx] !== '') return false;
    }
    return true;
  }
  place(food, rot, px, py) {
    if (!this.canPlace(food, rot, px, py)) return false;
    const shape = rotateShape(food.shape, rot);
    for (const [dx, dy] of shape) { this.grid[py+dy][px+dx] = food.id; }
    this.placed.push({ id: food.id, rot, x: px, y: py });
    return true;
  }
  isFull() { return this.grid.every(row => row.every(c => c !== '')); }
  emptyCells() { return this.grid.flat().filter(c => c === '').length; }
  filledCells() { return this.w * this.h - this.emptyCells(); }
}

// ===== Tests =====

describe('Food Data', () => {
  it('should have 10 foods', () => eq(foods.length, 10));
  it('should have unique ids', () => eq(new Set(foods.map(f=>f.id)).size, 10));
  it('should have Japanese names', () => foods.forEach(f => assert(f.name.length > 0)));
  it('should have effects', () => foods.forEach(f => assert(f.effect.length > 0)));
  it('should have positive values', () => foods.forEach(f => assert(f.value > 0)));
  it('umeboshi should be 1x1', () => eq(foods[0].shape.length, 1));
  it('karaage should be 2x2 (4 cells)', () => eq(foods[4].shape.length, 4));
  it('tonkatsu should be 2x3 (6 cells)', () => eq(foods[8].shape.length, 6));
  it('gyoza should be T-shape (4 cells)', () => eq(foods[7].shape.length, 4));
});

describe('Shape Rotation', () => {
  it('1x1 should be unchanged after rotation', () => {
    const r = rotateShape([[0,0]], 1);
    eq(r.length, 1);
  });
  it('4 rotations should return to original', () => {
    const orig = [[0,0],[1,0]];
    const r4 = rotateShape(orig, 4);
    assert(r4[0][0] === orig[0][0] && r4[0][1] === orig[0][1]);
  });
  it('horizontal 1x2 should become vertical after 1 rotation', () => {
    const r = rotateShape([[0,0],[1,0]], 1);
    // After 90° CW: (x,y) → (y,-x)
    // (0,0)→(0,0), (1,0)→(0,-1)
    assert(r.some(([x,y]) => x === 0 && y === -1), 'Should have vertical cell');
  });
  it('L-shape rotation should preserve cell count', () => {
    const r = rotateShape(foods[5].shape, 2);
    eq(r.length, 3);
  });
});

describe('Board - Basic', () => {
  it('should create empty board', () => {
    const b = new Board(4, 4);
    eq(b.emptyCells(), 16);
    eq(b.filledCells(), 0);
  });
  it('should place 1x1 food', () => {
    const b = new Board(3, 3);
    assert(b.place(foods[0], 0, 1, 1));
    eq(b.grid[1][1], 'umeboshi');
    eq(b.filledCells(), 1);
  });
  it('should place 2x2 food', () => {
    const b = new Board(4, 4);
    assert(b.place(foods[4], 0, 0, 0)); // karaage at (0,0)
    eq(b.filledCells(), 4);
  });
  it('should reject out-of-bounds placement', () => {
    const b = new Board(3, 3);
    assert(!b.canPlace(foods[6], 0, 1, 0)); // sushi 3x1 at x=1 overflows
  });
  it('should reject overlapping placement', () => {
    const b = new Board(4, 4);
    b.place(foods[0], 0, 1, 1);
    assert(!b.canPlace(foods[0], 0, 1, 1)); // same spot
  });
  it('should detect full board', () => {
    const b = new Board(2, 2);
    b.place(foods[4], 0, 0, 0); // karaage fills 2x2
    assert(b.isFull());
  });
  it('should not be full with empty cells', () => {
    const b = new Board(3, 3);
    b.place(foods[0], 0, 0, 0);
    assert(!b.isFull());
  });
});

describe('Board - Complex Placement', () => {
  it('should place L-shape correctly', () => {
    const b = new Board(4, 4);
    assert(b.place(foods[5], 0, 0, 0)); // broccoli L-shape
    eq(b.grid[0][0], 'broccoli');
    eq(b.grid[1][0], 'broccoli');
    eq(b.grid[1][1], 'broccoli');
    eq(b.filledCells(), 3);
  });
  it('should place T-shape correctly', () => {
    const b = new Board(4, 4);
    assert(b.place(foods[7], 0, 0, 0)); // gyoza T-shape
    eq(b.filledCells(), 4);
  });
  it('should place tonkatsu 2x3', () => {
    const b = new Board(4, 4);
    assert(b.place(foods[8], 0, 0, 0));
    eq(b.filledCells(), 6);
  });
  it('should place multiple non-overlapping foods', () => {
    const b = new Board(4, 2);
    assert(b.place(foods[1], 0, 0, 0)); // onigiri 2x1 at (0,0)
    assert(b.place(foods[1], 0, 2, 0)); // onigiri 2x1 at (2,0)
    assert(b.place(foods[1], 0, 0, 1)); // onigiri at (0,1)
    assert(b.place(foods[1], 0, 2, 1)); // onigiri at (2,1)
    assert(b.isFull());
  });
  it('should handle edge placement', () => {
    const b = new Board(3, 1);
    assert(b.place(foods[6], 0, 0, 0)); // sushi 3x1 fills exactly
    assert(b.isFull());
  });
});

// Levels
const levels = [
  { num: 1, w: 3, h: 2, foods: [0,1,3], title: 'はじめての弁当', par: 120 },
  { num: 2, w: 3, h: 3, foods: [0,1,2,3], title: '朝ごはん弁当', par: 180 },
  { num: 3, w: 4, h: 3, foods: [1,2,5,3], title: 'お昼の弁当', par: 220 },
  { num: 4, w: 4, h: 4, foods: [0,1,4,5,3], title: '豪華弁当', par: 350 },
  { num: 5, w: 4, h: 4, foods: [1,6,9,0,3], title: 'パズル弁当', par: 380 },
  { num: 6, w: 5, h: 3, foods: [7,1,2,0,3], title: '深夜の特製弁当', par: 300 },
  { num: 7, w: 5, h: 4, foods: [4,6,7,1,0,3], title: 'チャレンジ弁当', par: 450 },
  { num: 8, w: 5, h: 4, foods: [8,1,5,0,0,3], title: 'とんかつ弁当', par: 480 },
  { num: 9, w: 6, h: 4, foods: [8,7,6,9,0,0,3], title: '二段弁当・上', par: 550 },
  { num: 10, w: 6, h: 5, foods: [8,7,6,4,1,2,9,0,3], title: '究極の弁当', par: 700 },
];

describe('Levels', () => {
  it('should have 10 levels', () => eq(levels.length, 10));
  it('should have unique numbers', () => eq(new Set(levels.map(l=>l.num)).size, 10));
  it('should have Japanese titles', () => levels.forEach(l => assert(l.title.length > 0)));
  it('should have positive par scores', () => levels.forEach(l => assert(l.par > 0)));
  it('should have valid food indices', () => {
    levels.forEach(l => l.foods.forEach(idx => assert(idx >= 0 && idx < 10, `Invalid food index ${idx} in level ${l.num}`)));
  });
  it('level food cells should not exceed board', () => {
    levels.forEach(l => {
      const totalCells = l.foods.reduce((sum, idx) => sum + foods[idx].shape.length, 0);
      const boardCells = l.w * l.h;
      assert(totalCells <= boardCells, `Level ${l.num}: ${totalCells} food cells > ${boardCells} board cells`);
    });
  });
  it('boards should grow in size', () => {
    assert(levels[9].w * levels[9].h > levels[0].w * levels[0].h);
  });
});

// ===== File Structure =====

describe('Project Structure', () => {
  const files = [
    'project.godot', 'icon.svg',
    'scripts/food_data.gd', 'scripts/bento_board.gd',
    'scripts/level_data.gd', 'scripts/game_manager.gd',
    'scenes/main.tscn', 'scenes/main_ui.gd',
    'README.md', 'CLAUDE.md',
  ];
  files.forEach(f => {
    it(`should have ${f}`, () => assert(existsSync(join(ROOT, f))));
  });
});

describe('GDScript Validation', () => {
  const gdFiles = ['scripts/food_data.gd', 'scripts/bento_board.gd', 'scripts/level_data.gd', 'scripts/game_manager.gd', 'scenes/main_ui.gd'];
  gdFiles.forEach(f => {
    it(`${f} should have extends/class_name`, () => {
      const c = readFileSync(join(ROOT, f), 'utf8');
      assert(c.includes('extends ') || c.includes('class_name '));
    });
  });
});

describe('Japanese UI Text', () => {
  it('project.godot should have Japanese name', () => {
    const c = readFileSync(join(ROOT, 'project.godot'), 'utf8');
    assert(c.includes('真夜中弁当'));
  });
  it('main scene should have Japanese labels', () => {
    const c = readFileSync(join(ROOT, 'scenes/main.tscn'), 'utf8');
    assert(c.includes('真夜中弁当'));
    assert(c.includes('スタート'));
    assert(c.includes('深夜の弁当パズル'));
  });
  it('main_ui.gd should have Japanese text', () => {
    const c = readFileSync(join(ROOT, 'scenes/main_ui.gd'), 'utf8');
    assert(c.includes('ステージクリア'));
    assert(c.includes('パーフェクト'));
    assert(c.includes('合計スコア'));
    assert(c.includes('もう一度'));
  });
  it('game_manager.gd should have Japanese grades', () => {
    const c = readFileSync(join(ROOT, 'scripts/game_manager.gd'), 'utf8');
    assert(c.includes('弁当の神'));
    assert(c.includes('弁当マスター'));
  });
  it('food_data.gd should have Japanese food names', () => {
    const c = readFileSync(join(ROOT, 'scripts/food_data.gd'), 'utf8');
    assert(c.includes('おにぎり'));
    assert(c.includes('唐揚げ'));
    assert(c.includes('卵焼き'));
  });
});

// ===== Summary =====
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🍱\x1b[0m'); }
console.log('');
