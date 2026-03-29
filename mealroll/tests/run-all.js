const { execSync } = require('child_process');
const path = require('path');
const tests = ['recipes.test.js', 'spin.test.js'];
let allPassed = true;
const results = [];

console.log('MealRoll Test Suite\n');

tests.forEach(test => {
  try {
    const output = execSync(`node "${path.join(__dirname, test)}"`, { encoding: 'utf8', stdio: 'pipe' });
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
results.forEach(r => console.log(`  ${r.status === 'PASS' ? '\u2705' : '\u274c'} ${r.test}`));
const p = results.filter(r => r.status === 'PASS').length;
console.log(`\n${p}/${results.length} test suites passed`);
process.exit(allPassed ? 0 : 1);
