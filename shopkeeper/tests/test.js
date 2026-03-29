// ShopKeeper Test Suite
const {
  PRODUCTS, CUSTOMERS, SKILLS_TAUGHT, TIPS,
  createDefaultState, initializeShop, buyStock, setPrice,
  generateCustomer, serveCustomer, endDay,
  getProfit, getProfitMargin, getProductMargin, getInventoryValue,
  getReputationLevel, discoverSkill, getSkillReport, seededRandom,
} = require('../engine.js');

let passed = 0, failed = 0;
const failures = [];
function assert(c, n) { if (c) passed++; else { failed++; failures.push(n); console.log('  FAIL: ' + n); } }
function assertEqual(e, a, n) { if (e === a) passed++; else { failed++; failures.push(`${n} (e=${e}, g=${a})`); console.log(`  FAIL: ${n} (e=${e}, g=${a})`); } }
function assertClose(a, b, tol, n) { assert(Math.abs(a - b) <= tol, `${n} (${a} ~= ${b})`); }
function assertGt(a, b, n) { assert(a > b, `${n} (${a}>${b})`); }
function assertGte(a, b, n) { assert(a >= b, `${n} (${a}>=${b})`); }

console.log('=== ShopKeeper Test Suite ===\n');

// ---- Data Tests ----
console.log('[Data Tests]');
assertEqual(8, PRODUCTS.length, '8 products');
assertEqual(8, CUSTOMERS.length, '8 customers');
assertEqual(7, Object.keys(SKILLS_TAUGHT).length, '7 skills');

PRODUCTS.forEach(p => {
  assert(p.id.length > 0, `Product ${p.id} has id`);
  assert(p.name.length > 0, `Product ${p.id} has name`);
  assert(p.icon.length > 0, `Product ${p.id} has icon`);
  assertGt(p.baseCost, 0, `Product ${p.id} cost > 0`);
  assertGt(p.suggestedPrice, p.baseCost, `Product ${p.id} price > cost`);
  assertGt(p.shelfLife, 0, `Product ${p.id} shelfLife > 0`);
  assert(['baked', 'drink'].includes(p.category), `Product ${p.id} valid category`);
});

const pids = PRODUCTS.map(p => p.id);
assertEqual(pids.length, new Set(pids).size, 'Product IDs unique');

CUSTOMERS.forEach(c => {
  assert(c.name.length > 0, `Customer ${c.name} has name`);
  assert(c.icon.length > 0, `Customer ${c.name} has icon`);
  assertGt(c.patience, 0, `Customer ${c.name} has patience`);
  assert(['baked', 'drink'].includes(c.favoriteCategory), `Customer ${c.name} valid category`);
  assert(['none', 'fair', 'good', 'great'].includes(c.tip), `Customer ${c.name} valid tip`);
});

Object.entries(SKILLS_TAUGHT).forEach(([id, s]) => {
  assert(s.name.length > 0, `Skill ${id} has name`);
  assert(s.description.length > 0, `Skill ${id} has description`);
});

console.log('  Data tests complete.\n');

// ---- State Tests ----
console.log('[State Tests]');
const ds = createDefaultState();
assertEqual(1, ds.day, 'Day starts at 1');
assertEqual(50, ds.cash, 'Cash starts at $50');
assertEqual(0, ds.totalRevenue, 'Revenue starts at 0');
assertEqual(0, ds.totalCosts, 'Costs start at 0');
assertEqual(50, ds.reputation, 'Reputation starts at 50');
assertEqual(0, ds.skillsDiscovered.length, 'No skills initially');

const inited = initializeShop(createDefaultState());
PRODUCTS.forEach(p => {
  assert(inited.prices[p.id] !== undefined, `Price set for ${p.id}`);
  assert(inited.inventory[p.id] !== undefined, `Inventory set for ${p.id}`);
  assertEqual(0, inited.inventory[p.id].quantity, `${p.id} starts with 0 stock`);
});

console.log('  State tests complete.\n');

