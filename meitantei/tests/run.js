// MeiTantei Test Suite
import { cases, getCaseById, checkSolution } from '../src/cases.js';

let total = 0, passed = 0, failed = 0;

function describe(name, fn) { console.log(`\n  \x1b[1m${name}\x1b[0m`); fn(); }
function it(name, fn) {
  total++;
  try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${name}`); }
  catch (e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${name}\n      \x1b[31m${e.message}\x1b[0m`); }
}
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

// Mock localStorage
const storage = {};
globalThis.localStorage = {
  getItem: k => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: k => { delete storage[k]; },
  clear: () => Object.keys(storage).forEach(k => delete storage[k]),
};

console.log('\n\x1b[1m🔍 MeiTantei Test Suite\x1b[0m');

// ===== Cases Data =====
describe('Cases Data', () => {
  it('should have 3 cases', () => eq(cases.length, 3));

  it('should have unique ids', () => {
    const ids = cases.map(c => c.id);
    eq(new Set(ids).size, ids.length);
  });

  it('should have Japanese titles', () => {
    cases.forEach(c => assert(c.title.length > 0, `Missing title for ${c.id}`));
  });

  it('should have difficulty levels', () => {
    cases.forEach(c => assert(c.difficulty, `Missing difficulty for ${c.id}`));
  });

  it('should have synopses', () => {
    cases.forEach(c => assert(c.synopsis.length > 20, `Short synopsis for ${c.id}`));
  });
});

describe('Case 1 - 消えた内定通知', () => {
  const c = cases[0];

  it('should have scene with objects', () => {
    assert(c.scene.objects.length >= 4, 'Need at least 4 scene objects');
  });

  it('should have at least 3 clues', () => {
    assert(c.clues.length >= 3);
  });

  it('should have at least 3 suspects', () => {
    assert(c.suspects.length >= 3);
  });

  it('should have valid clue locations', () => {
    c.clues.forEach(clue => {
      assert(clue.location.x >= 0 && clue.location.y >= 0, `Invalid location for ${clue.id}`);
      assert(clue.location.w > 0 && clue.location.h > 0, `Invalid size for ${clue.id}`);
    });
  });

  it('should have a valid solution', () => {
    assert(c.solution.culprit, 'Missing culprit');
    assert(c.solution.requiredClues.length >= 2, 'Need at least 2 required clues');
    assert(c.solution.explanation.length > 20, 'Short explanation');
  });

  it('solution culprit should be in suspects', () => {
    assert(c.suspects.some(s => s.id === c.solution.culprit));
  });

  it('required clues should exist in case clues', () => {
    const clueIds = c.clues.map(cl => cl.id);
    c.solution.requiredClues.forEach(rc => {
      assert(clueIds.includes(rc), `Required clue ${rc} not found`);
    });
  });
});

describe('Case 2 - サークル棟の怪文書', () => {
  const c = cases[1];
  it('should have 5 clues', () => eq(c.clues.length, 5));
  it('should have 4 suspects', () => eq(c.suspects.length, 4));
  it('solution should reference valid suspect', () => {
    assert(c.suspects.some(s => s.id === c.solution.culprit));
  });
});

describe('Case 3 - 研究データの改竄', () => {
  const c = cases[2];
  it('should have 5 clues', () => eq(c.clues.length, 5));
  it('should have 4 suspects', () => eq(c.suspects.length, 4));
  it('should be advanced difficulty', () => eq(c.difficulty, '上級'));
});

// ===== getCaseById =====
describe('getCaseById', () => {
  it('should find case1', () => {
    const c = getCaseById('case1');
    assert(c, 'Should find case1');
    eq(c.title, '消えた内定通知');
  });

  it('should find case3', () => {
    const c = getCaseById('case3');
    assert(c);
    eq(c.title, '研究データの改竄');
  });

  it('should return undefined for invalid id', () => {
    eq(getCaseById('invalid'), undefined);
  });
});

