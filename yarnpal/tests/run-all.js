const { execSync } = require('child_process');
const path = require('path');
const tests = ['counter.test.js', 'projects.test.js', 'timer.test.js'];
let allPassed = true;
const results = [];

console.log('YarnPal Test Suite\n');

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
results.forEach(r => {
  const icon = r.status === 'PASS' ? '\u2705' : '\u274c';
  console.log(`  ${icon} ${r.test}`);
});
console.log(`\n${results.filter(r => r.status === 'PASS').length}/${results.length} passed`);
process.exit(allPassed ? 0 : 1);
