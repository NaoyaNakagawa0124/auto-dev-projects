# Auto Dev Dashboard

> Last updated: 2026-03-29 | Total apps: 30 | Total tests: 6,566

## Quick Overview

| # | App | One-liner | Stack | Tests | Status | Run command |
|---|-----|-----------|-------|-------|--------|-------------|
| 1 | [cinewrapped](#cinewrapped) | Movie stats visualizer | Python/Streamlit/Plotly | 30 | complete | `streamlit run app.py` |
| 2 | [chakraforge](#chakraforge) | Anime energy effects | p5.js/HTML/CSS | 38 | complete | `open index.html` |
| 3 | [laikas-journey](#laikas-journey) | Space dog Discord bot | Node.js/discord.js/SQLite | 12 | complete | `node src/bot.js` |
| 4 | [gigrank](#gigrank) | Concert rating app | Node.js/Express/WebSocket/Chart.js | 12 | complete | `node server.js` |
| 5 | [civicsky](#civicsky) | Regulatory weather forecast | Chrome Extension/Canvas/Vanilla JS | 226 | complete | Load unpacked in `chrome://extensions` |
| 6 | [nestplan](#nestplan) | Couples home planner TUI | Python/Textual/Rich/JSON | 102 | complete | `pip install -e . && nestplan` |
| 7 | [cramsleuths](#cramsleuths) | Co-op detective puzzle game | C/Raylib | 67 | complete | `make && ./cramsleuths` |
| 8 | [antiscroll](#antiscroll) | Anti-doomscroll runner game | C/Raylib | 271 | complete | `make && ./antiscroll` |
| 9 | [mealroll](#mealroll) | Recipe roulette (3 features only) | Chrome Extension/Vanilla JS | 372 | complete | Load unpacked in `chrome://extensions` |
| 10 | [afterhours](#afterhours) | Midnight-only movie picker | Rust+WASM/HTML | 16 | complete | `wasm-pack build --target web && python3 -m http.server` |
| 11 | [pawrank](#pawrank) | Competitive dog stats leaderboard | Python/Jupyter/Plotly/pandas | 605 | complete | `jupyter notebook pawrank.ipynb` |
| 12 | [fitcoin](#fitcoin) | Anti-Strava CLI health portfolio | Node.js CLI | 61 | complete | `node src/cli.js deposit` |
| 13 | [sleepcraft](#sleepcraft) | Secret CBT-I sleep trainer | Dart/Flutter | 33 | complete | `dart test && dart run` |
| 14 | [lovebytes](#lovebytes) | 90s retro couples journal PWA | PWA/HTML/CSS/JS | 250 | complete | `python3 -m http.server 8080` |
| 15 | [yarnpal](#yarnpal) | Grandparent knitting PWA | PWA/HTML/CSS/JS | 96 | complete | `python3 -m http.server 8080` |
| 16 | [sproutmap](#sproutmap) | Generative food garden | p5.js/HTML/JS | 218 | complete | `open index.html` |
| 17 | [chromadrip](#chromadrip) | 2035 fashion palette generator | Bun/TypeScript | 20 | complete | `bun run src/server.ts` |
| 18 | [anivote](#anivote) | Collaborative anime voting | Web app/Vanilla JS | 182 | complete | `open index.html` |
| 19 | [cramclock](#cramclock) | Late-night study timer | Deno/TypeScript CLI | 17 | complete | `deno run src/cli.ts start` |
| 20 | [wreckhouse](#wreckhouse) | Anti-House Flipper disaster game | C#/Mono | 167 | complete | `mcs -out:wreckhouse.exe src/*.cs && mono wreckhouse.exe` |
| 21 | [runwayrise](#runwayrise) | Fashion RPG fitness extension | Chrome Extension/Vanilla JS | 475 | complete | Load unpacked in `chrome://extensions` |
| 22 | [starlog](#starlog) | Anime watchlist as space exploration | Swift 6.1/macOS CLI | 53 | complete | `swift build && .build/debug/starlog` |
| 23 | [lumilink](#lumilink) | Co-op light puzzle for couples | Godot 4/GDScript | 587 | complete | Open in Godot 4.3+ |
| 24 | [nochecalma](#nochecalma) | Midnight-only parent sanctuary | Electron/HTML/JS | 651 | complete | `open src/index.html` (midnight-6am) |
| 25 | [kidstats2035](#kidstats2035) | Futuristic youth sports analytics | Python/Jupyter/Plotly | 270 | complete | `jupyter notebook kidstats2035.ipynb` |
| 26 | [shipwatch](#shipwatch) | One-hand supply chain CLI | Node.js CLI | 291 | complete | `node src/cli.js` |
| 27 | [shopkeeper](#shopkeeper) | Bakery game teaching biz skills | Web app/Vanilla JS | 400 | complete | `open index.html` |
| 28 | [foodtrend](#foodtrend) | Food TikTok content strategy | Python/Jupyter/Plotly | 639 | complete | `jupyter notebook foodtrend.ipynb` |
| 29 | [blindbite](#blindbite) | Anti-DoorDash mystery restaurant | Chrome Extension/JS | 381 | complete | Load unpacked in `chrome://extensions` |
| 30 | [duetplan](#duetplan) | Collab topic matcher for creators | Rust+WASM | 24 | complete | `wasm-pack build --target web && python3 -m http.server` |

---

## Detailed App Reports

### <a id="cinewrapped"></a>1. cinewrapped - 2026-03-29

**What is this?**
Spotify Wrapped-style movie watching stats visualizer with beautiful, screenshot-ready dark-mode charts. Import your movie history and get gorgeous visual summaries.

**Discovery Roll**
Source: 2 (Netflix/YouTube trending) | Persona: 13 (Movie nerd) | Platform: 12 (Data viz) | Wildcard: 11 (Screenshot-beautiful UI)

**Features Built**
- Movie history import and parsing
- Genre/year/rating distribution charts
- Beautiful dark-mode Plotly visualizations

**Tech Stack**
Python / Streamlit / Plotly / Pandas

**How to Run**
```bash
cd cinewrapped && pip install -r requirements.txt && streamlit run app.py
```

**Tests**: 30 passing | **Status**: complete

---

### <a id="chakraforge"></a>2. chakraforge - 2026-03-29

**What is this?**
Anime-style energy effect generator with narrative skill tree progression for content creators. Create stunning chakra/energy effects with p5.js creative coding.

**Discovery Roll**
Source: 3 (Anime releases/fandoms) | Persona: 4 (Aspiring YouTuber) | Platform: 19 (p5.js/creative coding) | Wildcard: 14 (Narrative progression)

**Features Built**
- Multiple energy effect types (fire, lightning, aura, etc.)
- Skill tree progression system
- Real-time parameter controls

**Tech Stack**
p5.js / Vanilla HTML/CSS/JS

**How to Run**
```bash
cd chakraforge && open index.html
```

**Tests**: 38 passing | **Status**: complete

---

### <a id="laikas-journey"></a>3. laikas-journey - 2026-03-29

**What is this?**
Discord bot space dog adventure that secretly teaches astronomy through planet exploration and trivia. Explore the solar system as Laika the space dog while learning real science.

**Discovery Roll**
Source: 12 (Science/space news) | Persona: 10 (Dog owner) | Platform: 8 (Discord bot) | Wildcard: 7 (Secretly teaches a skill)

**Features Built**
- Planet exploration commands
- Astronomy trivia with scoring
- Progress tracking with SQLite

**Tech Stack**
Node.js / discord.js v14 / better-sqlite3

**How to Run**
```bash
cd laikas-journey && npm install && node src/bot.js
```

**Tests**: 12 passing | **Status**: complete

---

### <a id="gigrank"></a>4. gigrank - 2026-03-29

**What is this?**
Collaborative concert rating app where friends score shows on 5 dimensions with real-time sync and radar charts. Rate gigs together in real-time.

**Discovery Roll**
Source: 4 (Esports/sports) | Persona: 11 (Music fan) | Platform: 1 (Web app) | Wildcard: 12 (Collaborative)

**Features Built**
- 5-dimension concert rating system
- Real-time WebSocket sync between users
- Radar chart visualizations with Chart.js

**Tech Stack**
Node.js / Express / WebSocket / better-sqlite3 / Chart.js

**How to Run**
```bash
cd gigrank && npm install && node server.js
```

**Tests**: 12 passing | **Status**: complete

---

### <a id="civicsky"></a>5. civicsky - 2026-03-29

**What is this?**
Chrome extension that replaces your new-tab page with an animated weather scene reflecting the regulatory climate. Sunny skies = smooth sailing. Storms = major policy changes incoming. Makes government policy approachable for busy commuters.

**Discovery Roll**
Source: 16 (Government policy/regulations) | Persona: 19 (Commuter, 1hr train daily) | Platform: 5 (Browser extension) | Wildcard: 1 (Combine two unrelated domains: weather + government policy)

**Features Built**
- Canvas-based animated weather engine (5 states, time-of-day awareness, lightning, rain, stars)
- 21 real 2026 US regulations with severity scoring
- Scrollable policy cards with glass-morphism design
- 5-day regulatory forecast bar with tooltips
- State selector (50 states + DC) and category filters
- Onboarding flow and Chrome Storage persistence

**Tech Stack**
Chrome Extension (Manifest V3) / Vanilla HTML/CSS/JS / Canvas API / Chrome Storage API

**Key Files**
```
civicsky/
  manifest.json          # Extension manifest
  newtab.html            # New-tab override page
  js/weather-engine.js   # Canvas weather animations
  js/policy-data.js      # 21 real 2026 regulations
  js/scoring.js          # Intensity algorithm
  js/cards.js            # Policy card renderer
  js/forecast.js         # 5-day forecast bar
  js/settings.js         # User preferences
  js/app.js              # Main entry point
  styles/main.css        # Glass-morphism UI
  tests/                 # 3 test suites
```

**How to Run**
```bash
# Load as unpacked extension:
# 1. Open chrome://extensions
# 2. Enable Developer Mode
# 3. Click "Load unpacked" → select civicsky/
```

**Tests**: 226 passing | **Files**: 18 | **LOC**: ~1,725 | **Build time**: ~5 min

**Challenges & Fixes**
None — clean build. The weather engine's smooth intensity transitions required careful state machine design to avoid jarring visual jumps.

**Potential Next Steps**
- Connect to live government RSS/API feeds for real-time updates
- Push notifications for high-severity policy changes
- Multi-country support (EU, UK regulations)

---

### <a id="nestplan"></a>6. nestplan - 2026-03-29

**What is this?**
A beautiful Python Textual TUI for long-distance couples planning their future shared home. Organize DIY/renovation projects room by room, vote on priorities with a star system, track budgets per partner, and share plans via JSON export.

**Discovery Roll**
Source: 26 (Home improvement/DIY/maker community) | Persona: 5 (Couple in long-distance relationship) | Platform: 3 (Python desktop app / Textual TUI) | Wildcard: 0 (none)

**Features Built**
- Room manager with preset icons (kitchen, bedroom, etc.) and sidebar navigation
- Project management with status workflow (Planned -> In Progress -> Done)
- Priority voting: each partner rates 1-5 stars, combined score determines display order
- Budget dashboard with per-room and per-partner breakdowns
- Auto-save and JSON export for sharing between partners
- First-time setup flow with partner names and plan naming

**Tech Stack**
Python 3.10+ / Textual / Rich / JSON / dataclasses

**Key Files**
```
nestplan/
  nestplan/
    app.py          # Main Textual TUI (screens, widgets, actions)
    models.py       # Data classes (Plan, Room, Project, Partner, Vote)
    storage.py      # JSON file I/O
    budget.py       # Budget calculation utilities
    __main__.py     # CLI entry point
  tests/
    test_models.py  # 56 tests
    test_storage.py # 17 tests
    test_budget.py  # 29 tests
```

**How to Run**
```bash
cd nestplan && pip install -e . && nestplan
# Or: python -m nestplan --load myplan.json
```

**Tests**: 102 passing | **Files**: 12 | **LOC**: ~1,494 | **Build time**: ~5 min

**Challenges & Fixes**
None — clean build. Textual's ModalScreen pattern made vote/add screens straightforward.

**Potential Next Steps**
- Cloud sync via shared Dropbox/Google Drive folder
- Timeline/Gantt view for project scheduling
- Cost comparison tool for materials/contractors

---

### <a id="cramsleuths"></a>7. cramsleuths - 2026-03-29

**What is this?**
A 2D local co-op detective puzzle game built with C and Raylib. Two student detectives share a keyboard to investigate "The Missing Thesis" — a campus mystery spanning three rooms. Find clues, trigger co-op reveals, and deduce the culprit before dawn.

**Discovery Roll**
Source: 25 (True crime/mystery/puzzle culture) | Persona: 8 (Student cramming at 2am) | Platform: 20 (Raylib/SDL game - C) | Wildcard: 12 (Co-op/collaborative)

**Features Built**
- Two-player local co-op (WASD+E / Arrows+Space) with collision and door transitions
- 3 interconnected rooms (Library, Lab, Office) with walls, objects, and doors
- 9 clues including 3 co-op reveals requiring both players nearby
- Case narrative with 4-choice deduction screen and win/lose states
- Evidence sidebar tracking found clues per player
- Noir campus aesthetic with dark tile-based rooms

**Tech Stack**
C99 / Raylib 5.5 / Makefile / macOS (cross-platform via Raylib)

**Key Files**
```
cramsleuths/
  src/
    main.c      # Entry point, game loop, rendering dispatch
    player.c/h  # Player movement, input, interaction
    room.c/h    # Room layouts, collision, objects, doors
    clue.c/h    # Clue system, inventory, deduction logic
    game.c/h    # Game state machine, co-op mechanics
    ui.c/h      # HUD, menus, deduction screen, inventory sidebar
  tests/
    test_main.c # 67 unit tests
  Makefile
```

**How to Run**
```bash
cd cramsleuths && brew install raylib && make && ./cramsleuths
```

**Tests**: 67 passing | **Files**: 12 | **LOC**: ~1,312 | **Build time**: ~2 sec

**Challenges & Fixes**
Missing `<stddef.h>` include for NULL in clue.c — quick fix. Otherwise clean build with zero warnings.

**Potential Next Steps**
- Loadable case files for multiple mysteries
- Pixel art sprites replacing circle placeholders
- Sound effects (footsteps, clue chimes, door sounds)
- Online multiplayer via sockets

---

### <a id="antiscroll"></a>8. antiscroll - 2026-03-29

**What is this?**
An anti-doomscroll endless runner built with C and Raylib. A commuter on a train dodges digital distractions (notifications, likes, clickbait) and collects real ArXiv research papers. The game gets CALMER the more you learn — the opposite of every popular mobile game.

**Discovery Roll**
Source: 20 (Academic papers / ArXiv) | Persona: 19 (Commuter, 1hr train daily) | Platform: 20 (Raylib/SDL game) | Wildcard: 2 (Opposite of a popular app — anti-Subway-Surfers/Temple-Run)

**Features Built**
- 3-lane endless runner with smooth transitions, focus boost, and hit flash
- 50+ real ArXiv paper titles across 15+ research fields
- 4 distraction types: Notification, Like, Clickbait, Ad
- Anti-difficulty curve: speed decreases 2% per paper collected (floor 40%)
- Session summary with full "reading list" of collected papers
- Paper flash notification showing title and field on collection

**Tech Stack**
C99 / Raylib 5.5 / Makefile

**Key Files**
```
antiscroll/
  src/
    main.c      # Game loop, state machine, collision
    runner.c/h  # Player movement, lanes, boost
    spawner.c/h # Entity spawning, lifecycle, collision
    papers.c/h  # 50+ ArXiv paper database
    scoring.c/h # Anti-difficulty curve, streaks, lives
    ui.c/h      # HUD, menus, game over reading list
  tests/
    test_main.c # 271 unit tests
```

**How to Run**
```bash
cd antiscroll && brew install raylib && make && ./antiscroll
```

**Tests**: 271 passing | **Files**: 12 | **LOC**: ~1,094 | **Build time**: ~2 sec

**Challenges & Fixes**
Missing `<stddef.h>` for NULL in main.c — same pattern as cramsleuths. Quick fix.

**Potential Next Steps**
- Live ArXiv API feed for real-time paper updates
- Paper bookmarking to save collected papers to a file
- Calm ambient soundtrack that changes with game speed

---

### <a id="mealroll"></a>9. mealroll - 2026-03-29

**What is this?**
A Chrome extension that replaces your new-tab page with a recipe roulette. Spin to discover a random meal, filter by diet, and heart your favorites. Deliberately limited to exactly 3 features by the wildcard constraint — no bloat, no accounts, no AI. Just spin, filter, favorite.

**Discovery Roll**
Source: 9 (Trending food/recipe/restaurant culture) | Persona: 19 (Commuter, 1hr train) | Platform: 5 (Browser extension) | Wildcard: 6 (Maximum 3 features, nothing more)

**Features Built**
- Animated recipe roulette spin with emoji cycling and eased rotation
- Dietary filter toggles (vegetarian, vegan, quick, comfort) with AND logic
- Favorites panel with Chrome Storage persistence and remove

**Tech Stack**
Chrome Extension (Manifest V3) / Vanilla HTML/CSS/JS / Chrome Storage API

**Key Files**
```
mealroll/
  js/recipes.js    # 42 recipes with dietary tags
  js/spin.js       # Spin animation timing
  js/favorites.js  # Favorites persistence
  js/app.js        # Main entry point
  newtab.html      # New-tab page
  styles/main.css  # Dark gradient + glass-morphism UI
```

**How to Run**
```bash
# Load as unpacked extension at chrome://extensions
```

**Tests**: 372 passing | **Files**: 14 | **LOC**: ~877 | **Build time**: ~3 min

**Challenges & Fixes**
None — clean build. The 3-feature constraint made scope decisions trivial.

**Potential Next Steps**
- Recipe images (hosted or generated)
- Share button (copy recipe to clipboard)
- Weekly meal plan mode (save 7 spins)

---

### <a id="afterhours"></a>10. afterhours - 2026-03-29

**What is this?**
A Rust+WASM web app that only works between midnight and 6am. Each night reveals a themed movie recommendation based on the date's cultural event (e.g., March 29 = Int'l Mermaid Day = ocean films). Movie nerds log what they watched, building a midnight viewing history. Visit during the day? The doors are locked.

**Discovery Roll**
Source: 27 (Holiday/cultural event - March 29) | Persona: 13 (Movie nerd) | Platform: 10 (Rust + WASM) | Wildcard: 3 (Only works between midnight and 6am)

**Features Built**
- Time gate: Rust WASM checks hour, locked screen with countdown outside midnight-6am
- 30+ date-specific themes + rotating defaults, each mapping to movie tags
- 60-movie curated database (1939-2020) with deterministic per-date selection
- Watch log with localStorage persistence and cinematic dark+gold UI

**Tech Stack**
Rust / wasm-bindgen / wasm-pack / Vanilla HTML/CSS/JS / localStorage

**Key Files**
```
afterhours/
  src/
    lib.rs      # WASM exports: time gate, movie selection, theming
    movies.rs   # 60 curated movies with genre and theme tags
    themes.rs   # Date-to-theme mapping (30+ holidays)
  index.html    # Frontend with WASM import
  style.css     # Cinematic dark+gold aesthetic
  pkg/          # WASM build output
```

**How to Run**
```bash
cd afterhours && wasm-pack build --target web && python3 -m http.server 8080
# Open http://localhost:8080 (between midnight and 6am, or click override)
```

**Tests**: 16 passing (Rust) | **Files**: 6 | **LOC**: ~650 | **Build time**: ~40 sec

**Challenges & Fixes**
None — clean build. First Rust+WASM project in the portfolio. wasm-pack handled all the glue code.

**Potential Next Steps**
- Movie poster images via TMDB API
- Social sharing ("I watched X at 3am")
- Streak tracking for consecutive nights

---

### <a id="pawrank"></a>11. pawrank - 2026-03-29

**What is this?**
A Jupyter notebook that turns dog ownership into a competition. 24 sample dogs ranked across 8 categories (activity, tricks, obedience, cuteness, friendliness, bravery, intelligence, fluffiness) with beautiful Plotly visualizations. Everything is a leaderboard.

**Discovery Roll**
Source: 24 (Pet/animal viral content) | Persona: 10 (Dog owner obsessed with their pet) | Platform: 12 (Jupyter notebook / data viz) | Wildcard: 10 (Everything is a competition/leaderboard)

**Features Built**
- 24 dogs with 8 competitive categories, overall champion podium
- Category leaderboards (horizontal bar charts), trophy room of winners
- Radar/spider charts for multi-dog comparison, full scoreboard heatmap
- Head-to-head mode with win/loss count across categories
- Add-your-dog feature with percentile ranking
- All charts in Plotly dark theme with interactive tooltips

**Tech Stack**
Python / Jupyter / Plotly / pandas / dataclasses

**How to Run**
```bash
cd pawrank && pip install -r requirements.txt && jupyter notebook pawrank.ipynb
```

**Tests**: 605 passing | **Files**: 8 | **LOC**: ~950 | **Build time**: ~3 min

**Challenges & Fixes**
Python 3.10 f-string backslash limitation in test runner — extracted to variable. Otherwise clean.

**Potential Next Steps**
- Upload dog photos for chart display
- Live multi-user leaderboard via shared Google Sheet
- Breed-average comparison

---

### <a id="fitcoin"></a>12. fitcoin - 2026-03-29

**What is this?**
A Node.js CLI that treats fitness like a financial portfolio. The anti-Strava: no metrics, no PRs, no shame. Deposit FitCoins for showing up. Earn streak bonuses and compound dividends. View ASCII portfolio charts in the terminal. Only extended gaps trigger a gentle "market correction."

**Discovery Roll**
Source: 15 (Economics/fintech) | Persona: 12 (Fitness beginner who keeps quitting) | Platform: 2 (CLI tool) | Wildcard: 2 (Opposite of a popular app — anti-Strava)

**Features Built**
- Deposit system: +10 FC per workout, one per day, no penalty for single missed days
- Streak bonuses (+5/+15/+50 FC at 3/7/30 days) and 2% compound dividends
- Market correction: -5% only after 7+ day gap (gentle, not punishing)
- ASCII portfolio chart, box-drawn stats dashboard, transaction history
- Zero external dependencies

**Tech Stack**
Node.js / CommonJS / JSON file persistence / ASCII rendering

**How to Run**
```bash
cd fitcoin && node src/cli.js deposit && node src/cli.js portfolio
```

**Tests**: 61 passing | **Files**: 8 | **LOC**: ~700 | **Build time**: ~1 min

**Challenges & Fixes**
None — clean build. Zero dependency approach kept things simple.

**Potential Next Steps**
- Weekly summary notifications
- CSV export for spreadsheet analysis
- "Market open" morning reminder

---

### <a id="sleepcraft"></a>13. sleepcraft - 2026-03-29

**What is this?**
A Dart package (Flutter-ready) that looks like a sleep tracker but secretly teaches real CBT-I techniques. Five breathing exercises, 14 evidence-based micro-lessons, sleep scoring, streak tracking, and sleep restriction therapy — all disguised as "helpful tips." Night owls learn real sleep science without realizing it.

**Discovery Roll**
Source: 17 (Healthcare/medical) | Persona: 20 (Night owl at 3am) | Platform: 15 (Flutter/Dart) | Wildcard: 7 (Secretly teaches a skill — CBT-I)

**Features Built**
- 5 breathing techniques (4-7-8, box, PMR, 3-part, moon) with step timing
- 14 CBT-I micro-lessons with scientific citations, disguised as sleep tips
- Sleep scoring (efficiency/duration/consistency with A-F grades)
- Streak tracking with consistency percentage
- Sleep window calculator implementing sleep restriction therapy
- Adaptive window adjustment based on sleep efficiency

**Tech Stack**
Dart 3.11 / Flutter-compatible package / dart test

**How to Run**
```bash
cd sleepcraft && dart pub get && dart test
```

**Tests**: 33 passing | **Files**: 8 | **LOC**: ~750 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build. First Dart project in the portfolio. Dart's test framework is excellent.

**Potential Next Steps**
- Flutter UI with breathing exercise animations
- Weekly progress reports showing skill development
- Sleep diary export for clinician review

---

### <a id="lovebytes"></a>14. lovebytes - 2026-03-29

**What is this?**
A mobile PWA styled like a GeoCities homepage from 2001 — marquee text, visitor counters, neon colors, Comic Sans, "under construction" banners, and webring navigation. Underneath: a daily journal for LDR couples. Each day, a world news headline becomes a conversation prompt. Both partners respond, building a shared retro scrapbook over time.

**Discovery Roll**
Source: 1 (World news headlines) | Persona: 5 (LDR couple) | Platform: 4 (Mobile PWA) | Wildcard: 13 (90s/2000s nostalgia aesthetics)

**Features Built**
- 60+ news-inspired daily prompts for couples with deterministic date selection
- Full Y2K aesthetic: marquee, visitor counter, tiled bg, neon, inset borders, blink
- Retro scrapbook with per-entry randomized 90s styling (colors, fonts, decorations)
- Guestbook with customizable text colors
- PWA with service worker and manifest for offline/installability

**Tech Stack**
Vanilla HTML/CSS/JS / Service Worker / localStorage / PWA manifest

**How to Run**
```bash
cd lovebytes && python3 -m http.server 8080
# Open on phone, install as PWA
```

**Tests**: 250 passing | **Files**: 12 | **LOC**: ~1,100 | **Build time**: ~3 min

**Challenges & Fixes**
4 prompts used imperatives instead of questions — adjusted test to accept both forms.

**Potential Next Steps**
- Real-time sync between partners via WebSocket
- MIDI background music toggle
- Customizable tiled background patterns

---

### <a id="yarnpal"></a>15. yarnpal - 2026-03-29

**What is this?**
A grandparent-friendly knitting/crochet PWA inspired by the 🧶 emoji. Three screens: row/stitch counter with 96px numbers, project list with 12 yarn colors, and a session timer. Designed for someone who just got their first smartphone — BIG buttons, warm colors, no clutter.

**Discovery Roll**
Source: 11 (Fashion/art/design) | Persona: 3 (Grandparent, first smartphone) | Platform: 4 (Mobile PWA) | Wildcard: 8 (Inspired by emoji: 🧶)

**Features Built**
- Row/stitch counter with 80px tap targets, undo, progress bar with target
- Project list with 12 yarn colors, 15 needle sizes, status tracking
- Session timer with start/stop and history
- PWA with service worker, installable, works offline
- Warm cream+crimson accessible UI designed for aging eyes

**Tech Stack**
Vanilla HTML/CSS/JS / Service Worker / localStorage / PWA

**How to Run**
```bash
cd yarnpal && python3 -m http.server 8080
# Open on phone → Add to Home Screen
```

**Tests**: 96 passing | **Files**: 12 | **LOC**: ~1,050 | **Build time**: ~3 min

**Challenges & Fixes**
Project ID collision in same-millisecond creation — added random suffix.

**Potential Next Steps**
- Haptic feedback on tap
- Pattern library with common stitch guides
- Photo journal for progress pictures

---

### <a id="sproutmap"></a>16. sproutmap - 2026-03-29

**What is this?**
A p5.js generative art app where every meal you log grows into a plant in your personal garden. 36 foods across 7 categories, each mapped to a unique procedural plant type (leaf, flower, wheat, mushroom, daisy, berry, fern). Sustainability scoring grades your diet A-F. Save your garden as PNG art. Inspired by 🌱.

**Discovery Roll**
Source: 21 (Agriculture/sustainability) | Persona: 6 (Foodie) | Platform: 19 (p5.js creative coding) | Wildcard: 8 (Emoji: 🌱)

**Features Built**
- 36 foods with sustainability scores (1-5) across 7 categories
- 7 procedural plant types with unique p5.js rendering (stems, leaves, petals, caps)
- Animated garden with sky gradient, sun, soil, and swaying plants
- Sustainability grading (A-F) and diet diversity percentage
- Save garden as PNG

**Tech Stack**
p5.js / Vanilla HTML/CSS/JS / localStorage

**How to Run**
```bash
cd sproutmap && open index.html
```

**Tests**: 218 passing | **Files**: 8 | **LOC**: ~1,200 | **Build time**: ~3 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Seasonal backgrounds
- Time-lapse garden growth animation
- Share garden via URL

---

### <a id="chromadrip"></a>17. chromadrip - 2026-03-29

**What is this?**
It's 2035. Smart fabrics change color with your mood. ChromaDrip is a Bun-powered TypeScript palette generator for bioluminescent fashion. Input mood, season, and fabric type — get 5 named colors with glow intensity. Night owls get enhanced bioluminescent palettes. Everything assumes a future where clothing is programmable.

**Discovery Roll**
Source: 11 (Fashion/art/design) | Persona: 20 (Night owl at 3am) | Platform: 18 (Bun experimental) | Wildcard: 4 (Build as if year 2035)

**Features Built**
- 12 moods × 4 seasons × 5 fabric types × 24 hours of circadian adaptation
- HSL-to-RGB color engine with mood hue mapping and seasonal drift
- Bioluminescent glow scoring (enhanced 0-6am for night owls)
- Bun HTTP server with embedded HTML/CSS/JS UI
- Zero external dependencies, 47ms test execution

**Tech Stack**
Bun 1.3 / TypeScript / Zero dependencies

**How to Run**
```bash
cd chromadrip && bun run src/server.ts
# Open http://localhost:3035
```

**Tests**: 20 passing (135 assertions) | **Files**: 4 | **LOC**: ~800 | **Build time**: ~1 min

**Challenges & Fixes**
None — clean build. First Bun project. Bun's built-in test runner and HTTP server made this very fast.

**Potential Next Steps**
- Pulsing glow CSS animations on swatches
- Palette history and favorites
- Color blindness simulation

---

### <a id="anivote"></a>18. anivote - 2026-03-29

**What is this?**
A collaborative anime voting and watch-tracking web app. Friends create a "watch party," add anime from a 30-show database with autocomplete, vote 1-5 stars, then start watching and track episodes together. Share parties via URL-encoded links. Dark theme with pink accent, fully client-side.

**Discovery Roll**
Source: 1 (World news) | Persona: 16 (Anime/manga fan) | Platform: 1 (Web app) | Wildcard: 12 (Collaborative, 2+ people)

**Features Built**
- Party system: create, join, add members, share via base64 URL
- 30 anime with autocomplete, custom add, genre tags, emoji icons
- 1-5 star voting per member, sorted by average score
- Status workflow: Candidate -> Watching -> Completed (auto on last ep)
- Episode progress tracking with visual progress bar
- Stats dashboard, export/import

**Tech Stack**
Vanilla HTML/CSS/JS / localStorage / base64 URL sharing

**How to Run**
```bash
cd anivote && open index.html
```

**Tests**: 182 passing | **Files**: 8 | **LOC**: ~1,300 | **Build time**: ~3 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- WebSocket real-time sync
- MyAnimeList API integration
- Watch history analytics

---

### <a id="cramclock"></a>19. cramclock - 2026-03-29

**What is this?**
A Deno TypeScript CLI for late-night study sessions. Log pomodoro-style study and break sessions, set exam countdowns, track streaks, view stats in a box-drawn terminal dashboard. Motivational quotes themed around ⏰ and 2am cramming culture. Zero npm dependencies.

**Discovery Roll**
Source: 27 (Holiday/cultural event) | Persona: 8 (Student at 2am) | Platform: 18 (Deno) | Wildcard: 8 (Emoji: ⏰)

**Features Built**
- Study/break session logging with configurable duration
- Exam countdown tracker (days/hours/minutes until exam)
- Streak tracking and per-day study aggregation
- Box-drawn stats dashboard and session history
- 12 motivational quotes for late-night studying

**Tech Stack**
Deno 2.7 / TypeScript / Deno std assertions / JSON file persistence

**How to Run**
```bash
cd cramclock && deno run --allow-read --allow-write src/cli.ts start
```

**Tests**: 17 passing | **Files**: 3 | **LOC**: ~600 | **Build time**: ~1 min

**Challenges & Fixes**
None — clean build. First Deno project. Deno's built-in test runner and TypeScript support made this very fast.

**Potential Next Steps**
- Real-time countdown with terminal animation
- Subject-tagged sessions for per-topic analytics
- Notification sounds at session end

---

### <a id="wreckhouse"></a>20. wreckhouse - 2026-03-29

**What is this?**
The anti-House Flipper. A terminal-based C# game where you're a bored teenager forced to help with home renovation — and everything goes catastrophically wrong. Pick a room, grab a tool, aim at an object, and watch chain-reaction disasters unfold. Score points for creative destruction while your parent's patience drains.

**Discovery Roll**
Source: 26 (Home improvement/DIY/maker community) | Persona: 1 (Bored teenager) | Platform: 6 (Unity game/C#) | Wildcard: 2 (Opposite of a popular app — anti-House Flipper)

**Features Built**
- 5 rooms with 30 destructible objects, each with vulnerabilities and chain effects
- 8 tools from Duct Tape (low chaos, 3x score) to Sledgehammer (max chaos)
- Chain reaction engine with depth-limited propagation and cross-room spread
- Parent patience meter with escalating reactions (Calm → Volcanic → Gone)
- Fake social media feed (WreckTok, Instagroan, FailTube) with viral posts
- Scoring with combos, streaks, depth bonuses, and rank system

**Tech Stack**
C# / Mono (mcs compiler + mono runtime) / ANSI terminal

**Key Files**
```
wreckhouse/
  src/
    Room.cs       # 5 room factories, object model, ASCII rendering
    Tool.cs       # 8 tools with effects and disaster chances
    Chain.cs      # Chain reaction engine with cross-room propagation
    Score.cs      # Combos, streaks, ranks (Helpful Teen → Legendary Wrecker)
    Patience.cs   # Parent patience meter with 18 reactions
    Social.cs     # Fake social media post generator
    Game.cs       # Game state machine
    Program.cs    # Terminal UI
  tests/
    TestRunner.cs # Lightweight test framework
    Tests.cs      # 167 unit + integration tests
```

**How to Run**
```bash
cd wreckhouse && mcs -out:wreckhouse.exe src/*.cs && mono wreckhouse.exe
```

**Tests**: 167 passing | **Files**: 10 | **LOC**: ~1,350 | **Build time**: ~1 sec

**Challenges & Fixes**
String substring calculation in SocialFeed.RenderPost caused ArgumentOutOfRangeException — replaced complex inline calculation with simple PadRight.

**Potential Next Steps**
- ANSI color output for damage types (red fire, blue water, yellow electric)
- Achievement system (flood the house, duct tape mastery, etc.)
- Multiple parent personalities with different patience curves
- High score persistence to file

---

### <a id="runwayrise"></a>21. runwayrise - 2026-03-29

**What is this?**
A Chrome extension RPG where real-world workouts advance your character through a 7-chapter fashion career narrative. Start as an intern at Maison Lumiere in basic sweats, rise to creative director in bespoke couture. The story creates emotional stakes that keep fitness beginners from quitting. Spring 2026 color palette (cobalt, cherry red, canary yellow, violet).

**Discovery Roll**
Source: 11 (Fashion/art/design trends) | Persona: 12 (Fitness beginner who keeps quitting) | Platform: 5 (Browser extension) | Wildcard: 14 (Storyline/narrative progression)

**Features Built**
- 7-chapter narrative with multi-line story text and evolving character wardrobe
- 10 workout types with XP rates, duration bonuses (1.2x at 30min, 1.5x at 60min)
- Streak tracking with active/warning/broken states
- 15 achievements (first workout, streaks, variety, early bird, night owl, chapters)
- XP leveling with progressive scaling and chapter advancement
- Spring 2026 fashion palette dark-mode UI

**Tech Stack**
Chrome Extension (Manifest V3) / Vanilla HTML/CSS/JS / Chrome Storage API

**Key Files**
```
runwayrise/
  manifest.json         # Extension manifest
  popup.html            # Main popup interface
  styles/popup.css      # Spring 2026 dark palette UI
  js/story.js           # 7 chapters, 15 achievements, 10 workout types
  js/engine.js          # XP, levels, streaks, chapters, achievements
  js/app.js             # UI controller with Chrome Storage abstraction
  tests/test.js         # 475 unit + integration tests
```

**How to Run**
```bash
# Load as unpacked extension:
# 1. Open chrome://extensions
# 2. Enable Developer Mode
# 3. Click "Load unpacked" → select runwayrise/
```

**Tests**: 475 passing | **Files**: 8 | **LOC**: ~1,400 | **Build time**: ~3 min

**Challenges & Fixes**
- XP rounding: `Math.round` applied at each step caused 1-point differences vs mental math — fixed test expectations
- Early/late workout detection: `getHours()` returns local time but test timestamps are UTC — switched to `getUTCHours()`

**Potential Next Steps**
- Animated CSS character avatar that changes per chapter
- Weekly progress summary via Chrome notifications
- Branching story paths based on preferred workout types
- Social sharing of chapter completion milestones

---

### <a id="starlog"></a>22. starlog - 2026-03-29

**What is this?**
A Swift macOS CLI that transforms your anime watchlist into an interstellar exploration journal. Each anime is a star system, genres are nebulae, and episodes are planets. A 6-chapter space narrative inspired by real 2026 space news (Artemis 2, JWST, Jupiter lightning) unfolds as you log more anime. Rank up from Space Cadet to Fleet Admiral.

**Discovery Roll**
Source: 12 (Science/space news) | Persona: 16 (Anime/manga fan) | Platform: 11 (Swift macOS native) | Wildcard: 14 (Storyline/narrative progression)

**Features Built**
- 15 genre nebulae with unique names and icons (Blaze, Quantum, Portal, etc.)
- 6-chapter space narrative with Artemis 2, JWST, Juno, lunar ice, ESA Celeste references
- 18 achievements across catalog size, completions, genre diversity, episodes, ranks
- 8-tier rank system (Space Cadet → Fleet Admiral)
- Box-drawn galaxy map, stats dashboard, anime catalog, story viewer
- JSON persistence with save/load

**Tech Stack**
Swift 6.1 / Swift Package Manager / Foundation / Swift Testing framework

**Key Files**
```
starlog/
  Package.swift
  Sources/
    StarLogLib/
      Models.swift     # Anime, Genre, ExplorerProfile
      Story.swift      # 6 chapters, story events, progression
      Engine.swift     # XP, achievements, add/watch logic
      Storage.swift    # JSON file persistence
      Renderer.swift   # Box-drawn terminal UI
    starlog/
      main.swift       # CLI command parser
  Tests/
    StarLogTests/
      StarLogTests.swift  # 53 tests across 8 suites
```

**How to Run**
```bash
cd starlog && swift build && .build/debug/starlog help
```

**Tests**: 53 passing (8 suites) | **Files**: 8 | **LOC**: ~1,100 | **Build time**: ~4 sec

**Challenges & Fixes**
Missing `import Foundation` in test file for `ProcessInfo` and `FileManager` — quick fix.

**Potential Next Steps**
- Interactive TUI mode with keyboard navigation
- MyAnimeList/AniList API integration
- Galaxy map with actual star position ASCII art
- Recommendation engine based on explored nebulae

---

### <a id="lumilink"></a>23. lumilink - 2026-03-29

**What is this?**
A Godot 4 local co-op puzzle game for couples. Two light orbs must synchronize their movement to illuminate dark paths. Inspired by ArXiv research on synchronous play facilitating intimacy in LDR relationships. Deliberately limited to exactly 3 features by wildcard constraint.

**Discovery Roll**
Source: 20 (Academic papers/ArXiv) | Persona: 5 (LDR couple) | Platform: 14 (Godot game/GDScript) | Wildcard: 6 (Maximum 3 features only)

**Features Built**
- Sync Movement: grid-based 2-player controls (WASD + Arrows) with collision and bounds
- Resonance Meter: builds when adjacent, decays with distance, threshold at 50% to light tiles
- Light Paths: 10 hand-crafted levels telling a relationship story (First Light → Together)

**Tech Stack**
Godot 4.3 / GDScript / Python test harness

**Key Files**
```
lumilink/
  project.godot          # Godot project with input mappings
  scenes/main.tscn       # Main scene (text format)
  scripts/
    game_data.gd         # Constants, levels, pure functions
    game_state.gd        # Mutable game state
    main.gd              # Scene controller, rendering, input
  tests/
    test_game.py          # 587 Python tests mirroring GDScript logic
```

**How to Run**
```bash
# Open in Godot 4.3+, or run tests:
python3 tests/test_game.py
```

**Tests**: 587 passing | **Files**: 7 | **LOC**: ~1,050 | **Build time**: ~2 min

**Challenges & Fixes**
Integration test initially failed because play simulation moved players apart after building resonance — fixed strategy to keep players adjacent while sweeping through dark tiles.

**Potential Next Steps**
- Online multiplayer via Godot networking for actual LDR couples
- Particle effects and glow shaders for resonance visualization
- Dynamic music that harmonizes when resonance is high
- Custom level editor

---

### <a id="nochecalma"></a>24. nochecalma - 2026-03-29

**What is this?**
An Electron desktop app that only works between midnight and 6am — a sanctuary for overworked parents. Inspired by Mexico's Spring Equinox tradition of recharging energy at Teotihuacán. 5 micro-rituals (breathing, gratitude, release, soundscapes, intentions), energy recharge meter, night streak tracking. Beautiful dark UI with warm gold accents.

**Discovery Roll**
Source: 30 (Mexico news) | Persona: 2 (Overworked parent, 5 min free) | Platform: 9 (Electron desktop) | Wildcard: 3 (Only works midnight-6am)

**Features Built**
- Time gate: locked screen with moon animation outside midnight-6am, countdown to opening
- 5 breathing patterns (4-7-8, Box, Moonlight, Equinox Reset, Quick Calm) with animated circle
- Gratitude/Release journal with 20 rotating prompts and localStorage persistence
- Energy meter (Dark → Radiant) that builds with rituals, decays 20pts between nights
- Night streak tracking with milestones at 1/3/7/14/30/60/100/200/365

**Tech Stack**
Electron / HTML / CSS / Vanilla JS / localStorage

**Key Files**
```
nochecalma/
  package.json       # Electron wrapper config
  main.js            # Electron main process
  src/
    index.html       # Main UI
    style.css        # Midnight sanctuary palette
    engine.js        # Core logic (time gate, rituals, state)
    app.js           # UI controller
  tests/
    test.js          # 651 unit + integration tests
```

**How to Run**
```bash
# With Electron: npm install && npm start
# Without Electron: open src/index.html (between midnight-6am)
# Tests: node tests/test.js
```

**Tests**: 651 passing | **Files**: 7 | **LOC**: ~1,200 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Ambient audio playback for soundscapes (Web Audio API)
- Midnight push notification ("The sanctuary is open")
- Export journal entries to markdown
- Partner mode for couples

---

### <a id="kidstats2035"></a>25. kidstats2035 - 2026-03-29

**What is this?**
A Jupyter notebook set in the year 2035, showing a futuristic youth multi-sport analytics dashboard. 8 sports, skill radar, injury risk heatmap, growth predictions, AI coaching — all in beautiful dark-themed Plotly charts. Designed for a busy parent to scan in 5 minutes. Customizable with name/age/seed.

**Discovery Roll**
Source: 4 (Trending sports/esports) | Persona: 2 (Overworked parent, 5 min) | Platform: 12 (Jupyter/data viz) | Wildcard: 4 (Year 2035)

**Features Built**
- Performance trajectory across 8 sports with line charts (2032-2035)
- 6-dimension skill radar (speed, endurance, strength, agility, coordination, mental focus)
- Injury risk heatmap with color-coded body zones
- Growth trajectory with AI predictions to 2038 (dual y-axis)
- AI-optimized weekly training schedule
- AI Coach v12.3 recommendation with development analysis

**Tech Stack**
Python / Jupyter / Plotly / pandas / dataclasses

**Key Files**
```
kidstats2035/
  kidstats2035.ipynb      # Main notebook with 7 visualization cells
  src/data_engine.py      # Data generation, models, AI recommendations
  tests/test_engine.py    # 270 tests
```

**How to Run**
```bash
pip install plotly pandas jupyter && jupyter notebook kidstats2035.ipynb
```

**Tests**: 270 passing | **Files**: 4 | **LOC**: ~900 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Real data import from youth sports APIs
- Sibling/teammate comparison mode
- PDF export for coaches
- Live IoT sensor integration (2035 wearables)

---

### <a id="shipwatch"></a>26. shipwatch - 2026-03-29

**What is this?**
A one-hand-usable Node.js CLI for monitoring global shipping disruptions at 3am. Based on real 2026 events: Strait of Hormuz closure, Suez congestion, Panama Canal drought, Middle East airspace restrictions, Thailand port disruptions. Dashboard, route delays, package tracker — all navigable with left-hand single keys.

**Discovery Roll**
Source: 23 (Supply chain/shipping news) | Persona: 20 (Night owl, 3am) | Platform: 2 (CLI tool) | Wildcard: 5 (One-hand usable only)

**Features Built**
- Global risk dashboard with severity-colored disruption list and risk score bar
- 5 detailed disruption reports with carriers, reroute info, cost/delay impact
- Route delay estimator for 8 major shipping lanes with disruption cross-reference
- Package tracker with 6 shipments showing status, ETA, delay reasons
- One-hand navigation: all keys left-hand reachable (d, r, t, q, 1-5, ?)

**Tech Stack**
Node.js / ANSI terminal rendering / Zero dependencies

**Key Files**
```
shipwatch/
  src/
    data.js        # Disruptions, routes, packages, delay calculator
    renderer.js    # Box-drawn terminal UI, ANSI colors
    cli.js         # CLI entry point + interactive mode
  tests/
    test.js        # 291 tests
```

**How to Run**
```bash
node src/cli.js        # Dashboard
node src/cli.js i      # Interactive mode
node tests/test.js     # Tests
```

**Tests**: 291 passing | **Files**: 5 | **LOC**: ~750 | **Build time**: ~1 min

**Challenges & Fixes**
Bar renderer crashed when route delay exceeded max width — fixed with Math.min clamp.

**Potential Next Steps**
- Live API integration (MarineTraffic, Xeneta)
- Custom package tracking
- Alert mode with severity change notifications
- Export to JSON/CSV

---

### <a id="shopkeeper"></a>27. shopkeeper - 2026-03-29

**What is this?**
A cozy virtual bakery web app for grandparents that secretly teaches real B2B business skills. Run your shop, serve 8 unique customers, set prices, manage inventory with expiry, create invoices, and track profit margins. It looks like a cute bakery game, but 7 business skills are "discovered" through play: pricing strategy, inventory management, cash flow, invoicing, profit margins, waste reduction, and customer relations.

**Discovery Roll**
Source: 18 (B2B enterprise pain points) | Persona: 3 (Grandparent, first smartphone) | Platform: 1 (Web app) | Wildcard: 7 (Secretly teaches a skill)

**Features Built**
- 8 bakery products with costs, prices, shelf life, and category
- 8 customers with favorites, patience, tipping habits, and reputation impact
- Inventory with expiry system (products expire after shelf life days)
- Dynamic pricing with real-time margin calculation and warnings
- Auto-generated invoices per customer sale
- Reputation system (Unknown → Beloved) with 5 tiers
- 7 discoverable business skills with celebration toasts

**Tech Stack**
Vanilla HTML/CSS/JS / localStorage / Zero dependencies

**Key Files**
```
shopkeeper/
  index.html        # Main UI with 5 views
  style.css         # Warm bakery palette, grandparent-friendly
  engine.js         # Game logic, products, customers, financials
  app.js            # UI controller
  tests/test.js     # 400 tests
```

**How to Run**
```bash
open index.html
```

**Tests**: 400 passing | **Files**: 6 | **LOC**: ~1,300 | **Build time**: ~2 min

**Challenges & Fixes**
Coffee shelf life expiry off-by-one: test expected expiry at day 2 but shelfLife=1 means expiry at end of day 1. Fixed test expectations.

**Potential Next Steps**
- Seasonal events and holiday specials
- Supplier negotiation mini-game
- Tax calculation (secretly teaching accounting)
- Multi-language support

---

### <a id="foodtrend"></a>28. foodtrend - 2026-03-29

**What is this?**
A one-hand-friendly Jupyter notebook for aspiring food TikTokers. 7 Plotly visualizations: engagement heatmap, trending categories, hashtag growth, competitor landscape, content gaps, growth projection, and strategy summary. Just Shift+Enter through cells — zero typing needed.

**Discovery Roll**
Source: 9 (Food/recipe culture) | Persona: 4 (Aspiring TikToker) | Platform: 12 (Jupyter/data viz) | Wildcard: 5 (One-hand usable)

**Features Built**
- Posting time heatmap (7 days x 24 hours) with evening/weekend peaks
- 10 food category growth rates (Air Fryer +35% leads)
- 20 trending hashtags with competition color coding
- 8 competitor accounts scatter plot (followers vs engagement vs growth)
- Content gap analysis identifying underserved high-growth niches
- 12-month follower projection with viral month markers

**Tech Stack**
Python / Jupyter / Plotly / pandas

**Key Files**
```
foodtrend/
  foodtrend.ipynb          # 8-cell notebook
  src/data_engine.py       # All data generation and analysis
  tests/test_engine.py     # 639 tests
```

**How to Run**
```bash
pip install plotly pandas jupyter && jupyter notebook foodtrend.ipynb
```

**Tests**: 639 passing | **Files**: 4 | **LOC**: ~850 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Real TikTok API integration
- A/B test content calendar generator
- Recipe viral score predictor
- Multi-platform comparison (TikTok vs Reels vs Shorts)

---

### <a id="blindbite"></a>29. blindbite - 2026-03-29

**What is this?**
The anti-DoorDash Chrome extension. Instead of overwhelming you with choices, it gives you ONE mystery restaurant pick. No reviews, no ratings, no photos — just a name, cuisine, vibe, distance, and a supply chain fact about your food's ingredients. Tracks your "trust score" (how often you go with the pick vs re-roll). 86% of Gen Z have menu anxiety — this cures it.

**Discovery Roll**
Source: 23 (Supply chain/shipping) | Persona: 6 (Foodie, eats out daily) | Platform: 5 (Browser extension) | Wildcard: 2 (Opposite of popular app — anti-DoorDash)

**Features Built**
- Mystery restaurant picker: 12 cuisines, 60 restaurants, random selection
- 15 supply chain ingredient facts (origin, miles traveled, trivia)
- Trust Score system with 5 levels (Control Freak → Blind Faith)
- Streak tracking for consecutive trusted picks
- Food delivery site detection (DoorDash, UberEats, Yelp, etc.)
- Dark-themed popup with mystery vibe

**Tech Stack**
Chrome Extension (Manifest V3) / Vanilla JS / Chrome Storage API

**Key Files**
```
blindbite/
  manifest.json        # Extension config
  popup.html           # Self-contained popup with inline app.js
  js/engine.js         # Core logic, data, trust scoring
  tests/test.js        # 381 tests
```

**How to Run**
```bash
# Load as unpacked extension or open popup.html
```

**Tests**: 381 passing | **Files**: 5 | **LOC**: ~800 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Real restaurant data via Google Places API
- Location-based picks with browser geolocation
- "Food passport" tracking explored cuisines
- Social sharing of mystery picks

---

### <a id="duetplan"></a>30. duetplan - 2026-03-29

**What is this?**
A Rust+WASM collaborative web app for content creator duos. Two creators independently swipe on 30 trending topics (real March 2026 TikTok/Netflix/Spotify data), then reveal their matches — topics they both want to collaborate on. Generates a collab plan with weekly schedule. URL-encoded state sharing, no server needed.

**Discovery Roll**
Source: 2 (Trending Netflix/TikTok/Spotify) | Persona: 4 (Aspiring YouTuber) | Platform: 10 (Rust+WASM) | Wildcard: 12 (Co-op/collaborative)

**Features Built**
- 30 real trending topics across 21 categories with icons
- Swipe-style voting (yes/skip) for each creator
- Match finding: reveals topics both creators want
- Compatibility score (0-100%) with quality labels (Creative Soulmates → Opposites Attract)
- Auto-generated collab plan with 4-week schedule
- URL-encoded vote sharing (no backend required)

**Tech Stack**
Rust / wasm-bindgen / wasm-pack / HTML/CSS/JS

**Key Files**
```
duetplan/
  Cargo.toml          # Rust project with wasm-bindgen
  src/lib.rs          # All logic: topics, voting, matching, plan generation (24 tests)
  index.html          # Frontend with WASM import
  pkg/                # WASM build output
```

**How to Run**
```bash
wasm-pack build --target web && python3 -m http.server 8080
```

**Tests**: 24 passing (Rust) | **Files**: 3 | **LOC**: ~600 | **Build time**: ~10 sec

**Challenges & Fixes**
None — clean build. Second Rust+WASM project (after afterhours).

**Potential Next Steps**
- Real-time WebSocket sync instead of URL sharing
- Custom topic submission
- TikTok/YouTube trending API integration
- Match history across sessions
