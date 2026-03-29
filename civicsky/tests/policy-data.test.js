const {
  CATEGORIES,
  POLICIES,
  US_STATES,
  STATE_NAMES,
  getPoliciesForState,
  getPoliciesByCategory,
  getUpcomingPolicies,
  getRecentPolicies
} = require('../js/policy-data.js');

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

console.log('Policy Data Tests');
console.log('=================');

// Basic data integrity
console.log('\n--- Data Integrity ---');
assert(POLICIES.length >= 20, `At least 20 policies (got ${POLICIES.length})`);
assert(US_STATES.length === 51, `51 states + DC (got ${US_STATES.length})`);
assert(Object.keys(STATE_NAMES).length === 51, `51 state names`);

// Every policy has required fields
console.log('\n--- Policy Schema ---');
POLICIES.forEach((p, i) => {
  assert(p.id && typeof p.id === 'string', `Policy ${i} has id`);
  assert(p.title && typeof p.title === 'string', `Policy ${i} has title`);
  assert(p.summary && typeof p.summary === 'string', `Policy ${i} has summary`);
  assert(p.category && Object.values(CATEGORIES).includes(p.category), `Policy ${i} has valid category`);
  assert(p.severity && ['mild','moderate','significant','severe'].includes(p.severity), `Policy ${i} has valid severity`);
  assert(typeof p.severityScore === 'number' && p.severityScore >= 0 && p.severityScore <= 100, `Policy ${i} has valid severityScore`);
  assert(p.effectiveDate && /^\d{4}-\d{2}-\d{2}$/.test(p.effectiveDate), `Policy ${i} has valid date`);
  assert(Array.isArray(p.states) && p.states.length > 0, `Policy ${i} has states array`);
});

// getPoliciesForState
console.log('\n--- getPoliciesForState ---');
const nyPolicies = getPoliciesForState('NY');
assert(nyPolicies.length > 0, 'NY has policies');
assert(nyPolicies.every(p => p.states.includes('NY') || p.states.length === US_STATES.length), 'NY policies are relevant');

const allPolicies = getPoliciesForState(null);
assert(allPolicies.length === POLICIES.length, 'null state returns all');

// getPoliciesByCategory
console.log('\n--- getPoliciesByCategory ---');
const taxPolicies = getPoliciesByCategory(POLICIES, 'tax');
assert(taxPolicies.length > 0, 'Tax category has policies');
assert(taxPolicies.every(p => p.category === 'tax'), 'All are tax');

const noCat = getPoliciesByCategory(POLICIES, null);
assert(noCat.length === POLICIES.length, 'null category returns all');

// getUpcomingPolicies
console.log('\n--- getUpcomingPolicies ---');
const upcoming = getUpcomingPolicies(POLICIES, '2026-01-01');
assert(upcoming.length > 0, 'Has upcoming policies from 2026-01-01');
assert(upcoming.every((p, i) => i === 0 || new Date(p.effectiveDate) >= new Date(upcoming[i-1].effectiveDate)), 'Sorted by date ascending');

// getRecentPolicies
console.log('\n--- getRecentPolicies ---');
const recent = getRecentPolicies(POLICIES, '2026-04-01', 90);
assert(recent.length > 0, 'Has recent policies within 90 days of 2026-04-01');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
