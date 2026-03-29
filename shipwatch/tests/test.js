// ShipWatch Test Suite
const {
  DISRUPTIONS, ROUTES, PACKAGES,
  SEVERITY_COLORS, STATUS_ICONS, PKG_STATUS_ICONS,
  getRouteDelay, getGlobalRiskScore, getGlobalRiskLevel,
} = require('../src/data.js');

const {
  renderDashboard, renderDisruption, renderRoutes, renderPackages, renderHelp,
  box, stripAnsi, bar,
} = require('../src/renderer.js');

let passed = 0, failed = 0;
const failures = [];

function assert(c, n) { if (c) passed++; else { failed++; failures.push(n); console.log('  FAIL: ' + n); } }
function assertEqual(e, a, n) { if (e === a) passed++; else { failed++; failures.push(`${n} (exp=${e}, got=${a})`); console.log(`  FAIL: ${n} (exp=${e}, got=${a})`); } }
function assertGt(a, b, n) { assert(a > b, `${n} (${a} > ${b})`); }
function assertGte(a, b, n) { assert(a >= b, `${n} (${a} >= ${b})`); }

console.log('=== ShipWatch Test Suite ===\n');

// ---- Data Tests ----
console.log('[Data Tests]');

assertEqual(5, DISRUPTIONS.length, '5 disruptions');
assertEqual(8, ROUTES.length, '8 routes');
assertEqual(6, PACKAGES.length, '6 packages');

DISRUPTIONS.forEach((d, i) => {
  assert(d.id.length > 0, `Disruption ${i} has id`);
  assert(d.region.length > 0, `Disruption ${i} has region`);
  assert(['critical', 'high', 'medium', 'low'].includes(d.severity), `Disruption ${i} valid severity`);
  assert(['active', 'monitoring', 'resolved'].includes(d.status), `Disruption ${i} valid status`);
  assert(d.since.length > 0, `Disruption ${i} has date`);
  assert(d.summary.length > 0, `Disruption ${i} has summary`);
  assertGt(d.impact.delayDays, 0, `Disruption ${i} delay > 0`);
  assertGt(d.impact.costIncrease, 0, `Disruption ${i} cost > 0`);
  assertGt(d.impact.routesAffected, 0, `Disruption ${i} routes > 0`);
  assert(d.carriers.length > 0, `Disruption ${i} has carriers`);
  assert(d.reroute.length > 0, `Disruption ${i} has reroute`);
});

// Disruption IDs unique
const dIds = DISRUPTIONS.map(d => d.id);
assertEqual(dIds.length, new Set(dIds).size, 'Disruption IDs unique');

ROUTES.forEach((r, i) => {
  assert(r.id.length > 0, `Route ${i} has id`);
  assert(r.name.length > 0, `Route ${i} has name`);
  assertGt(r.normalDays, 0, `Route ${i} has normal days`);
  assert(r.ports.length >= 2, `Route ${i} has >= 2 ports`);
});

// Route IDs unique
const rIds = ROUTES.map(r => r.id);
assertEqual(rIds.length, new Set(rIds).size, 'Route IDs unique');

PACKAGES.forEach((p, i) => {
  assert(p.id.length > 0, `Package ${i} has id`);
  assert(p.origin.length > 0, `Package ${i} has origin`);
  assert(p.destination.length > 0, `Package ${i} has destination`);
  assert(['in-transit', 'delayed', 'delivered', 'held'].includes(p.status), `Package ${i} valid status`);
  assert(p.contents.length > 0, `Package ${i} has contents`);
  assert(p.weight.length > 0, `Package ${i} has weight`);
  assert(rIds.includes(p.route), `Package ${i} route exists`);
});

// Package IDs unique
const pIds = PACKAGES.map(p => p.id);
assertEqual(pIds.length, new Set(pIds).size, 'Package IDs unique');

console.log('  Data tests complete.\n');

// ---- Route Delay Tests ----
console.log('[Route Delay Tests]');

