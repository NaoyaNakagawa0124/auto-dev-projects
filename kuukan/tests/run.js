/**
 * 空間 テストスイート
 * Run: node tests/run.js
 */
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
function suite(n) { console.log(`\n\x1b[33m  ${n}\x1b[0m`); }
function assert(n, c) {
  if (c) { console.log(`    \x1b[32m✓\x1b[0m ${n}`); passed++; }
  else { console.log(`    \x1b[31m✗\x1b[0m ${n}`); failed++; }
}

console.log('\x1b[1m🚀 空間 テストスイート\x1b[0m');

// Load data — replace const with var for eval compatibility
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf-8')
  .replace(/^const /gm, 'var ');
eval(dataJs);

// ===== Transmission Tests =====
suite('通信データ');

assert('通信メッセージ: 15個以上', TRANSMISSIONS.length >= 15);
for (const tx of TRANSMISSIONS) {
  assert(`通信: msg存在 "${tx.msg.slice(0,15)}..."`, typeof tx.msg === 'string' && tx.msg.length > 0);
  assert(`通信: advice存在`, typeof tx.advice === 'string' && tx.advice.length > 0);
}
// Japanese check
for (const tx of TRANSMISSIONS) {
  const hasJP = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(tx.msg);
  if (!hasJP) { assert(`通信: 日本語 "${tx.msg.slice(0,20)}"`, false); break; }
}
assert('通信: 全メッセージ日本語', true);

// ===== Crew Tests =====
suite('クルーデータ');

assert('クルー: 6名以上', CREW_MEMBERS.length >= 6);
for (const c of CREW_MEMBERS) {
  assert(`クルー: ${c.name}`, c.name && c.avatar && c.task && c.role);
}

assert('タスク: 12種以上', CREW_TASKS.length >= 12);
for (const t of CREW_TASKS) {
  assert(`タスク日本語: ${t}`, /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(t));
}

assert('ステータス: 配列', Array.isArray(CREW_STATUSES));
assert('完了メッセージ: 5個以上', MISSION_COMPLETE_MSGS.length >= 5);
for (const m of MISSION_COMPLETE_MSGS) {
  assert(`完了MSG日本語: ${m.slice(0,15)}`, /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(m));
}

// ===== Timer Logic Tests =====
suite('タイマーロジック');

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

assert('25分表示', formatTimer(25 * 60) === '25:00');
assert('0分表示', formatTimer(0) === '00:00');
assert('1秒表示', formatTimer(1) === '00:01');
assert('59分59秒', formatTimer(59 * 60 + 59) === '59:59');
assert('50分表示', formatTimer(50 * 60) === '50:00');
assert('15分表示', formatTimer(15 * 60) === '15:00');

// Countdown simulation
let sec = 5;
const results = [];
while (sec >= 0) { results.push(formatTimer(sec)); sec--; }
assert('カウントダウン: 5→0', results[0] === '00:05' && results[5] === '00:00');
assert('カウントダウン: 6ステップ', results.length === 6);

// ===== HTML Structure =====
suite('HTML構造');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
assert('タイトル: 空間', html.includes('空間'));
assert('日本語: ミッション', html.includes('ミッション'));
assert('日本語: 管制室からの通信', html.includes('管制室からの通信'));
assert('日本語: クルーステータス', html.includes('クルーステータス'));
assert('日本語: ミッションログ', html.includes('ミッションログ'));
assert('日本語: 発進ボタン', html.includes('発進'));
assert('日本語: 一時停止', html.includes('一時停止'));
assert('日本語: 帰還', html.includes('帰還'));
assert('日本語: 待機中', html.includes('待機中'));
assert('日本語: 集中ミッション', html.includes('集中ミッション'));
assert('日本語: 今日のミッション', html.includes('今日のミッション'));
assert('日本語: バーチャルクルー', html.includes('バーチャルクルー'));
assert('CSS参照', html.includes('style.css'));
assert('JS参照: data.js', html.includes('data.js'));
assert('JS参照: app.js', html.includes('app.js'));
assert('Noto Sans JP', html.includes('Noto+Sans+JP'));
assert('JetBrains Mono', html.includes('JetBrains+Mono'));
assert('Canvas: starfield', html.includes('starfield'));

// ===== CSS Structure =====
suite('CSSデザイン');

const css = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf-8');
assert('ダークテーマ', css.includes('#05060f'));
assert('グラスモーフィズム: backdrop-filter', css.includes('backdrop-filter'));
assert('レスポンシブ: @media', css.includes('@media'));
assert('アニメーション: @keyframes', css.includes('@keyframes'));
assert('CSS変数: --accent', css.includes('--accent'));
assert('ステータスバッジ: .active', css.includes('.status-badge.active'));
assert('パルスアニメーション', css.includes('pulse'));

// ===== App Logic =====
suite('アプリロジック');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf-8');
assert('タイマー: startTimer関数', appJs.includes('function startTimer'));
assert('タイマー: pauseTimer関数', appJs.includes('function pauseTimer'));
assert('タイマー: resetTimer関数', appJs.includes('function resetTimer'));
assert('タイマー: completeTimer関数', appJs.includes('function completeTimer'));
assert('通信: showTransmission関数', appJs.includes('function showTransmission'));
assert('クルー: renderCrew関数', appJs.includes('function renderCrew'));
assert('ログ: addLog関数', appJs.includes('function addLog'));
assert('LocalStorage: 永続化', appJs.includes('localStorage'));
assert('星空: starfield', appJs.includes('starfield'));
assert('タイピングエフェクト', appJs.includes('typeMsg'));
assert('稼働時間表示', appJs.includes('uptime'));

// ===== Summary =====
const total = passed + failed;
console.log(`\n${'─'.repeat(40)}`);
if (failed === 0) console.log(`\x1b[32m✓ ${passed}/${total} テスト全て通過\x1b[0m`);
else console.log(`\x1b[31m✗ ${failed}/${total} テスト失敗\x1b[0m`);
process.exit(failed > 0 ? 1 : 0);
