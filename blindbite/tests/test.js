// BlindBite Test Suite
const {
  CUISINES, RESTAURANT_NAMES, SUPPLY_CHAIN_FACTS, FOOD_DELIVERY_DOMAINS, MYSTERY_MESSAGES,
  seededRandom, generatePick, createDefaultPreferences, recordPick,
  getTrustScore, getTrustLevel, isFoodDeliverySite,
} = require('../js/engine.js');

let passed = 0, failed = 0;
const failures = [];
function assert(c, n) { if (c) passed++; else { failed++; failures.push(n); console.log('  FAIL: ' + n); } }
function assertEqual(e, a, n) { if (e === a) passed++; else { failed++; failures.push(`${n} (e=${e}, g=${a})`); console.log(`  FAIL: ${n} (e=${e}, g=${a})`); } }
function assertGt(a, b, n) { assert(a > b, `${n} (${a}>${b})`); }
function assertGte(a, b, n) { assert(a >= b, `${n} (${a}>=${b})`); }
function assertBetween(v, lo, hi, n) { assert(v >= lo && v <= hi, `${n} (${lo}<=${v}<=${hi})`); }

console.log('=== BlindBite Test Suite ===\n');

// ---- Data Tests ----
console.log('[Data Tests]');
assertEqual(12, CUISINES.length, '12 cuisines');
assertGt(SUPPLY_CHAIN_FACTS.length, 10, '10+ supply chain facts');
assertGt(MYSTERY_MESSAGES.length, 5, '5+ mystery messages');
assertGt(FOOD_DELIVERY_DOMAINS.length, 5, '5+ food delivery domains');

CUISINES.forEach(c => {
  assert(c.id.length > 0, `Cuisine ${c.id} has id`);
  assert(c.name.length > 0, `Cuisine ${c.id} has name`);
  assert(c.icon.length > 0, `Cuisine ${c.id} has icon`);
  assert(c.vibe.length > 0, `Cuisine ${c.id} has vibe`);
  assert(RESTAURANT_NAMES[c.id], `Cuisine ${c.id} has restaurants`);
  assertGt(RESTAURANT_NAMES[c.id].length, 0, `Cuisine ${c.id} has 1+ restaurants`);
});

const cids = CUISINES.map(c => c.id);
assertEqual(cids.length, new Set(cids).size, 'Cuisine IDs unique');

SUPPLY_CHAIN_FACTS.forEach((f, i) => {
  assert(f.ingredient.length > 0, `Fact ${i} has ingredient`);
  assert(f.fact.length > 0, `Fact ${i} has fact text`);
  assert(f.origin.length > 0, `Fact ${i} has origin`);
});

MYSTERY_MESSAGES.forEach((m, i) => {
  assert(m.length > 0, `Message ${i} not empty`);
});

console.log('  Data tests complete.\n');

// ---- Seeded Random Tests ----
console.log('[Random Tests]');

const rng1 = seededRandom(42);
const v1 = [rng1(), rng1(), rng1()];
const rng2 = seededRandom(42);
const v2 = [rng2(), rng2(), rng2()];
for (let i = 0; i < 3; i++) assertEqual(v1[i], v2[i], `Deterministic ${i}`);

const rng3 = seededRandom(99);
const v3 = [rng3(), rng3()];
assert(v1[0] !== v3[0] || v1[1] !== v3[1], 'Different seeds differ');

for (let i = 0; i < 100; i++) {
  const v = seededRandom(i)();
  assertBetween(v, 0, 1.1, `Random in range (seed ${i})`);
}

console.log('  Random tests complete.\n');

// ---- Pick Generation Tests ----
console.log('[Pick Generation Tests]');

const pick = generatePick({}, 42);
assert(pick.restaurant.length > 0, 'Pick has restaurant');
assert(pick.cuisine.length > 0, 'Pick has cuisine');
assert(pick.cuisineIcon.length > 0, 'Pick has icon');
assert(pick.vibe.length > 0, 'Pick has vibe');
assertBetween(pick.distance, 0.3, 5.0, 'Distance in range');
assert(pick.supplyChainFact.ingredient.length > 0, 'Pick has supply chain fact');
assert(pick.mysteryMessage.length > 0, 'Pick has mystery message');