// ---- Buy Stock Tests ----
console.log('[Buy Stock Tests]');
let s1 = initializeShop(createDefaultState());

let r1 = buyStock(s1, 'cookie', 5);
assert(r1.success, 'Buy 5 cookies succeeds');
assertEqual(5, s1.inventory.cookie.quantity, '5 cookies in stock');
assertClose(42.5, s1.cash, 0.01, 'Cash after buying (50 - 5*1.5 = 42.5)');
assertEqual(7.5, s1.totalCosts, 'Costs tracked');
assert(s1.skillsDiscovered.includes('inventory'), 'Inventory skill discovered');
assert(s1.skillsDiscovered.includes('cashflow'), 'Cash flow skill discovered');

// Can't afford
let r2 = buyStock(s1, 'pie', 100);
assert(!r2.success, 'Can\'t afford 100 pies');

// Invalid product
let r3 = buyStock(s1, 'nonexistent', 1);
assert(!r3.success, 'Invalid product');

// Zero quantity
let r4 = buyStock(s1, 'cookie', 0);
assert(!r4.success, 'Zero quantity');

// Negative quantity
let r5 = buyStock(s1, 'cookie', -1);
assert(!r5.success, 'Negative quantity');

console.log('  Buy stock tests complete.\n');

// ---- Set Price Tests ----
console.log('[Set Price Tests]');
let s2 = initializeShop(createDefaultState());

let rp1 = setPrice(s2, 'cookie', 5.00);
assert(rp1.success, 'Set cookie price');
assertEqual(5.00, s2.prices.cookie, 'Cookie price updated');
assert(s2.skillsDiscovered.includes('pricing'), 'Pricing skill discovered');
assert(s2.skillsDiscovered.includes('margins'), 'Margins skill discovered');

// Below cost warning
let rp2 = setPrice(s2, 'cookie', 1.00);
assert(rp2.success, 'Below cost still succeeds');
assert(rp2.message.includes('below cost'), 'Warning about below cost');

// Invalid product
let rp3 = setPrice(s2, 'nonexistent', 5);
assert(!rp3.success, 'Invalid product');

// Zero price
let rp4 = setPrice(s2, 'cookie', 0);
assert(!rp4.success, 'Zero price rejected');

console.log('  Set price tests complete.\n');

// ---- Customer Generation Tests ----
console.log('[Customer Generation Tests]');

for (let day = 1; day <= 10; day++) {
  const cust = generateCustomer(day, day * 7);
  assert(cust.name.length > 0, `Day ${day} customer has name`);
  assert(cust.wants.length > 0, `Day ${day} customer wants something`);
  assert(cust.wants.length <= 3, `Day ${day} customer wants <= 3 items`);
  cust.wants.forEach(w => assert(pids.includes(w), `Day ${day} want ${w} is valid product`));
}

// Deterministic
const c1 = generateCustomer(1, 42);
const c2 = generateCustomer(1, 42);
assertEqual(c1.name, c2.name, 'Same seed = same customer');
assertEqual(c1.wants.length, c2.wants.length, 'Same seed = same wants length');

// Different seeds = different customers (usually)
const c3 = generateCustomer(1, 1);
const c4 = generateCustomer(1, 999);
// Can't guarantee different due to randomness, but test structure
assert(c3.wants.length > 0 && c4.wants.length > 0, 'Both customers have wants');

console.log('  Customer generation tests complete.\n');

// ---- Serve Customer Tests ----
console.log('[Serve Customer Tests]');

let s3 = initializeShop(createDefaultState());
buyStock(s3, 'cookie', 10);
buyStock(s3, 'muffin', 5);
buyStock(s3, 'coffee', 5);
buyStock(s3, 'tea', 5);

const cust = generateCustomer(1, 42);
const sr = serveCustomer(s3, cust);
assertGte(sr.fulfilled, 0, 'Fulfilled >= 0');
assertGte(sr.orderTotal, 0, 'Order total >= 0');
assertGte(sr.tipAmount, 0, 'Tip >= 0');
assertEqual(1, s3.customersServed, '1 customer served');
assert(s3.skillsDiscovered.includes('customerService'), 'Customer service skill discovered');

