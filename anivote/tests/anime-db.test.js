const { GENRES, SAMPLE_ANIME, getSuggestions, getByTitle, getRandomPicks } = require('../js/anime-db');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Anime DB Tests\n==============');

assert(GENRES.length >= 10, 'at least 10 genres');
assert(SAMPLE_ANIME.length >= 25, `25+ anime (got ${SAMPLE_ANIME.length})`);

SAMPLE_ANIME.forEach((a, i) => {
  assert(a.title && a.title.length > 0, `anime ${i} has title`);
  assert(a.episodes > 0, `anime ${i} has episodes`);
  assert(a.genre && a.genre.length > 0, `anime ${i} has genre`);
  assert(a.emoji && a.emoji.length > 0, `anime ${i} has emoji`);
});

// Unique titles
const titles = new Set(SAMPLE_ANIME.map(a => a.title));
assert(titles.size === SAMPLE_ANIME.length, 'unique titles');

// Suggestions
const s1 = getSuggestions('attack');
assert(s1.length > 0, 'finds Attack on Titan');
assert(s1[0].title.includes('Attack'), 'correct match');

const s2 = getSuggestions('');
assert(s2.length === 0, 'empty query = empty');

const s3 = getSuggestions('x');
assert(s3.length === 0, 'single char = empty');

const s4 = getSuggestions('nonexistent');
assert(s4.length === 0, 'no match = empty');

// Max 5 suggestions
const s5 = getSuggestions('a');
// 'a' is only 1 char so should be empty
assert(s5.length === 0, 'query too short');

const s6 = getSuggestions('an');
assert(s6.length <= 5, 'max 5 suggestions');

// getByTitle
assert(getByTitle('Death Note') !== null, 'find Death Note');
assert(getByTitle('death note') !== null, 'case insensitive');
assert(getByTitle('Nothing') === null, 'null for missing');

// getRandomPicks
const picks = getRandomPicks(3);
assert(picks.length === 3, '3 random picks');
assert(picks.every(p => p.title), 'all have titles');

const picks2 = getRandomPicks();
assert(picks2.length === 3, 'default 3');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
