# GigRank 🎤

**Rate concerts with friends. Compare your vibes.**

GigRank is a collaborative concert rating app where you and your friends score live shows across multiple dimensions and discover how your tastes compare.

## Features

- **Gig Groups** - Create or join a crew with a shared code
- **Multi-Dimension Ratings** - Rate energy, sound quality, setlist, crowd, and overall vibes
- **Live Sync** - See friends' ratings appear in real-time
- **Taste Comparison** - Radar chart comparing your scores with friends
- **Gig History** - Browse past concerts and aggregate scores
- **Share Cards** - Generate beautiful score cards for social media

## Tech Stack

- **Express.js** - API server
- **WebSocket (ws)** - Real-time rating sync
- **SQLite (better-sqlite3)** - Persistent storage
- **Vanilla HTML/CSS/JS** - No framework frontend
- **Chart.js** - Rating visualizations

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:3000

## How It Works

1. Create a **Gig Group** and share the join code with friends
2. Add a **concert** (artist, venue, date)
3. Each person **rates** the show on 5 dimensions (1-10)
4. View the **comparison radar** to see how your crew rated
5. Browse **gig history** and **share** beautiful score cards

## License

MIT
