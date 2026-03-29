# FitCoin

> The anti-Strava. Your health is a portfolio. Every workout is a deposit.

## What is FitCoin?

FitCoin is a CLI tool that treats your fitness journey like a financial portfolio. No metrics, no PRs, no comparisons. Just: **did you move today?**

- **Yes** → Deposit FitCoins. Portfolio goes up.
- **No** → That's okay. But your portfolio stagnates.

It's the opposite of every fitness app that makes you feel bad for not hitting a PR. FitCoin celebrates showing up.

## Commands

```bash
fitcoin deposit          # Log a workout (any kind!)
fitcoin balance          # Check your FitCoin balance
fitcoin portfolio        # See your health portfolio chart
fitcoin streak           # View your current streak
fitcoin history          # View recent transactions
fitcoin dividends        # Streak bonuses compound daily
fitcoin stats            # Overall statistics
```

## How It Works

| Action | FitCoins |
|--------|----------|
| Any workout | +10 FC |
| 3-day streak bonus | +5 FC |
| 7-day streak bonus | +15 FC |
| 30-day streak bonus | +50 FC |
| Dividend (daily if streak > 3) | +2% of balance |
| Skip day | 0 (no penalty!) |
| 7+ day gap | -5% "market correction" |

**Key principle:** You never lose coins for skipping a day. Only extended gaps trigger a small correction. This is anti-punishment design.

## Install & Run

```bash
cd fitcoin
node src/cli.js deposit
node src/cli.js portfolio
```

## License

MIT
