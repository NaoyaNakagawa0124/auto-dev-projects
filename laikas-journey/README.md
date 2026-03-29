# Laika's Journey 🐕🚀

**A Discord bot where you guide a space dog through the solar system, secretly learning astronomy along the way.**

Inspired by Laika, the first dog to orbit Earth in 1957, this bot lets you adopt a virtual space dog and explore planets together. Answer astronomy challenges, discover real science facts, and watch your dog (and your knowledge) grow.

## Features

- **Adopt Your Space Dog** - Name and customize your cosmic companion
- **Planet Exploration** - Journey from Mercury to Neptune (and beyond)
- **Science Challenges** - Real astronomy trivia at each planet
- **Dog Care** - Feed, play, and train your space dog
- **Discovery Journal** - Track facts you've learned
- **Leaderboard** - Compare exploration progress with your server

## Commands

| Command | Description |
|---------|-------------|
| `/adopt <name>` | Adopt your space dog |
| `/explore` | Travel to the next planet |
| `/challenge` | Answer an astronomy question |
| `/dog` | Check your dog's status and stats |
| `/journal` | View discovered facts |
| `/leaderboard` | Server exploration rankings |
| `/feed` | Feed your space dog |
| `/play` | Play with your space dog |

## Tech Stack

- **Node.js 18+**
- **discord.js v14** - Discord API wrapper
- **SQLite (better-sqlite3)** - Persistent player data
- **dotenv** - Environment configuration

## Setup

1. Create a Discord bot at https://discord.com/developers/applications
2. Copy `.env.example` to `.env` and add your bot token
3. Install and run:

```bash
npm install
node bot.js
```

4. Invite the bot to your server with the OAuth2 URL from the developer portal (needs `bot` and `applications.commands` scopes)

## License

MIT
