const {
  createPortfolio, deposit, getBalance, getStats,
  getRecentTransactions, getPortfolioHistory, daysBetween,
  DEPOSIT_AMOUNT, STREAK_3_BONUS, STREAK_7_BONUS, DIVIDEND_RATE,
  CORRECTION_RATE, CORRECTION_THRESHOLD,
} = require('../src/portfolio');

let passed = 0, failed = 0;
function assert(c, m) { if (c) passed++; else { failed++; console.error('  FAIL: ' + m); } }
function eq(a, b, m) { assert(a === b, `${m} (got ${a}, expected ${b})`); }

console.log('Portfolio Tests\n===============');

// --- Create ---
console.log('\n--- Create ---');
const p = createPortfolio();
eq(p.balance, 0, 'starts at 0');
eq(p.totalWorkouts, 0, 'no workouts');
eq(p.currentStreak, 0, 'no streak');
eq(p.longestStreak, 0, 'no longest streak');
assert(p.transactions.length === 0, 'no transactions');

// --- Single Deposit ---
console.log('\n--- Single Deposit ---');
const r1 = deposit(p, '2026-03-01');
eq(r1.portfolio.balance, DEPOSIT_AMOUNT, 'balance after first deposit');
eq(r1.portfolio.totalWorkouts, 1, '1 workout');
eq(r1.portfolio.currentStreak, 1, 'streak is 1');
eq(r1.added, DEPOSIT_AMOUNT, 'added amount');
assert(r1.message.includes('+10'), 'message shows +10');

// --- Duplicate Same Day ---
console.log('\n--- Duplicate ---');
const r2 = deposit(r1.portfolio, '2026-03-01');
eq(r2.added, 0, 'no add on duplicate');
assert(r2.message.includes('Already'), 'already message');
eq(r2.portfolio.balance, DEPOSIT_AMOUNT, 'balance unchanged');

// --- Consecutive Days (Streak) ---
console.log('\n--- Streak ---');
let sp = createPortfolio();
for (let d = 1; d <= 7; d++) {
  const date = `2026-03-${String(d).padStart(2, '0')}`;
  const r = deposit(sp, date);
  sp = r.portfolio;
}
eq(sp.currentStreak, 7, 'streak 7 after 7 days');
eq(sp.longestStreak, 7, 'longest streak 7');
eq(sp.totalWorkouts, 7, '7 workouts');
assert(sp.balance > 7 * DEPOSIT_AMOUNT, 'balance > base due to bonuses');

// Check streak bonuses were applied
const bonusTxs = sp.transactions.filter(t => t.type === 'bonus');
assert(bonusTxs.length >= 2, 'at least 2 bonus transactions (day 3 and 7)');
assert(bonusTxs.some(t => t.amount === STREAK_3_BONUS), '3-day bonus applied');
assert(bonusTxs.some(t => t.amount === STREAK_7_BONUS), '7-day bonus applied');

// Check dividends were applied (streak > 3)
const divTxs = sp.transactions.filter(t => t.type === 'dividend');
assert(divTxs.length > 0, 'dividends applied after day 3');

// --- Gap Resets Streak ---
console.log('\n--- Gap ---');
let gp = createPortfolio();
deposit(gp, '2026-03-01');
const gr = deposit(gp, '2026-03-01');
gp = gr.portfolio;
const gr2 = deposit(gp, '2026-03-05'); // 4-day gap
gp = gr2.portfolio;
eq(gp.currentStreak, 1, 'streak reset after gap');

// --- Correction After 7+ Day Gap ---
console.log('\n--- Correction ---');
let cp = createPortfolio();
cp = deposit(cp, '2026-03-01').portfolio;
cp = deposit(cp, '2026-03-02').portfolio;
cp = deposit(cp, '2026-03-03').portfolio;
const balBefore = cp.balance;
cp = deposit(cp, '2026-03-15').portfolio; // 12-day gap
const correctionTxs = cp.transactions.filter(t => t.type === 'correction');
assert(correctionTxs.length > 0, 'correction applied');
assert(cp.totalCorrections > 0, 'totalCorrections > 0');

// --- daysBetween ---
console.log('\n--- daysBetween ---');
eq(daysBetween('2026-03-01', '2026-03-01'), 0, 'same day = 0');
eq(daysBetween('2026-03-01', '2026-03-02'), 1, 'next day = 1');
eq(daysBetween('2026-03-01', '2026-03-08'), 7, 'week = 7');
eq(daysBetween('2026-01-01', '2026-12-31'), 364, 'year = 364');

// --- getBalance ---
console.log('\n--- getBalance ---');
const bp = createPortfolio();
eq(getBalance(bp), 0, 'balance of new portfolio');
bp.balance = 42;
eq(getBalance(bp), 42, 'balance after manual set');

// --- getStats ---
console.log('\n--- getStats ---');
const stats = getStats(sp);
assert(stats.balance > 0, 'stats balance > 0');
eq(stats.totalWorkouts, 7, 'stats workouts');
assert(stats.totalDeposited > 0, 'stats deposited');
assert(stats.consistency > 0, 'stats consistency > 0');

// --- getRecentTransactions ---
console.log('\n--- Recent Transactions ---');
const recent = getRecentTransactions(sp, 3);
eq(recent.length, 3, 'gets last 3');
const all = getRecentTransactions(sp, 100);
assert(all.length === sp.transactions.length, 'gets all when n > total');

// --- getPortfolioHistory ---
console.log('\n--- Portfolio History ---');
const history = getPortfolioHistory(sp);
assert(history.length > 0, 'has history points');
assert(history[history.length - 1].balance === sp.balance, 'last point matches balance');
assert(history.every(p => typeof p.date === 'string'), 'all points have dates');
assert(history.every(p => typeof p.balance === 'number'), 'all points have balances');

// --- No Penalty for Single Skip ---
console.log('\n--- No Penalty ---');
let np = createPortfolio();
np = deposit(np, '2026-03-01').portfolio;
const balAfterDeposit = np.balance;
np = deposit(np, '2026-03-03').portfolio; // 2-day gap, no correction
const corrTxs = np.transactions.filter(t => t.type === 'correction');
eq(corrTxs.length, 0, 'no correction for 2-day gap');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
