/**
 * 映画道 (Eigamichi) - Unit Tests
 * Run: node test.js
 */
const fs = require('fs');

let tests = 0, passed = 0, failed = 0;
function section(n) { console.log(`\n  \x1b[36m[${n}]\x1b[0m`); }
function test(n, fn) {
  tests++;
  try { fn(); passed++; console.log(`  \x1b[32m✓\x1b[0m ${n}`); }
  catch (e) { failed++; console.log(`  \x1b[31m✗\x1b[0m ${n}: ${e.message}`); }
}
function assert(c, m) { if (!c) throw new Error(m || 'fail'); }
function assertEqual(a, b, m) { if (a !== b) throw new Error(m || `Expected ${b}, got ${a}`); }

// Load and parse the tree from index.html
const html = fs.readFileSync('index.html', 'utf-8');

// Extract tree object - find it between "const tree = {" and the closing "};"
const treeMatch = html.match(/const tree = (\{[\s\S]*?\n\};)/);
assert(treeMatch, 'Could not find tree in HTML');

// Parse tree by evaluating it (safe since we control the content)
let tree;
eval('tree = ' + treeMatch[1].replace(/};$/, '}'));

console.log('\n  ═══════════════════════════════════════');
console.log('   映画道 (Eigamichi) - Unit Tests');
console.log('  ═══════════════════════════════════════');

// ─── Tree Structure ─────────────────────────────────
section('ツリー構造');

test('ルートノードが存在する', () => assert(tree.root));
test('ルートに5つの選択肢', () => assertEqual(tree.root.choices.length, 5));
test('ルートにテキストがある', () => assert(tree.root.text.length > 0));

const allNodes = Object.keys(tree);
const branchNodes = allNodes.filter(k => tree[k].choices);
const leafNodes = allNodes.filter(k => tree[k].movie);

test(`全${allNodes.length}ノード`, () => assert(allNodes.length > 30));
test(`分岐ノード: ${branchNodes.length}`, () => assert(branchNodes.length >= 15));
test(`映画ノード: ${leafNodes.length}`, () => assert(leafNodes.length >= 30));

// ─── Reachability ───────────────────────────────────
section('到達可能性');

function getAllReachable(nodeId, visited = new Set()) {
  if (visited.has(nodeId)) return visited;
  visited.add(nodeId);
  const node = tree[nodeId];
  if (node && node.choices) {
    for (const c of node.choices) {
      getAllReachable(c.next, visited);
    }
  }
  return visited;
}

const reachable = getAllReachable('root');
test('全ノードがルートから到達可能', () => {
  const unreachable = allNodes.filter(n => !reachable.has(n));
  assert(unreachable.length === 0, `Unreachable: ${unreachable.join(', ')}`);
});

test('全リーフが映画を持つ', () => {
  const reachableLeaves = [...reachable].filter(n => !tree[n].choices);
  for (const n of reachableLeaves) {
    assert(tree[n].movie, `Node ${n} is a leaf but has no movie`);
  }
});

// ─── Choice Integrity ───────────────────────────────
section('選択肢の整合性');

test('全選択肢のnextが存在するノードを指す', () => {
  for (const [id, node] of Object.entries(tree)) {
    if (!node.choices) continue;
    for (const c of node.choices) {
      assert(tree[c.next], `${id} → ${c.next} does not exist`);
    }
  }
});

test('全選択肢にlabelがある', () => {
  for (const [id, node] of Object.entries(tree)) {
    if (!node.choices) continue;
    for (const c of node.choices) {
      assert(c.label && c.label.length > 0, `${id} has choice without label`);
    }
  }
});

test('全選択肢にemojiがある', () => {
  for (const [id, node] of Object.entries(tree)) {
    if (!node.choices) continue;
    for (const c of node.choices) {
      assert(c.emoji && c.emoji.length > 0, `${id} has choice without emoji`);
    }
  }
});

test('分岐ノードにtextがある', () => {
  for (const node of branchNodes) {
    assert(tree[node].text && tree[node].text.length > 0, `${node} missing text`);
  }
});

// ─── Movie Data Quality ─────────────────────────────
section('映画データ品質');

