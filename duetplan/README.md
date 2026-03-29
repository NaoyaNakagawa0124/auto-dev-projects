# DuetPlan

A Rust+WASM collaborative content topic matcher for creator duos. Two creators independently swipe on 30 trending topics (real March 2026 TikTok/Netflix/Spotify trends), then reveal their matches — topics they both want to create about.

## How It Works

1. Creator 1 swipes Yes/Skip on 30 trending topics
2. Creator 1 shares a URL with their votes encoded
3. Creator 2 opens the URL and swipes on the same topics
4. Both see their matches, compatibility score, and a generated collab plan

## Features

- 30 trending topics from March 2026 (TikTok, Netflix, YouTube, Spotify)
- 21 content categories with icons
- Compatibility scoring (0-100%)
- Match quality labels (Creative Soulmates → Opposites Attract)
- Auto-generated collab plan with weekly schedule
- URL-encoded state sharing (no server needed)

## Build & Run

```bash
wasm-pack build --target web --out-dir pkg
python3 -m http.server 8080
# Open http://localhost:8080
```

## Test

```bash
cargo test
```
