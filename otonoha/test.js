/**
 * 音の葉 (Otonoha) - Unit Tests
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

const html = fs.readFileSync('index.html', 'utf-8');

console.log('\n  ═══════════════════════════════════════');
console.log('   音の葉 (Otonoha) - Unit Tests');
console.log('  ═══════════════════════════════════════');

// ─── HTML Structure ─────────────────────────────────
section('HTML構造');
test('日本語タイトル', () => assert(html.includes('<title>音の葉')));
test('p5.jsライブラリ読み込み', () => assert(html.includes('p5.js') || html.includes('p5.min.js')));
test('Zen Maru Gothicフォント', () => assert(html.includes('Zen+Maru+Gothic')));
test('viewport設定あり', () => assert(html.includes('viewport')));
test('canvas要素が作られる', () => assert(html.includes('createCanvas')));

// ─── Genre Styles ───────────────────────────────────
section('ジャンルスタイル');

// Extract genreStyles
const genreMatch = html.match(/const genreStyles = (\{[\s\S]*?\n\};)/);
assert(genreMatch, 'Could not find genreStyles');
let genreStyles;
eval('genreStyles = ' + genreMatch[1].replace(/};$/, '}'));

test('Popスタイルが定義されている', () => assert(genreStyles['Pop']));
test('J-Popスタイルが定義されている', () => assert(genreStyles['J-Pop']));
test('Hip-Hopスタイルが定義されている', () => assert(genreStyles['Hip-Hop']));
test('Rockスタイルが定義されている', () => assert(genreStyles['Rock']));
test('K-Popスタイルが定義されている', () => assert(genreStyles['K-Pop']));
test('Animeスタイルが定義されている', () => assert(genreStyles['Anime']));
test('defaultスタイルが定義されている', () => assert(genreStyles['default']));

test('各スタイルにhueがある', () => {
  for (const [k, v] of Object.entries(genreStyles)) {
    assert(typeof v.hue === 'number', `${k} missing hue`);
    assert(v.hue >= 0 && v.hue <= 360, `${k} hue out of range: ${v.hue}`);
  }
});

test('各スタイルにpetalsがある', () => {
  for (const [k, v] of Object.entries(genreStyles)) {
    assert(typeof v.petals === 'number' && v.petals >= 3, `${k} invalid petals`);
  }
});

test('各スタイルにshapeがある', () => {
  const validShapes = ['round', 'angular', 'spiky'];
  for (const [k, v] of Object.entries(genreStyles)) {
    assert(validShapes.includes(v.shape), `${k} invalid shape: ${v.shape}`);
  }
});

// ─── Fallback Song Data ─────────────────────────────
section('フォールバックデータ');

const songMatch = html.match(/const fallbackSongs = (\[[\s\S]*?\];)/);
assert(songMatch, 'Could not find fallbackSongs');
let fallbackSongs;
eval('fallbackSongs = ' + songMatch[1]);

test(`${fallbackSongs.length}曲のフォールバックデータ`, () => assert(fallbackSongs.length >= 20));

test('全曲にnameがある', () => {
  for (const s of fallbackSongs) assert(s.name && s.name.length > 0, `Missing name`);
});

test('全曲にartistがある', () => {
  for (const s of fallbackSongs) assert(s.artist && s.artist.length > 0, `Missing artist`);
});

test('全曲にgenreがある', () => {
  for (const s of fallbackSongs) assert(s.genre && s.genre.length > 0, `Missing genre`);
});

test('全曲にrankがある (1-25)', () => {
  for (const s of fallbackSongs) {
    assert(s.rank >= 1 && s.rank <= 25, `Invalid rank: ${s.rank}`);
  }
});

test('rankが昇順', () => {
  for (let i = 1; i < fallbackSongs.length; i++) {
    assert(fallbackSongs[i].rank >= fallbackSongs[i-1].rank, 'Not sorted');
  }
});

test('日本語の曲が含まれる', () => {
  const jpSongs = fallbackSongs.filter(s => /[\u3000-\u9FFF]/.test(s.name));
  assert(jpSongs.length >= 5, `Only ${jpSongs.length} JP songs`);
});

test('多様なジャンル', () => {
  const genres = new Set(fallbackSongs.map(s => s.genre));
  assert(genres.size >= 5, `Only ${genres.size} genres`);
});

test('YOASOBIが含まれる', () => {
  assert(fallbackSongs.some(s => s.artist === 'YOASOBI'));
});

// ─── API Integration ────────────────────────────────
section('API連携');
test('iTunes RSS APIのURLが正しい', () => {
  assert(html.includes('itunes.apple.com/jp/rss/topsongs'));
});
test('フォールバック処理がある', () => {
  assert(html.includes('catch') && html.includes('fallbackSongs'));
});
test('チャート情報表示がある', () => {
  assert(html.includes('chart-info'));
});

// ─── Flower Rendering ───────────────────────────────
section('花のレンダリング');
test('Flowerクラスが定義されている', () => assert(html.includes('class Flower')));
test('花にgrowthアニメーションがある', () => assert(html.includes('this.growth')));
test('花に風のswayがある', () => assert(html.includes('this.swayPhase')));
test('花弁の描画がある', () => assert(html.includes('petalCount')));
test('茎の描画がある', () => assert(html.includes('stemHeight')));
test('葉の描画がある', () => assert(html.includes('leafAngle')));
test('花のホバー検出がある', () => assert(html.includes('isHovered')));

// ─── Particle System ────────────────────────────────
section('パーティクル');
test('Petalクラスが定義されている', () => assert(html.includes('class Petal')));
test('花弁パーティクルが20個', () => assert(html.includes('i < 20')));

// ─── Controls ───────────────────────────────────────
section('操作');
test('風のトグルボタン', () => assert(html.includes('toggleWind')));
test('再生成ボタン', () => assert(html.includes('regrow')));
test('ラベルトグルボタン', () => assert(html.includes('toggleLabels')));
test('ホバー情報パネル', () => assert(html.includes('song-info')));

// ─── Japanese UI ────────────────────────────────────
section('日本語UI');
test('タイトルが日本語', () => assert(html.includes('音の葉')));
test('サブタイトルが日本語', () => assert(html.includes('音楽チャートから咲く花の庭')));
test('ボタンラベルが日本語', () => {
  assert(html.includes('風'));
  assert(html.includes('再生成'));
  assert(html.includes('名前'));
});
test('ローディングメッセージが日本語', () => assert(html.includes('チャートデータを読み込み中')));

// ─── Summary ────────────────────────────────────────
console.log('\n  ═══════════════════════════════════════');
if (failed === 0) {
  console.log(`  \x1b[32m ✓ ${passed}/${tests} テスト全て合格！\x1b[0m`);
} else {
  console.log(`  \x1b[31m ✗ ${passed}/${tests} 合格 (${failed}件失敗)\x1b[0m`);
}
console.log('  ═══════════════════════════════════════\n');
process.exit(failed > 0 ? 1 : 0);
