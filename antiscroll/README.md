# AntiScroll

> The anti-doomscroll game. Dodge distractions. Collect knowledge.

## What is AntiScroll?

AntiScroll is an endless runner built with Raylib where you play as a commuter on a train. Instead of mindlessly scrolling social media, you dodge digital distractions (notifications, clickbait, likes) and collect floating research paper titles from real ArXiv fields.

**The twist:** This is the opposite of popular mobile games. Instead of getting faster and harder, the game gets *calmer* the more papers you collect. Your score is knowledge gained, not points destroyed.

## Controls

| Key | Action |
|-----|--------|
| UP / W | Move up |
| DOWN / S | Move down |
| SPACE | Boost (brief speed up to grab papers) |
| ESC | Pause / Quit |

## Features

1. **Endless Runner** — Horizontal scrolling through a stylized train car
2. **Distraction Dodging** — Notifications, likes, clickbait fly at you
3. **Paper Collection** — Grab floating research papers from real ArXiv categories
4. **Calm Progression** — Game tempo decreases as you collect more (anti-difficulty-curve)
5. **Knowledge Score** — Papers collected displayed with field and title
6. **Session Summary** — End screen shows all papers you "read"

## Tech Stack

- **C99** + **Raylib 5.5**
- No external dependencies beyond Raylib

## Build & Run

```bash
make && ./antiscroll
```

## License

MIT
