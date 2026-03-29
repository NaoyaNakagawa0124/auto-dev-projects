// NijiLog Test Suite

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

// Mock localStorage
const storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
};

// Mock document
globalThis.document = {
  createElement: (tag) => ({ tagName: tag, textContent: '', innerHTML: '', get innerText() { return this.textContent; } }),
};

console.log('\n\x1b[1m🌈 NijiLog Test Suite\x1b[0m');

// --- Moods ---
import { moods, getMoodById, getMoodColor } from '../src/data/moods.js';

describe('Moods Data', () => {
  it('should have 8 moods', () => {
    eq(moods.length, 8);
  });

  it('should have unique ids', () => {
    const ids = moods.map(m => m.id);
    eq(new Set(ids).size, ids.length);
  });

  it('should have Japanese names', () => {
    moods.forEach(m => assert(m.name && m.name.length > 0, `Missing name for ${m.id}`));
  });

  it('should have valid hex colors', () => {
    moods.forEach(m => assert(/^#[0-9a-fA-F]{6}$/.test(m.color), `Invalid color: ${m.color}`));
  });

  it('should have HSL values in range', () => {
    moods.forEach(m => {
      assert(m.h >= 0 && m.h <= 360, `Invalid hue for ${m.id}: ${m.h}`);
      assert(m.s >= 0 && m.s <= 100, `Invalid sat for ${m.id}: ${m.s}`);
      assert(m.l >= 0 && m.l <= 100, `Invalid light for ${m.id}: ${m.l}`);
    });
  });

  it('getMoodById should find mood', () => {
    const joy = getMoodById('joy');
    eq(joy.name, '喜び');
    eq(joy.color, '#fbbf24');
  });

  it('getMoodById should return undefined for unknown', () => {
    eq(getMoodById('xxx'), undefined);
  });

  it('getMoodColor should return correct color', () => {
    eq(getMoodColor('sad'), '#6366f1');
  });

  it('getMoodColor should return fallback for unknown', () => {
    eq(getMoodColor('xxx'), '#94a3b8');
  });

  it('should have emojis for all moods', () => {
    moods.forEach(m => assert(m.emoji, `Missing emoji for ${m.id}`));
  });
});

// --- Store ---
localStorage.clear();
const store = await import('../src/store.js');
const { getState, addEntry, deleteEntry, getEntryByDate, getStats, computeGaps, getEntriesForMonth, todayStr } = store;

describe('Store - Basic Operations', () => {
  it('should start with empty state', () => {
    eq(getState().entries.length, 0);
  });

  it('should add an entry', () => {
    const e = addEntry({ date: '2026-03-29', mood: 'joy', text: '今日は楽しかった' });
    assert(e.id, 'Should have id');
    eq(e.mood, 'joy');
    eq(e.text, '今日は楽しかった');
    eq(getState().entries.length, 1);
  });

  it('should replace entry for same date', () => {
    addEntry({ date: '2026-03-29', mood: 'sad', text: '上書き' });
    eq(getState().entries.length, 1);
    eq(getState().entries[0].mood, 'sad');
  });

  it('should add entry for different date', () => {
    addEntry({ date: '2026-03-28', mood: 'calm', text: '穏やか' });
    eq(getState().entries.length, 2);
  });

  it('should sort entries by date', () => {
    const entries = getState().entries;
    assert(entries[0].date <= entries[1].date, 'Should be sorted');
  });

  it('should persist to localStorage', () => {
    const saved = JSON.parse(localStorage.getItem('nijilog_data'));
    eq(saved.entries.length, 2);
  });

  it('should get entry by date', () => {
    const e = getEntryByDate('2026-03-29');
    assert(e, 'Should find entry');
    eq(e.mood, 'sad');
  });

  it('should return null for missing date', () => {
    eq(getEntryByDate('2020-01-01'), null);
  });

  it('should delete entry', () => {
    deleteEntry('2026-03-28');
    eq(getState().entries.length, 1);
    eq(getEntryByDate('2026-03-28'), null);
  });

  it('should handle entry without text', () => {
    const e = addEntry({ date: '2026-03-27', mood: 'neutral' });
    eq(e.text, '');
  });
});

describe('Store - Stats', () => {
  it('should calculate total entries', () => {
    addEntry({ date: '2026-03-20', mood: 'joy', text: 'A' });
    addEntry({ date: '2026-03-21', mood: 'calm', text: 'B' });
    addEntry({ date: '2026-03-22', mood: 'joy', text: 'C' });
    addEntry({ date: '2026-03-25', mood: 'sad', text: 'D' }); // gap
    addEntry({ date: '2026-03-26', mood: 'energy', text: 'E' });

    const stats = getStats();
    eq(stats.totalEntries, 7); // 5 new + 2 from before (2026-03-29 and 2026-03-27)
  });

  it('should count mood frequencies', () => {
    const stats = getStats();
    eq(stats.moodCounts['joy'], 2);
    eq(stats.moodCounts['calm'], 1);
  });

  it('should track longest streak', () => {
    const stats = getStats();
    assert(stats.longestStreak >= 0, 'Should have longest streak');
  });

  it('should count gaps', () => {
    const stats = getStats();
    assert(stats.gaps.length >= 1, 'Should have at least 1 gap');
  });
});

describe('Store - computeGaps', () => {
  it('should find gaps between non-consecutive dates', () => {
    const entries = [
      { date: '2026-03-01' },
      { date: '2026-03-02' },
      { date: '2026-03-05' }, // 2-day gap after 3/02
      { date: '2026-03-10' }, // 4-day gap after 3/05
    ];
    const gaps = computeGaps(entries);
    eq(gaps.length, 2);
    eq(gaps[0].days, 2);
    eq(gaps[0].after, '2026-03-02');
    eq(gaps[0].before, '2026-03-05');
    eq(gaps[1].days, 4);
  });

  it('should return empty for consecutive dates', () => {
    const entries = [
      { date: '2026-03-01' },
      { date: '2026-03-02' },
      { date: '2026-03-03' },
    ];
    eq(computeGaps(entries).length, 0);
  });

  it('should return empty for single entry', () => {
    eq(computeGaps([{ date: '2026-03-01' }]).length, 0);
  });

  it('should return empty for no entries', () => {
    eq(computeGaps([]).length, 0);
  });
});

describe('Store - getEntriesForMonth', () => {
  it('should filter entries by month', () => {
    const march = getEntriesForMonth('2026-03');
    assert(march.length > 0, 'Should have March entries');
    march.forEach(e => assert(e.date.startsWith('2026-03'), `Wrong month: ${e.date}`));
  });

  it('should return empty for month with no entries', () => {
    eq(getEntriesForMonth('2025-01').length, 0);
  });
});

describe('Store - todayStr', () => {
  it('should return YYYY-MM-DD format', () => {
    const today = todayStr();
    assert(/^\d{4}-\d{2}-\d{2}$/.test(today), `Invalid format: ${today}`);
  });

  it('should be a valid date', () => {
    const d = new Date(todayStr());
    assert(!isNaN(d.getTime()), 'Should be valid date');
  });
});

// --- Summary ---
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) {
  console.log(`  \x1b[31m${failed} failed\x1b[0m`);
  process.exit(1);
} else {
  console.log('  \x1b[32mAll tests passed! 🌈\x1b[0m');
}
console.log('');