// All routes return valid data
ROUTES.forEach(r => {
  const delay = getRouteDelay(r.id);
  assert(delay !== null, `Route ${r.id} returns data`);
  assertEqual(r.normalDays, delay.normalDays, `Route ${r.id} normal days`);
  assertGte(delay.currentDays, delay.normalDays, `Route ${r.id} current >= normal`);
  assertGte(delay.delayDays, 0, `Route ${r.id} delay >= 0`);
  assert(Array.isArray(delay.affectedBy), `Route ${r.id} has affectedBy array`);
});

// Invalid route
assertEqual(null, getRouteDelay('nonexistent'), 'Invalid route returns null');

// Asia-Europe should be affected (passes through Suez)
const asiaEu = getRouteDelay('asia-eu');
assertGt(asiaEu.delayDays, 0, 'Asia-EU has delays');
assert(asiaEu.affectedBy.length > 0, 'Asia-EU affected by disruptions');

// Asia-US West Coast should have minimal/no delays (Pacific route)
const asiaUsWest = getRouteDelay('asia-uswest');
assertEqual(0, asiaUsWest.delayDays, 'Asia-US West no delays (Pacific)');

// Asia-Middle East severely affected
const asiaMideast = getRouteDelay('asia-mideast');
assertGt(asiaMideast.delayDays, 0, 'Asia-Middle East has delays');

console.log('  Route delay tests complete.\n');

// ---- Risk Score Tests ----
console.log('[Risk Score Tests]');

const score = getGlobalRiskScore();
assertGt(score, 0, 'Risk score > 0');
assertGte(100, score, 'Risk score <= 100');

// With current data (1 critical + 2 high + 2 medium = 30+20+20+10+10 = 90)
assertGte(score, 50, 'Risk score >= 50 with active disruptions');

const risk = getGlobalRiskLevel(score);
assert(risk.level.length > 0, 'Risk level has name');
assert(risk.color.length > 0, 'Risk level has color');
assert(risk.icon.length > 0, 'Risk level has icon');

// Test all risk levels
assertEqual('CRITICAL', getGlobalRiskLevel(70).level, '70 = CRITICAL');
assertEqual('CRITICAL', getGlobalRiskLevel(100).level, '100 = CRITICAL');
assertEqual('HIGH', getGlobalRiskLevel(50).level, '50 = HIGH');
assertEqual('HIGH', getGlobalRiskLevel(69).level, '69 = HIGH');
assertEqual('ELEVATED', getGlobalRiskLevel(30).level, '30 = ELEVATED');
assertEqual('NORMAL', getGlobalRiskLevel(0).level, '0 = NORMAL');
assertEqual('NORMAL', getGlobalRiskLevel(29).level, '29 = NORMAL');

console.log('  Risk score tests complete.\n');

// ---- Renderer Tests ----
console.log('[Renderer Tests]');

// stripAnsi
assertEqual('hello', stripAnsi('\x1b[31mhello\x1b[0m'), 'Strip ANSI codes');
assertEqual('plain', stripAnsi('plain'), 'No ANSI to strip');
assertEqual('', stripAnsi(''), 'Empty string');

// bar
const b1 = stripAnsi(bar(50, 100, 20));
assertEqual(20, b1.length, 'Bar length 20');
const b2 = stripAnsi(bar(0, 100, 10));
assertEqual(10, b2.length, 'Bar length 10');
const b3 = stripAnsi(bar(100, 100, 15));
assertEqual(15, b3.length, 'Full bar length 15');

// box
const boxed = box('Test', 'Hello\nWorld', 30);
assert(boxed.includes('┌'), 'Box has top border');
assert(boxed.includes('└'), 'Box has bottom border');
assert(boxed.includes('Test'), 'Box has title');
assert(boxed.includes('Hello'), 'Box has content');

// renderDashboard
const dashboard = renderDashboard();
assert(dashboard.length > 0, 'Dashboard not empty');
assert(dashboard.includes('SHIPWATCH'), 'Dashboard has title');
assert(dashboard.includes('Global Risk'), 'Dashboard has risk');
assert(dashboard.includes('Hormuz'), 'Dashboard mentions Hormuz');
assert(dashboard.includes('[1-5]'), 'Dashboard has nav hints');

