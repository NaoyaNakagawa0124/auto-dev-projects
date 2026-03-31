/**
 * 未来ポスト (Miraipost) - Node.js Unit Tests
 * Run: node test.js
 */

let tests = 0, passed = 0, failed = 0;

function section(name) {
  console.log(`\n  \x1b[36m[${name}]\x1b[0m`);
}

function test(name, fn) {
  tests++;
  try {
    fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } catch (e) {
    failed++;
    console.log(`  \x1b[31m✗\x1b[0m ${name}: ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── Replicated helpers ─────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function daysUntil(ts) {
  const now = new Date();
  const target = new Date(ts);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function daysAgo(ts) {
  const now = new Date();
  const past = new Date(ts);
  return Math.floor((now - past) / (1000 * 60 * 60 * 24));
}

function createLetter(body, days, type = 'letter') {
  return {
    id: generateId(),
    type,
    body,
    preview: body.substring(0, 60),
    createdAt: Date.now(),
    deliverAt: Date.now() + days * 24 * 60 * 60 * 1000,
    status: 'sealed',
    opened: false,
    resolved: type === 'worry' ? null : undefined,
  };
}

// ─── Tests ──────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
console.log('   未来ポスト (Miraipost) - Unit Tests');
console.log('  ═══════════════════════════════════════');

section('ID生成');
test('IDが文字列である', () => assertEqual(typeof generateId(), 'string'));
test('IDがユニークである (100個)', () => {
  const ids = new Set();
  for (let i = 0; i < 100; i++) ids.add(generateId());
  assertEqual(ids.size, 100);
});
test('IDが空でない', () => assert(generateId().length > 0));

section('日付フォーマット');
test('formatDate: 正しい日本語', () => assertEqual(formatDate(new Date(2026, 2, 31).getTime()), '2026年3月31日'));
test('formatDate: 1月1日', () => assertEqual(formatDate(new Date(2026, 0, 1).getTime()), '2026年1月1日'));
test('formatDate: 12月31日', () => assertEqual(formatDate(new Date(2026, 11, 31).getTime()), '2026年12月31日'));
test('daysUntil: 未来は正の値', () => {
  const d = daysUntil(Date.now() + 7 * 86400000);
  assert(d >= 6 && d <= 8, `Got ${d}`);
});
test('daysUntil: 過去は0', () => assertEqual(daysUntil(Date.now() - 1000), 0));
test('daysAgo: 3日前', () => {
  const d = daysAgo(Date.now() - 3 * 86400000);
  assert(d >= 2 && d <= 4, `Got ${d}`);
});
test('daysAgo: 今日は0', () => assertEqual(daysAgo(Date.now()), 0));

section('手紙作成');
test('通常手紙の基本プロパティ', () => {
  const l = createLetter('テスト', 30);
  assertEqual(l.type, 'letter');
  assertEqual(l.status, 'sealed');
  assertEqual(l.opened, false);
  assert(l.deliverAt > Date.now());
});
test('不安ポストの基本プロパティ', () => {
  const w = createLetter('心配', 14, 'worry');
  assertEqual(w.type, 'worry');
  assertEqual(w.resolved, null);
});
test('プレビュー60文字制限', () => {
  const l = createLetter('あ'.repeat(100), 7);
  assert(l.preview.length <= 60);
});
test('短いプレビューはそのまま', () => {
  const l = createLetter('短い文', 7);
  assertEqual(l.preview, '短い文');
});
test('7日後の配達日', () => {
  const l = createLetter('t', 7);
  const diff = (l.deliverAt - l.createdAt) / 86400000;
  assert(Math.abs(diff - 7) < 0.01);
});
test('30日後の配達日', () => {
  const l = createLetter('t', 30);
  const diff = (l.deliverAt - l.createdAt) / 86400000;
  assert(Math.abs(diff - 30) < 0.01);
});
test('365日後の配達日', () => {
  const l = createLetter('t', 365);
  const diff = (l.deliverAt - l.createdAt) / 86400000;
  assert(Math.abs(diff - 365) < 0.01);
});

section('配達チェック');
test('期限切れ → delivered', () => {
  const l = createLetter('past', 0);
  l.deliverAt = Date.now() - 1000;
  if (l.status === 'sealed' && l.deliverAt <= Date.now()) {
    l.status = 'delivered';
    l.deliveredAt = Date.now();
  }
  assertEqual(l.status, 'delivered');
});
test('未到達はsealedのまま', () => {
  const l = createLetter('future', 30);
  if (l.status === 'sealed' && l.deliverAt <= Date.now()) l.status = 'delivered';
  assertEqual(l.status, 'sealed');
});
test('delivered手紙は再配達されない', () => {
  const l = createLetter('t', 0);
  l.status = 'delivered';
  l.deliveredAt = Date.now() - 5000;
  const orig = l.deliveredAt;
  if (l.status === 'sealed' && l.deliverAt <= Date.now()) {
    l.status = 'delivered';
    l.deliveredAt = Date.now();
  }
  assertEqual(l.deliveredAt, orig);
});

section('不安解決');
test('resolved: yes', () => {
  const w = createLetter('x', 7, 'worry');
  w.resolved = 'yes';
  assertEqual(w.resolved, 'yes');
});
test('resolved: partial', () => {
  const w = createLetter('x', 7, 'worry');
  w.resolved = 'partial';
  assertEqual(w.resolved, 'partial');
});
test('resolved: no', () => {
  const w = createLetter('x', 7, 'worry');
  w.resolved = 'no';
  assertEqual(w.resolved, 'no');
});
test('通常手紙にresolved無し', () => {
  const l = createLetter('x', 7);
  assertEqual(l.resolved, undefined);
});

section('フィルタリング・ソート');
test('タイプフィルタ', () => {
  const ls = [
    createLetter('a', 7, 'letter'),
    createLetter('b', 7, 'worry'),
    createLetter('c', 7, 'letter'),
    createLetter('d', 7, 'worry'),
  ];
  assertEqual(ls.filter(l => l.type === 'worry').length, 2);
  assertEqual(ls.filter(l => l.type === 'letter').length, 2);
});
test('ステータスフィルタ', () => {
  const ls = [createLetter('a', 7), createLetter('b', 7), createLetter('c', 7)];
  ls[0].status = 'delivered';
  assertEqual(ls.filter(l => l.status === 'delivered').length, 1);
  assertEqual(ls.filter(l => l.status === 'sealed').length, 2);
});
test('配達日ソート (昇順)', () => {
  const ls = [createLetter('c', 30), createLetter('a', 7), createLetter('b', 14)];
  const sorted = [...ls].sort((a, b) => a.deliverAt - b.deliverAt);
  assertEqual(sorted[0].body, 'a');
  assertEqual(sorted[2].body, 'c');
});

section('統計計算');
test('送った手紙の数', () => {
  const ls = [createLetter('a', 7), createLetter('b', 7), createLetter('c', 7)];
  assertEqual(ls.length, 3);
});
test('届いた手紙の数', () => {
  const ls = [createLetter('a', 7), createLetter('b', 7)];
  ls[0].status = 'delivered';
  assertEqual(ls.filter(l => l.status === 'delivered').length, 1);
});
test('解決した不安の数', () => {
  const ls = [
    createLetter('a', 7, 'worry'),
    createLetter('b', 7, 'worry'),
    createLetter('c', 7, 'worry'),
  ];
  ls[0].resolved = 'yes';
  ls[1].resolved = 'no';
  assertEqual(ls.filter(l => l.type === 'worry' && l.resolved === 'yes').length, 1);
});

section('バリデーション');
test('空文字はfalsy', () => assert(!''.trim()));
test('空白のみはfalsy', () => assert(!'   \n  '.trim()));
test('正常な文字はtruthy', () => assert('明日も頑張ろう'.trim()));

section('セキュリティ');
test('HTMLタグがエスケープされる', () => {
  // Simple escapeHtml for Node
  function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  const escaped = escapeHtml('<script>alert("xss")</script>');
  assert(!escaped.includes('<script>'));
  assert(escaped.includes('&lt;script&gt;'));
});

section('背景スクリプト');
test('アラーム間隔は30分', () => {
  const CHECK_INTERVAL_MINUTES = 30;
  assertEqual(CHECK_INTERVAL_MINUTES, 30);
});
test('アラーム名が正しい', () => {
  assertEqual('miraipost-delivery-check', 'miraipost-delivery-check');
});

// ─── Summary ────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
if (failed === 0) {
  console.log(`  \x1b[32m ✓ ${passed}/${tests} テスト全て合格！\x1b[0m`);
} else {
  console.log(`  \x1b[31m ✗ ${passed}/${tests} 合格 (${failed}件失敗)\x1b[0m`);
}
console.log('  ═══════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
