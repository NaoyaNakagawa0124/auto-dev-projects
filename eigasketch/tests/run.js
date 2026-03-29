// EigaSketch Test Suite
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

console.log('\n\x1b[1m🎬 EigaSketch Test Suite\x1b[0m');

// Parse movie data from GDScript (extract key info for validation)
const movieGd = readFileSync(join(ROOT, 'scripts/movie_data.gd'), 'utf8');
const quizGd = readFileSync(join(ROOT, 'scripts/quiz_engine.gd'), 'utf8');

// Extract movie entries by counting Movie.new( occurrences
const movieMatches = movieGd.match(/Movie\.new\(/g) || [];
const movieCount = movieMatches.length;

// Extract genre definitions
const genreMatches = movieGd.match(/"(\w+)":\s*\{"name":\s*"([^"]+)"/g) || [];

// Extract hint types used
const hintTypes = new Set();
const hintTypeMatches = movieGd.match(/"type":\s*"(\w+)"/g) || [];
hintTypeMatches.forEach(m => { const t = m.match(/"type":\s*"(\w+)"/); if(t) hintTypes.add(t[1]); });

describe('Movie Database', () => {
  it('should have 30 movies', () => eq(movieCount, 30));
  it('should have 6 genres', () => eq(genreMatches.length, 6));
  it('should use multiple hint types', () => assert(hintTypes.size >= 4, `Only ${hintTypes.size} types`));
  it('should have circle hint type', () => assert(hintTypes.has('circle')));
  it('should have rect hint type', () => assert(hintTypes.has('rect')));
  it('should have line hint type', () => assert(hintTypes.has('line')));
  it('should have text_hint type', () => assert(hintTypes.has('text_hint')));
  it('should have star hint type', () => assert(hintTypes.has('star')));
  it('should have wave hint type', () => assert(hintTypes.has('wave')));

  // Check each genre has movies
  const genres = ['action', 'scifi', 'horror', 'romance', 'anime', 'fantasy'];
  genres.forEach(g => {
    const count = (movieGd.match(new RegExp(`"${g}"`, 'g')) || []).length;
    it(`should have movies in ${g} genre`, () => assert(count >= 5, `${g}: only ${count}`));
  });

  // Check all movies have 4 hints
  const hintArrays = movieGd.match(/\[\s*\{/g) || [];
  it('hint arrays should be present for all movies', () => assert(hintArrays.length >= 30));
});

describe('Movie Titles (Japanese)', () => {
  const titles = [
    'ダイ・ハード', 'マトリックス', 'スター・ウォーズ', 'タイタニック',
    'となりのトトロ', '千と千尋の神隠し', 'ハリー・ポッター', 'リング',
    'インセプション', 'ジョン・ウィック', 'アナと雪の女王', 'もののけ姫',
    'ブレードランナー', 'ラ・ラ・ランド', '君の名は。', 'ジョーズ',
  ];
  titles.forEach(t => {
    it(`should contain "${t}"`, () => assert(movieGd.includes(t)));
  });
});

describe('Quiz Engine Logic', () => {
  it('should have TIME_PER_QUESTION constant', () => assert(quizGd.includes('TIME_PER_QUESTION')));
  it('should have SPEED_BONUS_MAX constant', () => assert(quizGd.includes('SPEED_BONUS_MAX')));
  it('should have BASE_POINTS constant', () => assert(quizGd.includes('BASE_POINTS')));
  it('should have HINT_PENALTY constant', () => assert(quizGd.includes('HINT_PENALTY')));
  it('should calculate accuracy', () => assert(quizGd.includes('get_accuracy')));
  it('should have grade system', () => assert(quizGd.includes('get_grade')));
  it('should have S grade', () => assert(quizGd.includes('"S"')));
  it('should have results function', () => assert(quizGd.includes('get_results')));
  it('should track correct count', () => assert(quizGd.includes('correct_count')));
  it('should have next_question', () => assert(quizGd.includes('next_question')));
  it('should have reveal_next_hint', () => assert(quizGd.includes('reveal_next_hint')));
});

describe('Sketch Drawer', () => {
  const sketchGd = readFileSync(join(ROOT, 'scripts/sketch_drawer.gd'), 'utf8');
  it('should draw wobbly circles', () => assert(sketchGd.includes('_draw_wobbly_circle')));
  it('should draw wobbly rects', () => assert(sketchGd.includes('_draw_wobbly_rect')));
  it('should draw wobbly lines', () => assert(sketchGd.includes('_draw_wobbly_line')));
  it('should draw wobbly stars', () => assert(sketchGd.includes('_draw_wobbly_star')));
  it('should draw wobbly waves', () => assert(sketchGd.includes('_draw_wobbly_wave')));
  it('should have paper grid background', () => assert(sketchGd.includes('grid')));
  it('should support hint labels', () => assert(sketchGd.includes('hint')));
});

describe('Japanese UI Text', () => {
  const mainTscn = readFileSync(join(ROOT, 'scenes/main.tscn'), 'utf8');
  const mainUi = readFileSync(join(ROOT, 'scenes/main_ui.gd'), 'utf8');

  it('scene should have Japanese title', () => assert(mainTscn.includes('映画スケッチ')));
  it('scene should have Japanese subtitle', () => assert(mainTscn.includes('スケッチから映画を当てろ')));
  it('scene should have start button', () => assert(mainTscn.includes('クイズ開始')));
  it('scene should have challenge button', () => assert(mainTscn.includes('全30問チャレンジ')));
  it('UI should have result screen text', () => assert(mainUi.includes('クイズ結果')));
  it('UI should have retry button', () => assert(mainUi.includes('もう一度')));
  it('UI should have correct/wrong text', () => assert(mainUi.includes('正解')));
  it('quiz should have Japanese grades', () => assert(quizGd.includes('映画博士')));
  it('quiz should have Japanese grade labels', () => assert(quizGd.includes('シネフィル')));
});

describe('Project Structure', () => {
  const files = [
    'project.godot', 'icon.svg',
    'scripts/movie_data.gd', 'scripts/quiz_engine.gd', 'scripts/sketch_drawer.gd',
    'scenes/main.tscn', 'scenes/main_ui.gd',
    'README.md', 'CLAUDE.md',
  ];
  files.forEach(f => {
    it(`should have ${f}`, () => assert(existsSync(join(ROOT, f))));
  });
});

describe('Project Config', () => {
  const pg = readFileSync(join(ROOT, 'project.godot'), 'utf8');
  it('should have Japanese name', () => assert(pg.includes('映画スケッチ')));
  it('should be Godot 4', () => assert(pg.includes('config_version=5')));
  it('should have main scene', () => assert(pg.includes('main.tscn')));
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🎬\x1b[0m'); }
console.log('');
