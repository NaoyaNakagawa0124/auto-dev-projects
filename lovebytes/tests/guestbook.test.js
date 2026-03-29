const { createMessage } = require('../js/guestbook');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Guestbook Tests\n===============');

const m1 = createMessage('Alice', 'Love this site!', '#ff00ff');
assert(m1.id && m1.id.length > 0, 'has id');
assert(m1.author === 'Alice', 'author set');
assert(m1.text === 'Love this site!', 'text set');
assert(m1.color === '#ff00ff', 'color set');
assert(m1.timestamp.includes('T'), 'has ISO timestamp');

const m2 = createMessage(null, 'Hello');
assert(m2.author === 'Anonymous', 'default author is Anonymous');
assert(m2.color === '#00ff00', 'default color is green');

const m3 = createMessage('Bob', 'Hi', '#00ffff');
assert(m1.id !== m3.id, 'unique ids');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
