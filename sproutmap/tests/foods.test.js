const {
  CATEGORIES, CATEGORY_PLANTS, FOODS, getFoodByName, getFoodsByCategory,
  getPlantType, calculateSustainabilityScore, getCategoryDistribution, getDiversityScore
} = require('../js/foods');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Food Tests\n==========');

// Data integrity
console.log('\n--- Data ---');
assert(Object.keys(CATEGORIES).length === 7, '7 categories');
assert(Object.keys(CATEGORY_PLANTS).length === 7, '7 plant types');
assert(FOODS.length >= 35, `35+ foods (got ${FOODS.length})`);

FOODS.forEach((f, i) => {
  assert(f.name && f.name.length > 0, `food ${i} has name`);
  assert(Object.values(CATEGORIES).includes(f.category), `food ${i} valid category`);
  assert(f.sustainability >= 1 && f.sustainability <= 5, `food ${i} sustainability 1-5`);
  assert(f.emoji && f.emoji.length > 0, `food ${i} has emoji`);
});

Object.values(CATEGORY_PLANTS).forEach(p => {
  assert(p.type && p.type.length > 0, `plant has type`);
  assert(Array.isArray(p.color) && p.color.length === 3, `plant has RGB color`);
  assert(p.label && p.label.length > 0, `plant has label`);
});

// Lookups
console.log('\n--- Lookups ---');
assert(getFoodByName('Apple') !== null, 'find Apple');
assert(getFoodByName('Apple').category === 'fruit', 'Apple is fruit');
assert(getFoodByName('TOFU') !== null, 'case insensitive');
assert(getFoodByName('NonExistent') === null, 'null for missing');

const vegs = getFoodsByCategory('vegetable');
assert(vegs.length >= 5, 'at least 5 vegetables');
assert(vegs.every(f => f.category === 'vegetable'), 'all are vegetables');

const plant = getPlantType('vegetable');
assert(plant.type === 'leaf', 'vegetable = leaf');
assert(getPlantType('unknown').type === 'leaf', 'unknown falls back to leaf');

// Scoring
console.log('\n--- Scoring ---');
const emptyScore = calculateSustainabilityScore([]);
assert(emptyScore.grade === 'N/A', 'empty = N/A');

const greenMeals = [
  { sustainability: 1 }, { sustainability: 1 }, { sustainability: 1 }
];
const greenScore = calculateSustainabilityScore(greenMeals);
assert(greenScore.grade === 'A', 'all 1s = A');
assert(greenScore.color === '#27ae60', 'A is green');

const redMeals = [
  { sustainability: 5 }, { sustainability: 5 }, { sustainability: 5 }
];
const redScore = calculateSustainabilityScore(redMeals);
assert(redScore.grade === 'F', 'all 5s = F');

const mixedMeals = [
  { sustainability: 1 }, { sustainability: 3 }, { sustainability: 2 }
];
const mixedScore = calculateSustainabilityScore(mixedMeals);
assert(mixedScore.grade === 'B', 'avg 2 = B');

// Distribution
console.log('\n--- Distribution ---');
const log = [
  { category: 'vegetable' }, { category: 'vegetable' },
  { category: 'fruit' }, { category: 'protein' }
];
const dist = getCategoryDistribution(log);
assert(dist.vegetable === 2, '2 vegetables');
assert(dist.fruit === 1, '1 fruit');
assert(dist.sweet === 0, '0 sweets');

// Diversity
console.log('\n--- Diversity ---');
assert(getDiversityScore([]) === 0, 'empty = 0%');
const diverse = [
  { category: 'vegetable' }, { category: 'fruit' }, { category: 'grain' },
  { category: 'protein' }, { category: 'dairy' }, { category: 'sweet' }, { category: 'drink' }
];
assert(getDiversityScore(diverse) === 100, '7/7 = 100%');
assert(getDiversityScore([{ category: 'vegetable' }]) === Math.round(100/7), '1/7 diversity');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
