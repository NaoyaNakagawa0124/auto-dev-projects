const { YARN_COLORS, NEEDLE_SIZES, createProject } = require('../js/projects');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Project Tests\n=============');

assert(YARN_COLORS.length >= 10, 'at least 10 yarn colors');
assert(NEEDLE_SIZES.length >= 10, 'at least 10 needle sizes');

YARN_COLORS.forEach((c, i) => {
  assert(c.name && c.name.length > 0, `color ${i} has name`);
  assert(c.hex && c.hex.startsWith('#'), `color ${i} has hex`);
});

NEEDLE_SIZES.forEach((s, i) => {
  assert(s.includes('mm'), `size ${i} has mm`);
});

const p1 = createProject('Baby Blanket', '#c0392b', '5mm', 'For the grandkid');
assert(p1.id && p1.id.length > 0, 'has id');
assert(p1.name === 'Baby Blanket', 'name set');
assert(p1.yarnColor === '#c0392b', 'color set');
assert(p1.needleSize === '5mm', 'needle set');
assert(p1.notes === 'For the grandkid', 'notes set');
assert(p1.status === 'active', 'default active');
assert(p1.createdAt.includes('T'), 'has timestamp');

const p2 = createProject();
assert(p2.name === 'New Project', 'default name');
assert(p2.yarnColor === YARN_COLORS[0].hex, 'default color');
assert(p2.needleSize === '4mm', 'default needle');

const p3 = createProject('Scarf');
assert(p1.id !== p3.id, 'unique ids');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
