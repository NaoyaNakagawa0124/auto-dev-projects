// WasureNote Test Suite
import { MODES, PROMPTS, FAREWELL_MESSAGES, getRandomPrompt, getRandomFarewell } from '../src/destroy.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🗑️ WasureNote Test Suite\x1b[0m');

describe('Destruction Modes', () => {
  it('should have 3 modes', () => eq(Object.keys(MODES).length, 3));
  it('should have burn mode', () => assert(MODES.burn));
  it('should have melt mode', () => assert(MODES.melt));
  it('should have wind mode', () => assert(MODES.wind));
  it('should have Japanese names', () => {
    Object.values(MODES).forEach(m => assert(m.name.length > 0));
  });
  it('should have emojis', () => {
    Object.values(MODES).forEach(m => assert(m.emoji));
  });
  it('should have base colors (HSL array)', () => {
    Object.values(MODES).forEach(m => {
      assert(Array.isArray(m.baseColor) && m.baseColor.length === 3);
      assert(Array.isArray(m.particleColor) && m.particleColor.length === 3);
    });
  });
  it('burn name should be 燃やす', () => eq(MODES.burn.name, '燃やす'));
  it('melt name should be 溶かす', () => eq(MODES.melt.name, '溶かす'));
  it('wind name should be 風に飛ばす', () => eq(MODES.wind.name, '風に飛ばす'));
});

describe('Prompts', () => {
  it('should have at least 4 prompts', () => assert(PROMPTS.length >= 4));
  it('should all be Japanese', () => PROMPTS.forEach(p => assert(p.length > 5)));
  it('getRandomPrompt should return a string', () => assert(typeof getRandomPrompt() === 'string'));
  it('getRandomPrompt should return a valid prompt', () => assert(PROMPTS.includes(getRandomPrompt())));
});

describe('Farewell Messages', () => {
  it('should have at least 5 messages', () => assert(FAREWELL_MESSAGES.length >= 5));
  it('should all be Japanese', () => FAREWELL_MESSAGES.forEach(m => assert(m.length > 5)));
  it('getRandomFarewell should return a string', () => assert(typeof getRandomFarewell() === 'string'));
  it('should include garbage collection reference', () => {
    assert(FAREWELL_MESSAGES.some(m => m.includes('ガベージコレクション') || m.includes('デリート')));
  });
});

describe('Anti-Diary Design (NO persistence)', () => {
  const mainJs = readFileSync(join(ROOT, 'src/main.js'), 'utf8');
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

  it('should NOT use localStorage', () => {
    assert(!mainJs.includes('localStorage'), 'main.js should not use localStorage');
  });
  it('should NOT use sessionStorage', () => {
    assert(!mainJs.includes('sessionStorage'));
  });
  it('should NOT use IndexedDB', () => {
    assert(!mainJs.includes('indexedDB'));
  });
  it('should NOT use cookies', () => {
    assert(!mainJs.includes('document.cookie'));
  });
  it('console log should mention nothing is saved', () => {
    assert(mainJs.includes('nothing is saved'));
  });
});

describe('Japanese UI Text', () => {
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  it('should have 忘れノート title', () => assert(html.includes('忘れノート')));
  it('should have ガベージコレクション subtitle', () => assert(html.includes('ガベージコレクション')));
  it('should have 手放す button', () => assert(html.includes('手放す')));
  it('should have Japanese placeholder', () => assert(html.includes('悩み')));
  it('should have session counter', () => assert(html.includes('手放したもの')));
});

describe('Project Structure', () => {
  ['index.html', 'src/style.css', 'src/main.js', 'src/destroy.js', 'README.md', 'CLAUDE.md'].forEach(f => {
    it(`should have ${f}`, () => assert(existsSync(join(ROOT, f))));
  });
});

describe('CSS Design', () => {
  const css = readFileSync(join(ROOT, 'src/style.css'), 'utf8');
  it('should have backdrop-filter (glassmorphism)', () => assert(css.includes('backdrop-filter')));
  it('should have gradient button', () => assert(css.includes('gradient')));
  it('should have dark background', () => assert(css.includes('#080610') || css.includes('var(--bg)')));
  it('should be responsive', () => assert(css.includes('@media')));
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🗑️\x1b[0m'); }
console.log('');