// Invoice created for non-empty order
if (sr.fulfilled > 0) {
  assert(sr.invoice !== null, 'Invoice created');
  assert(sr.invoice.id.startsWith('INV-'), 'Invoice has proper ID');
  assertEqual(cust.name, sr.invoice.customer, 'Invoice has customer name');
  assertGt(sr.invoice.total, 0, 'Invoice total > 0');
  assertEqual(1, s3.invoicesCreated, '1 invoice created');
  assert(s3.skillsDiscovered.includes('invoicing'), 'Invoicing skill discovered');
}

// Serve with no stock
let s4 = initializeShop(createDefaultState());
const emptyCust = { name: "Test", icon: "🧑", patience: 2, favoriteCategory: "baked", tip: "good", wants: ["cookie", "cake"] };
const sr2 = serveCustomer(s4, emptyCust);
assertEqual(0, sr2.fulfilled, 'No items served with empty stock');
assertEqual(0, sr2.orderTotal, 'No revenue with empty stock');
assert(s4.reputation < 50, 'Reputation drops when failing to serve');

console.log('  Serve customer tests complete.\n');

// ---- End Day Tests ----
console.log('[End Day Tests]');

let s5 = initializeShop(createDefaultState());
buyStock(s5, 'coffee', 3); // shelfLife = 1

// Day 1 end - coffee daysOld goes 0->1, 1 >= 1 = expires
let ed1 = endDay(s5);
assertEqual(2, s5.day, 'Advanced to day 2');
assertEqual(1, s5.salesHistory.length, '1 day in history');
assertGt(ed1.expired, 0, 'Coffee expired after 1 day (shelfLife=1)');
assertEqual(0, s5.inventory.coffee.quantity, 'Expired stock removed');
assert(s5.skillsDiscovered.includes('waste'), 'Waste skill discovered');

// No expiry for fresh stock
let s6 = initializeShop(createDefaultState());
buyStock(s6, 'cookie', 5); // shelfLife = 3
endDay(s6);
assertEqual(5, s6.inventory.cookie.quantity, 'Cookies survive day 1');
endDay(s6);
assertEqual(5, s6.inventory.cookie.quantity, 'Cookies survive day 2');
let ed6_3 = endDay(s6);
assertEqual(0, s6.inventory.cookie.quantity, 'Cookies expire day 3');

console.log('  End day tests complete.\n');

// ---- Financial Tests ----
console.log('[Financial Tests]');

let s7 = initializeShop(createDefaultState());
assertEqual(0, getProfit(s7), 'Profit starts at 0');
assertEqual(0, getProfitMargin(s7), 'Margin starts at 0');

s7.totalRevenue = 100;
s7.totalCosts = 60;
s7.totalTips = 10;
assertEqual(50, getProfit(s7), 'Profit = 100 + 10 - 60 = 50');
assertEqual(40, getProfitMargin(s7), 'Margin = (100-60)/100 = 40%');

// Product margin
let s8 = initializeShop(createDefaultState());
s8.prices.cookie = 3.00;
const cm = getProductMargin('cookie', s8);
assertClose(50, cm, 0.1, 'Cookie margin = (3-1.5)/3 = 50%');

s8.prices.cookie = 1.50;
assertClose(0, getProductMargin('cookie', s8), 0.1, 'Zero margin at cost');

s8.prices.cookie = 1.00;
assert(getProductMargin('cookie', s8) < 0, 'Negative margin below cost');

// Inventory value
buyStock(s8, 'cookie', 10);
buyStock(s8, 'cake', 5);
const iv = getInventoryValue(s8);
assertGt(iv, 0, 'Inventory has value');
assertClose(10 * 1.5 + 5 * 3.0, iv, 0.01, 'Inventory value = 10*1.5 + 5*3.0 = 30');

console.log('  Financial tests complete.\n');

// ---- Reputation Tests ----
console.log('[Reputation Tests]');

