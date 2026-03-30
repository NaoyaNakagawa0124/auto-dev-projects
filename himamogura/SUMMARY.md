# Himamogura (ヒマモグラ) — Summary

## What Was Built

A Discord bot with a cute mole mascot that "digs up" hobby suggestions for bored adults. Inspired by 2026's "going analogue" meme trend and internet culture. Features quiz-based hobby matching, daily challenges with streak tracking, and a gamified hobby collection system.

## Features

- **/dig** — Random hobby suggestion with mole ASCII art and beautiful category-colored embeds
- **/quiz** — 5-question interactive personality quiz → matched hobby recommendations
- **/collection** — Paginated view of tried hobbies with ratings
- **/rate** — Rate hobbies 1-5 stars with mole reactions
- **/challenge** — Daily challenges with streak tracking and milestones
- **/stats** — Personal stats with hobby level titles (初心者→伝説のモグラ)
- **/ranking** — Server-wide leaderboard
- **108 hobbies** across 5 categories (creative, physical, social, learning, relaxation)
- **Mole mascot** with 5 ASCII art poses and 8 personality contexts

## Tech Decisions

- **discord.js v14**: Industry standard, full slash command and interaction support
- **better-sqlite3**: Zero-config persistence, perfect for bot data
- **ES modules**: Modern Node.js project structure
- **No external test framework**: Custom runner for zero-dependency testing

## Potential Next Steps

- Hobby recommendation engine based on rating patterns
- Server-specific hobby challenges and competitions
- Integration with external APIs (weather-based outdoor hobby suggestions)
- Multilingual support
