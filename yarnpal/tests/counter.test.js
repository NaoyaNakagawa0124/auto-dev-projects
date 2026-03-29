const {
  createCounter, incrementRows, decrementRows, incrementStitches,
  decrementStitches, resetCounter, setTarget, getProgress, undoLast
} = require('../js/counter');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }
function eq(a, b, m) { assert(a === b, `${m} (got ${a}, exp ${b})`); }

console.log('Counter Tests\n=============');

let c = createCounter();
eq(c.rows, 0, 'init rows 0');
eq(c.stitches, 0, 'init stitches 0');
eq(c.history.length, 0, 'init empty history');

// Increment
incrementRows(c);
incrementRows(c);
incrementRows(c);
eq(c.rows, 3, '3 rows after 3 increments');
eq(c.history.length, 3, '3 history entries');

incrementStitches(c);
incrementStitches(c);
eq(c.stitches, 2, '2 stitches');

// Decrement
decrementRows(c);
eq(c.rows, 2, 'rows after decrement');
decrementStitches(c);
eq(c.stitches, 1, 'stitches after decrement');

// Can't go below 0
let c2 = createCounter();
decrementRows(c2);
eq(c2.rows, 0, 'rows cant go below 0');
decrementStitches(c2);
eq(c2.stitches, 0, 'stitches cant go below 0');

// Target and progress
setTarget(c, 10);
eq(c.targetRows, 10, 'target set');
eq(getProgress(c), 20, 'progress 2/10 = 20%');

setTarget(c, 0);
eq(getProgress(c), 0, 'progress 0 with no target');

setTarget(c, 1);
eq(getProgress(c), 100, 'progress capped at 100% (2/1)');

// Undo
let c3 = createCounter();
incrementRows(c3);
incrementRows(c3);
incrementStitches(c3);
eq(c3.rows, 2, 'before undo rows');
undoLast(c3); // undo stitch
eq(c3.stitches, 0, 'undo stitch');
eq(c3.rows, 2, 'rows unchanged after stitch undo');
undoLast(c3); // undo row
eq(c3.rows, 1, 'undo row');
undoLast(c3); // undo row
eq(c3.rows, 0, 'undo to 0');
undoLast(c3); // no-op
eq(c3.rows, 0, 'undo on empty is no-op');

// Reset
let c4 = createCounter();
incrementRows(c4);
incrementRows(c4);
incrementStitches(c4);
resetCounter(c4);
eq(c4.rows, 0, 'reset rows');
eq(c4.stitches, 0, 'reset stitches');
eq(c4.history.length, 0, 'reset history');

// Negative target
setTarget(c4, -5);
eq(c4.targetRows, 0, 'negative target clamped to 0');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
