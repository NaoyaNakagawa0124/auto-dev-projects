const {
  TAGS, TAG_LABELS, TAG_COLORS, RECIPES,
  getRecipes, filterRecipes, getRandomRecipe, getRecipeById
} = require('../js/recipes.js');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Recipe Tests\n============');

// Data integrity
console.log('\n--- Data Integrity ---');
assert(RECIPES.length >= 40, `At least 40 recipes (got ${RECIPES.length})`);
assert(Object.keys(TAGS).length === 4, '4 tag types');
assert(Object.keys(TAG_LABELS).length === 4, '4 tag labels');
assert(Object.keys(TAG_COLORS).length === 4, '4 tag colors');

// Schema
console.log('\n--- Schema ---');
RECIPES.forEach((r, i) => {
  assert(typeof r.id === 'number', `Recipe ${i} has numeric id`);
  assert(typeof r.name === 'string' && r.name.length > 0, `Recipe ${i} has name`);
  assert(typeof r.emoji === 'string', `Recipe ${i} has emoji`);
  assert(typeof r.cookTime === 'number' && r.cookTime > 0, `Recipe ${i} has cookTime`);
  assert(Array.isArray(r.ingredients) && r.ingredients.length >= 3, `Recipe ${i} has 3+ ingredients`);
  assert(Array.isArray(r.tags) && r.tags.length > 0, `Recipe ${i} has tags`);
  r.tags.forEach(t => {
    assert(['vegetarian', 'vegan', 'quick', 'comfort'].includes(t), `Recipe ${i} tag '${t}' valid`);
  });
});

// Unique IDs
console.log('\n--- Unique IDs ---');
const ids = new Set(RECIPES.map(r => r.id));
assert(ids.size === RECIPES.length, 'All IDs unique');

// getRecipes
console.log('\n--- getRecipes ---');
assert(getRecipes().length === RECIPES.length, 'getRecipes returns all');

// filterRecipes
console.log('\n--- filterRecipes ---');
const veg = filterRecipes(['vegetarian']);
assert(veg.length > 0, 'Has vegetarian recipes');
assert(veg.every(r => r.tags.includes('vegetarian')), 'All are vegetarian');

const vegan = filterRecipes(['vegan']);
assert(vegan.length > 0, 'Has vegan recipes');

const quick = filterRecipes(['quick']);
assert(quick.length > 0, 'Has quick recipes');
assert(quick.every(r => r.cookTime <= 30), 'Quick recipes are <=30min');

const combo = filterRecipes(['vegan', 'quick']);
assert(combo.length > 0, 'Has vegan+quick');
assert(combo.every(r => r.tags.includes('vegan') && r.tags.includes('quick')), 'All match both tags');

const empty = filterRecipes([]);
assert(empty.length === RECIPES.length, 'Empty filter = all');

const nullFilter = filterRecipes(null);
assert(nullFilter.length === RECIPES.length, 'null filter = all');

// getRandomRecipe
console.log('\n--- getRandomRecipe ---');
for (let i = 0; i < 20; i++) {
  const r = getRandomRecipe([]);
  assert(r !== null, 'random returns something');
}
const randVeg = getRandomRecipe(['vegetarian']);
assert(randVeg.tags.includes('vegetarian'), 'random vegetarian is vegetarian');

// getRecipeById
console.log('\n--- getRecipeById ---');
assert(getRecipeById(1) !== null, 'find id 1');
assert(getRecipeById(1).name === 'Spaghetti Carbonara', 'id 1 is Carbonara');
assert(getRecipeById(999) === null, 'id 999 is null');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
