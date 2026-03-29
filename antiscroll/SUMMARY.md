# AntiScroll — Build Summary

## What Was Built

An anti-doomscroll endless runner game built with C and Raylib. The player is a commuter on a train dodging digital distractions (notifications, likes, clickbait, ads) and collecting real ArXiv research paper titles. The core twist: the game gets CALMER the more papers you collect — the opposite of every popular mobile game that gets progressively harder.

## Core Features

1. **3-Lane Endless Runner** — Smooth vertical lane transitions, focus boost mechanic, hit flash feedback. Player character carries a book (of course).

2. **50+ Real ArXiv Papers** — Titles from 15+ research fields: ML, NLP, Computer Vision, Physics, Math, Biology, Astrophysics, Robotics, Security, Climate, Neuroscience, and more.

3. **Distraction Obstacles** — Four types: Notification (!), Like (<3), Clickbait (??), and Ads (AD). Each with distinct colors. Hit 3 and it's game over.

4. **Anti-Difficulty Curve** — Each paper collected reduces game speed by 2% (floor: 40% speed). Getting hit increases speed. The calmer you play, the calmer it gets.

5. **Session Summary** — Game over screen shows your full "reading list" of collected papers with field tags. Turns a gaming session into a research discovery experience.

6. **Paper Flash** — Collecting a paper triggers a bottom-bar flash showing the full title and ArXiv field.

## Tech Decisions

- **C99 + Raylib** — Same stack as cramsleuths but completely different gameplay genre
- **Embedded paper DB** — 50 papers compiled into the binary, no file I/O needed
- **Anti-difficulty math** — `speed_mult = 1.0 - (papers * 0.02)` with floor at 0.4, plus hit penalty
- **Entity pool** — Fixed-size array of 32 entities avoids allocation

## Stats

- **271 tests** passing (papers, runner, scoring, spawner)
- **12 source files** (6 .c + 6 .h)
- **~1,094 LOC** (C)
- **Build time**: ~2 seconds

## Potential Next Steps

1. **Live ArXiv feed** — Fetch real papers via API at runtime
2. **Paper bookmarking** — Save collected papers to a file for later reading
3. **Difficulty modes** — "Focused" (slow start), "Distracted" (fast start)
4. **Sound design** — Calm ambient music that changes with speed
5. **Leaderboard** — Track most papers collected per session
