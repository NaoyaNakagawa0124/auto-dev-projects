const { renderPortfolioChart, renderStreakBar, renderStatsBox, renderTransactions } = require('../src/chart');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }

console.log('Chart Tests\n===========');

// --- Portfolio Chart ---
console.log('\n--- Portfolio Chart ---');
const emptyChart = renderPortfolioChart([]);
assert(emptyChart.includes('No data'), 'empty chart message');

const history = [
  { date: '2026-03-01', balance: 10 },
  { date: '2026-03-02', balance: 20 },
  { date: '2026-03-03', balance: 35 },
  { date: '2026-03-04', balance: 50 },
  { date: '2026-03-05', balance: 65 },
];
const chart = renderPortfolioChart(history);
assert(chart.includes('FitCoin'), 'chart has title');
assert(chart.includes('█'), 'chart has bars');
assert(chart.includes('│'), 'chart has y-axis');
assert(chart.length > 100, 'chart has content');

// --- Streak Bar ---
console.log('\n--- Streak Bar ---');
const bar0 = renderStreakBar(0, 0);
assert(bar0.includes('░'), 'empty streak has empty bar');
assert(bar0.includes('0 days'), 'shows 0 days');

const bar5 = renderStreakBar(5, 10);
assert(bar5.includes('▓'), 'active streak has filled bar');
assert(bar5.includes('5 days'), 'shows 5 days');
assert(bar5.includes('best: 10'), 'shows best');

const bar50 = renderStreakBar(50, 50);
assert(bar50.includes('▓'), 'long streak has bars');

// --- Stats Box ---
console.log('\n--- Stats Box ---');
const stats = {
  balance: 150,
  totalWorkouts: 10,
  totalDeposited: 100,
  totalDividends: 30,
  totalCorrections: 5,
  currentStreak: 5,
  longestStreak: 8,
  consistency: 70,
};
const box = renderStatsBox(stats);
assert(box.includes('150 FC'), 'shows balance');
assert(box.includes('10'), 'shows workouts');
assert(box.includes('70%'), 'shows consistency');
assert(box.includes('╔'), 'has box border');

// --- Transactions ---
console.log('\n--- Transactions ---');
const emptyTx = renderTransactions([]);
assert(emptyTx.includes('No transactions'), 'empty transactions message');

const txs = [
  { type: 'deposit', amount: 10, date: '2026-03-01', note: 'Workout' },
  { type: 'bonus', amount: 5, date: '2026-03-03', note: '3-day streak' },
  { type: 'dividend', amount: 2, date: '2026-03-04', note: 'Daily' },
  { type: 'correction', amount: -5, date: '2026-03-15', note: 'Gap' },
];
const txOutput = renderTransactions(txs);
assert(txOutput.includes('+10'), 'shows deposit');
assert(txOutput.includes('+5'), 'shows bonus');
assert(txOutput.includes('-5'), 'shows correction');
assert(txOutput.includes('Recent'), 'has header');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
