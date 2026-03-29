const { createGardenState, addPlant, updateGarden, getGardenStats, pseudoRandom } = require('../js/garden');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Garden Tests\n============');

console.log('\n--- Create ---');
const g = createGardenState();
assert(g.plants.length === 0, 'starts empty');

console.log('\n--- Add Plants ---');
g.width = 800;
g.height = 600;
g.soilY = 450;

addPlant(g, { name: 'Apple', category: 'fruit' }, { type: 'flower', color: [230, 100, 140] });
assert(g.plants.length === 1, '1 plant after add');
assert(g.plants[0].type === 'flower', 'correct type');
assert(g.plants[0].food.name === 'Apple', 'food reference');
assert(g.plants[0].growProgress === 0, 'starts at 0 progress');

addPlant(g, { name: 'Rice', category: 'grain' }, { type: 'wheat', color: [210, 180, 60] });
addPlant(g, { name: 'Tofu', category: 'protein' }, { type: 'mushroom', color: [180, 140, 100] });
assert(g.plants.length === 3, '3 plants');

// Plants have valid positions
g.plants.forEach((p, i) => {
  assert(typeof p.x === 'number' && p.x > 0, `plant ${i} has valid x`);
  assert(typeof p.y === 'number', `plant ${i} has valid y`);
  assert(p.height > 0, `plant ${i} has positive height`);
  assert(p.width > 0, `plant ${i} has positive width`);
});

console.log('\n--- Update ---');
updateGarden(g, 0.5);
assert(g.plants[0].growProgress > 0, 'progress increased after update');
assert(g.plants[0].growProgress <= 1, 'progress capped at 1');

// Run many updates
for (let i = 0; i < 100; i++) updateGarden(g, 0.1);
assert(g.plants[0].growProgress === 1, 'fully grown after many updates');

console.log('\n--- Stats ---');
const stats = getGardenStats(g);
assert(stats.totalPlants === 3, 'stats total 3');
assert(stats.typeDistribution.flower === 1, '1 flower');
assert(stats.typeDistribution.wheat === 1, '1 wheat');
assert(stats.typeDistribution.mushroom === 1, '1 mushroom');

console.log('\n--- pseudoRandom ---');
assert(typeof pseudoRandom(0) === 'number', 'returns number');
assert(pseudoRandom(0) >= 0 && pseudoRandom(0) < 1, 'in [0,1)');
assert(pseudoRandom(42) === pseudoRandom(42), 'deterministic');
assert(pseudoRandom(1) !== pseudoRandom(2), 'different seeds differ');

// Many plants
console.log('\n--- Stress ---');
const big = createGardenState();
big.width = 800; big.height = 600; big.soilY = 450;
for (let i = 0; i < 50; i++) {
  addPlant(big, { name: 'Food' + i, category: 'vegetable' }, { type: 'leaf', color: [60, 180, 75] });
}
assert(big.plants.length === 50, '50 plants added');
assert(getGardenStats(big).totalPlants === 50, 'stats show 50');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
