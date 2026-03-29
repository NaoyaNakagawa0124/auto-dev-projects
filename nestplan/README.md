# NestPlan

> Plan your future home together — a beautiful terminal app for couples.

## What is NestPlan?

NestPlan is a Textual TUI (Terminal User Interface) app that helps long-distance couples plan their future shared home. Organize projects room by room, set budgets, vote on priorities, assign tasks, and track progress — all from your terminal.

## Who is this for?

Couples planning to move in together, especially those in long-distance relationships who want to dream, plan, and coordinate their future home before the big move.

## Features

1. **Room Manager** — Add and organize rooms (kitchen, bedroom, living room, etc.)
2. **Project Planner** — Create DIY/renovation projects per room with descriptions and budgets
3. **Priority Voting** — Each partner votes on project priority (1-5 stars). Combined score determines order.
4. **Budget Dashboard** — Track total budget, per-room spending, and who's covering what
5. **Progress Tracker** — Mark projects as planned, in-progress, or done with visual indicators
6. **Partner Profiles** — Two-player mode: each person identified by name with their own votes
7. **Export/Import** — Share your plan as a JSON file so both partners stay in sync

## Tech Stack

- **Python 3.10+**
- **Textual** — Modern TUI framework
- **Rich** — Beautiful terminal formatting
- **JSON** — Data persistence (no database needed)

## Quick Start

```bash
cd nestplan
pip install -e .
nestplan
```

Or run directly:
```bash
python -m nestplan
```

## Usage

```bash
# Start with a new plan
nestplan

# Load an existing plan
nestplan --load myplan.json

# Export your plan
# (Use the Export button in the app)
```

## License

MIT