// Deterministic
const pick2 = generatePick({}, 42);
assertEqual(pick.restaurant, pick2.restaurant, 'Same seed = same restaurant');
assertEqual(pick.cuisine, pick2.cuisine, 'Same seed = same cuisine');

// Different seed = different pick (usually)
const pick3 = generatePick({}, 99);
assert(pick.restaurant !== pick3.restaurant || pick.cuisine !== pick3.cuisine, 'Diff seed = diff pick');

// Cuisine exclusion
const exPrefs = { excludeCuisines: ['italian', 'japanese', 'mexican', 'thai', 'indian', 'chinese', 'french', 'korean', 'american', 'mediterranean', 'vietnamese'] };
const exPick = generatePick(exPrefs, 42);
assertEqual('Ethiopian', exPick.cuisine, 'Excluded all but Ethiopian');

// Exclude all = fallback to full list
const allExcluded = { excludeCuisines: cids };
const fallback = generatePick(allExcluded, 42);
assert(fallback.cuisine.length > 0, 'Fallback when all excluded');

// Null preferences
const nullPick = generatePick(null, 42);
assert(nullPick.restaurant.length > 0, 'Null prefs works');

// Restaurant names are from correct cuisine
for (let i = 0; i < 50; i++) {
  const p = generatePick({}, i);
  const cid = CUISINES.find(c => c.name === p.cuisine).id;
  assert(RESTAURANT_NAMES[cid].includes(p.restaurant), `Pick ${i}: restaurant matches cuisine`);
}

console.log('  Pick generation tests complete.\n');

// ---- Preferences Tests ----
console.log('[Preferences Tests]');

const prefs = createDefaultPreferences();
assertEqual(0, prefs.totalPicks, 'Default 0 picks');
assertEqual(0, prefs.totalTrusted, 'Default 0 trusted');
assertEqual(0, prefs.streak, 'Default 0 streak');
assertEqual(0, prefs.bestStreak, 'Default 0 best streak');
assert(Array.isArray(prefs.history), 'History is array');
assert(Array.isArray(prefs.excludeCuisines), 'Exclude is array');

// Record trusted pick
let p1 = createDefaultPreferences();
p1 = recordPick(p1, pick, true);
assertEqual(1, p1.totalPicks, '1 pick');
assertEqual(1, p1.totalTrusted, '1 trusted');
assertEqual(1, p1.streak, 'Streak 1');
assertEqual(1, p1.bestStreak, 'Best streak 1');
assertEqual(1, p1.history.length, '1 history entry');
assert(p1.history[0].trusted, 'History marked trusted');

// Record untrusted pick (re-roll)
p1 = recordPick(p1, pick3, false);
assertEqual(2, p1.totalPicks, '2 picks');
assertEqual(1, p1.totalTrusted, 'Still 1 trusted');
assertEqual(0, p1.streak, 'Streak broken');
assertEqual(1, p1.bestStreak, 'Best streak preserved');

// Build streak
let p2 = createDefaultPreferences();
for (let i = 0; i < 5; i++) {
  p2 = recordPick(p2, generatePick({}, i), true);
}
assertEqual(5, p2.streak, 'Streak 5');
assertEqual(5, p2.bestStreak, 'Best 5');

p2 = recordPick(p2, pick, false);
assertEqual(0, p2.streak, 'Streak broken');
assertEqual(5, p2.bestStreak, 'Best preserved at 5');

p2 = recordPick(p2, pick, true);
assertEqual(1, p2.streak, 'New streak started');

// History cap at 50
let p3 = createDefaultPreferences();
for (let i = 0; i < 55; i++) {
  p3 = recordPick(p3, generatePick({}, i), true);
}
assertEqual(50, p3.history.length, 'History capped at 50');
assertEqual(55, p3.totalPicks, 'Total picks still correct');