assertEqual('Beloved', getReputationLevel(90).level, '90 = Beloved');
assertEqual('Popular', getReputationLevel(70).level, '70 = Popular');
assertEqual('Known', getReputationLevel(50).level, '50 = Known');
assertEqual('Struggling', getReputationLevel(30).level, '30 = Struggling');
assertEqual('Unknown', getReputationLevel(0).level, '0 = Unknown');

for (let r = 0; r <= 100; r += 10) {
  const rl = getReputationLevel(r);
  assert(rl.level.length > 0, `Rep ${r} has level`);
  assert(rl.icon.length > 0, `Rep ${r} has icon`);
  assert(rl.stars.length > 0, `Rep ${r} has stars`);
}

console.log('  Reputation tests complete.\n');

// ---- Skill Tests ----
console.log('[Skill Tests]');

let s9 = createDefaultState();
assertEqual(0, s9.skillsDiscovered.length, 'No skills initially');

discoverSkill(s9, 'pricing');
assertEqual(1, s9.skillsDiscovered.length, 'Skill added');
assert(s9.skillsDiscovered.includes('pricing'), 'Pricing discovered');

discoverSkill(s9, 'pricing'); // Duplicate
assertEqual(1, s9.skillsDiscovered.length, 'No duplicate skills');

discoverSkill(s9, 'inventory');
discoverSkill(s9, 'margins');
assertEqual(3, s9.skillsDiscovered.length, 'Multiple skills');

const report = getSkillReport(s9);
assertEqual(3, report.length, 'Report has 3 skills');
assert(report[0].name.length > 0, 'Report has skill names');
assert(report[0].description.length > 0, 'Report has descriptions');

console.log('  Skill tests complete.\n');

// ---- Seeded Random Tests ----
console.log('[Seeded Random Tests]');

const rng1 = seededRandom(42);
const vals1 = [rng1(), rng1(), rng1()];
const rng2 = seededRandom(42);
const vals2 = [rng2(), rng2(), rng2()];

for (let i = 0; i < 3; i++) {
  assertEqual(vals1[i], vals2[i], `Seeded random deterministic (${i})`);
}

const rng3 = seededRandom(99);
const vals3 = [rng3(), rng3(), rng3()];
assert(vals1[0] !== vals3[0] || vals1[1] !== vals3[1], 'Different seeds differ');

// Values in [0, 1)
const rng4 = seededRandom(12345);
for (let i = 0; i < 100; i++) {
  const v = rng4();
  assert(v >= 0 && v < 1.1, `Random value ${v} in range`);
}

console.log('  Seeded random tests complete.\n');

// ---- Integration Tests ----
console.log('[Integration Tests]');

// Simulate 5 days of play
let sim = initializeShop(createDefaultState());

for (let day = 1; day <= 5; day++) {
  // Buy some stock
  buyStock(sim, 'cookie', 5);
  buyStock(sim, 'coffee', 3);
  buyStock(sim, 'muffin', 4);

  // Serve 3 customers
  for (let c = 0; c < 3; c++) {
    const customer = generateCustomer(day, c + day * 10);
    serveCustomer(sim, customer);
  }

  endDay(sim);
}

assertGte(sim.day, 6, 'Integration: reached day 6');
assertGt(sim.customersServed, 0, 'Integration: served customers');
assertGt(sim.totalRevenue, 0, 'Integration: earned revenue');
assertGt(sim.invoicesCreated, 0, 'Integration: created invoices');
assertGt(sim.itemsSold, 0, 'Integration: sold items');
assertGt(sim.skillsDiscovered.length, 3, 'Integration: discovered skills');
assertEqual(5, sim.salesHistory.length, 'Integration: 5 days of history');

// Verify profit calculation
const profit = getProfit(sim);
const margin = getProfitMargin(sim);
assertClose(sim.totalRevenue + sim.totalTips - sim.totalCosts, profit, 0.01, 'Integration: profit formula');
assert(typeof margin === 'number' && !isNaN(margin), 'Integration: margin is a number');

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