test('全映画にタイトルがある', () => {
  for (const n of leafNodes) {
    assert(tree[n].movie.title, `${n} missing title`);
  }
});

test('全映画に原題がある', () => {
  for (const n of leafNodes) {
    assert(tree[n].movie.original, `${n} missing original title`);
  }
});

test('全映画に年がある', () => {
  for (const n of leafNodes) {
    const y = tree[n].movie.year;
    assert(y >= 1950 && y <= 2026, `${n} invalid year: ${y}`);
  }
});

test('全映画に監督がある', () => {
  for (const n of leafNodes) {
    assert(tree[n].movie.director, `${n} missing director`);
  }
});

test('全映画にratingがある (1-10)', () => {
  for (const n of leafNodes) {
    const r = tree[n].movie.rating;
    assert(r >= 1 && r <= 10, `${n} invalid rating: ${r}`);
  }
});

test('全映画にジャンルがある', () => {
  for (const n of leafNodes) {
    assert(tree[n].movie.genre, `${n} missing genre`);
  }
});

test('全映画に説明文がある (50文字以上)', () => {
  for (const n of leafNodes) {
    assert(tree[n].movie.desc.length >= 50, `${n} desc too short`);
  }
});

test('映画タイトルが日本語', () => {
  for (const n of leafNodes) {
    const title = tree[n].movie.title;
    assert(/[\u3000-\u9FFF]/.test(title) || /[\uFF00-\uFFEF]/.test(title),
           `${n}: "${title}" not Japanese`);
  }
});

// ─── Path Depth ─────────────────────────────────────
section('パスの深さ');

function getPathDepths(nodeId, depth = 0) {
  const node = tree[nodeId];
  if (!node.choices) return [depth];
  let depths = [];
  for (const c of node.choices) {
    depths = depths.concat(getPathDepths(c.next, depth + 1));
  }
  return depths;
}

const depths = getPathDepths('root');
const minDepth = Math.min(...depths);
const maxDepth = Math.max(...depths);
const avgDepth = depths.reduce((a, b) => a + b, 0) / depths.length;

test(`最短パス: ${minDepth}ステップ (2以上)`, () => assert(minDepth >= 2));
test(`最長パス: ${maxDepth}ステップ (5以下)`, () => assert(maxDepth <= 5));
test(`平均パス: ${avgDepth.toFixed(1)}ステップ`, () => assert(avgDepth >= 2 && avgDepth <= 4));
test(`全パス数: ${depths.length}`, () => assert(depths.length >= 30));

// ─── Uniqueness ─────────────────────────────────────
section('ユニーク性');

test('映画タイトルがユニーク', () => {
  const titles = leafNodes.map(n => tree[n].movie.title);
  const unique = new Set(titles);
  assertEqual(unique.size, titles.length, `${titles.length - unique.size} duplicates`);
});

test('映画原題がユニーク', () => {
  const originals = leafNodes.map(n => tree[n].movie.original);
  const unique = new Set(originals);
  // Allow 1 duplicate (Arrival appears in 2 branches)
  assert(unique.size >= originals.length - 1, `Too many duplicates`);
});

// ─── HTML Quality ───────────────────────────────────
section('HTML品質');

test('日本語のtitleタグ', () => assert(html.includes('<title>映画道')));
test('Zen Maru Gothicフォント', () => assert(html.includes('Zen+Maru+Gothic')));
test('CSS変数が定義されている', () => assert(html.includes('--accent')));
test('アニメーションが定義されている', () => assert(html.includes('@keyframes fadeIn')));
test('レスポンシブ viewport', () => assert(html.includes('viewport')));

// ─── Summary ────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
if (failed === 0) {
  console.log(`  \x1b[32m ✓ ${passed}/${tests} テスト全て合格！\x1b[0m`);
} else {
  console.log(`  \x1b[31m ✗ ${passed}/${tests} 合格 (${failed}件失敗)\x1b[0m`);
}
console.log(`  📊 ノード: ${allNodes.length} | 映画: ${leafNodes.length} | パス: ${depths.length}`);
console.log('  ═══════════════════════════════════════\n');
process.exit(failed > 0 ? 1 : 0);