// renderDisruption
const detail = renderDisruption(0);
assert(detail.length > 0, 'Disruption detail not empty');
assert(detail.includes('Strait of Hormuz'), 'Detail has region');
assert(detail.includes('critical'), 'Detail has severity');

// Invalid disruption index
const badDetail = renderDisruption(99);
assert(badDetail.includes('Invalid'), 'Invalid index handled');

const badDetail2 = renderDisruption(-1);
assert(badDetail2.includes('Invalid'), 'Negative index handled');

// All disruptions render
for (let i = 0; i < DISRUPTIONS.length; i++) {
  const d = renderDisruption(i);
  assert(d.length > 100, `Disruption ${i} renders substantial content`);
  assert(d.includes(DISRUPTIONS[i].region), `Disruption ${i} includes region`);
}

// renderRoutes
const routes = renderRoutes();
assert(routes.length > 0, 'Routes not empty');
assert(routes.includes('Route Status'), 'Routes has title');
ROUTES.forEach(r => {
  assert(routes.includes(r.name), `Routes includes ${r.name}`);
});

// renderPackages
const packages = renderPackages();
assert(packages.length > 0, 'Packages not empty');
assert(packages.includes('Package Tracker'), 'Packages has title');
PACKAGES.forEach(p => {
  assert(packages.includes(p.id), `Packages includes ${p.id}`);
});

// renderHelp
const help = renderHelp();
assert(help.length > 0, 'Help not empty');
assert(help.includes('One-Hand'), 'Help mentions one-hand');
assert(help.includes('Left Hand'), 'Help mentions left hand');
assert(help.includes('3am'), 'Help mentions 3am');

console.log('  Renderer tests complete.\n');

// ---- One-Hand Usability Tests ----
console.log('[One-Hand Usability Tests]');

// All navigation keys should be left-hand reachable
const leftHandKeys = ['1','2','3','4','5','q','w','e','r','t','a','s','d','f','g','z','x','c','v','b',' ','?'];

// Commands used in the app
const appKeys = ['d', 'r', 't', 'q', '?', '1', '2', '3', '4', '5'];
appKeys.forEach(key => {
  assert(leftHandKeys.includes(key), `Key "${key}" is left-hand reachable`);
});

// No modifier keys required (Ctrl, Shift, Alt)
const dashboardText = stripAnsi(renderDashboard());
assert(!dashboardText.includes('Ctrl+'), 'No Ctrl+ in dashboard');
assert(!dashboardText.includes('Shift+'), 'No Shift+ in dashboard');
assert(!dashboardText.includes('Alt+'), 'No Alt+ in dashboard');

const helpText = stripAnsi(renderHelp());
assert(!helpText.includes('Ctrl+'), 'No Ctrl+ in help');
assert(!helpText.includes('Shift+'), 'No Shift+ in help');

console.log('  One-hand usability tests complete.\n');

// ---- Integration Tests ----
console.log('[Integration Tests]');

// All views render without errors
const views = [
  renderDashboard(),
  renderRoutes(),
  renderPackages(),
  renderHelp(),
];
views.forEach((v, i) => {
  assertGt(v.length, 100, `View ${i} has substantial content`);
  assert(v.includes('┌'), `View ${i} has box border`);
  assert(v.includes('┘'), `View ${i} has box end`);
});

// All disruption details render
for (let i = 0; i < DISRUPTIONS.length; i++) {
  const d = renderDisruption(i);
  assertGt(d.length, 100, `Disruption ${i} detail is substantial`);
}

// Route delays are consistent
const delays = ROUTES.map(r => getRouteDelay(r.id));
delays.forEach(d => {
  assertEqual(d.normalDays + d.delayDays, d.currentDays, `Route ${d.route.id} math checks out`);
});

// Packages reference valid routes
PACKAGES.forEach(p => {
  const delay = getRouteDelay(p.route);
  assert(delay !== null, `Package ${p.id} route ${p.route} is valid`);
});

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
