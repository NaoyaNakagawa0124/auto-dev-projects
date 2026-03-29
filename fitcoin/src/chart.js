/**
 * FitCoin — ASCII chart rendering for terminal portfolio view.
 */

const CHART_HEIGHT = 12;
const CHART_WIDTH = 50;

function renderPortfolioChart(history) {
  if (history.length === 0) return 'No data yet. Make your first deposit!';

  const values = history.map(p => p.balance);
  const dates = history.map(p => p.date);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  // Take last CHART_WIDTH points or pad
  const display = values.slice(-CHART_WIDTH);
  const displayDates = dates.slice(-CHART_WIDTH);

  const lines = [];
  lines.push('');
  lines.push('  FitCoin Portfolio');
  lines.push('  ' + '─'.repeat(CHART_WIDTH + 4));

  for (let row = CHART_HEIGHT; row >= 0; row--) {
    const threshold = min + (range * row) / CHART_HEIGHT;
    let line = '';

    // Y-axis label
    if (row === CHART_HEIGHT) {
      line += padLeft(String(max), 6) + ' │';
    } else if (row === 0) {
      line += padLeft(String(min), 6) + ' │';
    } else if (row === Math.floor(CHART_HEIGHT / 2)) {
      line += padLeft(String(Math.round((max + min) / 2)), 6) + ' │';
    } else {
      line += '       │';
    }

    for (let col = 0; col < display.length; col++) {
      const val = display[col];
      if (val >= threshold) {
        line += '█';
      } else {
        line += ' ';
      }
    }
    lines.push(line);
  }

  // X-axis
  lines.push('       └' + '─'.repeat(display.length));

  // Date labels
  if (displayDates.length > 0) {
    const first = displayDates[0].slice(5); // MM-DD
    const last = displayDates[displayDates.length - 1].slice(5);
    const gap = display.length - first.length - last.length;
    lines.push('        ' + first + ' '.repeat(Math.max(gap, 1)) + last);
  }

  lines.push('');
  return lines.join('\n');
}

function renderStreakBar(current, longest) {
  const maxBar = 30;
  const filled = Math.min(current, maxBar);
  const bar = '▓'.repeat(filled) + '░'.repeat(maxBar - filled);
  return `  Streak: [${bar}] ${current} days (best: ${longest})`;
}

function renderStatsBox(stats) {
  const lines = [];
  lines.push('');
  lines.push('  ╔══════════════════════════════════╗');
  lines.push('  ║      FITCOIN PORTFOLIO STATS      ║');
  lines.push('  ╠══════════════════════════════════╣');
  lines.push(`  ║  Balance:      ${padLeft(stats.balance + ' FC', 16)}  ║`);
  lines.push(`  ║  Workouts:     ${padLeft(String(stats.totalWorkouts), 16)}  ║`);
  lines.push(`  ║  Deposited:    ${padLeft(stats.totalDeposited + ' FC', 16)}  ║`);
  lines.push(`  ║  Dividends:    ${padLeft(stats.totalDividends + ' FC', 16)}  ║`);
  lines.push(`  ║  Corrections:  ${padLeft(stats.totalCorrections + ' FC', 16)}  ║`);
  lines.push(`  ║  Streak:       ${padLeft(stats.currentStreak + ' days', 16)}  ║`);
  lines.push(`  ║  Best Streak:  ${padLeft(stats.longestStreak + ' days', 16)}  ║`);
  lines.push(`  ║  Consistency:  ${padLeft(stats.consistency + '%', 16)}  ║`);
  lines.push('  ╚══════════════════════════════════╝');
  lines.push('');
  return lines.join('\n');
}

function renderTransactions(transactions) {
  if (transactions.length === 0) return '  No transactions yet.';
  const lines = ['', '  Recent Transactions:', '  ─────────────────────────────────────'];
  for (const tx of transactions) {
    const sign = tx.amount >= 0 ? '+' : '';
    const icon = tx.type === 'deposit' ? '💪' : tx.type === 'bonus' ? '🎉' : tx.type === 'dividend' ? '📈' : '📉';
    lines.push(`  ${tx.date}  ${icon} ${sign}${tx.amount} FC  ${tx.note}`);
  }
  lines.push('');
  return lines.join('\n');
}

function padLeft(str, len) {
  while (str.length < len) str = ' ' + str;
  return str;
}

module.exports = {
  renderPortfolioChart, renderStreakBar, renderStatsBox, renderTransactions,
  CHART_HEIGHT, CHART_WIDTH,
};
