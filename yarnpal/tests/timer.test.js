const {
  createTimer, startTimer, stopTimer, resetTimer,
  getElapsed, formatTime, getTotalSessionTime, getSessionCount
} = require('../js/timer');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }
function eq(a, b, m) { assert(a === b, `${m} (got ${a}, exp ${b})`); }

console.log('Timer Tests\n===========');

let t = createTimer();
assert(!t.running, 'not running initially');
eq(getElapsed(t), 0, 'elapsed 0');
eq(getSessionCount(t), 0, 'no sessions');

// Start
startTimer(t);
assert(t.running, 'running after start');
assert(t.startTime > 0, 'start time set');

// Double start is no-op
const st = t.startTime;
startTimer(t);
eq(t.startTime, st, 'double start no-op');

// Stop
stopTimer(t);
assert(!t.running, 'not running after stop');
eq(getSessionCount(t), 1, '1 session after stop');
assert(getTotalSessionTime(t) >= 0, 'total session time >= 0');

// Double stop is no-op
stopTimer(t);
eq(getSessionCount(t), 1, 'double stop no-op');

// Reset
let t2 = createTimer();
startTimer(t2);
stopTimer(t2);
t2 = resetTimer(t2);
assert(!t2.running, 'reset not running');
eq(getElapsed(t2), 0, 'reset elapsed 0');
eq(getSessionCount(t2), 0, 'reset no sessions');

// formatTime
eq(formatTime(0), '0:00', 'format 0');
eq(formatTime(1000), '0:01', 'format 1s');
eq(formatTime(60000), '1:00', 'format 1m');
eq(formatTime(90000), '1:30', 'format 1m30s');
eq(formatTime(3600000), '1h 00m', 'format 1h');
eq(formatTime(5400000), '1h 30m', 'format 1h30m');
eq(formatTime(7200000), '2h 00m', 'format 2h');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
