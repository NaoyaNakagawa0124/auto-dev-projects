#!/usr/bin/env node

/**
 * FitCoin CLI — The anti-Strava.
 */

const { deposit, getBalance, getRecentTransactions, getStats, getPortfolioHistory } = require('./portfolio');
const { renderPortfolioChart, renderStreakBar, renderStatsBox, renderTransactions } = require('./chart');
const { load, save } = require('./storage');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function main() {
  const portfolio = load();

  switch (command) {
    case 'deposit':
    case 'd': {
      const result = deposit(portfolio, new Date().toISOString().split('T')[0]);
      save(result.portfolio);
      console.log('\n  💪 ' + result.message);
      console.log(renderStreakBar(result.portfolio.currentStreak, result.portfolio.longestStreak));
      break;
    }

    case 'balance':
    case 'b': {
      const bal = getBalance(portfolio);
      console.log(`\n  💰 Balance: ${bal} FitCoins`);
      console.log(renderStreakBar(portfolio.currentStreak, portfolio.longestStreak));
      break;
    }

    case 'portfolio':
    case 'p': {
      const history = getPortfolioHistory(portfolio);
      console.log(renderPortfolioChart(history));
      console.log(`  💰 Current: ${portfolio.balance} FC | 📈 Workouts: ${portfolio.totalWorkouts}`);
      break;
    }

    case 'streak':
    case 's': {
      console.log('\n  🔥 Streak Report');
      console.log(renderStreakBar(portfolio.currentStreak, portfolio.longestStreak));
      if (portfolio.currentStreak >= 3) {
        console.log('  Dividends active! +2% daily compound.');
      } else if (portfolio.currentStreak > 0) {
        console.log(`  ${3 - portfolio.currentStreak} more day(s) to unlock dividends!`);
      } else {
        console.log('  Start a streak today!');
      }
      console.log('');
      break;
    }

    case 'history':
    case 'h': {
      const n = parseInt(args[1]) || 10;
      const txs = getRecentTransactions(portfolio, n);
      console.log(renderTransactions(txs));
      break;
    }

    case 'stats': {
      const stats = getStats(portfolio);
      console.log(renderStatsBox(stats));
      break;
    }

    case 'dividends': {
      if (portfolio.currentStreak <= 3) {
        console.log('\n  📊 Dividends unlock after a 3-day streak.');
        console.log(`  Current streak: ${portfolio.currentStreak} days.\n`);
      } else {
        console.log(`\n  📊 Dividends Active!`);
        console.log(`  Rate: 2% of balance per workout day`);
        console.log(`  Total earned: ${portfolio.totalDividends} FC`);
        console.log(`  Current balance: ${portfolio.balance} FC\n`);
      }
      break;
    }

    case 'help':
    default:
      console.log(`
  ╔═══════════════════════════════════════╗
  ║          FITCOIN — Anti-Strava        ║
  ║   Your health is a portfolio.         ║
  ╚═══════════════════════════════════════╝

  Commands:
    deposit (d)     Log a workout (+10 FC)
    balance (b)     Check your balance
    portfolio (p)   View portfolio chart
    streak (s)      View streak status
    history (h)     Recent transactions
    dividends       Dividend info
    stats           Full statistics
    help            Show this help

  Philosophy:
    No metrics. No PRs. No shame.
    Just show up. Your portfolio will grow.
`);
  }
}

main();
