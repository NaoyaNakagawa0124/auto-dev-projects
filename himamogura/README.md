# ヒマモグラ (Himamogura) — Hobby Discovery Discord Bot

A Discord bot with a cute mole mascot that "digs up" hobby suggestions for bored adults. Inspired by 2026's "going analogue" trend and meme culture.

## Features

- **🕳️ /dig** — モグラが新しい趣味を掘り出す（ランダム趣味提案）
- **📋 /quiz** — 性格診断で趣味マッチング
- **📅 /challenge** — 今日のチャレンジを表示
- **📚 /collection** — 試した趣味コレクションを表示
- **⭐ /rate** — 試した趣味を評価する
- **📊 /stats** — 自分の趣味統計を表示
- **🏆 /ranking** — サーバー内の趣味ランキング

## Tech Stack

- Node.js 18+
- discord.js v14
- SQLite (better-sqlite3) for persistence
- ASCII art mole mascot

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Discord bot token
node src/bot.js
```

## Bot Invite

Create a bot at https://discord.com/developers/applications and invite with `applications.commands` and `bot` scopes.