console.log('  Preferences tests complete.\n');

// ---- Trust Score Tests ----
console.log('[Trust Score Tests]');

assertEqual(0, getTrustScore(createDefaultPreferences()), '0 picks = 0 trust');

let tp = createDefaultPreferences();
tp.totalPicks = 10;
tp.totalTrusted = 10;
assertEqual(100, getTrustScore(tp), '10/10 = 100%');

tp.totalTrusted = 5;
assertEqual(50, getTrustScore(tp), '5/10 = 50%');

tp.totalTrusted = 0;
assertEqual(0, getTrustScore(tp), '0/10 = 0%');

// Trust levels
assertEqual('Blind Faith', getTrustLevel(80).level, '80% = Blind Faith');
assertEqual('Blind Faith', getTrustLevel(100).level, '100% = Blind Faith');
assertEqual('Adventurer', getTrustLevel(60).level, '60% = Adventurer');
assertEqual('Curious', getTrustLevel(40).level, '40% = Curious');
assertEqual('Skeptic', getTrustLevel(20).level, '20% = Skeptic');
assertEqual('Control Freak', getTrustLevel(0).level, '0% = Control Freak');

for (let s = 0; s <= 100; s += 10) {
  const tl = getTrustLevel(s);
  assert(tl.level.length > 0, `Trust ${s}% has level`);
  assert(tl.icon.length > 0, `Trust ${s}% has icon`);
  assert(tl.badge.length > 0, `Trust ${s}% has badge`);
}

console.log('  Trust score tests complete.\n');

// ---- Food Site Detection Tests ----
console.log('[Site Detection Tests]');

assert(isFoodDeliverySite('www.doordash.com'), 'DoorDash detected');
assert(isFoodDeliverySite('order.ubereats.com'), 'UberEats detected');
assert(isFoodDeliverySite('www.grubhub.com'), 'GrubHub detected');
assert(isFoodDeliverySite('www.yelp.com'), 'Yelp detected');
assert(isFoodDeliverySite('www.tripadvisor.com'), 'TripAdvisor detected');
assert(isFoodDeliverySite('www.opentable.com'), 'OpenTable detected');

assert(!isFoodDeliverySite('www.google.com'), 'Google not detected');
assert(!isFoodDeliverySite('www.amazon.com'), 'Amazon not detected');
assert(!isFoodDeliverySite('github.com'), 'GitHub not detected');
assert(!isFoodDeliverySite(''), 'Empty string not detected');

console.log('  Site detection tests complete.\n');

// ---- Integration Tests ----
console.log('[Integration Tests]');

// Full session simulation
let session = createDefaultPreferences();
for (let i = 0; i < 20; i++) {
  const p = generatePick(session, i * 100);
  const trusted = i % 3 !== 0; // Trust 2 out of 3
  session = recordPick(session, p, trusted);
}

assertEqual(20, session.totalPicks, 'Integration: 20 picks');
assertGt(session.totalTrusted, 10, 'Integration: 10+ trusted');
assertGt(session.bestStreak, 0, 'Integration: has best streak');
assertEqual(20, session.history.length, 'Integration: 20 history entries');

const trustScore = getTrustScore(session);
assertBetween(trustScore, 50, 80, 'Integration: trust 50-80%');
const trustLevel = getTrustLevel(trustScore);
assert(trustLevel.level.length > 0, 'Integration: has trust level');

// Variety check: not all picks same
const cuisines = new Set(session.history.map(h => h.cuisine));
assertGt(cuisines.size, 1, 'Integration: multiple cuisines picked');

const restaurants = new Set(session.history.map(h => h.restaurant));
assertGt(restaurants.size, 1, 'Integration: multiple restaurants picked');

console.log('  Integration tests complete.\n');

// ============ Results ============
console.log('================================');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('================================');
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  - ' + f));
}
process.exit(failed > 0 ? 1 : 0);
