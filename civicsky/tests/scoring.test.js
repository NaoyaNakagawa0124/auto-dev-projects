const { calculateIntensity, calculateForecast, severityFromScore } = require('../js/scoring.js');

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

console.log('Scoring Tests');
console.log('=============');

// calculateIntensity
console.log('\n--- calculateIntensity ---');
assert(calculateIntensity([]) === 0, 'Empty policies -> 0');
assert(calculateIntensity(null) === 0, 'null -> 0');

const mildPolicies = [
  { severity: 'mild', effectiveDate: '2026-06-01' },
  { severity: 'mild', effectiveDate: '2026-06-01' }
];
const result1 = calculateIntensity(mildPolicies, '2026-03-29');
assert(result1 > 0 && result1 <= 100, `Mild policies score in range: ${result1}`);

const severePolicies = [
  { severity: 'severe', effectiveDate: '2026-03-29' },
  { severity: 'severe', effectiveDate: '2026-03-28' },
  { severity: 'severe', effectiveDate: '2026-03-27' },
  { severity: 'significant', effectiveDate: '2026-03-29' },
  { severity: 'significant', effectiveDate: '2026-03-28' }
];
const result2 = calculateIntensity(severePolicies, '2026-03-29');
assert(result2 > result1, `Severe policies score higher (${result2} > ${result1})`);

// Recency boost
const recentPolicy = [{ severity: 'moderate', effectiveDate: '2026-03-29' }];
const oldPolicy = [{ severity: 'moderate', effectiveDate: '2025-01-01' }];
const recentScore = calculateIntensity(recentPolicy, '2026-03-29');
const oldScore = calculateIntensity(oldPolicy, '2026-03-29');
assert(recentScore >= oldScore, `Recent policy scores >= old (${recentScore} vs ${oldScore})`);

// calculateForecast
console.log('\n--- calculateForecast ---');
const policies = [
  { severity: 'moderate', effectiveDate: '2026-03-30' },
  { severity: 'severe', effectiveDate: '2026-04-01' }
];
const forecast = calculateForecast(policies, '2026-03-29', 5);
assert(forecast.length === 5, 'Forecast has 5 days');
assert(forecast[0].date === '2026-03-29', 'First day is start date');
assert(forecast.every(d => typeof d.intensity === 'number'), 'Each day has intensity');
assert(forecast.every(d => d.dayName && typeof d.dayName === 'string'), 'Each day has name');
assert(forecast.every(d => Array.isArray(d.newPolicies)), 'Each day has newPolicies array');

// Check that the day with the policy has it in newPolicies
const mar30 = forecast.find(d => d.date === '2026-03-30');
assert(mar30.newPolicies.length === 1, 'Mar 30 has 1 new policy');

// severityFromScore
console.log('\n--- severityFromScore ---');
assert(severityFromScore(0) === 'mild', '0 -> mild');
assert(severityFromScore(25) === 'mild', '25 -> mild');
assert(severityFromScore(26) === 'moderate', '26 -> moderate');
assert(severityFromScore(50) === 'moderate', '50 -> moderate');
assert(severityFromScore(51) === 'significant', '51 -> significant');
assert(severityFromScore(75) === 'significant', '75 -> significant');
assert(severityFromScore(76) === 'severe', '76 -> severe');
assert(severityFromScore(100) === 'severe', '100 -> severe');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
