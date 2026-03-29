// OshiShrine Test Suite
import { THEMES, BADGES, TITLES, getTheme, loadShrine } from '../src/shrine.js';

// Mock localStorage
const storage = {};
globalThis.localStorage = {
  getItem: k => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: k => { delete storage[k]; },
  clear: () => Object.keys(storage).forEach(k => delete storage[k]),
};

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m⛩️ OshiShrine Test Suite\x1b[0m');

describe('Themes', () => {
  it('should have 6 themes', () => eq(THEMES.length, 6));
  it('should have unique ids', () => eq(new Set(THEMES.map(t => t.id)).size, 6));
  it('should have Japanese names', () => THEMES.forEach(t => assert(t.name.length > 0)));
  it('should have hex primary colors', () => {
    THEMES.forEach(t => assert(/^#[0-9a-fA-F]{6}$/.test(t.primary), `Invalid: ${t.primary}`));
  });
  it('should have hex secondary colors', () => {
    THEMES.forEach(t => assert(/^#[0-9a-fA-F]{6}$/.test(t.secondary)));
  });
  it('should have hex bg colors', () => {
    THEMES.forEach(t => assert(/^#[0-9a-fA-F]{6}$/.test(t.bg)));
  });
  it('should have star colors', () => {
    THEMES.forEach(t => assert(t.star));
  });
});

describe('getTheme', () => {
  it('should find pink theme', () => {
    const t = getTheme('pink');
    eq(t.name, 'ピンク');
  });
  it('should find gold theme', () => {
    const t = getTheme('gold');
    eq(t.name, 'ゴールド');
  });
  it('should return default for unknown', () => {
    const t = getTheme('xxx');
    eq(t.id, 'pink'); // falls back to first
  });
});

describe('Badges', () => {
  it('should have 8 badges', () => eq(BADGES.length, 8));
  it('should have unique ids', () => eq(new Set(BADGES.map(b => b.id)).size, 8));
  it('should have emojis', () => BADGES.forEach(b => assert(b.emoji)));
  it('should have Japanese names', () => BADGES.forEach(b => assert(b.name.length > 0)));
  it('should include heart badge', () => assert(BADGES.some(b => b.id === 'heart')));
});

describe('Titles', () => {
  it('should have at least 5 titles', () => assert(TITLES.length >= 5));
  it('should all be Japanese', () => TITLES.forEach(t => assert(t.length > 0)));
  it('should include 永遠の推し', () => assert(TITLES.includes('永遠の推し')));
});

describe('loadShrine', () => {
  localStorage.clear();
  it('should return default shrine for fresh start', () => {
    const s = loadShrine();
    eq(s.oshiName, '');
    eq(s.catchphrase, '');
    eq(s.themeId, 'pink');
    assert(s.badges.length > 0);
    assert(s.visitorCount > 0);
  });
  it('should have default guestbook entries', () => {
    const s = loadShrine();
    assert(s.guestbookEntries.length >= 2);
  });
  it('should have createdAt date', () => {
    const s = loadShrine();
    assert(s.createdAt);
  });
});

describe('Shrine Data Integrity', () => {
  it('default badges should be valid badge ids', () => {
    const s = loadShrine();
    const validIds = BADGES.map(b => b.id);
    s.badges.forEach(b => assert(validIds.includes(b), `Invalid badge: ${b}`));
  });
  it('default guestbook entries should have name, text, date', () => {
    const s = loadShrine();
    s.guestbookEntries.forEach(e => {
      assert(e.name, 'Missing name');
      assert(e.text, 'Missing text');
      assert(e.date, 'Missing date');
    });
  });
});

// File structure
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

describe('Project Structure', () => {
  ['index.html', 'src/style.css', 'src/main.js', 'src/shrine.js', 'src/effects.js', 'README.md'].forEach(f => {
    it(`should have ${f}`, () => assert(existsSync(join(ROOT, f))));
  });
});

describe('90s Aesthetic Elements', () => {
  const css = readFileSync(join(ROOT, 'src/style.css'), 'utf8');
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

  it('CSS should have marquee animation', () => assert(css.includes('marquee')));
  it('CSS should have blink animation', () => assert(css.includes('blink')));
  it('CSS should have rainbow animation', () => assert(css.includes('rainbow')));
  it('CSS should have retro font', () => assert(css.includes('Press Start 2P')));
  it('CSS should have crosshair cursor', () => assert(css.includes('crosshair')));
  it('CSS should have double border', () => assert(css.includes('double')));
  it('HTML should have visitor counter', () => assert(html.includes('参拝者')));
  it('HTML should have guestbook', () => assert(html.includes('ゲストブック')));
  it('HTML should have under construction', () => assert(html.includes('工事中')));
  it('HTML should have Internet Explorer reference', () => assert(html.includes('Internet Explorer')));
  it('HTML should have 800x600 reference', () => assert(html.includes('800x600')));
});

describe('Japanese UI Text', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  it('should have 推し神社 title', () => assert(html.includes('推し神社')));
  it('should have setup instructions', () => assert(html.includes('推しの名前')));
  it('should have キャッチフレーズ', () => assert(html.includes('キャッチフレーズ')));
  it('should have テーマカラー', () => assert(html.includes('テーマカラー')));
  it('should have 神社を建立する', () => assert(html.includes('神社を建立する')));
  it('should have 編集 button', () => assert(html.includes('編集')));
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! ⛩️\x1b[0m'); }
console.log('');
