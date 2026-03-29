const { PROMPTS, getPromptForDate, getTodaysPrompt, getPromptCount } = require('../js/prompts');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Prompt Tests\n============');

console.log('\n--- Data ---');
assert(PROMPTS.length >= 60, `At least 60 prompts (got ${PROMPTS.length})`);
assert(getPromptCount() === PROMPTS.length, 'getPromptCount matches');

PROMPTS.forEach((p, i) => {
  assert(p.headline && p.headline.length > 10, `Prompt ${i} has headline`);
  assert(p.question && p.question.length > 10, `Prompt ${i} has question`);
  assert(p.question.includes('?') || p.question.includes('.') || p.question.includes('!'), `Prompt ${i} question is a sentence`);
});

console.log('\n--- getPromptForDate ---');
const p1 = getPromptForDate('2026-03-29');
assert(p1 !== null, 'returns prompt for date');
assert(typeof p1.headline === 'string', 'has headline');
assert(typeof p1.question === 'string', 'has question');

// Deterministic
const p2 = getPromptForDate('2026-03-29');
assert(p1.headline === p2.headline, 'same date = same prompt');

// Different dates give different prompts (usually)
const p3 = getPromptForDate('2026-06-15');
assert(p3 !== null, 'returns prompt for different date');

console.log('\n--- getTodaysPrompt ---');
const today = getTodaysPrompt();
assert(today !== null, 'today prompt exists');
assert(today.headline.length > 0, 'today has headline');

// All 365 days covered
console.log('\n--- All Days ---');
for (let m = 1; m <= 12; m++) {
  for (let d of [1, 15, 28]) {
    const date = `2026-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const p = getPromptForDate(date);
    assert(p && p.question, `${date} has prompt`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
