// AmimonoTenki Test Suite
import { TEMP_RANGES, tempToColor, tempToRange, tempToYarn, tempToHSL } from '../src/colors.js';
import { getDateRange, computeStats } from '../src/weather.js';

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🧶 AmimonoTenki Test Suite\x1b[0m');

// ===== Temperature Ranges =====
describe('Temperature Ranges', () => {
  it('should have 11 ranges', () => eq(TEMP_RANGES.length, 11));
  it('should cover -20 to 45°C', () => {
    eq(TEMP_RANGES[0].min, -20);
    eq(TEMP_RANGES[TEMP_RANGES.length - 1].max, 45);
  });
  it('should be contiguous (no gaps)', () => {
    for (let i = 1; i < TEMP_RANGES.length; i++) {
      eq(TEMP_RANGES[i].min, TEMP_RANGES[i-1].max, `Gap between ${TEMP_RANGES[i-1].max} and ${TEMP_RANGES[i].min}`);
    }
  });
  it('should have hex colors', () => {
    TEMP_RANGES.forEach(r => assert(/^#[0-9a-fA-F]{6}$/.test(r.color), `Invalid color: ${r.color}`));
  });
  it('should have Japanese yarn names', () => {
    TEMP_RANGES.forEach(r => assert(r.yarn.length > 0, `Missing yarn name`));
  });
  it('should have Japanese names', () => {
    TEMP_RANGES.forEach(r => assert(r.name.length > 0, `Missing name`));
  });
  it('should progress from cold to hot colors', () => {
    // First should be blue-ish, last should be red-ish
    const firstR = parseInt(TEMP_RANGES[0].color.slice(1, 3), 16);
    const firstB = parseInt(TEMP_RANGES[0].color.slice(5, 7), 16);
    const lastR = parseInt(TEMP_RANGES[TEMP_RANGES.length - 1].color.slice(1, 3), 16);
    assert(firstB > firstR, 'Cold should be blue-dominant');
    assert(lastR > 200, 'Hot should be red-dominant');
  });
});

// ===== tempToColor =====
describe('tempToColor', () => {
  it('should return deep blue for -15°C', () => eq(tempToColor(-15), '#1a237e'));
  it('should return blue for 2°C', () => eq(tempToColor(2), '#1e88e5'));
  it('should return green for 18°C', () => eq(tempToColor(18), '#66bb6a'));
  it('should return yellow for 27°C', () => eq(tempToColor(27), '#fdd835'));
  it('should return red for 37°C', () => eq(tempToColor(37), '#e53935'));
  it('should handle extreme cold (-30°C)', () => eq(tempToColor(-30), TEMP_RANGES[0].color));
  it('should handle extreme hot (50°C)', () => eq(tempToColor(50), TEMP_RANGES[TEMP_RANGES.length - 1].color));
  it('should handle boundary (0°C → cold bracket)', () => eq(tempToColor(0), '#1e88e5'));
  it('should handle boundary (10°C → cool bracket)', () => eq(tempToColor(10), '#4db6ac'));
});

// ===== tempToRange =====
describe('tempToRange', () => {
  it('should return correct range for 22°C', () => {
    const r = tempToRange(22);
    eq(r.name, '暖かい');
  });
  it('should return correct range for -8°C', () => {
    const r = tempToRange(-8);
    eq(r.name, '厳寒');
  });
  it('should return correct range for 33°C', () => {
    const r = tempToRange(33);
    eq(r.name, '猛暑');
  });
});

// ===== tempToYarn =====
describe('tempToYarn', () => {
  it('should return yarn name for 15°C', () => eq(tempToYarn(15), '緑'));
  it('should return yarn name for -3°C', () => eq(tempToYarn(-3), '青'));
  it('should return yarn name for 32°C', () => eq(tempToYarn(32), 'オレンジ'));
});

// ===== tempToHSL =====
describe('tempToHSL', () => {
  it('should return HSL object', () => {
    const hsl = tempToHSL(20);
    assert(typeof hsl.h === 'number');
    assert(typeof hsl.s === 'number');
    assert(typeof hsl.l === 'number');
  });
  it('H should be 0-360', () => {
    const hsl = tempToHSL(10);
    assert(hsl.h >= 0 && hsl.h <= 360);
  });
  it('S should be 0-100', () => {
    const hsl = tempToHSL(25);
    assert(hsl.s >= 0 && hsl.s <= 100);
  });
  it('L should be 0-100', () => {
    const hsl = tempToHSL(30);
    assert(hsl.l >= 0 && hsl.l <= 100);
  });
});

// ===== Date Range =====
describe('getDateRange', () => {
  it('should return start and end dates', () => {
    const { start, end } = getDateRange();
    assert(start, 'Should have start');
    assert(end, 'Should have end');
  });
  it('should return YYYY-MM-DD format', () => {
    const { start, end } = getDateRange();
    assert(/^\d{4}-\d{2}-\d{2}$/.test(start));
    assert(/^\d{4}-\d{2}-\d{2}$/.test(end));
  });
  it('should span approximately 1 year', () => {
    const { start, end } = getDateRange();
    const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
    assert(diff >= 360 && diff <= 370, `Expected ~365 days, got ${diff}`);
  });
  it('end should be yesterday or earlier', () => {
    const { end } = getDateRange();
    const endDate = new Date(end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    assert(endDate < today, 'End should be before today');
  });
});

// ===== computeStats =====
describe('computeStats', () => {
  it('should return null for empty data', () => {
    eq(computeStats([]), null);
    eq(computeStats(null), null);
  });
  it('should compute correct stats', () => {
    const data = [
      { date: '2025-01-01', mean: 5, max: 8, min: 2 },
      { date: '2025-01-02', mean: 10, max: 13, min: 7 },
      { date: '2025-01-03', mean: 15, max: 18, min: 12 },
    ];
    const s = computeStats(data);
    eq(s.days, 3);
    eq(s.min, 5);
    eq(s.max, 15);
    eq(s.avg, 10);
    eq(s.range, 10);
  });
  it('should handle single day', () => {
    const s = computeStats([{ date: '2025-06-01', mean: 25, max: 28, min: 22 }]);
    eq(s.days, 1);
    eq(s.min, 25);
    eq(s.max, 25);
  });
  it('should handle negative temps', () => {
    const data = [
      { date: '2025-01-01', mean: -10 },
      { date: '2025-01-02', mean: -5 },
    ];
    const s = computeStats(data);
    eq(s.min, -10);
    eq(s.avg, -7.5);
  });
  it('should skip null means', () => {
    const data = [
      { date: '2025-01-01', mean: 10 },
      { date: '2025-01-02', mean: null },
      { date: '2025-01-03', mean: 20 },
    ];
    const s = computeStats(data);
    eq(s.days, 3);
    eq(s.avg, 15);
  });
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🧶\x1b[0m'); }
console.log('');
