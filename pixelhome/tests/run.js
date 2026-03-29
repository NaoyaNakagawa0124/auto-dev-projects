// PixelHome Test Suite
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { TASKS, SECRETS, CATEGORIES, FURNITURE, checkSecrets } from '../src/data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🏠 PixelHome Test Suite\x1b[0m');

// ===== Tasks =====
describe('Tasks Data', () => {
  it('should have 15 tasks', () => eq(TASKS.length, 15));
  it('should have unique ids', () => eq(new Set(TASKS.map(t => t.id)).size, 15));
  it('should have Japanese names', () => TASKS.forEach(t => assert(t.name.length > 0)));
  it('should have valid categories', () => {
    TASKS.forEach(t => assert(CATEGORIES[t.category], `Unknown category: ${t.category}`));
  });
  it('should have furniture references', () => {
    TASKS.forEach(t => assert(FURNITURE[t.furniture], `Unknown furniture: ${t.furniture} for task ${t.id}`));
  });
  it('should have unique furniture per task', () => {
    const fids = TASKS.map(t => t.furniture);
    eq(new Set(fids).size, fids.length, 'Duplicate furniture');
  });
  it('essential tasks should be 5', () => {
    eq(TASKS.filter(t => t.category === 'essential').length, 5);
  });
  it('shopping tasks should be 5', () => {
    eq(TASKS.filter(t => t.category === 'shopping').length, 5);
  });
  it('setup tasks should be 5', () => {
    eq(TASKS.filter(t => t.category === 'setup').length, 5);
  });
});

// ===== Furniture =====
describe('Furniture Data', () => {
  const allFurniture = Object.keys(FURNITURE);
  it('should have at least 15 furniture items', () => assert(allFurniture.length >= 15));
  it('should have position data', () => {
    allFurniture.forEach(id => {
      const f = FURNITURE[id];
      assert(typeof f.x === 'number' && typeof f.y === 'number', `Missing position for ${id}`);
      assert(typeof f.w === 'number' && typeof f.h === 'number', `Missing size for ${id}`);
    });
  });
  it('should have colors', () => {
    allFurniture.forEach(id => assert(FURNITURE[id].color, `Missing color for ${id}`));
  });
  it('should have Japanese labels', () => {
    allFurniture.forEach(id => assert(FURNITURE[id].label, `Missing label for ${id}`));
  });
  it('furniture should fit within room bounds (340x170)', () => {
    allFurniture.forEach(id => {
      const f = FURNITURE[id];
      assert(f.x >= 0 && f.x + f.w <= 340, `${id} overflows x: ${f.x}+${f.w}`);
      assert(f.y >= 0 && f.y + f.h <= 170, `${id} overflows y: ${f.y}+${f.h}`);
    });
  });
});

// ===== Categories =====
describe('Categories', () => {
  it('should have 3 categories', () => eq(Object.keys(CATEGORIES).length, 3));
  it('should have Japanese names', () => {
    Object.values(CATEGORIES).forEach(c => assert(c.name.length > 0));
  });
  it('should have emojis', () => {
    Object.values(CATEGORIES).forEach(c => assert(c.emoji));
  });
  it('should have colors', () => {
    Object.values(CATEGORIES).forEach(c => assert(c.color));
  });
});

// ===== Secrets =====
describe('Secrets', () => {
  it('should have 4 secrets', () => eq(SECRETS.length, 4));
  it('should have unique ids', () => eq(new Set(SECRETS.map(s => s.id)).size, 4));
  it('should have Japanese names', () => SECRETS.forEach(s => assert(s.name)));
  it('should have conditions', () => SECRETS.forEach(s => assert(s.condition)));
  it('should have descriptions', () => SECRETS.forEach(s => assert(s.desc)));
  it('secret furniture should exist', () => {
    SECRETS.forEach(s => assert(FURNITURE[s.id], `Missing furniture for secret ${s.id}`));
  });
});

// ===== checkSecrets =====
describe('checkSecrets', () => {
  it('should return nothing for 0 completed', () => {
    eq(checkSecrets(0, 15).length, 0);
  });
  it('should unlock pixel_cat at 1 completed', () => {
    const r = checkSecrets(1, 15);
    assert(r.includes('pixel_cat'));
  });
  it('should unlock nyancat at 5', () => {
    const r = checkSecrets(5, 15);
    assert(r.includes('nyancat'));
    assert(r.includes('pixel_cat'));
  });
  it('should unlock doge at 10', () => {
    const r = checkSecrets(10, 15);
    assert(r.includes('doge'));
    assert(r.includes('nyancat'));
  });
  it('should unlock this_is_fine at all completed', () => {
    const r = checkSecrets(15, 15);
    assert(r.includes('this_is_fine'));
    eq(r.length, 4);
  });
  it('should not unlock this_is_fine if not all done', () => {
    const r = checkSecrets(14, 15);
    assert(!r.includes('this_is_fine'));
  });
});

// ===== Project Structure =====
describe('Project Structure', () => {
  const files = [
    'manifest.json', 'src/newtab.html', 'src/newtab.css',
    'src/newtab.js', 'src/data.js', 'src/renderer.js',
    'README.md', 'CLAUDE.md',
  ];
  files.forEach(f => {
    it(`should have ${f}`, () => assert(existsSync(join(ROOT, f))));
  });
});

describe('Manifest V3 Validation', () => {
  const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));

  it('should be manifest v3', () => eq(manifest.manifest_version, 3));
  it('should have Japanese name', () => assert(manifest.name.includes('ピクセルホーム')));
  it('should override new tab', () => {
    assert(manifest.chrome_url_overrides.newtab);
  });
  it('should request storage permission', () => {
    assert(manifest.permissions.includes('storage'));
  });
  it('should have version', () => assert(manifest.version));
});

describe('HTML Validation', () => {
  const html = readFileSync(join(ROOT, 'src/newtab.html'), 'utf8');
  it('should have Japanese lang', () => assert(html.includes('lang="ja"')));
  it('should have canvas', () => assert(html.includes('<canvas')));
  it('should reference newtab.js', () => assert(html.includes('newtab.js')));
  it('should have Japanese title', () => assert(html.includes('ピクセルホーム')));
  it('should have task panel', () => assert(html.includes('引っ越しタスク')));
  it('should have secret section', () => assert(html.includes('シークレット')));
});

// ===== Summary =====
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🏠\x1b[0m'); }
console.log('');
