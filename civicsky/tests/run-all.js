const { execSync } = require('child_process');
const path = require('path');

const tests = [
  'weather-engine.test.js',
  'policy-data.test.js',
  'scoring.test.js'
];

let allPassed = true;
const results = [];

console.log('CivicSky Test Suite\n');

tests.forEach(test => {
  const file = path.join(__dirname, test);
  try {
    const output = execSync(`node "${file}"`, { encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    results.push({ test, status: 'PASS' });
  } catch (err) {
    console.log(err.stdout || '');
    console.error(err.stderr || '');
    results.push({ test, status: 'FAIL' });
    allPassed = false;
  }
});

console.log('\n=== Summary ===');
results.forEach(r => {
  console.log(`  ${r.status === 'PASS' ? '\u2705' : '\u274C'} ${r.test}`);
});

const total = results.length;
const passing = results.filter(r => r.status === 'PASS').length;
console.log(`\n${passing}/${total} test suites passed`);

process.exit(allPassed ? 0 : 1);
