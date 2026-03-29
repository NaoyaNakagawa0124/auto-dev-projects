/**
 * FitCoin — Portfolio logic: balance, deposits, dividends, corrections.
 */

const DEPOSIT_AMOUNT = 10;
const STREAK_3_BONUS = 5;
const STREAK_7_BONUS = 15;
const STREAK_30_BONUS = 50;
const DIVIDEND_RATE = 0.02;       // 2% daily dividend if streak > 3
const CORRECTION_RATE = 0.05;     // 5% correction after 7+ day gap
const CORRECTION_THRESHOLD = 7;   // days gap before correction

function createPortfolio() {
  return {
    balance: 0,
    totalDeposited: 0,
    totalDividends: 0,
    totalCorrections: 0,
    transactions: [],
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    lastWorkoutDate: null,
    createdAt: new Date().toISOString(),
  };
}

function deposit(portfolio, date) {
  const dateStr = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
  const today = dateStr;

  // Check if already deposited today
  const alreadyToday = portfolio.transactions.some(
    t => t.type === 'deposit' && t.date === today
  );
  if (alreadyToday) {
    return { portfolio, message: 'Already deposited today! One workout per day counts.', added: 0 };
  }

  // Calculate gap and apply correction if needed
  let correctionAmount = 0;
  if (portfolio.lastWorkoutDate) {
    const gap = daysBetween(portfolio.lastWorkoutDate, today);
    if (gap > CORRECTION_THRESHOLD && portfolio.balance > 0) {
      correctionAmount = Math.round(portfolio.balance * CORRECTION_RATE);
      portfolio.balance -= correctionAmount;
      portfolio.totalCorrections += correctionAmount;
      portfolio.transactions.push({
        type: 'correction',
        amount: -correctionAmount,
        date: today,
        note: `Market correction (-${CORRECTION_RATE * 100}%) after ${gap}-day gap`,
      });
    }
  }

  // Update streak
  if (portfolio.lastWorkoutDate) {
    const gap = daysBetween(portfolio.lastWorkoutDate, today);
    if (gap === 1) {
      portfolio.currentStreak++;
    } else if (gap === 0) {
      // same day, shouldn't happen due to check above
    } else {
      portfolio.currentStreak = 1;
    }
  } else {
    portfolio.currentStreak = 1;
  }

  if (portfolio.currentStreak > portfolio.longestStreak) {
    portfolio.longestStreak = portfolio.currentStreak;
  }

  // Base deposit
  let totalAdded = DEPOSIT_AMOUNT;
  portfolio.balance += DEPOSIT_AMOUNT;
  portfolio.totalDeposited += DEPOSIT_AMOUNT;
  portfolio.totalWorkouts++;
  portfolio.lastWorkoutDate = today;

  portfolio.transactions.push({
    type: 'deposit',
    amount: DEPOSIT_AMOUNT,
    date: today,
    note: 'Workout logged',
  });

  // Streak bonuses
  let bonusNote = '';
  if (portfolio.currentStreak === 3) {
    portfolio.balance += STREAK_3_BONUS;
    totalAdded += STREAK_3_BONUS;
    bonusNote = '3-day streak bonus!';
    portfolio.transactions.push({ type: 'bonus', amount: STREAK_3_BONUS, date: today, note: bonusNote });
  } else if (portfolio.currentStreak === 7) {
    portfolio.balance += STREAK_7_BONUS;
    totalAdded += STREAK_7_BONUS;
    bonusNote = '7-day streak bonus!';
    portfolio.transactions.push({ type: 'bonus', amount: STREAK_7_BONUS, date: today, note: bonusNote });
  } else if (portfolio.currentStreak === 30) {
    portfolio.balance += STREAK_30_BONUS;
    totalAdded += STREAK_30_BONUS;
    bonusNote = '30-day streak MEGA bonus!';
    portfolio.transactions.push({ type: 'bonus', amount: STREAK_30_BONUS, date: today, note: bonusNote });
  }

  // Dividend
  let dividendAmount = 0;
  if (portfolio.currentStreak > 3 && portfolio.balance > 0) {
    dividendAmount = Math.round(portfolio.balance * DIVIDEND_RATE);
    if (dividendAmount > 0) {
      portfolio.balance += dividendAmount;
      portfolio.totalDividends += dividendAmount;
      totalAdded += dividendAmount;
      portfolio.transactions.push({
        type: 'dividend',
        amount: dividendAmount,
        date: today,
        note: `Daily dividend (${DIVIDEND_RATE * 100}%)`,
      });
    }
  }

  let message = `+${DEPOSIT_AMOUNT} FC deposited!`;
  if (bonusNote) message += ` ${bonusNote}`;
  if (dividendAmount > 0) message += ` +${dividendAmount} FC dividend.`;
  if (correctionAmount > 0) message += ` (${correctionAmount} FC correction applied)`;
  message += ` Balance: ${portfolio.balance} FC`;

  return { portfolio, message, added: totalAdded };
}

function getBalance(portfolio) {
  return portfolio.balance;
}

function getRecentTransactions(portfolio, n) {
  return portfolio.transactions.slice(-n);
}

function getStats(portfolio) {
  const daysSinceStart = portfolio.createdAt
    ? daysBetween(portfolio.createdAt.split('T')[0], new Date().toISOString().split('T')[0]) + 1
    : 1;
  const consistency = daysSinceStart > 0
    ? Math.round((portfolio.totalWorkouts / daysSinceStart) * 100)
    : 0;

  return {
    balance: portfolio.balance,
    totalWorkouts: portfolio.totalWorkouts,
    totalDeposited: portfolio.totalDeposited,
    totalDividends: portfolio.totalDividends,
    totalCorrections: portfolio.totalCorrections,
    currentStreak: portfolio.currentStreak,
    longestStreak: portfolio.longestStreak,
    daysSinceStart,
    consistency: Math.min(consistency, 100),
  };
}

function getPortfolioHistory(portfolio) {
  // Reconstruct balance over time from transactions
  let balance = 0;
  const points = [];
  let lastDate = '';

  for (const tx of portfolio.transactions) {
    balance += tx.amount;
    if (tx.date !== lastDate) {
      points.push({ date: tx.date, balance });
      lastDate = tx.date;
    } else {
      points[points.length - 1].balance = balance;
    }
  }
  return points;
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

module.exports = {
  DEPOSIT_AMOUNT, STREAK_3_BONUS, STREAK_7_BONUS, STREAK_30_BONUS,
  DIVIDEND_RATE, CORRECTION_RATE, CORRECTION_THRESHOLD,
  createPortfolio, deposit, getBalance, getRecentTransactions,
  getStats, getPortfolioHistory, daysBetween,
};
