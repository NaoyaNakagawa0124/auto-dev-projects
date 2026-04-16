/**
 * 流彩 テストスイート (Node.js)
 * Run: node tests.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Build a script that includes all source files + tests
const fluidSrc = fs.readFileSync(path.join(__dirname, 'fluid.js'), 'utf8');
const palettesSrc = fs.readFileSync(path.join(__dirname, 'palettes.js'), 'utf8');
const gallerySrc = fs.readFileSync(path.join(__dirname, 'gallery.js'), 'utf8');

const testScript = `
${fluidSrc}
${palettesSrc}
${gallerySrc}

let passed = 0;
let failed = 0;

function suite(name) {
  log('\\n\\x1b[33m  ' + name + '\\x1b[0m');
}

function assert(testName, condition) {
  if (condition) {
    log('    \\x1b[32m✓\\x1b[0m ' + testName);
    passed++;
  } else {
    log('    \\x1b[31m✗\\x1b[0m ' + testName);
    failed++;
  }
}

log('\\x1b[1m流彩 テストスイート\\x1b[0m');

// ===== FluidSolver Tests =====
suite('FluidSolver');

const f = new FluidSolver(64);
assert('コンストラクタ: グリッドサイズ', f.N === 64);
assert('コンストラクタ: バッファサイズ', f.size === 66 * 66);
assert('コンストラクタ: 速度場U初期化', f.u.length === f.size);
assert('コンストラクタ: 速度場V初期化', f.v.length === f.size);
assert('コンストラクタ: 密度場R初期化', f.densityR.length === f.size);
assert('コンストラクタ: 密度場G初期化', f.densityG.length === f.size);
assert('コンストラクタ: 密度場B初期化', f.densityB.length === f.size);
assert('コンストラクタ: 密度場A初期化', f.densityA.length === f.size);

// IX
assert('IX: インデックス計算', f.IX(5, 3) === 5 + 66 * 3);
assert('IX: 原点', f.IX(0, 0) === 0);
assert('IX: 右下', f.IX(65, 65) === 65 + 66 * 65);

// Reset
f.densityR[100] = 1.0;
f.u[200] = 5.0;
f.inkLayers.push({ test: true });
f.reset();
assert('リセット: 密度クリア', f.densityR[100] === 0);
assert('リセット: 速度クリア', f.u[200] === 0);
assert('リセット: インクレイヤークリア', f.inkLayers.length === 0);

// addDensity
f.reset();
f.addDensity(10, 10, 0.5, 0.3, 0.1, 1.0);
const idx = f.IX(10, 10);
assert('addDensity: R値', Math.abs(f.densityR[idx] - 0.5) < 0.001);
assert('addDensity: G値', Math.abs(f.densityG[idx] - 0.3) < 0.001);
assert('addDensity: B値', Math.abs(f.densityB[idx] - 0.1) < 0.001);
assert('addDensity: A値 ≤ 1', f.densityA[idx] <= 1.0);

// addDensity accumulation
f.addDensity(10, 10, 0.5, 0.3, 0.1, 0.5);
assert('addDensity: 蓄積R', Math.abs(f.densityR[idx] - 0.75) < 0.001);
assert('addDensity: Aクランプ', f.densityA[idx] <= 1.0);

// addVelocity
f.reset();
f.addVelocity(20, 20, 3.0, -2.0);
const vidx = f.IX(20, 20);
assert('addVelocity: X', f.u[vidx] === 3.0);
assert('addVelocity: Y', f.v[vidx] === -2.0);

f.addVelocity(20, 20, 1.0, 1.0);
assert('addVelocity: 蓄積X', f.u[vidx] === 4.0);
assert('addVelocity: 蓄積Y', f.v[vidx] === -1.0);

// dropInk
f.reset();
f.dropInk(32, 32, 5, 1.0, 0.0, 0.0, 0.5);
assert('dropInk: 中心に密度', f.densityR[f.IX(32, 32)] > 0);
assert('dropInk: 周辺に密度', f.densityR[f.IX(33, 32)] > 0);
assert('dropInk: 遠方は密度なし', f.densityR[f.IX(50, 50)] === 0);
assert('dropInk: レイヤー記録', f.inkLayers.length === 1);
assert('dropInk: レイヤーの色R', f.inkLayers[0].r === 1.0);
assert('dropInk: レイヤーの色G', f.inkLayers[0].g === 0.0);

// Marangoni velocity
let hasVel = false;
for (let i = -5; i <= 5; i++) {
  for (let j = -5; j <= 5; j++) {
    if (i === 0 && j === 0) continue;
    const vi = f.IX(32 + i, 32 + j);
    if (Math.abs(f.u[vi]) > 0.001 || Math.abs(f.v[vi]) > 0.001) hasVel = true;
  }
}
assert('dropInk: マランゴニ速度場', hasVel);

// Step
f.reset();
f.dropInk(32, 32, 5, 0.5, 0.5, 0.5, 0.3);
f.step();
assert('step: クラッシュなし', true);
assert('step: 密度が拡散', f.densityR[f.IX(33, 32)] > 0 || f.densityR[f.IX(32, 33)] > 0);

// Stability
for (let i = 0; i < 50; i++) f.step();
let hasNaN = false;
for (let i = 0; i < f.size; i++) {
  if (isNaN(f.densityR[i]) || isNaN(f.u[i]) || isNaN(f.v[i])) { hasNaN = true; break; }
}
assert('step: 50ステップ安定（NaN無し）', !hasNaN);

// Energy dissipation
f.reset();
f.addVelocity(32, 32, 10.0, 10.0);
for (let i = 0; i < 100; i++) f.step();
assert('step: 速度減衰', Math.abs(f.u[f.IX(32, 32)]) < 10.0);

// Boundary
f.reset();
f.addDensity(1, 1, 1, 1, 1, 1);
f.addVelocity(1, 1, 5, 5);
f.step();
assert('境界条件: 端で安定', true);

// Large drop
f.reset();
f.dropInk(32, 32, 15, 1, 0, 0, 1.0);
f.step();
assert('大きなドロップ: 安定', !isNaN(f.densityR[f.IX(32, 32)]));

// Multiple colors
f.reset();
f.dropInk(20, 20, 5, 1, 0, 0, 0.5);
f.dropInk(40, 40, 5, 0, 1, 0, 0.5);
assert('複数色: 赤のみ赤', f.densityR[f.IX(20, 20)] > 0);
assert('複数色: 緑のみ緑', f.densityG[f.IX(40, 40)] > 0);
f.step();
assert('複数色: ステップ後安定', !isNaN(f.densityR[f.IX(20, 20)]));

// ===== Palette Tests =====
suite('パレット');

assert('getPalette: wabi', getPalette('wabi').name === '侘寂');
assert('getPalette: sakura', getPalette('sakura').name === '桜');
assert('getPalette: ocean', getPalette('ocean').name === '海');
assert('getPalette: sunset', getPalette('sunset').name === '夕焼け');
assert('getPalette: neon', getPalette('neon').name === 'ネオン');
assert('getPalette: mono', getPalette('mono').name === '墨');
assert('getPalette: 不正名fallback', getPalette('xxx').name === '侘寂');

const wabi = getPalette('wabi');
assert('色数: 5色', wabi.colors.length === 5);
assert('色: hex形式', wabi.colors[0].hex.startsWith('#'));
assert('色: rgb配列', Array.isArray(wabi.colors[0].rgb) && wabi.colors[0].rgb.length === 3);
assert('色: rgb範囲 0-1', wabi.colors.every(c => c.rgb.every(v => v >= 0 && v <= 1)));
assert('背景色: hex', wabi.background.startsWith('#'));

const names = getAllPaletteNames();
assert('getAllPaletteNames: 6個', names.length === 6);
assert('getAllPaletteNames: wabiを含む', names.includes('wabi'));
assert('getAllPaletteNames: neonを含む', names.includes('neon'));

// Consistent structure
for (const name of names) {
  const p = getPalette(name);
  assert(name + ': 5色', p.colors.length === 5);
  assert(name + ': 背景色', typeof p.background === 'string');
}

// ===== Gallery Tests =====
suite('ギャラリー');

const g = new GalleryManager();
localStorage.removeItem(g.storageKey);

assert('初期: 空', g.getAll().length === 0);
assert('getCount: 0', g.getCount() === 0);

const item = g.save('data:image/png;base64,abc', { palette: 'wabi' });
assert('保存: 返却', item !== null);
assert('保存: ID', item.id.length > 0);
assert('保存: パレット', item.palette === 'wabi');
assert('保存: 日時', item.createdAt.includes('T'));
assert('getCount: 1', g.getCount() === 1);

g.save('data:image/png;base64,def', { palette: 'sakura' });
assert('複数保存: 2件', g.getCount() === 2);

const all = g.getAll();
assert('順序: 新しい順', all[0].palette === 'sakura');

g.delete(all[0].id);
assert('削除後: 1件', g.getCount() === 1);
assert('削除後: 残りはwabi', g.getAll()[0].palette === 'wabi');

const dateStr = g.formatDate('2026-04-16T14:30:00.000Z');
assert('formatDate: /含む', dateStr.includes('/'));
assert('formatDate: :含む', dateStr.includes(':'));

localStorage.removeItem(g.storageKey);

// ===== Summary =====
const total = passed + failed;
log('\\n' + '─'.repeat(40));
if (failed === 0) {
  log('\\x1b[32m✓ ' + passed + '/' + total + ' テスト全て通過\\x1b[0m');
} else {
  log('\\x1b[31m✗ ' + failed + '/' + total + ' テスト失敗\\x1b[0m');
}

_exitCode = failed > 0 ? 1 : 0;
`;

const localStorageData = {};
const sandbox = {
  console,
  log: console.log,
  Math,
  Date,
  Float32Array,
  Array,
  Object,
  isNaN,
  parseInt,
  parseFloat,
  setTimeout,
  _exitCode: 0,
  localStorage: {
    getItem: (k) => localStorageData[k] || null,
    setItem: (k, v) => { localStorageData[k] = v; },
    removeItem: (k) => { delete localStorageData[k]; },
  },
};

vm.createContext(sandbox);
vm.runInContext(testScript, sandbox);
process.exit(sandbox._exitCode);
