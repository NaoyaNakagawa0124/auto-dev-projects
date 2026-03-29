const {
  SPIN_DURATION, SPIN_ROTATIONS,
  createSpinState, startSpin, updateSpin, isSpinning, getSpinProgress
} = require('../js/spin.js');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Spin Tests\n==========');

console.log('\n--- Constants ---');
assert(SPIN_DURATION > 0, 'duration positive');
assert(SPIN_ROTATIONS > 0, 'rotations positive');

console.log('\n--- Create ---');
const s = createSpinState();
assert(!s.spinning, 'not spinning initially');
assert(s.currentAngle === 0, 'angle 0');
assert(s.targetRecipe === null, 'no target recipe');

console.log('\n--- Start ---');
const recipe = { id: 1, name: 'Test' };
let completed = false;
startSpin(s, recipe, () => { completed = true; });
assert(s.spinning, 'spinning after start');
assert(s.targetRecipe === recipe, 'target set');
assert(isSpinning(s), 'isSpinning true');

console.log('\n--- Progress ---');
const p = getSpinProgress(s);
assert(p >= 0 && p <= 1, 'progress in [0,1]');

console.log('\n--- Update (simulated completion) ---');
// Force completion by setting start time far in the past
s.startTime = Date.now() - SPIN_DURATION - 100;
updateSpin(s);
assert(!s.spinning, 'stopped after duration');
assert(completed, 'callback fired');

console.log('\n--- Non-spinning update ---');
const s2 = createSpinState();
updateSpin(s2); // should not crash
assert(!s2.spinning, 'still not spinning');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
