# StarLog

A Swift macOS CLI app that transforms your anime watchlist into an interstellar exploration journal. Each anime is a star system, genres are nebulae, episodes are planets. A 6-chapter space narrative unfolds as you log more anime, with events inspired by real 2026 space news.

## Features

- Log anime as "star systems" with genre, episodes, and rating
- 6-chapter space exploration narrative that progresses as you watch
- Narrative events inspired by Artemis 2, JWST discoveries, Jupiter lightning
- Galaxy map showing your explored nebulae (genres) and star systems
- Explorer rank system from Cadet to Admiral
- Stats dashboard with watch time, genre diversity, and exploration progress

## Tech Stack

Swift 6.1 / Swift Package Manager / Foundation / macOS native

## Build & Run

```bash
swift build && .build/debug/starlog
```

## Test

```bash
swift test
```

## Commands

```
starlog add <title> --genre <genre> --episodes <n> --rating <1-10>
starlog watch <title> [--episodes <n>]
starlog story
starlog map
starlog stats
starlog list
```