// ===== checkSolution =====
describe('checkSolution', () => {
  const c = cases[0]; // case1

  it('should accept correct solution with all clues', () => {
    const result = checkSolution(c, 's1', ['c1-fingerprint', 'c1-coffee', 'c1-trash', 'c1-schedule']);
    assert(result.correct, 'Should be correct');
    assert(result.correctCulprit, 'Culprit should match');
    assert(result.hasRequiredClues, 'Should have required clues');
  });

  it('should accept with exactly required clues', () => {
    const result = checkSolution(c, 's1', ['c1-fingerprint', 'c1-coffee', 'c1-trash']);
    assert(result.correct);
  });

  it('should reject wrong culprit', () => {
    const result = checkSolution(c, 's2', ['c1-fingerprint', 'c1-coffee', 'c1-trash']);
    assert(!result.correct);
    assert(!result.correctCulprit);
  });

  it('should reject missing clues', () => {
    const result = checkSolution(c, 's1', ['c1-fingerprint']);
    assert(!result.correct);
    assert(result.correctCulprit);
    assert(!result.hasRequiredClues);
  });

  it('should list missing clues', () => {
    const result = checkSolution(c, 's1', ['c1-fingerprint']);
    assert(result.missingClues.length === 2);
    assert(result.missingClues.includes('c1-coffee'));
    assert(result.missingClues.includes('c1-trash'));
  });

  it('should reject empty clues', () => {
    const result = checkSolution(c, 's1', []);
    assert(!result.correct);
    eq(result.missingClues.length, 3);
  });
});

// ===== Store =====
localStorage.clear();
const store = await import('../src/store.js');

describe('Store - Case Progress', () => {
  it('should start with no completed cases', () => {
    eq(store.getCompletedCount(), 0);
  });

  it('should start a case', () => {
    store.startCase('case1');
    eq(store.getState().currentCase, 'case1');
  });

  it('should find a clue', () => {
    const result = store.findClue('case1', 'c1-fingerprint');
    assert(result === true);
  });

  it('should not duplicate clues', () => {
    const result = store.findClue('case1', 'c1-fingerprint');
    assert(result === false);
  });

  it('should track found clues', () => {
    const clues = store.getFoundClues('case1');
    assert(clues.includes('c1-fingerprint'));
    eq(clues.length, 1);
  });

  it('should mark case as solved', () => {
    store.markSolved('case1');
    assert(store.isCaseCompleted('case1'));
    eq(store.getCompletedCount(), 1);
  });

  it('should persist to localStorage', () => {
    const saved = JSON.parse(localStorage.getItem('meitantei_save'));
    assert(saved.completedCases.includes('case1'));
  });

  it('isCaseCompleted should return false for unsolved', () => {
    assert(!store.isCaseCompleted('case2'));
  });

  it('should reset all', () => {
    store.resetAll();
    eq(store.getCompletedCount(), 0);
    eq(store.getFoundClues('case1').length, 0);
  });
});

// ===== Scene Data Validation =====
describe('Scene Data Integrity', () => {
  cases.forEach(c => {
    it(`${c.id} scene objects should have valid types`, () => {
      c.scene.objects.forEach(obj => {
        assert(['rect', 'circle'].includes(obj.type), `Invalid type: ${obj.type}`);
      });
    });

    it(`${c.id} scene objects should have labels`, () => {
      c.scene.objects.forEach(obj => {
        assert(obj.label, `Missing label in ${c.id}`);
      });
    });

    it(`${c.id} clues should have unique ids`, () => {
      const ids = c.clues.map(cl => cl.id);
      eq(new Set(ids).size, ids.length);
    });

    it(`${c.id} suspects should have emojis`, () => {
      c.suspects.forEach(s => assert(s.emoji, `Missing emoji for ${s.id}`));
    });
  });
});

// ===== Summary =====
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) {
  console.log(`  \x1b[31m${failed} failed\x1b[0m`);
  process.exit(1);
} else {
  console.log('  \x1b[32mAll tests passed! 🔍\x1b[0m');
}
console.log('');
