# 学びの木 — Summary

## What Was Built

A Python CLI learning tracker for parents and children where a virtual ASCII art tree grows as learning hours accumulate. Features 7 tree growth stages (seed to giant tree), 9 school subjects with emojis, milestone celebrations, weekly statistics, and streak tracking. The growth mechanic makes studying feel rewarding.

## Features

- **7 Tree Stages** — ASCII art tree that evolves: 種→芽→苗木→若木→成長中→大木→巨木
- **9 Subjects** — 国語, 算数, 理科, 社会, 英語, 音楽, 体育, 図工, その他
- **Milestone System** — Celebrations at 30/120/300/600/1200/2400 minutes
- **Progress Bars** — Visual progress toward next milestone
- **Weekly Stats** — Daily breakdown with bar chart
- **Streak Tracking** — Consecutive learning days counter
- **JSON Persistence** — Data stored at ~/.manabi-no-ki/data.json

## Tech Stack

- Python 3.10
- ANSI terminal colors
- JSON file storage
- No external dependencies for core

## Potential Next Steps

- Textual TUI (interactive full-screen app)
- Multiple children profiles
- Subject-specific tree branches visualization
- Achievement badge system
