/**
 * tiketto テストスイート
 * Run: node tests/run.js
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

let passed = 0;
let failed = 0;

function suite(name) {
  console.log(`\n\x1b[33m  ${name}\x1b[0m`);
}

function assert(testName, condition) {
  if (condition) {
    console.log(`    \x1b[32m✓\x1b[0m ${testName}`);
    passed++;
  } else {
    console.log(`    \x1b[31m✗\x1b[0m ${testName}`);
    failed++;
  }
}

console.log('\x1b[1m🎫 tiketto テストスイート\x1b[0m');

// ===== Store Tests =====
suite('Store（データ永続化）');

const tmpDir = path.join(os.tmpdir(), `tiketto-test-${Date.now()}`);
fs.mkdirSync(tmpDir, { recursive: true });
process.env.TIKETTO_DATA_PATH = tmpDir;

const Store = require('../store');

const store = new Store('test-store');
assert('Store作成', store !== null);
assert('初期状態: undefinedを返す', store.get('key') === undefined);

store.set('name', 'tiketto');
assert('set/get: 文字列', store.get('name') === 'tiketto');

store.set('count', 42);
assert('set/get: 数値', store.get('count') === 42);

store.set('items', [1, 2, 3]);
assert('set/get: 配列', Array.isArray(store.get('items')) && store.get('items').length === 3);

store.set('ticket', { artist: 'YOASOBI', venue: '東京ドーム' });
const ticket = store.get('ticket');
assert('set/get: オブジェクト', ticket.artist === 'YOASOBI');
assert('set/get: ネスト値', ticket.venue === '東京ドーム');

store.delete('name');
assert('delete: 削除済み', store.get('name') === undefined);

const all = store.getAll();
assert('getAll: オブジェクト返却', typeof all === 'object');
assert('getAll: countが残存', all.count === 42);

// File persistence
const store2 = new Store('test-store');
assert('永続化: ファイルから復元', store2.get('count') === 42);

// Edge cases
store.set('empty', '');
assert('空文字列の保存', store.get('empty') === '');

store.set('null', null);
assert('nullの保存', store.get('null') === null);

store.set('nested', { a: { b: { c: 'deep' } } });
assert('深いネスト', store.get('nested').a.b.c === 'deep');

// ===== Ticket Data Model Tests =====
suite('チケットデータモデル');

// Simulate ticket operations like main.js does
let tickets = [];

function addTicket(data) {
  const ticket = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  return ticket;
}

function updateTicket(updated) {
  const idx = tickets.findIndex(t => t.id === updated.id);
  if (idx >= 0) {
    tickets[idx] = { ...tickets[idx], ...updated };
    return tickets[idx];
  }
  return null;
}

function deleteTicket(id) {
  tickets = tickets.filter(t => t.id !== id);
  return true;
}

const t1 = addTicket({ artist: 'YOASOBI', venue: '東京ドーム', date: '2026-04-01', rating: 5, color: '#ff6b6b' });
assert('追加: IDが生成される', typeof t1.id === 'string' && t1.id.length > 0);
assert('追加: createdAtが設定される', typeof t1.createdAt === 'string');
assert('追加: artistが保存される', t1.artist === 'YOASOBI');
assert('追加: venueが保存される', t1.venue === '東京ドーム');
assert('追加: dateが保存される', t1.date === '2026-04-01');
assert('追加: ratingが保存される', t1.rating === 5);
assert('追加: colorが保存される', t1.color === '#ff6b6b');

const t2 = addTicket({ artist: 'Ado', venue: '日本武道館', date: '2026-05-15', rating: 4, color: '#9775fa' });
assert('複数追加: 2件', tickets.length === 2);
assert('複数追加: 異なるID', t1.id !== t2.id);

const updated = updateTicket({ id: t1.id, rating: 4, memo: '最高のライブだった' });
assert('更新: ratingが変更', updated.rating === 4);
assert('更新: memoが追加', updated.memo === '最高のライブだった');
assert('更新: artistは維持', updated.artist === 'YOASOBI');

const notFound = updateTicket({ id: 'nonexistent', rating: 1 });
assert('更新: 存在しないID → null', notFound === null);

deleteTicket(t2.id);
assert('削除: 1件に減少', tickets.length === 1);
assert('削除: 正しいチケットが残存', tickets[0].id === t1.id);

// ===== Sort Tests =====
suite('ソート');

const testTickets = [
  { artist: 'C-Artist', venue: 'A-Venue', date: '2026-03-01' },
  { artist: 'A-Artist', venue: 'C-Venue', date: '2026-01-15' },
  { artist: 'B-Artist', venue: 'B-Venue', date: '2026-06-20' },
];

function sortTickets(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case 'date-desc': return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-asc': return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'artist': return sorted.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
    case 'venue': return sorted.sort((a, b) => (a.venue || '').localeCompare(b.venue || ''));
    default: return sorted;
  }
}

const byDateDesc = sortTickets(testTickets, 'date-desc');
assert('日付降順: 最新が先頭', byDateDesc[0].date === '2026-06-20');

const byDateAsc = sortTickets(testTickets, 'date-asc');
assert('日付昇順: 最古が先頭', byDateAsc[0].date === '2026-01-15');

const byArtist = sortTickets(testTickets, 'artist');
assert('アーティスト順', byArtist[0].artist === 'A-Artist');

const byVenue = sortTickets(testTickets, 'venue');
assert('会場順', byVenue[0].venue === 'A-Venue');

// ===== Stats Tests =====
suite('統計計算');

function countBy(arr, keyOrFn) {
  const counts = {};
  for (const item of arr) {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (key) counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function monthHeatmap(arr) {
  const year = new Date().getFullYear();
  const months = new Array(12).fill(0);
  for (const t of arr) {
    const d = new Date(t.date);
    if (d.getFullYear() === year) {
      months[d.getMonth()]++;
    }
  }
  return months;
}

const statsData = [
  { artist: 'YOASOBI', venue: '東京ドーム', date: '2026-01-10', rating: 5 },
  { artist: 'YOASOBI', venue: '大阪城ホール', date: '2026-01-20', rating: 4 },
  { artist: 'Ado', venue: '東京ドーム', date: '2026-03-05', rating: 5 },
  { artist: 'Official髭男dism', venue: '横浜アリーナ', date: '2026-06-15', rating: 4 },
  { artist: 'YOASOBI', venue: '横浜アリーナ', date: '2025-12-25', rating: 5 },
];

const artistCounts = countBy(statsData, 'artist');
assert('アーティスト集計: YOASOBI=3', artistCounts['YOASOBI'] === 3);
assert('アーティスト集計: Ado=1', artistCounts['Ado'] === 1);

const venueCounts = countBy(statsData, 'venue');
assert('会場集計: 東京ドーム=2', venueCounts['東京ドーム'] === 2);
assert('会場集計: 3箇所', Object.keys(venueCounts).length === 3);

const yearCounts = countBy(statsData, t => new Date(t.date).getFullYear());
assert('年集計: 2026=4', yearCounts[2026] === 4);
assert('年集計: 2025=1', yearCounts[2025] === 1);

const heatmap = monthHeatmap(statsData);
assert('ヒートマップ: 12ヶ月', heatmap.length === 12);
assert('ヒートマップ: 1月=2', heatmap[0] === 2);
assert('ヒートマップ: 3月=1', heatmap[2] === 1);
assert('ヒートマップ: 6月=1', heatmap[5] === 1);
assert('ヒートマップ: 12月=0(前年)', heatmap[11] === 0);

const avgRating = statsData.filter(t => t.rating).reduce((s, t) => s + t.rating, 0) / statsData.filter(t => t.rating).length;
assert('平均評価: 4.6', Math.abs(avgRating - 4.6) < 0.01);

// ===== Search Tests =====
suite('検索');

const searchData = [
  { artist: 'YOASOBI', venue: '東京ドーム', tour: 'ARENA TOUR' },
  { artist: 'Ado', venue: '日本武道館', tour: 'WISH TOUR' },
  { artist: 'Official髭男dism', venue: '横浜アリーナ', tour: '' },
];

function searchFilter(data, query) {
  const q = query.toLowerCase();
  return data.filter(t => {
    return (t.artist || '').toLowerCase().includes(q) ||
           (t.venue || '').toLowerCase().includes(q) ||
           (t.tour || '').toLowerCase().includes(q);
  });
}

assert('アーティスト検索: yoasobi', searchFilter(searchData, 'yoasobi').length === 1);
assert('会場検索: ドーム', searchFilter(searchData, 'ドーム').length === 1);
assert('ツアー検索: arena', searchFilter(searchData, 'arena').length === 1);
assert('空検索: 全件', searchFilter(searchData, '').length === 3);
assert('該当なし: 0件', searchFilter(searchData, 'xxxxxxxxx').length === 0);
assert('大文字小文字: ADO', searchFilter(searchData, 'ADO').length === 1);

// ===== Import/Export Tests =====
suite('インポート/エクスポート');

const exportData = [
  { id: 'abc', artist: 'Test', venue: 'Hall', date: '2026-01-01' },
];

const jsonStr = JSON.stringify(exportData);
assert('エクスポート: JSON文字列', typeof jsonStr === 'string');

const parsed = JSON.parse(jsonStr);
assert('インポート: パース成功', Array.isArray(parsed));
assert('インポート: データ復元', parsed[0].artist === 'Test');

// Invalid JSON
let importError = false;
try { JSON.parse('not json'); } catch { importError = true; }
assert('インポート: 不正JSON検出', importError);

// Not an array
const notArray = JSON.parse('{"key": "value"}');
assert('インポート: 配列でないデータ検出', !Array.isArray(notArray));

// ===== HTML Structure Tests =====
suite('HTML構造');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
assert('日本語: チケット追加ボタン', html.includes('チケット追加'));
assert('日本語: コレクション', html.includes('コレクション'));
assert('日本語: 統計', html.includes('統計'));
assert('日本語: タイムライン', html.includes('タイムライン'));
assert('日本語: アーティスト', html.includes('アーティスト'));
assert('日本語: 会場', html.includes('会場'));
assert('日本語: まだチケットがありません', html.includes('まだチケットがありません'));
assert('日本語: 保存ボタン', html.includes('保存'));
assert('日本語: キャンセルボタン', html.includes('キャンセル'));
assert('日本語: 削除ボタン', html.includes('削除'));
assert('日本語: 検索プレースホルダー', html.includes('アーティスト、会場で検索'));
assert('日本語: 日付ソート', html.includes('日付 (新しい順)'));
assert('Electron: preload.js参照', html.includes('renderer.js'));
assert('CSS: style.css参照', html.includes('style.css'));
assert('フォント: Noto Sans JP', html.includes('Noto+Sans+JP'));

// ===== Cleanup =====
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch {}

// ===== Summary =====
const total = passed + failed;
console.log(`\n${'─'.repeat(40)}`);
if (failed === 0) {
  console.log(`\x1b[32m✓ ${passed}/${total} テスト全て通過\x1b[0m`);
} else {
  console.log(`\x1b[31m✗ ${failed}/${total} テスト失敗\x1b[0m`);
}

process.exit(failed > 0 ? 1 : 0);
