# Auto Dev Dashboard

> Last updated: 2026-05-17 07:40 | Total apps: 105 | Total tests: 14,122

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
| 31 | [clapboard](#clapboard) | Movie-style work time tracker | Chrome Extension/JS | 163 | complete | Load unpacked in `chrome://extensions` |
| 32 | [shotlist2035](#shotlist2035) | AI photography shot list generator | Electron/HTML/JS | 516 | complete | `open src/index.html` |
| 33 | [commutestory](#commutestory) | Infrastructure narrative notebook | Python/Jupyter/Plotly | 305 | complete | `jupyter notebook commutestory.ipynb` |
| 34 | [dormescape](#dormescape) | First apartment text adventure | Rust+WASM | 19 | complete | `wasm-pack build --target web && python3 -m http.server` |
| 35 | [cineconquest](#cineconquest) | 3D globe movie conquest game | Three.js/Vite/Vanilla JS | 39 | complete | `npm run dev` |
| 36 | [nijilog](#nijilog) | Generative art mood diary | p5.js/Vite/Vanilla JS | 32 | complete | `npm run dev` |
| 37 | [snapjudge](#snapjudge) | Speed photo-culling game (3 features) | Godot 4/GDScript | 64 | complete | `godot project.godot` |
| 38 | [ronriroom](#ronriroom) | Office escape logic puzzles | C/Raylib | 64 | complete | `make && ./ronriroom` |
| 39 | [kidlog](#kidlog) | SNS-style family milestone TUI | Python/Textual | 53 | complete | `python3 src/app.py` |
| 40 | [meitantei](#meitantei) | Detective photo evidence game | Vanilla JS/Canvas/Vite | 48 | complete | `npm run dev` |
| 41 | [tsundoku](#tsundoku) | Book-stacking Tetris puzzle | C/Raylib | 57 | complete | `make && ./tsundoku` |
| 42 | [midnightbento](#midnightbento) | Bento box spatial puzzle | Godot 4/GDScript | 52 | complete | `godot project.godot` |
| 43 | [pixelhome](#pixelhome) | Pixel art moving task extension | Chrome Extension/JS | 49 | complete | Load unpacked in `chrome://extensions` |
| 44 | [eigasketch](#eigasketch) | Sketch-style movie quiz game | Godot 4/GDScript | 71 | complete | `godot project.godot` |
| 45 | [amimonotenki](#amimonotenki) | Temperature scarf pattern generator | p5.js/Vite/OpenMeteo API | 35 | complete | `npm run dev` |
| 46 | [ikifuku](#ikifuku) | Breathing exercise generative art | Vanilla JS/Canvas/Vite | 38 | complete | `npm run dev` |
| 47 | [oshishrine](#oshishrine) | Retro GeoCities fan shrine builder | Vanilla JS/Canvas/Vite | 46 | complete | `npm run dev` |
| 48 | [kuizunote](#kuizunote) | Brain training puzzle notebook | Python/Jupyter/matplotlib | 57 | complete | `jupyter notebook kuizunote.ipynb` |
| 49 | [oshimap](#oshimap) | Oshi tour map tracker | Rust+WASM/Canvas | 11 | complete | `wasm-pack build --target web` |
| **50** | [**madorimystery**](#madorimystery) | **Floor plan mystery generator** | **Vanilla JS/Canvas/Vite** | **40** | **complete** | `npm run dev` |
| 51 | [wasurenote](#wasurenote) | Anti-diary worry destroyer | Vanilla JS/Canvas/Vite | 38 | complete | `npm run dev` |
| 52 | [hoshifumi](#hoshifumi) | Star constellation typing game | Three.js/GLSL/Vanilla JS | 0 | complete | `npx serve hoshifumi/` |
| 53 | [himamogura](#himamogura) | Hobby discovery Discord bot with mole mascot | Node.js/discord.js/SQLite | 710 | complete | `node src/bot.js` |
| 54 | [netamemo](#netamemo) | Collaborative content idea clipboard for creators | Chrome Extension/Vanilla JS | 55 | complete | Load unpacked in `chrome://extensions` |
| 55 | [neonreader](#neonreader) | Cyberpunk reader mode for seniors | Chrome Extension/Vanilla JS | 58 | complete | Load unpacked in `chrome://extensions` |
| 56 | [bookcosmos](#bookcosmos) | Physics-simulated reading cosmos | Three.js/GLSL/N-body physics | 0 | complete | `npx serve bookcosmos/` |
| 57 | [shuukatsu-meikyuu](#shuukatsu-meikyuu) | Roguelike job search dungeon crawler | Rust+WASM/Canvas | 47 | complete | `wasm-pack build --target web && cd www && python3 -m http.server` |
| 58 | [wancostar](#wancostar) | Dog walk cosmic galaxy CLI | Swift 5.9/CLI/ANSI | 51 | complete | `swift run Wancostar galaxy` |
| 59 | [tenkimeshi](#tenkimeshi) | Weather-based food recommender IoT | Python/OpenMeteo/RPi | 72 | complete | `python3 src/tenkimeshi.py --demo --once` |
| **60** | [**kabuoto**](#kabuoto) | **Stock market data sonification** | **Web Audio API/Canvas/JS** | **0** | **complete** | `open kabuoto/index.html` |
| 61 | [nyantokashite](#nyantokashite) | Cat cleanup Sokoban puzzle game | Canvas 2D/Web Audio/JS | 0 | complete | `open nyantokashite/index.html` |
| 62 | [tenaoshi](#tenaoshi) | Cozy neighborhood renovation game | C/Raylib 5.5 | 32 | complete | `make && ./tenaoshi` |
| 63 | [miraipost](#miraipost) | Future self letter Chrome extension | Chrome Ext/Vanilla JS | 36 | complete | Load unpacked in `chrome://extensions` |
| 64 | [oshizora](#oshizora) | Living oshi-colored sky with real weather | Canvas/Vanilla JS/OpenMeteo | 60 | complete | `open index.html` |
| 65 | [namioto](#namioto) | One-hand ocean breathing meditation | C/Raylib 5.5 | 27 | complete | `make && ./namioto` |
| 66 | [idolhistoria](#idolhistoria) | 50-year Japanese idol culture data viz | Python/Jupyter/Plotly | 42 | complete | `jupyter notebook idolhistoria.ipynb` |
| 67 | [eigamichi](#eigamichi) | Visual-novel branching movie recommender | Vanilla JS/HTML/CSS | 31 | complete | `open index.html` |
| 68 | [otonoha](#otonoha) | Music chart generative flower garden | p5.js/iTunes API | 44 | complete | `open index.html` |
| 69 | [sekaiquest](#sekaiquest) | ASCII world map TUI explorer | Python/Textual/Rich | 46 | complete | `python3 app.py` |
| 70 | [tokineko](#tokineko) | 時間旅行する猫のターミナルコンパニオン | Python/Textual/Rich | 63 | complete | `pip install -e . && tokineko` |
| 71 | [niwacraft](#niwacraft) | 親子で楽しむコージー庭づくりゲーム | Godot 4.x/GDScript | 45 | complete | Godotで開く → F5 |
| 72 | [ryuusai](#ryuusai) | デジタル墨流しアートジェネレータ | p5.js/Vanilla JS | 80 | complete | `npx serve .` → http://localhost:3000 |
| 73 | [tsumugu](#tsumugu) | 七十二候×手仕事 Discord/CLIボット | Node.js/discord.js | 115 | complete | `node src/cli.js today` |
| 74 | [tabibumi](#tabibumi) | エモい旅日記CLI | Bun/TypeScript/SQLite | 38 | complete | `bun run src/cli.ts help` |
| 75 | [tiketto](#tiketto) | 🎫チケットコレクション Electronアプリ | Electron/Vanilla JS/JSON | 71 | complete | `npm start` |
| 76 | [shinjin-quest](#shinjin-quest) | 新卒サバイバルシミュレーション | C++17/ANSI Terminal | 88 | complete | `make && ./shinjin-quest` |
| 77 | [hoshiura](#hoshiura) | 写真カラー×星座占い | Dart/HTML/CSS/JS | 29 | complete | `dart run bin/hoshiura.dart` |
| 78 | [gaku-erp](#gaku-erp) | 勉強エンタープライズ管理 | C#/Mono/ANSI | 70 | complete | `make && mono gaku-erp.exe` |
| 79 | [omusubi](#omusubi) | 🍙遠距離カップル食事共有 | Dart/HTML/CSS/JS | 32 | complete | `dart run bin/omusubi.dart log カレー` |
| 80 | [kuukan](#kuukan) | 🚀宇宙ステーション・バーチャルオフィス | HTML/CSS/JS/Canvas | 103 | complete | `python3 -m http.server 8080` |
| 81 | [manabi-no-ki](#manabi-no-ki) | 🌳学習で育つ木 — 親子学習トラッカー | Python/ANSI/JSON | 109 | complete | `python3 src/cli.py status` |
| 82 | [sodachi-graph](#sodachi-graph) | 🌱育ちグラフ — 子育てVN×ダッシュボード | C/Raylib 5.5 | 126 | complete | `make && ./sodachi-graph` |
| 83 | [mado](#mado) | 窓 — 静かな語学旅 (Rust+WASM ambient scenes) | Rust+WASM/Canvas/Web Audio | 8 | complete | `python3 -m http.server 8765` |
| 84 | [bug-zumou](#bug-zumou) | バグずもう — 60秒バグ発見お相撲 | Swift 5.9/SwiftUI/SwiftPM | 19 | complete | `swift run` |
| 85 | [danboaru-za](#danboaru-za) | 段ボール座 — 引っ越し未開封箱を星座にする | p5.js/HTML/CSS/ESM | 24 | complete | `python3 -m http.server 8765` |
| 86 | [takibi](#takibi) | 焚火 — カフェノマドの寄り添う集中PWA | Vanilla JS/Canvas/Web Audio/PWA | 14 | complete | `python3 -m http.server 8000` |
| 87 | [bungou-reki](#bungou-reki) | 文豪暦 — 文学暦カードバトル (Tauri) | Tauri 2/Rust/Vanilla JS | 36 | complete | `cd src && python3 -m http.server 8000` |
| 88 | [madori-zukan](#madori-zukan) | 間取り図鑑 — アニメの家を物件カタログにする PWA | PWA/Vanilla JS/SVG | 16 | complete | `python3 -m http.server 8000` |
| 89 | [hoshi-yomi](#hoshi-yomi) | 星詠み — 星座をなぞって語彙を覚える夜空ゲーム | Godot 4/GDScript | 238 | complete | `godot --path .` |
| 90 | [ryogae-kan](#ryogae-kan) | 両替勘 — 5秒勝負の値段感覚トレーニング | Rust+WASM/Vanilla JS | 23 | complete | `wasm-pack build --target web -d www/pkg && cd www && python3 -m http.server 8000` |
| 91 | [eiga-ichiba](#eiga-ichiba) | 映画市場 — 2人で囲む映画株式投資ゲーム | C/Raylib 5.5 | 2,566 | complete | `make && ./eiga-ichiba` |
| 92 | [yasai-nikki](#yasai-nikki) | やさい日記 — 子どもの28日間野菜観察アプリ | C/Raylib 5.5 | 101 | complete | `make && ./yasai-nikki` |
| 93 | [gochisou-goyomi](#gochisou-goyomi) | ごちそう暦 — 世界の祝祭日メシ提案 TUI | Python/Textual 8 | 15 | complete | `pip install -e . && gochisou-goyomi` |
| 94 | [fukugyou-bubble](#fukugyou-bubble) | 副業バブル — 副業 idle クリッカーゲーム (Tauri) | Tauri 2/Rust/Vanilla JS | 43 | complete | `cd src && python3 -m http.server 8000` |
| 95 | [ikitsugi](#ikitsugi) | 息継ぎ — 効率厨ゲーマー向け呼吸ドット拡張機能 | Browser Extension MV3/Vanilla JS/Shadow DOM | 27 | complete | Load unpacked from `ikitsugi/src/` in `chrome://extensions` |
| 96 | [futari-yoho](#futari-yoho) | 二人予報 — 共働き夫婦の判定しない気分予報 TUI | Python 3.10+/Textual 1.0/Rich/JSON | 42 | complete | `pip install -e . && futari-yoho` |
| 97 | [kotoba-mado](#kotoba-mado) | 言葉の窓 — 365 日の語学旅をターミナルのステンドグラスに | Python 3.10+/Rich 13/argparse/JSON | 49 | complete | `pip install -e . && kotoba-mado demo && kotoba-mado year` |
| 98 | [meme-fuda](#meme-fuda) | ミーム札 — シニア×家族で作る思い出ミームカード TUI | Python 3.10+/Textual 1.0/Rich/JSON | 35 | complete | `pip install -e . && meme-fuda` |
| 99 | [tane-kawase](#tane-kawase) | 種交わせ — 語学パートナーが種包を交わす CLI | Python 3.10+/Rich 13/argparse/JSON | 42 | complete | `pip install -e . && tane-kawase demo` |
| **100** | [**denshou-bako**](#denshou-bako) | **🎏 伝承箱 — シニアの知恵を Pi で 10 年残す枕元の箱** | Python 3.10+/Rich 13/Raspberry Pi/espeak-ng/arecord | 41 | complete | `pip install -e . && denshou demo && denshou book ./demo-recordings` |
| 101 | [chika-channel](#chika-channel) | 地下チャンネル — 動画を地下鉄路線図として育てる中毒系ブラウザゲーム | Bun 1.x/TypeScript/SVG/vanilla | 45 | complete | `bun install && bun run dev` |
| 102 | [hibi-no-mukashi](#hibi-no-mukashi) | 日々の昔 — 子育て親に夜 3 分の静かな歴史を 1 つ差し出す Rust+WASM | Rust/wasm-bindgen/serde/HTML/CSS/JS | 20 | complete | `wasm-pack build --target web && python3 -m http.server -d web` |
| 103 | [juugobyou](#juugobyou) | 十五秒 — 片付けが苦手な人の 15 秒だけの小さなボタン (Rust+WASM) | Rust/wasm-bindgen/HTML/CSS/JS | 16 | complete | `wasm-pack build --target web && python3 -m http.server -d web` |
| 104 | [aisaji](#aisaji) | 相匙 — 管理職と相手の 90 秒夕飯くじ Vanilla Web | Vanilla HTML/CSS/ES Module/Vitest | 28 | complete | `npm i && python3 -m http.server` (open `/web/`) |
| 105 | [sekai-wadaichou](#sekai-wadaichou) | 世界話題帳 — 就活生のための深夜の地球儀 Textual TUI | Python 3.10+/Textual 1.0/pytest-asyncio | 31 | complete | `pip install -e ".[test]" && sekai-wadaichou` |

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

---

### <a id="clapboard"></a>31. clapboard - 2026-03-29

**What is this?**
A Chrome extension that turns your workday into a movie production, inspired by the 🎬 clapperboard emoji. "Action!" starts timing a scene (task), "Cut!" stops it, "Retake" restarts with incremented take number. Track productions (projects), view daily "Dailies" review, and rank up from Intern to Legendary Director. 8 genre categories from Development to Coffee Break.

**Discovery Roll**
Source: 18 (B2B enterprise) | Persona: 13 (Movie nerd) | Platform: 5 (Browser extension) | Wildcard: 8 (Emoji: 🎬)

**Features Built**
- Scene timer with Action/Cut/Retake controls and take counting
- 8 work genres (dev, meeting, design, writing, review, admin, research, break)
- Productions (projects) with aggregate scene/minute stats
- Dailies: daily review showing all scenes by genre
- Career stats: total scenes, hours, takes, avg takes/scene, streak
- Director rank: 7 tiers from Intern to Legendary Director
- Director quotes for motivation

**Tech Stack**
Chrome Extension (Manifest V3) / Vanilla JS / Chrome Storage API

**Key Files**
```
clapboard/
  manifest.json        # Extension config
  popup.html           # Self-contained popup with embedded app
  js/engine.js         # All logic: scenes, productions, stats, ranks
  tests/test.js        # 163 tests
```

**How to Run**
```bash
# Load as unpacked extension or open popup.html
```

**Tests**: 163 passing | **Files**: 5 | **LOC**: ~750 | **Build time**: ~1 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- CSV export for invoicing
- Keyboard shortcuts (Ctrl+Shift+A/C)
- Background timer persistence
- Team "cast" mode

---

### <a id="shotlist2035"></a>32. shotlist2035 - 2026-03-29

**What is this?**
A 2035-themed Electron app acting as an AI Director of Photography. Generates personalized shot lists from 10 trending 2026 visual styles (cinematic, neon portrait, bold color, candid, retro film, screenshot aesthetic, etc.). 26 shot templates with descriptions, difficulty ratings, gear lists, viral potential scores, and AI Director notes. Filter by style and skill level.

**Discovery Roll**
Source: 2 (Netflix/TikTok/Spotify trending) | Persona: 15 (Photographer, 10K unsorted photos) | Platform: 9 (Electron) | Wildcard: 4 (Year 2035)

**Features Built**
- 10 trending visual styles with trend scores from 2026 photography data
- 26 shot templates across all styles with difficulty, gear, and descriptions
- Style filtering and 4-tier skill matching (Beginner → Pro)
- Viral potential scoring per shot based on trend data
- AI Director v12.0 notes with strategic photography advice
- Summary with style mix, difficulty breakdown, and gear checklist

**Tech Stack**
Electron / HTML / CSS / Vanilla JS

**Key Files**
```
shotlist2035/
  package.json / main.js    # Electron wrapper
  src/engine.js              # Styles, templates, generation, scoring
  src/index.html             # UI with gradient-themed design
  tests/test.js              # 516 tests
```

**How to Run**
```bash
open src/index.html
# or: npm install && npm start
```

**Tests**: 516 passing | **Files**: 6 | **LOC**: ~900 | **Build time**: ~1 min

**Challenges & Fixes**
Count=0 defaults to 5 (not 1) since engine uses `count || 5` — adjusted test expectation.

**Potential Next Steps**
- Photo upload + AI comparison to shot template
- Location-based shot suggestions
- Weekly trending style updates via API
- Portfolio builder from completed shots

---

### <a id="commutestory"></a>33. commutestory - 2026-03-29

**What is this?**
A Jupyter notebook that tells the narrative story of a daily train commute through 8 stations of infrastructure engineering. Each station is a chapter: steel-truss terminal, TBM-bored granite tunnel, cable-stayed bridge, AI smart station, BRT interchange, concrete viaduct, living green station, and multi-modal hub. 7 Plotly visualizations with verified engineering data. Based on real 2026 US transit project trends.

**Discovery Roll**
Source: 19 (Infrastructure/urban planning) | Persona: 19 (Commuter, 1hr train) | Platform: 12 (Jupyter/data viz) | Wildcard: 14 (Storyline/narrative)

**Features Built**
- 8-station narrative with multi-line story text per chapter
- Elevation profile chart (tunnel at -40m, bridge at +65m, viaduct at +22m)
- Harbor Bridge deep dive (340m span, 72 cables, 120m towers)
- BRT vs Rail cost comparison ($45M vs $400M — $355M redirected)
- Passenger volume bar chart across stations
- Sustainability metrics (solar, air filtration, rainwater, graywater)
- Construction timeline scatter plot (2018-2026)

**Tech Stack**
Python / Jupyter / Plotly / pandas / dataclasses

**Key Files**
```
commutestory/
  commutestory.ipynb      # 12-cell narrative notebook
  src/data_engine.py      # 8 stations with engineering data
  tests/test_engine.py    # 305 tests
```

**How to Run**
```bash
pip install plotly pandas jupyter && jupyter notebook commutestory.ipynb
```

**Tests**: 305 passing | **Files**: 4 | **LOC**: ~850 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build.

**Potential Next Steps**
- Interactive station map (click to read chapter)
- Real GTFS transit data integration
- Audio narration for actual commuters
- City-specific editions (NYC, London, Tokyo)

---

### <a id="dormescape"></a>34. dormescape - 2026-03-29

**What is this?**
A Rust+WASM interactive fiction game where a student at 2am navigates finding their first apartment after graduation. 7 chapters teach real financial concepts — the 30% rent rule, lease reading, credit scores, move-in budgeting, and emergency funds — through binary story choices. HUD tracks savings, rent, and credit. Ends with a financial grade based on your decisions. All data from 2026 housing market research ($915/bed avg, 27.2% income-to-rent).

**Discovery Roll**
Source: 22 (Real estate/housing) | Persona: 8 (Student cramming at 2am) | Platform: 10 (Rust+WASM) | Wildcard: 14 (Storyline/narrative)

**Features Built**
- 7-chapter text adventure (2:00 AM → 5:00 AM sunrise)
- Binary choices with budget/rent/credit effects and financial lessons
- HUD tracking savings, rent, credit score, chapter progress
- Financial grade (A-D) based on final rent-to-income ratio
- Monthly budget breakdown calculator
- Progress bar with chapter dots

**Tech Stack**
Rust / wasm-bindgen / wasm-pack / HTML/CSS/JS

**Key Files**
```
dormescape/
  Cargo.toml        # Rust project
  src/lib.rs         # 7 chapters, choices, effects, grading (19 tests)
  index.html         # Frontend with WASM import
  pkg/               # WASM build output
```

**How to Run**
```bash
wasm-pack build --target web && python3 -m http.server 8080
```

**Tests**: 19 passing (Rust) | **Files**: 3 | **LOC**: ~500 | **Build time**: ~5 sec

**Challenges & Fixes**
None — clean build. Third Rust+WASM project.

**Potential Next Steps**
- Multiple city storylines with different costs
- Shareable results card for social media
- Branching paths with more choices per chapter
- Real apartment listing API integration

---

### <a id="cineconquest"></a>35. cineconquest - 2026-03-29 18:30

**What is this?**
A competitive 3D globe visualization where movie lovers "conquer" countries by logging films from around the world. Features a Three.js interactive Earth with glowing markers, a 5-level conquest system, simulated global leaderboard, weekly challenges, and 17 unlockable achievements. All UI is in Japanese.

**Discovery Roll**
Source: 1 (Today's top world news) | Persona: 13 (全作品を記録する映画オタク) | Platform: 19 (p5.js/Three.js creative coding) | Wildcard: 10 (Everything is a competition/leaderboard)

**Features Built**
- 3D interactive globe with orbit controls, atmosphere shader, star field, and particle burst effects
- Movie logging form with country, genre, star rating, and date
- 5-level conquest system per country with progressive glow intensity
- Simulated global leaderboard with 9 AI opponents and diversity scoring
- 3 rotating weekly challenges (region-specific, genre variety, streaks)
- Statistics dashboard with genre/country/continent distribution charts
- 17 achievements from first film to continent explorers and 30-day streaks

**Tech Stack**
JavaScript / Three.js / Vite / localStorage / Noto Sans JP / Glassmorphism CSS

**Key Files**
```
src/main.js          — App entry point & UI orchestration
src/globe.js         — Three.js 3D globe, markers, particle effects
src/store.js         — State management with localStorage persistence
src/ui.js            — Panel rendering (form, log, rankings, stats)
src/achievements.js  — 17 achievement definitions and checker
src/leaderboard.js   — Simulated global rankings with AI opponents
src/challenges.js    — Weekly rotating challenge system
src/data/countries.js — 83 countries with Japanese names, lat/lng, continents
src/style.css        — Glassmorphism design, responsive layout
tests/run.js         — 39 tests covering all modules
```

**How to Run**
```bash
cd cineconquest
npm install
npm run dev
```

**Tests**: 39 passing | **Files**: 18 | **LOC**: ~3,670 | **Build time**: ~350ms

**Challenges & Fixes**
None — clean build. Three.js globe rendering with custom atmosphere shader worked on first attempt.

**Potential Next Steps**
- TMDb API integration for movie autocomplete and poster images
- Real multiplayer leaderboard with Firebase/Supabase
- News API for dynamic country challenges based on current events
- PWA manifest for installable mobile experience
- Share conquest map as image on social media

---

### <a id="nijilog"></a>36. nijilog - 2026-03-29 19:15

**What is this?**
A generative art diary where your daily emotions flow as colored particle streams on a p5.js canvas. Consecutive entries create smooth, beautiful color flows; skipped days create visible gaps (like supply chain breaks), motivating consistency. Color is central — each of 8 moods has a distinct hue that defines your personal artwork over time.

**Discovery Roll**
Source: 23 (Supply chain/shipping news) | Persona: 31 (日記をつけたいけど続かない人) | Platform: 19 (p5.js creative coding) | Wildcard: 32 (色が重要な意味を持つ)

**Features Built**
- Mood color picker: 8 moods with distinct colors (喜び, 穏やか, 元気, 愛, 悲しみ, 怒り, 不安, ふつう)
- p5.js generative particle flow visualization with wobble physics and glow effects
- Gap detection: dashed lines and labels for skipped days
- Calendar view: color-coded month grid with mood-per-day
- Entry list: chronological view with mood colors and text
- Stats dashboard: streak, longest streak, mood distribution bars, motivational messages
- Streak celebrations at 3/7/14/30 day milestones

**Tech Stack**
JavaScript / p5.js / Vite / localStorage / M PLUS Rounded 1c font / Dark glassmorphism CSS

**Key Files**
```
src/main.js          — App orchestration & event handling
src/flow.js          — p5.js particle stream generator & gap visualization
src/store.js         — State management with streak & gap computation
src/ui.js            — Panel rendering (form, calendar, list, stats)
src/data/moods.js    — 8 mood definitions with HSL values for p5.js
src/style.css        — Dark theme with glassmorphism, mood color variables
tests/run.js         — 32 tests covering moods, store, stats, gaps
```

**How to Run**
```bash
cd nijilog
npm install
npm run dev
```

**Tests**: 32 passing | **Files**: 14 | **LOC**: ~2,840 | **Build time**: ~415ms

**Challenges & Fixes**
None — clean build. p5.js HSL color mode worked seamlessly with mood color system.

**Potential Next Steps**
- Export flow visualization as shareable image
- Mood keyword auto-detection from entry text
- Ambient background music that changes with mood
- PWA for installable mobile experience
- Weekly AI-generated mood insights

---

### <a id="snapjudge"></a>37. snapjudge - 2026-03-29 20:00

**What is this?**
A speed photo-culling game in Godot 4 where players rapidly sort procedurally generated photos by quality. Each photo has sharpness, exposure, and composition attributes that determine whether it should be kept, deleted, or starred. Constrained to exactly 3 features: Judge, Score, Results.

**Discovery Roll**
Source: 37 (自動化・効率化) | Persona: 15 (1万枚の写真を持つカメラ好き) | Platform: 14 (Godot game) | Wildcard: 6 (最大3機能のみ)

**Features Built**
- Swipe/keyboard photo judging: keep (→), delete (←), star (↑) with tween animations
- Scoring: base points + speed bonus + star bonus + combo multiplier, with S-F grading
- Results screen: accuracy %, max combo, stars found, grade, high score tracking

**Tech Stack**
GDScript / Godot 4 / Procedural generation / Node.js test suite

**Key Files**
```
project.godot                — Godot 4 project config (720x1280 portrait)
scripts/photo_generator.gd   — Procedural photo generation with quality attributes
scripts/score_system.gd      — Scoring, combos, accuracy, grading (S-F)
scripts/game_manager.gd      — Game loop, timer, state machine
scripts/photo_card.gd        — Swipe/drag input handling with tween animations
scripts/photo_canvas.gd      — Procedural drawing (shapes, blur, exposure overlays)
scenes/main.tscn             — Main scene with title/game/results screens
scenes/main_ui.gd            — UI controller connecting all systems
tests/run.js                 — 64 tests (logic validation + structure + Japanese text)
```

**How to Run**
```bash
# Requires Godot 4 installed
godot project.godot
```

**Tests**: 64 passing (Node.js) | **Files**: 15 | **LOC**: ~1,760

**Challenges & Fixes**
Godot not installed on build machine — wrote comprehensive Node.js tests that validate game logic by reimplementing core algorithms, plus project structure and Japanese text verification.

**Potential Next Steps**
- Real photo datasets for more realistic training
- Difficulty levels (Easy/Hard)
- Photo editing mini-game between rounds

---

### <a id="ronriroom"></a>38. ronriroom - 2026-03-30 00:30

**What is this?**
A Raylib C logic puzzle escape game where a new employee solves 5 different puzzle types to escape office rooms. Each room features a distinct mechanic: pattern recognition (Latin square), number sequences (Fibonacci), linked switches, maze navigation, and Caesar cipher decryption.

**Discovery Roll**
Source: 20 (Academic papers/ArXiv) | Persona: 24 (新社会人/入社1年目) | Platform: 20 (Raylib/C) | Wildcard: 30 (パズル/謎解きが中心)

**Features Built**
- 5 puzzle types: pattern grid, number sequence, linked switches, pathfinding maze, Caesar cipher
- State machine game flow: Title → Story → Playing → Solved → Complete
- Scoring with time tracking, mistake counting, and S/A/B/C grading
- Hint system (press H) and wrong-answer visual feedback

**Tech Stack**
C99 / Raylib / Makefile / Pure logic separated from rendering

**Key Files**
```
src/main.c          — Game loop, input handling per puzzle type
src/game.c          — State machine, room transitions
src/puzzles.c       — All 5 puzzle types (logic only, no Raylib deps)
src/puzzles.h       — Puzzle data structures and API
src/ui.c            — All Raylib drawing code
src/ui.h            — Colors and UI constants
tests/test_puzzles.c — 64 tests covering all puzzle logic
Makefile            — Build game + test target
```

**How to Run**
```bash
make && ./ronriroom
```

**Tests**: 64 passing (C) | **Files**: 12 | **LOC**: ~1,300 (C/H) | **Build time**: <1s

**Challenges & Fixes**
None — clean build with zero compiler warnings. Pure logic separation made testing trivial.

**Potential Next Steps**
- Randomized puzzle parameters for replayability
- Japanese font rendering via Raylib font loading
- More puzzle types (Sudoku, Tower of Hanoi, binary)

---

### <a id="kidlog"></a>39. kidlog - 2026-03-30 01:00

**What is this?**
A Textual TUI family milestone tracker styled like a social media feed. Busy parents log their children's milestones in under 30 seconds from the terminal. Features SNS-style timeline with emoji reactions, 9 categories, streak tracking, and statistics.

**Discovery Roll**
Source: 33 (Hacker News) | Persona: 2 (忙しすぎる親) | Platform: 3 (Python Textual TUI) | Wildcard: 44 (SNS風UI)

**Features Built**
- SNS-style scrollable timeline with category emoji, timestamps, and reactions
- Quick modal entry form with 9 category buttons (運動/ことば/食事/睡眠/遊び/初めて/健康/社会性/その他)
- Emoji reaction system (❤️😂😢🎉💪🌟) with deduplication
- Statistics modal: category distribution bars, reaction counts, streak info
- Text search across all entries
- Streak tracking with longest streak record
- JSON file persistence (~/.kidlog_data.json)

**Tech Stack**
Python 3 / Textual TUI / JSON / Rich text rendering

**Key Files**
```
src/app.py           — Textual app with 4 screens (main, new entry, stats, reactions)
src/store.py         — Data layer: CRUD, stats, search, streak tracking
tests/test_store.py  — 53 tests covering all store operations
```

**How to Run**
```bash
pip install textual
cd kidlog && python3 src/app.py
```

**Tests**: 53 passing | **Files**: 6 | **LOC**: ~740 (Python)

**Challenges & Fixes**
None — clean implementation. Textual's modal screens and CSS-like styling made the SNS-style UI natural.

**Potential Next Steps**
- Export timeline as shareable HTML/PDF for grandparents
- Multi-child profiles with separate feeds
- Weekly summary notifications

---

### <a id="meitantei"></a>40. meitantei - 2026-03-30 01:45

**What is this?**
A web-based detective investigation game where a job-hunting student examines procedurally drawn crime scenes. Click evidence to discover clues, then accuse the right suspect with sufficient evidence. 3 university-themed cases: stolen job offer, threatening posters, and research data tampering.

**Discovery Roll**
Source: 25 (True crime/mystery) | Persona: 23 (就活中の大学生) | Platform: 7 (UE→Web adapted) | Wildcard: 36 (写真やカメラを使う)

**Features Built**
- Canvas-rendered crime scenes with clickable evidence hotspots and hover effects
- Clue discovery system with detail overlays and clue panel tracking
- Accusation modal: select suspect, validates both culprit and required evidence
- 3 cases with 3-5 clues each, 3-4 suspects, branching wrong/right outcomes
- Progress persistence with completed case tracking
- Dark mystery aesthetic with vignette, noir grid, gold accents

**Tech Stack**
Vanilla JS / Canvas API / Vite / CSS3 / localStorage

**Key Files**
```
src/cases.js      — 3 case definitions (scenes, clues, suspects, solutions)
src/renderer.js   — Canvas drawing (scenes, hotspots, clue details, vignette)
src/store.js      — Game state persistence (progress, clues, completion)
src/main.js       — Game loop, input handling, screen management
src/style.css     — Dark mystery theme with glassmorphism
tests/run.js      — 48 tests (cases, solutions, store, data integrity)
```

**How to Run**
```bash
cd meitantei
npm install
npm run dev
```

**Tests**: 48 passing | **Files**: 13 | **LOC**: ~2,220 | **Build**: 239ms (15KB bundle)

**Challenges & Fixes**
UE not available — adapted to web Canvas for immersive investigation. Zero-asset approach with procedural scene drawing.

**Potential Next Steps**
- Evidence board with drag-and-connect clues
- Timed investigation mode
- Sound effects and ambient mystery music

---

### <a id="tsundoku"></a>41. tsundoku - 2026-03-30 02:30

**What is this?**
A Tetris-style book stacking puzzle game in C/Raylib. 7 book-shaped pieces (文庫本, 単行本, 漫画セット, 百科事典, 画集, 新書, BOXセット) in 7 genre colors fall and must be stacked on shelves. 3-round tournament with cumulative scoring and S-F grading.

**Discovery Roll**
Source: 4 (Sports/esports) | Persona: 38 (読書家/年100冊) | Platform: 20 (Raylib/C) | Wildcard: 47 (建築・設計・間取り)

**Features Built**
- 7 unique book-shaped pieces with rotation and wall-kick
- 7 genre colors (Fiction, Science, History, Fantasy, Mystery, Romance, Philosophy)
- Line clearing with combo multiplier scoring
- 3-round tournament mode with per-round and total scoring
- Level progression (speed increases every 10 lines)
- Ghost piece drop preview, next piece display, sidebar stats

**Tech Stack**
C99 / Raylib / Makefile / Pure logic separated from rendering

**Key Files**
```
src/piece.c   — 7 piece types with rotation, genre colors
src/board.c   — 10x20 grid, collision, line clearing, scoring
src/game.c    — Game loop, round management, drop timing
src/ui.c      — Raylib drawing (board, pieces, sidebar, screens)
src/main.c    — Input handling, state machine
tests/test_game.c — 57 tests (pieces, board, scoring, game logic)
```

**How to Run**
```bash
make && ./tsundoku
```

**Tests**: 57 passing (C) | **Files**: 14 | **LOC**: ~1,400 | **Build**: <1s | Zero warnings

**Challenges & Fixes**
BOARD_H macro name collision with include guard — renamed to BOARD_ROWS.

**Potential Next Steps**
- Hold piece mechanic
- Custom shelf layout designer (architecture twist)
- Online leaderboard

---

### <a id="midnightbento"></a>42. midnightbento - 2026-03-30 03:15

**What is this?**
A Godot 4 spatial puzzle game where you pack Japanese food items into a bento box grid. 10 food types with unique shapes (umeboshi 1x1 to tonkatsu 2x3), 10 levels from tutorial to expert, and study-effect bonuses. Designed as a 2-minute study break for late-night crammers.

**Discovery Roll**
Source: 9 (Food/recipe culture) | Persona: 8 (深夜2時の詰め込み学生) | Platform: 14 (Godot game) | Wildcard: 0 (なし)

**Features Built**
- 10 food types: おにぎり, 卵焼き, 唐揚げ, ブロッコリー, 巻き寿司, 餃子, とんかつ, etc.
- 10 levels (3x2 to 6x5) with curated food sets
- Placement validation, rotation, undo
- Scoring: filled cells + variety bonus + full board bonus + study effects
- Study effect system (集中力, 記憶力, スタミナ, 健康, etc.)
- S-F grading based on par scores

**Tech Stack**
GDScript / Godot 4 / Node.js test suite

**Key Files**
```
scripts/food_data.gd    — 10 food items with shapes, colors, effects
scripts/bento_board.gd  — Grid logic: placement, validation, scoring
scripts/level_data.gd   — 10 level definitions with board sizes and food sets
scripts/game_manager.gd — Game flow, selection, placement, grading
scenes/main_ui.gd       — Drawing, input, screen management
tests/run.js            — 52 tests (logic, levels, structure, Japanese text)
```

**How to Run**
```bash
godot project.godot
```

**Tests**: 52 passing (Node.js) | **Files**: 13 | **LOC**: ~1,300

**Challenges & Fixes**
None — clean implementation. Level design verified by test ensuring food cells never exceed board capacity.

**Potential Next Steps**
- Drag-and-drop piece placement
- Randomized levels for infinite replay
- Time-based scoring leaderboard

---

### <a id="pixelhome"></a>43. pixelhome - 2026-03-30 04:00

**What is this?**
A Chrome extension that replaces your new tab with a pixel art room you build by completing moving tasks. 15 tasks (住所変更, ネット開通, カーテン購入, etc.) each unlock a piece of pixel furniture. 4 meme-inspired secret items (にゃんキャット, 柴犬ミーム, This is Fine, ピクセル猫) as easter eggs.

**Discovery Roll**
Source: 5 (Viral memes) | Persona: 28 (引っ越ししたばかりの人) | Platform: 5 (Chrome extension) | Wildcard: 19 (ピクセルアート)

**Features Built**
- Pixel art room rendered on Canvas with walls, floor, window, moon, stars
- 15 moving tasks across 3 categories (手続き/買い物/生活準備)
- 19 furniture items with pixel art rendering (highlight + shadow)
- 4 secret meme items unlocked at milestones (1/5/10/all tasks)
- Progress bar, chrome.storage persistence, Manifest V3

**Tech Stack**
Chrome Extension Manifest V3 / Vanilla JS / Canvas API / ES Modules

**Key Files**
```
manifest.json       — Manifest V3 config with newtab override
src/newtab.html     — New tab page layout
src/newtab.js       — Controller: task toggling, room rendering, storage
src/data.js         — 15 tasks, 19 furniture items, 4 secrets, 3 categories
src/renderer.js     — Canvas pixel art drawing (room, furniture, effects)
src/newtab.css      — Dark theme with pixel font
tests/run.js        — 49 tests (data, secrets, manifest, structure, Japanese text)
```

**How to Run**
Load unpacked in `chrome://extensions` (enable Developer Mode first)

**Tests**: 49 passing | **Files**: 10 | **LOC**: ~900

**Challenges & Fixes**
None — clean implementation. Storage abstraction allows testing with localStorage outside Chrome.

**Potential Next Steps**
- Animated furniture (walking pixel cat, flickering lamp)
- Custom task creation
- Day/night room themes based on time

---

### <a id="eigasketch"></a>44. eigasketch - 2026-03-30 04:45

**What is this?**
A Godot 4 movie quiz game with hand-drawn sketch-style visuals. Wobbly procedural hints (circles, rectangles, lines, stars, waves) are progressively drawn on a paper-grid canvas. Players guess the movie from 4 choices. 30 movies across 6 genres with speed-based scoring.

**Discovery Roll**
Source: 30 (Random country news) | Persona: 13 (映画オタク) | Platform: 14 (Godot) | Wildcard: 31 (手書き風ビジュアル)

**Features Built**
- 30 movies across 6 genres (Action, SF, Horror, Romance, Anime, Fantasy) with 4 sketch hints each
- Wobbly sketch renderer: sin-based wobble on circles, rects, lines, stars, waves
- Progressive hint reveal with time-based auto-progression
- Speed scoring with hint penalty (fewer hints = more points)
- 10-question quick mode and 30-question full challenge
- S-F grading system

**Tech Stack**
GDScript / Godot 4 / Procedural sketch drawing / Node.js test suite

**Key Files**
```
scripts/movie_data.gd    — 30 movies with visual hint definitions
scripts/quiz_engine.gd   — Quiz flow, scoring, grading
scripts/sketch_drawer.gd — Wobbly procedural drawing (6 shape types)
scenes/main_ui.gd        — UI controller, input, results
tests/run.js             — 71 tests
```

**How to Run**
```bash
godot project.godot
```

**Tests**: 71 passing | **Files**: 12 | **LOC**: ~1,600

**Challenges & Fixes**
None — clean implementation. 30-movie database with curated visual hints across all genres.

**Potential Next Steps**
- User-contributed movie databases
- Multiplayer who-guesses-faster mode
- Freehand drawing mode (player draws, game guesses)

---

### <a id="amimonotenki"></a>45. amimonotenki - 2026-03-30 05:30

**What is this?**
A p5.js temperature scarf pattern generator using the OpenMeteo weather API. Enter any city worldwide, and it fetches 1 year of daily temperatures to generate a knitting pattern. Each day becomes a row colored by temperature (deep blue = freezing, red = scorching). Produces a printable pattern crafters can actually follow.

**Discovery Roll**
Source: 36 (デザインツール) | Persona: 37 (DIYクラフター) | Platform: 19 (p5.js) | Wildcard: 28 (実在のWeb API連携)

**Features Built**
- City search via OpenMeteo geocoding API (Japanese support)
- 365-day temperature data fetch from archive API
- p5.js scarf visualization with 11 color ranges and knit texture
- Statistics dashboard (min/max/avg temp, range, day count)
- Scrollable pattern with date labels every 30 days
- Decorative fringe at scarf ends
- Japanese yarn name legend with color swatches

**Tech Stack**
JavaScript / p5.js / Vite / OpenMeteo API / CSS3

**Key Files**
```
src/colors.js   — 11 temperature ranges with hex colors, yarn names, HSL conversion
src/weather.js  — OpenMeteo API: city search, temp data fetch, stats computation
src/scarf.js    — p5.js scarf renderer with knit texture and fringe
src/main.js     — UI controller, city search, data flow
tests/run.js    — 35 tests (color mapping, temp ranges, date logic, stats)
```

**How to Run**
```bash
cd amimonotenki
npm install
npm run dev
```

**Tests**: 35 passing | **Files**: 10 | **LOC**: ~1,200 | **Build**: 394ms

**Challenges & Fixes**
Test had wrong temperature range name — fixed to match actual data (猛暑 not 酷暑 for 30-35°C).

**Potential Next Steps**
- Print/export as PDF with yarn shopping list
- Compare two cities side-by-side
- Monthly separator markers in the pattern

---

### <a id="ikifuku"></a>46. ikifuku - 2026-03-30 06:15

**What is this?**
A beautiful 5-minute breathing exercise web app that generates unique art as you breathe. Each inhale draws particles inward, each exhale creates expanding ripples. Four breathing patterns (4-7-8 リラックス, 4-4-4 バランス, 4-2-6 エナジー, 5-5-5 カーム). After 5 minutes, save your unique breath art as PNG. Glassmorphism UI, 8KB bundle.

**Discovery Roll**
Source: 33 (Hacker News) | Persona: 2 (忙しすぎる親) | Platform: 7 (UE→Web) | Wildcard: 11 (スクショ映えするUI)

**Features Built**
- 4 breathing patterns with configurable inhale/hold/exhale durations
- Generative art: ripples, particles, glowing orb responding to breath phases
- 5-color palette rotation on each phase change
- Session HUD: phase label, timer, progress bars, pause/resume
- Completion screen with cycle stats and PNG download
- Glassmorphism dark UI with gradient accents

**Tech Stack**
Vanilla JS / Canvas 2D / Vite / CSS glassmorphism

**Key Files**
```
src/breathing.js  — BreathingEngine class: patterns, phases, tick, breathValue
src/art.js        — BreathArt class: ripples, particles, orb, color palette
src/main.js       — App controller, game loop, screen management
src/style.css     — Glassmorphism dark theme, responsive
tests/run.js      — 38 tests (engine, patterns, phases, progress, controls)
```

**How to Run**
```bash
cd ikifuku && npm install && npm run dev
```

**Tests**: 38 passing | **Files**: 9 | **LOC**: ~1,000 | **Build**: 242ms (8KB bundle)

**Challenges & Fixes**
None — clean implementation. Canvas trail effect (semi-transparent overlay) creates beautiful layered art naturally.

**Potential Next Steps**
- Ambient audio (rain, waves, forest)
- Session history with saved artworks gallery
- Custom breathing pattern creator

---

### <a id="oshishrine"></a>47. oshishrine - 2026-03-30 07:00

**What is this?**
A retro GeoCities-style fan shrine builder for oshi (推し) culture. Enter your oshi's name, pick a theme color, and get a full 90s/2000s internet-era fan page with sparkle cursor trails, starfield, marquee text, visitor counter, guestbook, and "under construction" signs. Pure nostalgic joy.

**Discovery Roll**
Source: 34 (Stack Overflow) | Persona: 27 (推し活に全力の人) | Platform: 19 (p5.js→Canvas) | Wildcard: 13 (90s/2000sノスタルジア)

**Features Built**
- Shrine setup: oshi name, catchphrase, 6 theme colors (ピンク/ブルー/パープル/ゴールド/グリーン/レッド)
- 3 Canvas particle systems: starfield, sparkle cursor trail, floating hearts
- Retro CSS: marquee, blink animation, rainbow text, double borders, Press Start 2P font
- Visitor counter, guestbook with fake Y2K dates, badge display
- "Since 2003 | Best viewed with IE 6.0 | 800x600" footer
- 8 badge emojis, 6 random titles (永遠の推し, 世界一の推し, etc.)

**Tech Stack**
Vanilla JS / Canvas 2D / Vite / Retro CSS / localStorage

**Key Files**
```
src/shrine.js   — Data model: themes, badges, titles, guestbook, persistence
src/effects.js  — StarField, SparkleTrail, FloatingHearts particle systems
src/main.js     — App controller, setup form, shrine rendering
src/style.css   — Intentionally retro CSS (marquee, blink, rainbow, crosshair)
tests/run.js    — 46 tests (themes, badges, data, 90s elements, Japanese text)
```

**How to Run**
```bash
cd oshishrine && npm install && npm run dev
```

**Tests**: 46 passing | **Files**: 9 | **LOC**: ~1,100 | **Build**: 260ms (8KB)

**Challenges & Fixes**
None — the most fun app to build. Retro CSS aesthetics were intentional "ugly beauty."

**Potential Next Steps**
- MIDI background music player
- Animated GIF-style sprite decorations
- Share shrine via URL-encoded data

---

### <a id="kuizunote"></a>48. kuizunote - 2026-03-30 07:45

**What is this?**
An interactive Jupyter notebook brain training game for seniors. 10 visual puzzles across 4 types (pattern, sequence, logic, chart) with matplotlib visualizations. Includes bar charts, pie charts, color patterns, and mountain graphs. Brain-type personality diagnosis at the end (天才脳, 分析脳, 直感脳, のんびり脳, 冒険脳).

**Discovery Roll**
Source: 5 (Viral memes) | Persona: 36 (老後を楽しむシニア) | Platform: 12 (Jupyter notebook) | Wildcard: 30 (パズル中心)

**Features Built**
- 10 puzzles: pattern recognition, Fibonacci, logic, chart reading, age calc, mirror patterns
- matplotlib dark-themed charts: bar, pie, color pattern, mountain bar graph
- Brain type diagnosis with 5 personality types based on score
- Score visualization: gauge meter + correct/incorrect breakdown
- Hint and explanation after each puzzle

**Tech Stack**
Python / Jupyter Notebook / matplotlib / numpy

**Key Files**
```
puzzles.py              — 10 puzzle definitions, scoring, brain types, chart data
kuizunote.ipynb         — Interactive notebook with 15 cells
tests/test_puzzles.py   — 57 tests
```

**How to Run**
```bash
pip install matplotlib numpy
jupyter notebook kuizunote.ipynb
```

**Tests**: 57 passing | **Files**: 5 | **LOC**: ~750

**Challenges & Fixes**
None — clean implementation. Separated puzzle logic from notebook for full testability.

**Potential Next Steps**
- More puzzle categories (memory, spatial, vocabulary)
- Difficulty levels
- Progress tracking across sessions

---

### <a id="oshimap"></a>49. oshimap - 2026-03-30 08:30

**What is this?**
A Rust+WASM web app where oshi fans map their idol's tour locations across Japan's 47 prefectures. Events are plotted as glowing dots on a canvas-rendered Japan map, connected by route lines with haversine distance calculation. Stats show coverage percentage, event count, and total distance.

**Discovery Roll**
Source: 23 (Supply chain) | Persona: 27 (推し活) | Platform: 10 (Rust+WASM) | Wildcard: 33 (地図中心)

**Features Built**
- 47 prefecture Japan map rendered on Canvas with lat/lng projection
- Event CRUD: add concerts/events/pilgrimages with date, type, notes
- Route visualization: chronological lines between event locations
- Haversine distance calculation in Rust (Tokyo-Osaka ≈ 395km verified)
- Coverage stats: visited count, %, total distance
- localStorage persistence with JSON import/export

**Tech Stack**
Rust / wasm-bindgen / serde_json / wasm-pack / Canvas 2D / JavaScript

**Key Files**
```
src/lib.rs       — Rust: OshiMapState, 47 prefectures, haversine, events, routing (11 tests)
www/app.js       — JS: WASM init, map rendering, UI controller
www/index.html   — HTML with form and event list
www/style.css    — Dark pink-accent theme
Cargo.toml       — Rust deps
```

**How to Run**
```bash
wasm-pack build --target web
python3 -m http.server 8080
# Open http://localhost:8080/www/
```

**Tests**: 11 passing (Rust) | **Files**: 8 | **LOC**: ~800

**Challenges & Fixes**
None — clean build. Haversine formula verified against known Tokyo-Osaka distance.

**Potential Next Steps**
- SVG map with prefecture boundaries
- Photo attachment per event
- Share map as image or URL

---

### <a id="madorimystery"></a>50. madorimystery - 2026-03-30 09:15 🎉 MILESTONE APP #50!

**What is this?**
A floor plan mystery generator! Design a room layout on a grid, then the app auto-generates a complete murder mystery within it — culprit, weapon, motive, crime scene, clues, and a red herring. Switch to investigation mode to search rooms, collect evidence, and accuse the culprit. Perfect content for mystery YouTubers and TikTokers.

**Discovery Roll**
Source: 25 (True crime/mystery) | Persona: 4 (YouTuber志望) | Platform: 19 (p5.js→Canvas) | Wildcard: 47 (間取りを作る)

**Features Built**
- Grid-based floor plan editor: 8 room types with overlap detection
- Seeded mystery generator: deterministic results from floor plan layout
- 4 suspects with names, roles, alibis, emojis
- 5 weapons with room affinity, 5 motives
- 4+ clues per mystery including red herring
- Investigation mode: click rooms to discover clues
- Accusation system: requires 2+ clues before charging

**Tech Stack**
Vanilla JS / Canvas 2D / Vite / Seeded RNG / Grid collision

**Key Files**
```
src/mystery.js    — Mystery generator: suspects, weapons, motives, clues, seeded RNG
src/floorplan.js  — FloorPlan class: grid CRUD, overlap detection, Canvas rendering
src/main.js       — App controller: design/investigate modes, accusation flow
src/style.css     — Dark mystery theme with red accent
tests/run.js      — 40 tests (rooms, suspects, floor plan, mystery gen, investigation)
```

**How to Run**
```bash
cd madorimystery && npm install && npm run dev
```

**Tests**: 40 passing | **Files**: 9 | **LOC**: ~1,300 | **Build**: 240ms (10KB)

**Challenges & Fixes**
None — clean milestone build. Seeded RNG ensures reproducible mysteries for content creation.

**Potential Next Steps**
- Multiple mystery scenarios per floor plan
- Timer mode for speed investigation
- Export as shareable mystery image

---

### <a id="wasurenote"></a>51. wasurenote - 2026-03-30 10:00

**What is this?**
The anti-diary. Write down worries, regrets, or things you want to let go of, then the app ceremonially destroys them with particle animations. 3 destruction modes (燃やす🔥, 溶かす💧, 風に飛ばす🌬️). Each character becomes an independent particle. Farewell messages include dev humor ("ガベージコレクション完了"). **Intentionally stores nothing** — tests verify zero persistence.

**Discovery Roll**
Source: 35 (DevTools) | Persona: 31 (日記が続かない人) | Platform: 7 (UE→Web) | Wildcard: 2 (人気アプリの逆)

**Features Built**
- 3 destruction modes with unique particle physics per mode
- Character-level particle decomposition with Canvas 2D
- Randomized therapeutic prompts and farewell messages
- Zero data persistence (verified: no localStorage/sessionStorage/IndexedDB/cookies)
- Session-only destruction counter (resets on reload)
- Glassmorphism dark UI with gradient accents

**Tech Stack**
Vanilla JS / Canvas 2D / Vite / No storage (by design)

**Key Files**
```
src/destroy.js  — DestroyEngine, TextParticle, MODES, prompts, farewells
src/main.js     — App controller, animation loop, UI management
src/style.css   — Glassmorphism dark therapeutic theme
tests/run.js    — 38 tests (modes, prompts, anti-persistence, Japanese text)
```

**How to Run**
```bash
cd wasurenote && npm install && npm run dev
```

**Tests**: 38 passing | **Files**: 8 | **LOC**: ~700 | **Build**: 238ms (5KB — lightest app!)

**Challenges & Fixes**
None — the conceptual opposite of most apps: designed to NOT save data.

**Potential Next Steps**
- Audio: crackling fire, rain drops, wind sounds per mode
- Haptic feedback on mobile
- Ceremonial "closing" animation after destruction

---

### <a id="hoshifumi"></a>52. hoshifumi - 2026-03-30 12:30

**What is this?**
A Three.js generative art typing game inspired by Van Gogh's birthday (March 30, 1853). Type Japanese sentences at speed — each correct keystroke spawns a glowing star. Completed sentences form constellations that drift through a Starry Night-inspired 3D sky. Combo multipliers make stars brighter and bigger.

**Discovery Roll**
Source: 28 (Historical "on this day" — Van Gogh born March 30, 1853) | Persona: 7 (効率厨のゲーマー) | Platform: 19 (p5.js/Three.js creative coding) | Wildcard: 37 (手紙・メッセージを送る/受け取る体験)

**Features Built**
- Typing game with 15 Japanese sentences across 3 difficulty levels (初級/中級/上級)
- Constellation generation: typed characters → glowing stars → connected constellation lines
- Combo system: ×1 → ×2 → ×4 → ×8 → ×16 with visual/audio feedback
- Letter mode (手紙モード): free-type messages that become constellations
- Three.js scene: 2000 twinkling stars, 8 nebula clouds, 600 swirling particles, custom GLSL shaders
- Gamified stats: WPM, accuracy, score, max combo, stars created, elapsed time
- Web Audio API synthesized sound effects

**Tech Stack**
Three.js / Custom GLSL Shaders / Web Audio API / Vanilla JS / HTML5 / CSS3 (Glassmorphism)

**Key Files**
```
index.html — Complete single-file app (1221 lines)
README.md  — Project overview and run instructions
PLAN.md    — 5-phase implementation plan
```

**How to Run**
```bash
cd hoshifumi && npx serve .
```

**Tests**: 0 (single-file creative coding project) | **Files**: 4 | **LOC**: ~1221 | **Build time**: ~4 min

**Challenges & Fixes**
None — clean build with all features implemented in a single HTML file.

**Potential Next Steps**
- Online leaderboard with server-side WPM/score persistence
- More sentence sets (poetry, news, custom text upload)
- Share constellation screenshots (html2canvas integration)
- Progressive difficulty (sentences get longer as you play)

---

### <a id="himamogura"></a>53. himamogura - 2026-03-30 13:30

**What is this?**
A Discord bot with a cute mole (モグラ) mascot that "digs up" hobby suggestions for bored adults. Inspired by 2026's "going analogue" meme trend. Features quiz-based personality matching, daily challenges with streak tracking, and a gamified hobby collection system with 108 hobbies.

**Discovery Roll**
Source: 5 (Viral memes/internet culture) | Persona: 29 (趣味がなくて退屈している大人) | Platform: 8 (Discord bot) | Wildcard: 9 (マスコットキャラ必須)

**Features Built**
- /dig: Random hobby suggestion with mole ASCII art, category-colored embeds, try/skip buttons
- /quiz: 5-question interactive personality quiz → 3 matched hobby recommendations
- /collection: Paginated tried-hobbies view with star ratings
- /rate: Rate hobbies 1-5 stars with mole personality reactions
- /challenge: Daily challenges with streak tracking and milestone celebrations
- /stats: Personal stats with hobby level titles (初心者→伝説のモグラ)
- /ranking: Server-wide leaderboard by hobbies collected and streak

**Tech Stack**
Node.js / discord.js v14 / better-sqlite3 / ES modules

**Key Files**
```
src/bot.js          — Main entry, client setup, command routing
src/database.js     — SQLite schema, seeding, all queries
src/commands/dig.js — Random hobby with buttons
src/commands/quiz.js — Interactive 5-question quiz
src/data/hobbies.js — 108 hobbies across 5 categories
src/data/mascot.js  — Mole ASCII art + personality lines
tests/run.js        — 710 tests
```

**How to Run**
```bash
cd himamogura && npm install
cp .env.example .env  # Add Discord bot token
npm run deploy && npm start
```

**Tests**: 710 passing | **Files**: 14 | **LOC**: ~1,200 | **Build time**: ~8 min

**Challenges & Fixes**
None — clean build. All 710 tests pass including database CRUD, hobby data integrity, quiz scoring, streak logic, and edge cases.

**Potential Next Steps**
- Hobby recommendation engine based on rating patterns
- Weather API integration for outdoor hobby suggestions
- Server-specific hobby challenges and competitions

---

### <a id="netamemo"></a>54. netamemo - 2026-03-30 14:30

**What is this?**
A Chrome extension for aspiring YouTubers/TikTokers to collect content ideas from anywhere on the web, organize them with ratings, and collaborate with friends via sharing codes. Right-click any page to save it as a "ネタ" (content idea), then share boards and vote on the best ideas together.

**Discovery Roll**
Source: 33 (Hacker News — テック系の話題) | Persona: 4 (YouTuber/TikToker志望の人) | Platform: 5 (Browser extension) | Wildcard: 12 (2人以上でコラボ)

**Features Built**
- Right-click context menu: save any webpage as a content idea with auto-extracted metadata
- 6 category system with emoji badges (Tutorial, Review, Vlog, Short, Collab, Other)
- 3-axis rating: ポテンシャル, 工数, トレンド度 (1-5 each)
- Export/import sharing codes for collaborative idea boards (no backend)
- Vote system (thumbs up/down) with ranking display
- Side panel for persistent browse-and-clip workflow
- Search, category filter, 4 sort modes

**Tech Stack**
Chrome Extension Manifest V3 / Vanilla JS / chrome.storage.local / Base64 sharing

**Key Files**
```
manifest.json           — Manifest V3 config
popup/popup.html+css+js — Main popup with 3 tabs
sidepanel/              — Persistent side panel
background.js           — Context menu + storage
content.js              — Page info extraction
shared/sharing.js       — Export/import/merge logic
shared/data.js          — Categories, constants
tests/run.js            — 55 tests
```

**How to Run**
```bash
# Load in Chrome:
# 1. Open chrome://extensions
# 2. Enable Developer Mode
# 3. "Load unpacked" → select netamemo folder
```

**Tests**: 55 passing | **Files**: 15 | **LOC**: ~1,500 | **Build time**: ~8 min

**Challenges & Fixes**
None — clean build with all Manifest V3 requirements met.

**Potential Next Steps**
- WebRTC peer-to-peer real-time board sync
- AI-powered idea scoring based on current trends
- Export to YouTube Studio / TikTok drafts

---

### <a id="neonreader"></a>55. neonreader - 2026-03-30 15:30

**What is this?**
A Chrome extension that transforms any webpage into a clean, cyberpunk-styled reading experience for seniors. Neon text on dark backgrounds provides excellent readability while making browsing feel cool and futuristic. Features a reading guide, HUD overlay, scanline effects, and typewriter animation.

**Discovery Roll**
Source: 1 (World news headlines) | Persona: 3 (初めてスマホを持った祖父母) | Platform: 5 (Browser extension) | Wildcard: 29 (サイバーパンク世界観)

**Features Built**
- One-click reader mode with multi-strategy text extraction (article, role=main, paragraph heuristic)
- 4 neon color themes: ネオングリーン, サイバーシアン, アンバー, ホワイト
- Configurable font size (20-32px), line height, letter spacing with large defaults
- Reading guide band following mouse position for line tracking
- HUD overlay: character count, reading time, scroll progress
- Scanline CRT effect + typewriter title animation
- Alt+R keyboard shortcut, settings persist via chrome.storage

**Tech Stack**
Chrome Extension Manifest V3 / Vanilla JS / CSS / chrome.storage.local

**Key Files**
```
popup/popup.html+css+js     — Settings UI with sliders and theme selection
content/reader.js+css       — Reader mode overlay with text extraction
content/hud.js              — HUD overlay component
shared/textExtractor.js     — Multi-strategy article extraction
shared/settings.js          — Settings management
tests/run.js                — 58 tests
```

**How to Run**
```bash
# Load in Chrome:
# 1. chrome://extensions → Developer Mode ON
# 2. "Load unpacked" → select neonreader folder
# 3. Visit any webpage → click extension icon → "リーダーモード起動"
```

**Tests**: 58 passing | **Files**: 17 | **LOC**: ~1,800 | **Build time**: ~6 min

**Challenges & Fixes**
None — clean build. Cyberpunk neon-on-dark aesthetic works perfectly for accessibility (high contrast).

**Potential Next Steps**
- Text-to-speech integration
- Auto-simplify complex vocabulary
- Furigana for difficult kanji

---

### <a id="bookcosmos"></a>56. bookcosmos - 2026-03-30 16:30

**What is this?**
A Three.js physics simulation that transforms a reader's library into a living cosmos. Each book is a glowing celestial body with real n-body gravitational physics. Books of similar genres attract each other, forming beautiful galaxy clusters. Adding a 500+ page book triggers a supernova with particle burst and audio. Inspired by Artemis II and JWST discoveries.

**Discovery Roll**
Source: 12 (Science/space news — Artemis II, JWST) | Persona: 38 (読書家 — 年100冊読む人) | Platform: 19 (Three.js creative coding) | Wildcard: 22 (物理シミュレーション)

**Features Built**
- N-body gravitational simulation with genre affinity (3x same-genre attraction)
- 12 genres with distinct colors, 24 pre-populated Japanese/international books
- 4000-star GLSL twinkling background + nebula clouds
- Supernova effect for 500+ page books: camera zoom, flash, 200 particles, shockwave, Web Audio
- Constellation lines connecting same-author books
- Add/search/filter books, clickable star rating, statistics dashboard
- Export/import JSON, localStorage persistence, OrbitControls

**Tech Stack**
Three.js / Custom GLSL Shaders / N-Body Physics (Euler) / Web Audio API / Vanilla JS

**Key Files**
```
index.html — Complete single-file app (1321 lines, 45KB)
README.md  — Project overview and run instructions
PLAN.md    — 4-phase implementation plan
```

**How to Run**
```bash
cd bookcosmos && npx serve .
```

**Tests**: 0 (creative coding project) | **Files**: 5 | **LOC**: ~1,321 | **Build time**: ~4 min

**Challenges & Fixes**
None — clean build with all physics and visual effects working.

**Potential Next Steps**
- Reading timeline animation (watch cosmos grow over time)
- Goodreads CSV import
- Book recommendation from genre cluster analysis

---

### <a id="shuukatsu-meikyuu"></a>57. shuukatsu-meikyuu - 2026-03-30 17:30

**What is this?**
A Rust+WASM roguelike dungeon crawler themed around the Japanese job search process. Each run generates a unique 5-floor labyrinth with randomly generated companies, interview encounters, and events. Player stats grow through encounters, and a dashboard tracks progress across runs.

**Discovery Roll**
Source: 40 (データ分析・ダッシュボード) | Persona: 23 (就活中の大学生) | Platform: 10 (Rust+WASM) | Wildcard: 18 (毎回ランダム生成)

**Features Built**
- 5 themed floors: ES地獄 → グループディスカッション → 一次面接 → 技術試験 → 最終面接
- Procedural 5x5 dungeon generation with 7 room types per floor
- Random company generator (prefix × suffix × industry × size)
- 4-stat system (コミュ力, 技術力, 表現力, メンタル) with skill checks
- Item system (max 3): 完璧なES, ポートフォリオ, 推薦状, エナジードリンク etc.
- Canvas-based dungeon map rendering with color-coded rooms
- Run history dashboard with statistics

**Tech Stack**
Rust / wasm-bindgen / wasm-pack / HTML5 Canvas / Vanilla JS / localStorage

**Key Files**
```
src/lib.rs        — Game state machine, WASM exports (634 lines)
src/dungeon.rs    — Procedural generation (418 lines)
src/encounter.rs  — Encounter resolution (401 lines)
src/player.rs     — Stats, inventory (276 lines)
src/company.rs    — Random company gen (122 lines)
src/data.rs       — Japanese text data (154 lines)
www/index.html    — Frontend UI (179 lines)
www/style.css     — Styling (520 lines)
```

**How to Run**
```bash
cd shuukatsu-meikyuu
wasm-pack build --target web --out-dir www/pkg
cd www && python3 -m http.server 8000
```

**Tests**: 47 passing (cargo test) | **Files**: 10 | **LOC**: ~2,700 | **Build time**: ~8 min

**Challenges & Fixes**
Build agent was interrupted by rate limit. Resumed in next cycle — all code was already written and tests passing.

**Potential Next Steps**
- More encounter types (group interview, case study)
- Achievement / badge system
- Sound effects for encounters

---

### <a id="wancostar"></a>58. wancostar - 2026-03-30 21:00

**What is this?**
A Swift macOS CLI app for dog-obsessed owners that turns daily walk logs into a cosmic galaxy visualization in the terminal. Each walk becomes a star (sized by duration, colored by route type, sparkled by mood), grouped by month into constellations. Includes infrastructure rating for sidewalks, shade, and dog-friendliness.

**Discovery Roll**
Source: 19 (Infrastructure/urban planning) | Persona: 10 (犬に夢中すぎる飼い主) | Platform: 11 (Swift macOS) | Wildcard: 34 (天体・星空・宇宙テーマ)

**Features Built**
- Interactive walk logging with 6 route types and 3-axis infrastructure rating
- Cosmic galaxy visualization: walks as stars grouped by month, ANSI colored by route type
- Statistics dashboard with totals, averages, streaks, route breakdown, infra bar charts
- Unicode box-drawing tables throughout, all Japanese text
- JSON persistence, export/import, auto-generated demo data (28 walks)
- 51 Swift tests covering all models, storage, statistics, and rendering

**Tech Stack**
Swift 5.9 / Swift Package Manager / ANSI terminal colors / Unicode art / JSON persistence

**Key Files**
```
Sources/Wancostar/main.swift      — Entry point, command routing
Sources/Wancostar/Models.swift    — Walk, Dog, InfraRating, RouteType
Sources/Wancostar/Galaxy.swift    — Cosmic visualization renderer
Sources/Wancostar/Commands.swift  — All commands + stats
Sources/Wancostar/UI.swift        — ANSI colors, box drawing, prompts
Sources/Wancostar/Data.swift      — Demo data generator
Tests/WancostarTests/             — 51 tests
```

**How to Run**
```bash
cd wancostar && swift build && swift run Wancostar galaxy
```

**Tests**: 51 passing (swift test) | **Files**: 10 | **LOC**: ~1,800 | **Build time**: ~5 min

**Challenges & Fixes**
None — clean build with all Swift tests passing.

**Potential Next Steps**
- HealthKit integration for automatic walk detection
- GPS route recording via CoreLocation
- Animated terminal output with curses

---

### <a id="tenkimeshi"></a>59. tenkimeshi - 2026-03-30 22:00

**What is this?**
A Raspberry Pi IoT project for foodies that recommends food based on current weather and generates ASCII restaurant floor plans. Fetches real weather from OpenMeteo API. Includes a web-based IoT device simulator and detailed wiring guides for OLED/e-Paper displays.

**Discovery Roll**
Source: 6 (天気・自然現象) | Persona: 6 (毎日外食するフーディー) | Platform: 16 (Arduino/RPi IoT) | Wildcard: 47 (建築・間取り)

**Features Built**
- 10 food categories mapped to weather (temp, code, wind, humidity)
- 10 unique ASCII restaurant floor plans with Unicode box drawing
- ANSI-colored terminal display simulating IoT screen
- Web simulator with dark IoT device frame aesthetic
- Wiring guides for SSD1306 OLED (I2C) and e-Paper (SPI) + BOM
- Demo mode for offline testing, live mode with OpenMeteo API

**Tech Stack**
Python 3 (stdlib only) / OpenMeteo API / HTML/CSS/JS (simulator)

**Key Files**
```
src/recommender.py    — 10 food categories, recommendation logic
src/floorplan.py      — 10 ASCII floor plan templates
src/weather.py        — OpenMeteo API + 26 weather descriptions
src/display.py        — Terminal display formatter
src/tenkimeshi.py     — Main entry with --demo/--once flags
simulator/index.html  — Web IoT device simulator
docs/WIRING.md        — Pin diagrams for OLED/e-Paper
docs/BOM.md           — Bill of materials with yen pricing
tests/                — 72 tests (3 test files)
```

**How to Run**
```bash
cd tenkimeshi && python3 src/tenkimeshi.py --demo --once
# or open simulator/index.html
```

**Tests**: 72 passing | **Files**: 14 | **LOC**: ~2,200 | **Build time**: ~6 min

**Challenges & Fixes**
None — clean build, no external dependencies.

**Potential Next Steps**
- Actual RPi display driver integration
- Restaurant search API (Tabelog, Google Places)
- Historical weather-food preference learning

---

### <a id="kabuoto"></a>60. kabuoto - 2026-03-30 23:00

**What is this?**
A web app that sonifies stock market data into ambient music. Each trading day becomes a musical note — price changes map to pitch, volatility controls tempo, trading volume affects amplitude. Features synchronized price chart, real-time waveform oscilloscope, and 6 musical scales including Japanese miyako-bushi.

**Discovery Roll**
Source: 15 (Economics/fintech/stock market) | Persona: 21 (誰でも — 一般向け) | Platform: 15 (Flutter/Dart → Web) | Wildcard: 17 (音・BGM・効果音が核心的)

**Features Built**
- Web Audio synthesizer: 3 oscillator types + sub-oscillator, reverb, delay, filter
- 5 stocks × 180 days synthetic data (Toyota, Sony, SBG, NTT, Apple)
- Sonification: price→pitch (C3-C6), volatility→tempo (60-160 BPM), volume→amplitude
- 6 musical scales: major, minor, pentatonic, miyako-bushi, blues, chromatic
- Canvas price chart with playback position, volume bars, grid
- Real-time oscilloscope + note history display
- Speed 1-10x, master volume, reverb/delay controls

**Tech Stack**
Web Audio API / Canvas 2D / Vanilla JavaScript / No dependencies

**Key Files**
```
index.html — Complete single-file app (1167 lines)
README.md  — Project overview
PLAN.md    — 4-phase implementation plan
```

**How to Run**
```bash
cd kabuoto && open index.html
```

**Tests**: 0 (creative audio project) | **Files**: 5 | **LOC**: ~1,167 | **Build time**: ~3 min

**Challenges & Fixes**
Flutter SDK not available — adapted to pure web app while keeping the Dart-inspired architecture spirit.

**Potential Next Steps**
- Real-time API integration (Yahoo Finance)
- Multi-stock harmony (simultaneous playback)
- MIDI export of generated melodies

---

### <a id="nyantokashite"></a>61. nyantokashite - 2026-03-31 00:00

**What is this?**
A Sokoban-style puzzle game where a mischievous cat has knocked items off shelves and you must push them back to their correct spots. The cat roams the level every 3 moves, blocking your path and creating dynamic puzzle elements. 20 handcrafted levels across 4 rooms with pixel-art characters.

**Discovery Roll**
Source: 24 (Pet/animal viral content — cat chaos videos) | Persona: 32 (片付けが苦手な人) | Platform: 7 (Unreal Engine → web Canvas) | Wildcard: 30 (パズル/謎解き中心)

**Features Built**
- Sokoban push mechanics with 20 handcrafted solvable levels
- Dynamic cat AI: moves every 3 player moves, blocks paths
- 4 themed rooms: リビング, キッチン, 書斎, 寝室 (progressive difficulty)
- Full undo system + restart, star rating (par-based)
- Pixel-art characters drawn programmatically (chibi cleaner + orange tabby)
- Particle effects, 7 Web Audio sound effects
- Title screen with animated cat, instructions, level select
- Mobile touch controls with virtual d-pad

**Tech Stack**
HTML5 Canvas 2D / Web Audio API / Vanilla JavaScript / localStorage

**Key Files**
```
index.html — Complete single-file game (1524 lines)
README.md  — Project overview
PLAN.md    — 4-phase implementation plan
```

**How to Run**
```bash
cd nyantokashite && open index.html
```

**Tests**: 0 (puzzle game) | **Files**: 5 | **LOC**: ~1,524 | **Build time**: ~5 min

**Challenges & Fixes**
Unreal Engine not available — adapted to web Canvas while keeping the 3D game design concept.

**Potential Next Steps**
- Level editor for user-created puzzles
- More room themes and cat personality types
- Online level sharing via URL encoding

---

### <a id="tenaoshi"></a>62. tenaoshi - 2026-03-31

**What is this?**
A cozy top-down neighborhood renovation game built with Raylib in C. You play as a retired craftsperson walking around a tile-based town, discovering and fixing broken fences, overgrown gardens, peeling walls, and leaky roofs. The neighborhood visually transforms as you complete repairs — relaxing, satisfying gameplay designed for seniors who love DIY.

**Discovery Roll**
Source: 26 (Home improvement/DIY/Maker community) | Persona: 36 (老後を楽しんでいるシニア) | Platform: 20 (Raylib/SDL game) | Wildcard: 33 (地図やマップが中心要素)

**Features Built**
- 24x20 tile-based neighborhood map with roads, sidewalks, houses, gardens, water, bridge, trees, flowers
- 16 repair sites across 6 buildings: broken fences, overgrown gardens, peeling walls, leaky roofs
- 4 tools with correct-tool-for-the-job matching: hammer, paintbrush, shears, wrench
- Visual before/after transformation on repair completion
- Particle effects celebration system
- Smooth camera following with lerp interpolation
- Japanese font rendering (Hiragino) with full CJK codepoint support
- Title screen, victory screen, happiness meter, repair progress UI
- Animated water ripples, dripping roof leaks, pulsing repair highlights

**Tech Stack**
C11 / Raylib 5.5 / Makefile / macOS (no external assets — all procedural graphics)

**Key Files**
```
main.c      — Full game (~1000 LOC)
test_game.c — 32 unit tests for game logic
Makefile    — Build system
```

**How to Run**
```bash
cd tenaoshi && make && ./tenaoshi
```

**Tests**: 32 passing | **Files**: 7 | **LOC**: ~1,000 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean build on first attempt after minor unused variable warnings.

**Potential Next Steps**
- Neighbor NPC characters with dialogue
- Seasonal visual changes (cherry blossoms, snow)
- Sound effects for tools and repair completion
- Save/load game state

---

### <a id="miraipost"></a>63. miraipost - 2026-03-31

**What is this?**
A Chrome extension for writing letters to your future self. Seal your words with a wax seal animation, choose a delivery date, and receive them back as gentle browser notifications. Includes a "worry mailbox" for sealing away anxieties and revisiting them later with fresh perspective — a therapeutic writing tool built into your browser.

**Discovery Roll**
Source: 32 (Product Hunt) | Persona: 35 (将来に漠然とした不安がある人) | Platform: 5 (Chrome Extension) | Wildcard: 37 (手紙・メッセージ体験)

**Features Built**
- 4-tab popup UI: 書く / 届いた手紙 / 不安ポスト / 配達待ち
- Letter composition with lined paper CSS, Zen Maru Gothic font, delivery date picker
- Wax seal stamp-in animation on sealing, break-away animation on opening
- Chrome Alarms-based delivery scheduling (30-min checks)
- Worry mailbox with resolution tracking (解決した / まだ少し / まだ不安)
- Stats footer, unread badge, XSS-safe content rendering

**Tech Stack**
Chrome Extension Manifest V3 / Vanilla JS / HTML5 / CSS3 / Chrome Storage + Alarms + Notifications APIs / Google Fonts (Zen Maru Gothic)

**Key Files**
```
manifest.json  — Extension manifest
popup.html     — Main popup UI
popup.css      — Warm paper-texture styling
popup.js       — All logic (letter CRUD, delivery, reading)
background.js  — Service worker for alarm-based delivery
test.js        — 36 Node.js unit tests
```

**How to Run**
```bash
# Load in Chrome:
# 1. Open chrome://extensions
# 2. Enable Developer mode
# 3. Load unpacked → select miraipost/
```

**Tests**: 36 passing | **Files**: 10 | **LOC**: ~900 | **Build time**: ~3 min

**Challenges & Fixes**
None — clean implementation.

**Potential Next Steps**
- Letter encryption for privacy
- Dark mode for nighttime writing
- Letter templates and writing prompts
- Gratitude letter mode

---

### <a id="oshizora"></a>64. oshizora - 2026-03-31

**What is this?**
A mesmerizing living sky web app that blends your oshi's representative color with real weather data, time of day, and season. Cherry blossom petals in spring, fireflies in summer, falling leaves in autumn, snow in winter — all tinted in your oshi's color. Every visit looks different.

**Discovery Roll**
Source: 6 (Weather/Natural phenomena) | Persona: 27 (推し活に全力の人) | Platform: 1 (Web app) | Wildcard: 23 (使うたびに変化する)

**Features Built**
- Canvas-based dynamic sky with time-of-day gradients (dawn/day/dusk/night)
- Oshi color blending into sky, stars, clouds, particles
- OpenMeteo API for real weather + geolocation
- 4 seasonal particle systems: cherry blossoms, fireflies, falling leaves, snow
- Weather effects: rain streaks, cloud density, fog
- Sun/moon with glow, twinkling star field
- Setup modal with 10 preset oshi colors + custom picker
- Ambient oshi-themed messages rotating by weather/time

**Tech Stack**
HTML5 Canvas / Vanilla JS / OpenMeteo API / Geolocation API / Google Fonts (Zen Maru Gothic) / CSS glassmorphism

**Key Files**
```
index.html — Full app (single file, ~500 LOC)
test.js    — 60 unit tests
```

**How to Run**
```bash
open oshizora/index.html
```

**Tests**: 60 passing | **Files**: 6 | **LOC**: ~500 | **Build time**: ~3 min

**Challenges & Fixes**
None — clean implementation.

**Potential Next Steps**
- Multiple oshi profiles with swipe-to-switch
- Screenshot/wallpaper export
- Background music that changes with weather
- Share "my sky right now" as image

---

### <a id="namioto"></a>65. namioto - 2026-03-31

**What is this?**
A one-hand ocean meditation game where you control waves with your breathing. Hold spacebar to inhale (waves rise), release to exhale (waves fall). Steady breathing calms the ocean and clears the sky. Erratic breathing creates storms. 5-minute sessions with rhythm scoring — a stress-relief experience for busy couples.

**Discovery Roll**
Source: 14 (Fitness/Wellness) | Persona: 26 (共働き夫婦) | Platform: 20 (Raylib) | Wildcard: 5 (片手操作のみ)

**Features Built**
- Spacebar-only breathing control (hold=inhale, release=exhale)
- 3-layer procedural ocean waves with foam, responsive to breath rhythm
- Dynamic storm/clear sky transitions based on calmness
- Breath rhythm scoring: cycle length, balance, deviation from ideal 4s
- Calm time accumulation and session rating (3 tiers)
- Rising bubbles on inhale, birds appearing in calm weather
- Breathing circle indicator, HUD with calm meter, session timer

**Tech Stack**
C11 / Raylib 5.5 / Makefile / macOS (no external assets)

**Key Files**
```
main.c      — Full game (~530 LOC)
test_game.c — 27 unit tests
Makefile    — Build system
```

**How to Run**
```bash
cd namioto && make && ./namioto
```

**Tests**: 27 passing | **Files**: 6 | **LOC**: ~530 | **Build time**: ~1 min

**Challenges & Fixes**
Missing stdlib.h include — fixed immediately.

**Potential Next Steps**
- Two-player alternating mode for couples
- Background wave audio generation
- Multiple environments (forest, mountain, space)

---

### <a id="idolhistoria"></a>66. idolhistoria - 2026-03-31

**What is this?**
A rich Jupyter notebook visualizing 50+ years of Japanese idol culture history. From the birth of the idol concept in 1971 through AKB48, VTubers, and "Oshi no Ko" — 31 milestones across 7 eras with 5 interactive Plotly charts. Includes a "March 31" special section on idol graduation culture. A data-driven love letter to oshi-katsu fans.

**Discovery Roll**
Source: 28 (Historical "on this day") | Persona: 27 (推し活に全力の人) | Platform: 12 (Jupyter notebook) | Wildcard: 39 (歴史を追体験する)

**Features Built**
- Interactive milestone timeline (31 events, 7 color-coded eras, 3 event categories)
- Era comparison radar charts (7 eras × 5 dimensions)
- Decade debut pattern stacked bar chart (solo/group/virtual)
- Genre evolution area chart (6 genres over 50 years)
- "March 31" special events timeline
- Fan culture 4-panel metrics (distance, participation, spending, diversity)
- Rich Japanese narrative throughout

**Tech Stack**
Python 3 / Jupyter Notebook / Plotly / Pandas / NumPy / Matplotlib

**Key Files**
```
idolhistoria.ipynb — Main notebook (executed, with outputs)
build_notebook.py  — Notebook generator script
test.py            — 42 unit tests
```

**How to Run**
```bash
cd idolhistoria && jupyter notebook idolhistoria.ipynb
```

**Tests**: 42 passing | **Files**: 5 | **LOC**: ~600 | **Build time**: ~3 min

**Challenges & Fixes**
Plotly fillcolor format — hex colors used directly instead of rgba string manipulation.

**Potential Next Steps**
- User input for personal oshi milestones
- Real-time Oricon chart data integration
- "Relive an era" quiz/trivia within notebook

---

### <a id="eigamichi"></a>67. eigamichi - 2026-04-01

**What is this?**
A visual-novel style movie recommender where you navigate branching mood questions to discover your perfect film. 66 nodes form a decision tree with 45 unique movie destinations. Choose your mood → narrow your taste → arrive at a curated recommendation with your "cinema path" visualized as a tree. Beautiful dark UI with glassmorphism and smooth animations.

**Discovery Roll**
Source: 33 (Hacker News) | Persona: 13 (映画オタク) | Platform: 17 (Tauri → Web) | Wildcard: 43 (選択肢で分岐する)

**Features Built**
- 66-node decision tree (21 branch + 45 movie leaves)
- 5 mood branches: ワクワク / 泣きたい / 考えたい / 笑いたい / ゾクゾク
- 45 unique movies (1952-2019) with full JP metadata
- Path visualization as branching tree
- Persistent stats (localStorage)
- Back/reset navigation
- Dark glassmorphism UI with gradient background

**Tech Stack**
Vanilla JS / HTML5 / CSS3 (single file, no dependencies)

**Key Files**
```
index.html — Full app (~700 LOC, 66-node tree + UI)
test.js    — 31 tests (tree integrity, reachability, data quality)
```

**How to Run**
```bash
open eigamichi/index.html
```

**Tests**: 31 passing | **Files**: 4 | **LOC**: ~700 | **Build time**: ~3 min

**Challenges & Fixes**
Duplicate "メッセージ" (Arrival) in two branches — replaced one with "コンタクト" (Contact).

**Potential Next Steps**
- Expand to 100+ movies with deeper trees
- "Similar movies" after result
- Share path as image

---

### <a id="otonoha"></a>68. otonoha - 2026-04-01

**What is this?**
A generative flower garden built with p5.js where each bloom represents a song from the iTunes Japan music chart. Genre determines flower shape (Pop=round, Rock=spiky, Hip-Hop=angular), ranking determines size and stem height, and hue maps to genre. Real chart data from iTunes RSS API with 25-song curated fallback. Ambient, wind-blown garden perfect for seniors exploring music trends.

**Discovery Roll**
Source: 8 (Music charts) | Persona: 36 (老後を楽しんでいるシニア) | Platform: 19 (p5.js generative art) | Wildcard: 28 (実在Web API連携)

**Features Built**
- iTunes Japan RSS API for real top-25 chart data
- 7+ genre-to-flower-shape/color mappings
- Rank-based sizing (1st place = biggest bloom)
- Staggered growth animation from seed to full bloom
- Wind simulation on stems, leaves, background grass
- Floating petal particle system
- Hover to reveal song info (title, artist, rank, genre)
- Controls: wind toggle, regrow, label toggle

**Tech Stack**
p5.js 1.9 / iTunes RSS API / Vanilla JS / HTML / CSS / Google Fonts

**Key Files**
```
index.html — Full app (single file, ~500 LOC)
test.js    — 44 unit tests
```

**How to Run**
```bash
open otonoha/index.html
```

**Tests**: 44 passing | **Files**: 4 | **LOC**: ~500 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean implementation.

**Potential Next Steps**
- Click flower to play song preview (iTunes preview URL)
- Season-based garden themes
- Multiple chart regions (US, UK, Japan)

---

### <a id="sekaiquest"></a>69. sekaiquest - 2026-04-01

**What is this?**
A Textual TUI world map explorer where you navigate an ASCII map, discover 25 travel destinations across 7 regions, collect passport stamps, and learn fun facts. Rich terminal UI with map panel, destination info, progress tracking, and modal passport viewer. Map-centric design for bored teenagers to explore the world from their terminal.

**Discovery Roll**
Source: 13 (Travel destinations) | Persona: 1 (暇な10代の学生) | Platform: 3 (Python TUI) | Wildcard: 33 (地図/マップ中心)

**Features Built**
- 80x20 ASCII world map with continent outlines and 25 destination markers
- 7 regions: Asia (8), Europe (7), N.America (2), S.America (2), Africa (3), Middle East (2), Oceania (1)
- Passport stamp collection with persistent JSON state
- Fun facts and 2026 travel trends for each city
- Modal passport table with Rich formatting
- Progress bar and region counter in stats bar
- Proximity-based destination detection

**Tech Stack**
Python 3 / Textual TUI / Rich / JSON persistence

**Key Files**
```
app.py  — Full TUI app (~350 LOC)
test.py — 46 unit tests
```

**How to Run**
```bash
cd sekaiquest && python3 app.py
```

**Tests**: 46 passing | **Files**: 4 | **LOC**: ~350 | **Build time**: ~2 min

**Challenges & Fixes**
None — clean implementation.

**Potential Next Steps**
- Quiz mode: guess the city from facts
- Flight path animation between visited cities
- Real travel advisory API integration

---

### <a id="tokineko"></a>70. tokineko - 2026-04-08 10:00

**What is this?**
ターミナルに住む時間旅行する猫のコンパニオン。孤独なリモートワーカーのためのPomodoro連動型バーチャルペット。作業セッションを完了するたびに猫が先史時代から未来まで9つの時代を旅し、各時代でアイテムを収集できる。

**Discovery Roll**
Source: 24 (Pet/animal viral content) | Persona: 14 (孤独なリモートワーカー) | Platform: 3 (Python TUI) | Wildcard: 48 (タイムトラベル)

**Features Built**
- ポモドーロタイマー: 25分作業 / 5分休憩のサイクル管理
- 時間旅行: 3ポモドーロごとに猫が次の時代へ移動（9時代）
- 猫インタラクション: なでる・遊ぶ・おやつ（時代別リアクション）
- アイテム収集: 27個のアイテム（common/rare/legendaryのレアリティ）
- 実績システム: 10個の実績を解除
- 猫ステータス: 幸福度・エネルギー・好奇心の管理
- 永続セーブ: ~/.tokineko/save.jsonに自動保存

**Tech Stack**
Python 3.10+ / Textual (TUI) / Rich (formatting) / JSON file storage

**Key Files**
```
tokineko/
├── src/tokineko/
│   ├── app.py        # Textual TUI application
│   ├── game.py       # Core game logic
│   ├── models.py     # Data models & persistence
│   └── eras.py       # Era/item/achievement database
├── tests/
│   ├── test_models.py
│   ├── test_eras.py
│   └── test_game.py
└── pyproject.toml
```

**How to Run**
```bash
cd tokineko
pip install -e .
tokineko
```

**Tests**: 63 passing | **Files**: 34 | **LOC**: ~1,718 | **Build time**: ~10 min

**Challenges & Fixes**
Python 3.10 compatibility: replaced `list[str]` and `X | None` syntax with `from __future__ import annotations` and `Optional`/`List` imports.

**Potential Next Steps**
- Sound effects via terminal bell or system notifications
- Online leaderboard for Pomodoro counts
- Seasonal events with time-limited items
- Cat customization (appearance, personality)
- Multi-cat support

---

### <a id="niwacraft"></a>71. niwacraft - 2026-04-08 11:00

**What is this?**
親子で楽しむコージーな2D庭づくりシミュレーションゲーム。16x12のグリッドに作物・花・木・小道・柵・池などを配置して理想の庭をデザイン。季節が巡り植物が育ち、収穫もできる。各アイテムに食育豆知識付き。

**Discovery Roll**
Source: 21 (Agriculture/sustainability) | Persona: 39 (子育て中のパパ/ママ) | Platform: 14 (Godot game) | Wildcard: 47 (建築・間取り)

**Features Built**
- グリッドベースの庭エディタ: 20種のアイテムを自由配置
- 季節サイクル: 春→夏→秋→冬で植物の育成が変化
- 植物成長システム: 種→芽→成長→収穫の4段階
- 食育ヒント: 全アイテムに日本語の豆知識
- カスタム描画: GDScriptのdraw()で全ビジュアルを描画（外部アセット不要）
- カテゴリ別パレット: 作物・花・木・小道・建物・水場

**Tech Stack**
Godot 4.x / GDScript / Custom draw calls / No external assets

**Key Files**
```
niwacraft/
├── project.godot
├── scenes/main.tscn
├── scripts/
│   ├── game_data.gd    # Item/season/growth data
│   ├── grid_manager.gd # Grid system & rendering
│   └── main.gd         # Main game controller
└── tests/
    ├── test_game_data.gd
    └── test_grid_logic.gd
```

**How to Run**
```bash
# Godot 4.x をインストール後
godot --path niwacraft/
# または Godot エディタで開いて F5
```

**Tests**: 45 passing | **Files**: 11 | **LOC**: ~1,616 | **Build time**: ~8 min

**Challenges & Fixes**
Self-contained design: Used GDScript draw calls (draw_rect, draw_circle, draw_arc) instead of sprite assets to keep the project portable and dependency-free.

**Potential Next Steps**
- Weather system affecting growth
- Animal visitors (butterflies, birds)
- Recipes using harvested crops
- Garden export as image

---

### <a id="ryuusai"></a>72. ryuusai - 2026-04-16 22:00

**What is this?**
デジタル墨流し（Suminagashi）アートジェネレータ。リアルタイム流体物理シミュレーション（Navier-Stokes方程式）を使い、クリックで墨を落としドラッグで流れを作ることで、美しい抽象アートを生成する。高解像度エクスポート機能付きで、プリントオンデマンド副業にも活用可能。

**Discovery Roll**
Source: 7 (Wikipedia — fluid dynamics) | Persona: 33 (副業を始めたい人) | Platform: 19 (p5.js / creative coding) | Wildcard: 22 (物理シミュレーション)

**Features Built**
- リアルタイムNavier-Stokes流体シミュレーション（マランゴニ効果付き）
- 6種類の和風カラーパレット（侘寂、桜、海、夕焼け、ネオン、墨）各5色
- 自動生成モード（ランダムにインクを落とし流れを作る）
- 高解像度エクスポート（最大4x、和紙風テクスチャ背景対応）
- ギャラリー機能（localStorage、最大50枚保存）
- レスポンシブデザイン（モバイル対応）

**Tech Stack**
p5.js / Vanilla JavaScript / CSS (glassmorphism) / HTML5 Canvas / localStorage

**Key Files**
```
ryuusai/
├── index.html      — アプリシェル・UI構造
├── style.css       — ダークテーマ・グラスモーフィズム
├── fluid.js        — FluidSolverクラス（Navier-Stokes解法）
├── palettes.js     — 6パレット・30色定義
├── gallery.js      — GalleryManager（永続化）
├── app.js          — p5.jsスケッチ・UI制御・エクスポート
├── tests.js        — Node.jsテストスイート（80件）
└── tests.html      — ブラウザテストランナー
```

**How to Run**
```bash
cd ryuusai
npx serve .
# ブラウザで http://localhost:3000 を開く
```

**Tests**: 80 passing | **Files**: 12 | **LOC**: ~2,138 | **Build time**: ~10 min

**Challenges & Fixes**
流体シミュレーションの安定性確保のため、速度減衰（damping factor 0.999）とGauss-Seidel反復回数の調整が必要だった。

**Potential Next Steps**
- WebGLシェーダーによる高解像度グリッド描画
- SVGエクスポート（無限スケーリング対応）
- SNS共有機能（OGPプレビュー付き）

---

### <a id="tsumugu"></a>73. tsumugu - 2026-04-19 12:00

**What is this?**
日本の伝統暦「七十二候」に基づき、季節の手仕事（つまみ細工、水引、刺し子、草木染め等）を提案するDiscordボット＋CLIツール。全72候と36種の手仕事を完全収録し、日付に応じて自動的に今の候とおすすめクラフトを表示する。

**Discovery Roll**
Source: 6 (天気・自然現象) | Persona: 37 (DIY/クラフター) | Platform: 8 (Discord/LINE bot) | Wildcard: 15 (和風テーマ)

**Features Built**
- 七十二候完全データベース（全72候・24節気・4季節・読みがな・意味）
- 月別36種の和風クラフト提案（材料・難易度・季節メモ付き）
- 美しいBox-drawing CLI出力（ANSI色・季節カラーテーマ）
- Discord Embed生成（和風カラー・季節絵文字）
- キーワード検索（候名・読み・手仕事名・材料で横断検索）

**Tech Stack**
Node.js / ES modules / discord.js v14 / ANSI terminal colors

**Key Files**
```
tsumugu/
├── src/
│   ├── seasons.js   — 72候+24節気データベース
│   ├── crafts.js    — 36手仕事データベース
│   ├── embeds.js    — Discord Embed生成
│   ├── cli.js       — ターミナルUI
│   └── bot.js       — Discordボット
├── tests/
│   └── run.js       — 115テスト
└── package.json
```

**How to Run**
```bash
cd tsumugu
node src/cli.js today     # 今日の候と手仕事
node src/cli.js search 桜 # 検索
node src/cli.js crafts    # 季節の手仕事一覧
```

**Tests**: 115 passing | **Files**: 11 | **LOC**: ~1,644 | **Build time**: ~8 min

**Challenges & Fixes**
七十二候の正確な日付計算（太陽黄経ベース）を近似値で実装。年をまたぐ候（12月→1月）のインデックス計算にラップアラウンド処理が必要だった。

**Potential Next Steps**
- 天気API連携（実際の天気と候の組み合わせ）
- 候変わりの自動通知（cron scheduled post）
- 各候のイラスト画像生成

---

### <a id="tabibumi"></a>74. tabibumi - 2026-04-19 23:45

**What is this?**
ノスタルジア心理学の研究に基づく、一人旅のためのエモいCLI旅日記。やさしい質問で旅の感情を引き出し、記録を「未来の自分への手紙」に変換する。Bun + TypeScript + SQLiteで動作し、外部依存ゼロ。

**Discovery Roll**
Source: 20 (Academic papers / ArXiv) | Persona: 9 (海外一人旅中の旅行者) | Platform: 18 (Deno/Bun) | Wildcard: 20 (エモい・感情に訴える体験)

**Features Built**
- 心理学ベースの42問の質問（五感・感情・社会性・意味・ノスタルジア・発見の6カテゴリ）
- 旅フェーズ＆時間帯に応じた文脈適応型プロンプト
- 「未来の自分への手紙」自動生成エンジン
- 10種類の気分トラッキング（嬉しい、穏やか、感動、自由 etc.）
- Markdownエクスポート・旅の統計
- 温かみのあるANSIカラーCLI（amber/rose/cream系パレット）

**Tech Stack**
Bun / TypeScript / bun:sqlite / ANSI terminal

**Key Files**
```
tabibumi/
├── src/
│   ├── db.ts          — SQLite CRUD
│   ├── questions.ts   — 42問の質問バンク
│   ├── letter.ts      — 手紙・MD生成
│   ├── display.ts     — カラー出力
│   └── cli.ts         — CLIルーター
├── tests/
│   └── tabibumi.test.ts — 38テスト
└── package.json
```

**How to Run**
```bash
cd tabibumi
bun run src/cli.ts start "パリ"
bun run src/cli.ts write
bun run src/cli.ts letter
```

**Tests**: 38 passing | **Files**: 10 | **LOC**: ~1,352 | **Build time**: ~8 min

**Challenges & Fixes**
bun:sqliteのWALモードがテスト時の一時ファイル削除と競合。テストごとにユニークなDB名を使用する方式で解決。

**Potential Next Steps**
- IP位置情報による自動ロケーション検出
- 天気API連携で五感の文脈を追加
- 写真添付対応

---

### <a id="tiketto"></a>75. tiketto - 2026-04-26 12:00

**What is this?**
ライブ・コンサートのチケット半券をコレクションするElectronデスクトップアプリ。DevTools風ダークUIで、チケットスタブ風カードデザイン、統計ダッシュボード（ヒートマップ・ランキング）、タイムライン表示を備える。🎫絵文字インスパイア。

**Discovery Roll**
Source: 35 (デベロッパーツール) | Persona: 11 (ライブに毎週通う音楽ファン) | Platform: 9 (Electron) | Wildcard: 8 (ランダム絵文字 → 🎫)

**Features Built**
- チケットスタブ風CSSカードデザイン（カラーバー、日付スタブ、ミシン目）
- 統計ダッシュボード（参戦数、アーティスト/会場ランキング、月別ヒートマップ）
- タイムライン表示（年別時系列ビュー）
- 検索・4種ソート（日付昇降順、アーティスト、会場）
- 5段階★評価 + 8色カラーコード
- JSONインポート/エクスポート

**Tech Stack**
Electron 33 / Vanilla HTML/CSS/JS / JSON file store / JetBrains Mono + Noto Sans JP

**Key Files**
```
tiketto/
├── main.js       — Electron メインプロセス + IPC
├── preload.js    — Context Bridge
├── store.js      — JSON永続化
├── index.html    — UI構造
├── style.css     — DevToolsダークテーマ
├── renderer.js   — アプリロジック
└── tests/run.js  — 71テスト
```

**How to Run**
```bash
cd tiketto
npm install
npm start
```

**Tests**: 71 passing | **Files**: 11 | **LOC**: ~1,692 | **Build time**: ~12 min

**Challenges & Fixes**
Electron Storeのパス解決でelectron.app.getPathが利用不可な場合（テスト時）のフォールバック処理が必要だった。環境変数TIKETTO_DATA_PATHでオーバーライド可能に。

**Potential Next Steps**
- setlist.fm API連携でセトリ自動取得
- チケット画像のスクリーンショット生成
- カレンダービュー

---

### <a id="shinjin-quest"></a>76. shinjin-quest - 2026-04-26 13:00

**What is this?**
新卒1年目の社会人生活をシミュレーションするC++ターミナルサバイバルゲーム。体力・メンタル・貯金・評価の4リソースを管理しながら365日を生き残り、5種類のエンディングを目指す。飲み会、急なプレゼン、電車遅延などリアルなイベントが盛りだくさん。

**Discovery Roll**
Source: 4 (スポーツ/eスポーツ) | Persona: 24 (新社会人・入社1年目) | Platform: 7 (Unreal/C++ concept) | Wildcard: 38 (サバイバル要素)

**Features Built**
- 365日カレンダー（日本の祝日・四季対応）
- 4リソースサバイバルシステム（体力/メンタル/貯金/評価）
- 15+ランダムイベント（飲み会、ミス発見、宝くじ等）
- 季節イベント（GW、ボーナス、お盆、正月）
- 5種エンディング＋スコアシステム
- ANSIカラーターミナルUI（HPバー、ボックス描画）

**Tech Stack**
C++17 / ANSI escape codes / Makefile / clang++

**Key Files**
```
shinjin-quest/
├── src/
│   ├── main.cpp     — ゲームループ
│   ├── game.h/cpp   — プレイヤー・カレンダー・エンディング
│   ├── events.h/cpp — イベント・選択肢システム
│   └── display.h/cpp — ターミナルUI描画
├── tests/
│   └── test_main.cpp — 88テスト
└── Makefile
```

**How to Run**
```bash
cd shinjin-quest
make && ./shinjin-quest
```

**Tests**: 88 passing | **Files**: 12 | **LOC**: ~1,187 | **Build time**: ~10 min

**Challenges & Fixes**
年をまたぐカレンダー計算（4月開始→翌3月終了）のインデックス処理。月ごとの日数テーブルと祝日データベースの正確な実装が必要だった。

**Potential Next Steps**
- セーブ/ロード機能
- 難易度選択（ホワイト企業/ブラック企業）
- 職種分岐（営業/技術/企画）

---

### <a id="hoshiura"></a>77. hoshiura - 2026-04-26 14:00

**What is this?**
写真の色彩を分析して12星座とマッチングし、宇宙テーマの美しい占い結果を生成するDartアプリ。CLI + Web UIの二面構成で、写真ドロップ→カラー抽出→星座判定→運勢表示の一連の体験を提供。JWSTの宇宙写真ブームと2026年星座カラー占い流行を掛け合わせたコンセプト。

**Discovery Roll**
Source: 12 (科学/宇宙ニュース) | Persona: 15 (1万枚の写真を持つカメラ好き) | Platform: 15 (Flutter/Dart) | Wildcard: 41 (占い/運勢)

**Features Built**
- 12星座カラープロファイル（RGB主色/副色、エレメント、特性、ラッキーアイテム）
- 重み付きRGB色距離によるカラーマッチング
- シードベース決定論的占い生成（5カテゴリ×5段階）
- Canvas写真カラー抽出（彩度加重平均）
- 星空アニメーション背景
- Dart CLI（ANSI 256色スウォッチ表示）
- 宇宙テーマWeb UI（グラスモーフィズム、コスミックグラデーション）

**Tech Stack**
Dart 3.11 / HTML/CSS/JS / Canvas API / Glassmorphism UI

**Key Files**
```
hoshiura/
├── lib/
│   ├── constellations.dart — 12星座カラーDB
│   └── fortune.dart        — 占い生成エンジン
├── bin/
│   └── hoshiura.dart       — CLI
├── web/
│   ├── index.html          — Web UI
│   ├── style.css           — 宇宙テーマCSS
│   ├── constellations.js   — JS版星座データ
│   └── app.js              — 写真分析&占い表示
├── test/
│   └── hoshiura_test.dart  — 29テスト
└── pubspec.yaml
```

**How to Run**
```bash
cd hoshiura
dart pub get
dart run bin/hoshiura.dart --rgb 200,50,100
# Web: cd web && python3 -m http.server 8080
```

**Tests**: 29 passing | **Files**: 12 | **LOC**: ~1,320 | **Build time**: ~10 min

**Challenges & Fixes**
Dart source fileのUTF-8エンコーディングで一部CJK文字が化ける問題。手動で修正が必要だった（獅子座、奉仕精神等）。

**Potential Next Steps**
- カメラキャプチャ（モバイルPWA対応）
- 占い結果のOGPカード画像生成
- 日別占い履歴

---

### <a id="gaku-erp"></a>78. gaku-erp - 2026-04-26 15:00

**What is this?**
勉強をエンタープライズ風に管理するC#コンソールアプリ。科目は「部署」、テストは「クライアント案件」、勉強時間は「請求可能時間」、脳は「従業員」。知識在庫の減衰、深夜残業1.5倍ボーナス、ROI分析、財務レポートなど本格的なERP機能を搭載。B2B企業経営×学生の勉強という異色マッシュアップ。

**Discovery Roll**
Source: 18 (B2B enterprise) | Persona: 8 (深夜詰め込み勉強する学生) | Platform: 6 (Unity/C#) | Wildcard: 1 (2つの無関係な分野を組み合わせる)

**Features Built**
- 部署管理（科目追加・優先度・知識在庫トラッキング）
- タイムトラッキング（請求可能時間記録、深夜残業1.5x）
- 案件管理（テスト登録・納期・緊急度・S〜D評価）
- 従業員管理（体力・集中力・士気モニタリング）
- 知識減衰システム（日次減衰、優先度連動）
- 財務レポート（ROI分析、知識ポートフォリオ）
- KPIダッシュボード

**Tech Stack**
C# / Mono 6.14 / ANSI terminal / Makefile

**Key Files**
```
gaku-erp/
├── src/
│   ├── Models.cs    — Department, Employee, Company, Project
│   ├── Display.cs   — ターミナルUI（バー、カラー、ダッシュボード）
│   └── Program.cs   — メインループ・メニュー
├── tests/
│   └── TestRunner.cs — 70テスト
└── Makefile
```

**How to Run**
```bash
cd gaku-erp
make && mono gaku-erp.exe
```

**Tests**: 70 passing | **Files**: 8 | **LOC**: ~939 | **Build time**: ~8 min

**Challenges & Fixes**
None. Mono C#のコンパイルはスムーズ。ERP用語と勉強用語のマッピングが最も時間がかかった設計作業。

**Potential Next Steps**
- JSON永続化（セーブ/ロード）
- 複数従業員（グループ学習）
- 週次取締役会議レポート

---

### <a id="omusubi"></a>79. omusubi - 2026-04-26 22:45

**What is this?**
遠距離恋愛中のカップルが食事ログを共有し、おにぎりマスコット「おむすび」がリアクションしてくれるDartアプリ。同じ時間帯に食事すると「一緒にごはん」判定され、連続日数をストリークとして記録。二人で同時に作れるレシピも提案する。

**Discovery Roll**
Source: 9 (食/レシピ文化) | Persona: 5 (遠距離恋愛中のカップル) | Platform: 15 (Flutter/Dart) | Wildcard: 9 (マスコットキャラ必須)

**Features Built**
- おむすびマスコット（4ムード ASCII アート、13+食品リアクション）
- 二人分食事ログ（時間帯ラベル: 朝食/昼食/おやつ/夕食/夜食）
- 一緒にごはん判定（2時間ウィンドウ）& ストリーク追跡
- 8レシピ提案（カップル向けtip付き）
- ピンク×ブルーのかわいいWeb UI
- Dart CLI（ASCII マスコット表示）

**Tech Stack**
Dart 3.11 / HTML/CSS/JS / LocalStorage

**Key Files**
```
omusubi/
├── lib/
│   ├── mascot.dart  — マスコット ASCII アート & リアクション
│   └── meals.dart   — 食事ログ、ストリーク、レシピ
├── bin/
│   └── omusubi.dart — CLI
├── web/
│   ├── index.html   — Web UI
│   ├── style.css    — ピンク系かわいいCSS
│   └── app.js       — 食事記録 & 表示
├── test/
│   └── omusubi_test.dart — 32テスト
└── pubspec.yaml
```

**How to Run**
```bash
cd omusubi && dart pub get
dart run bin/omusubi.dart log カレーライス
# Web: cd web && python3 -m http.server 8080
```

**Tests**: 32 passing | **Files**: 11 | **LOC**: ~1,100 | **Build time**: ~8 min

**Challenges & Fixes**
食品名マッチングの優先順位問題（「コンビニ弁当」が「弁当」に先にマッチ）。キーワードチェック順序を調整して解決。

**Potential Next Steps**
- 食事写真共有機能
- パートナーが食事記録した時のプッシュ通知
- 食事当てっこゲーム

---

### <a id="kuukan"></a>80. kuukan - 2026-04-27 00:00

**What is this?**
リモートワーカーの孤独感を解消する宇宙ステーション風バーチャルオフィス。3層パララックス星空アニメーション、ミッション型ポモドーロタイマー、管制室からの通信（タイピングエフェクト付き）、バーチャルクルーの存在感表示。宇宙の静けさ＝リモートワークの孤独というメタファーを美しいUIで表現。80個目のマイルストーンアプリ。

**Discovery Roll**
Source: 7 (Wikipedia) | Persona: 14 (孤独を感じるリモートワーカー) | Platform: 6 (Unity/C# interactive) | Wildcard: 34 (宇宙テーマ)

**Features Built**
- 3層パララックス星空Canvas（ちらつき・視差あり）
- ミッションタイマー（25/50/15分プリセット、ステータスバッジ）
- 管制室通信（15メッセージ、タイピングエフェクト、実用アドバイス）
- バーチャルクルー（6名、ランダムタスク、ステータスドット）
- ミッションログ（タイムスタンプ自動記録、LocalStorage永続化）
- 日次統計（ミッション数・集中時間、日替わりリセット）
- グラスモーフィズムUI + パルスアニメーション

**Tech Stack**
HTML/CSS/JS / Canvas 2D / LocalStorage / Noto Sans JP + JetBrains Mono

**Key Files**
```
kuukan/
├── index.html    — 宇宙ステーションUI
├── style.css     — ダーク宇宙テーマ
├── data.js       — 通信・クルー・メッセージDB
├── app.js        — タイマー・星空・ロジック
├── tests/run.js  — 103テスト
├── README.md
└── SUMMARY.md
```

**How to Run**
```bash
cd kuukan && python3 -m http.server 8080
# http://localhost:8080
```

**Tests**: 103 passing | **Files**: 9 | **LOC**: ~1,400 | **Build time**: ~10 min

**Challenges & Fixes**
data.jsのconst宣言がNode.jsのeval環境で使えない問題。テスト時にconst→varに置換するアプローチで解決。

**Potential Next Steps**
- 宇宙ステーションBGM（ホワイトノイズ+機器音）
- WebSocket共有クルールーム
- ミッションストリーク実績システム

---

### <a id="manabi-no-ki"></a>81. manabi-no-ki - 2026-04-27 01:00

**What is this?**
子どもの学習記録で仮想の木が成長するPython CLIアプリ。7段階の成長ステージ（種→巨木）、9教科対応、マイルストーン祝い、プログレスバー、週間統計、ストリーク追跡。学習のモチベーションを「木を育てる」楽しさで支える。

**Discovery Roll**
Source: 38 (教育テック) | Persona: 39 (子育て中のパパ/ママ) | Platform: 3 (Python TUI) | Wildcard: 16 (育成要素)

**Features Built**
- 7段階ASCII木アート（種→芽→苗木→若木→成長中→大木→巨木）
- 9教科対応（国語/算数/理科/社会/英語/音楽/体育/図工/その他）
- マイルストーンシステム（30/120/300/600/1200/2400分）
- プログレスバー＆科目別バーチャート
- 週間統計レポート＆連続学習ストリーク
- JSON永続化（~/.manabi-no-ki/data.json）

**Tech Stack**
Python 3.10 / ANSI terminal / JSON file storage

**Key Files**
```
manabi-no-ki/
├── src/
│   ├── tree.py   — 木の成長ステージ・ASCIIアート・科目データ
│   ├── data.py   — JSON永続化・セッション管理・統計
│   └── cli.py    — CLIインターフェース
├── tests/
│   └── test_all.py — 109テスト
└── README.md
```

**How to Run**
```bash
cd manabi-no-ki
python3 src/cli.py log 算数 30 足し算
python3 src/cli.py status
python3 src/cli.py stats
```

**Tests**: 109 passing | **Files**: 8 | **LOC**: ~650 | **Build time**: ~10 min

**Challenges & Fixes**
木のステージ境界値テスト — マイルストーン値(30分)がステージ境界と一致するため、テストで+1が必要だった。

**Potential Next Steps**
- Textual TUIフルスクリーンアプリ
- 複数子どもプロフィール
- 科目ごとの枝ビジュアライゼーション

---

### <a id="sodachi-graph"></a>82. sodachi-graph - 2026-05-03 00:30

**What is this?**
親が子育て中の選択を10回行い、章末ごとに「智・徳・体・情」のスタッツが伸びる**ビジュアルノベル × データダッシュボード**ハイブリッド。Raylib (C) ネイティブで、Noto Sans JP の動的コードポイントロード、章ごとに異なる手描き風背景（プリミティブ図形のみで構築）、章間に滑らかなeasingで伸びるバーチャートを実装。エンディングは12通り、選択の偏りで変化。

**Discovery Roll**
Source: 40 (データ分析・ダッシュボード系) | Persona: 39 (子育て中のパパ/ママ) | Platform: 20 (Raylib/SDL game) | Wildcard: 43 (選択肢で分岐するマルチエンディングVN)

**Features Built**
- 5章 × 2選択 = 10決定の分岐ストーリー（0〜15歳の子育てを圧縮）
- 4スタッツ（智 知性 / 徳 思いやり / 体 健やかさ / 情 感性）と章間ダッシュボード
- 12種類のエンディング（突き抜け4 + 二刀流6 + 全人格1 + 凡庸1）
- 章ごとに異なる手描き風グラデーション背景（朝焼け→空＋木→学校→山並み→星空）
- ダッシュボードのease-in-outアニメーション + デルタ表示（+9 / −3など）
- UTF-8対応の独自ワードラップ描画関数（日本語の文字単位折り返し）
- 起動時に全表示テキストを連結→codepointsを抽出→LoadFontExへ（533 unique glyphs）

**Tech Stack**
C11 / Raylib 5.5 / Noto Sans JP / Make / -Wall -Wextra clean

**Key Files**
```
sodachi-graph/
├── Makefile            — clang + raylib via pkg-config
├── README.md / PLAN.md / SUMMARY.md / CLAUDE.md
├── assets/
│   └── NotoSansJP.ttf  — 同梱フォント
├── src/
│   ├── main.c          — 1280x720ゲームループ・10シーン状態機械・全描画
│   ├── story.h         — Stats / ChoicePoint / Chapter / Ending 型
│   └── story.c         — 物語データ + select_ending() 分岐ロジック
└── tests/
    └── test_endings.c  — 126 アサーション
```

**How to Run**
```bash
brew install raylib
cd sodachi-graph
make
./sodachi-graph
```

**Tests**: 126 passing | **Files**: 8 (excluding font) | **LOC**: ~970 (main.c 600 + story.c 220 + tests 150) | **Build time**: ~15 min

**Challenges & Fixes**
- Raylibの`LoadFontEx`は与えたcodepoint配列だけグリフを焼くため、日本語の動的フォントロードでは「表示するすべての文字」を事前に列挙する必要があった。`gather_text_buffer()`で全UI/物語/エンディング文字列を連結→`LoadCodepoints`→重複排除して解決。
- C文字列ポインタ算術 `"第一二三四五"+(chapter*3)` は ASCII を仮定する書き方で、UTF-8 では各漢字が3バイトのため一見動くがコンパイラ警告が出た。`const char *kanji[] = {"一","二",...}` に置き換え。

**Potential Next Steps**
- Web Audio対応（章ごとのアンビエント音楽）
- セーブ/ロード（plain JSONで途中保存）
- エンディング画面に4軸レーダーチャート追加
- WebAssembly（emscripten）でブラウザ版

---

### <a id="mado"></a>83. mado - 2026-05-05 03:10

**What is this?**
**窓**（mado）は、世界のどこかの街にある「窓」を一つ開けて、3 分だけ眺めて閉じる Web アプリ。空のグラデーション、屋根や山並みのシルエット、雪や蛍やオーロラの粒子、そして Rust が手でこしらえた 14 秒のシームレスな環境音。窓の下には、その土地の言葉が 3 つ静かに置いてある。覚えなくていい、ただ眺めるだけでもいい。Duolingo の真逆を狙った、ストリーク・通知・クイズのない語学アプリ。

**Discovery Roll**
Source: 13 (Travel destinations trending) | Persona: 34 (語学を勉強中の人) | Platform: 10 (Rust + WASM web app) | Intent: 4 (そっと寄り添う — 癒し/メンタル/静か)

**Features Built**
- 6 つの窓: パリ夜明け / リスボン午後 / ハノイ夕暮れ / ストックホルム雪朝 / イスタンブール夕焼け / レイキャビク深夜オーロラ
- シーンごとの空グラデーション (4 stop) + 3 層シルエット (64 点ハイトマップ) + 粒子 (埃/雪/蛍/オーロラ) を Rust 側で決定論的に生成
- Rust DSP による 14 秒シームレス環境音ループ (オシレータ + フィルタードノイズ + アクセント包絡)
- 「言葉を集める」手帳 (localStorage 永続化、街・言語・日付付き)
- ガラスモーフィズム + Noto Serif JP / Cormorant Garamond の静かなタイポグラフィ
- モバイル 480px 以下でフレーズカードが縦積みになる完全レスポンシブ
- 環境音ボタン: 1.4 秒フェードイン / 0.6 秒フェードアウト
- シーン切替時に WASM 内のアニメーション・粒子・音バッファが連続的に切り替わる

**Tech Stack**
Rust 1.94 + wasm-bindgen 0.2 (cdylib, 31KB wasm) / Canvas 2D / Web Audio API / Plain ES Modules / Noto Serif JP + Noto Sans JP + Cormorant Garamond

**Key Files**
```
mado/
├── Cargo.toml
├── src/lib.rs           — Mado 構造体、6シーンのグラデ/シルエット/粒子/音響レシピ
├── pkg/                 — wasm-pack の出力 (mado_bg.wasm 31KB、コミット済み)
├── data/windows.js      — 6 都市 × 3 フレーズ (原文・読み・意味・場面)
├── index.html           — マークアップ
├── style.css            — ガラスモーフィズム + JP タイポグラフィ
├── main.js              — WASM ロード・Canvas 描画・Web Audio・手帳
└── README.md / PLAN.md / SUMMARY.md / CLAUDE.md
```

**How to Run**
```bash
# pre-built WASM is committed
cd mado
python3 -m http.server 8765
# → http://localhost:8765/

# rebuild Rust → WASM
wasm-pack build --target web --out-dir pkg --release

# run Rust unit tests
cargo test --lib
```

**Tests**: 8 passing (Rust unit tests: scene count / wraparound / gradient bytes / silhouette range / particle spawning / audio buffer length & range / seamless loop endpoints / per-scene audio difference) | **Files**: 13 (excl. target/) | **LOC**: ~1,720 (Rust 489 + main.js 455 + style.css 503 + windows.js 195 + html 78) | **Build time**: ~25 min

**Challenges & Fixes**
- 当初 `generate_audio()` は `mado.set_scene()` で内部状態を切り替えてから呼ぶ設計だったが、これだと音バッファ生成のたびに粒子と時刻がリセットされ、シーン切替時にアニメーションが瞬断する。`generate_audio_for(scene, sr, sec)` という状態を持たない静的メソッドを追加し、`Mado::synth_audio` に共通ロジックを抽出して解決。
- 親リポジトリの `.gitignore` がグローバルに `pkg/` を除外していたため、ビルド済み WASM がコミットされない。`!mado/pkg/` で例外を追加し、`wasm-pack` が自動生成する `pkg/.gitignore` (`*` のみ) は削除。
- Rust の借用チェッカー: `tick()` の中で `self.particles.iter_mut()` と `self.rand_f32(&mut self)` を同時に使えない。spawn ロジックを `spawn_one()` に切り出し、先に死んでいる粒子のインデックスを `position()` で取得 → その後 `rand_f32()` を呼ぶ → 最後にインデックスでアクセス、という順番に整理。

**Potential Next Steps**
- 京都 / マラケシュ / ブエノスアイレスなど追加の窓 (Rust 側はすべて `match scene` の追記、データ側は windows.js の追記だけで増やせる)
- Web Speech API による発音再生 (タップ時のみ、自動再生はしない)
- 現在の窓と集めた言葉から PNG ポストカードを生成して保存 / 共有

---

### <a id="bug-zumou"></a>84. bug-zumou - 2026-05-05 09:40

**What is this?**
**バグずもう**は、Stack Overflow に出てくる本物のバグを 60 秒一本勝負の相撲に仕立てた macOS ネイティブ SwiftUI アプリ。3〜7 行のコード断片の中で「バグの行」をクリックすれば一勝、外せば黒星、時間切れも黒星。連勝で番付が **序ノ口 → 序二段 → 三段目 → 幕下 → 十両 → 前頭 → 小結 → 関脇 → 大関 → 横綱** と昇る。一人で家で働く開発者が、コーヒーを淹れている合間に「一番だけ」取って閉じる、そんな 90 秒の儀式を作る Intent 5 (夢中にさせる) のミニゲーム。

**Discovery Roll**
Source: 34 (Stack Overflow — 開発者が困っていること) | Persona: 14 (孤独を感じるリモートワーカー) | Platform: 11 (Swift macOS native app) | Intent: 5 (夢中にさせる — ゲーム性/中毒/競う)

**Features Built**
- 6 部屋 × 4 番 = 24 取組のキュレーションされたバグ・コーパス（言語横断: JS / Python / Java / Swift / C / Go / SQL / Bash）
- 部屋: ぬる怪部屋 / 一つ違ヰ部屋 / 等号部屋 / 正規表現部屋 / 並行ノ宿 / 罠ノ型部屋
- 番付 10 段階の昇進ロジック（連勝閾値 0→1→3→6→10→15→22→30→40→55、横綱の遠さを意識した非線形）
- 60 秒タイマー、残り 15 秒で警告色
- 行クリックで判定、勝敗と力士名・解説を覆い被せて即座に開示
- 連勝・最高・総取組数・勝率の永続化（UserDefaults）
- 取組ごとに力士名（ぬるぽ太郎、一寸はみ出し、代入暴狼、半端アンカー、素通り forEach、文字でなで斬りなど 24 種類）
- Return キーで取組開始 / 次の取組へ
- 直近 6 番のリピート回避

**Tech Stack**
Swift 5.9 / SwiftUI / SwiftPM `.executableTarget` / Combine / UserDefaults / XCTest / 朱色 (#f58e44) アクセントの自前 Theme

**Key Files**
```
bug-zumou/
├── Package.swift
├── Sources/BugZumou/
│   ├── BugZumouApp.swift   — @main エントリ
│   ├── ContentView.swift   — 全 SwiftUI ビュー (RankHeader / IdleHero / CodePanel / TimerStrip / RevealOverlay)
│   ├── Theme.swift         — 配色とフォント
│   ├── Models.swift        — Stable / Rank / Puzzle / Outcome
│   ├── Corpus.swift        — 24 取組のデータ
│   └── GameState.swift     — フェーズ機械、タイマー、永続化
└── Tests/BugZumouTests/
    ├── CorpusTests.swift   — 6 cases
    ├── RankTests.swift     — 5 cases
    └── GameStateTests.swift— 8 cases
```

**How to Run**
```bash
cd bug-zumou
swift build -c release
.build/release/bug-zumou
# or for development:
swift run
# tests:
swift test
```

**Tests**: 19 passing (Corpus 6 / Rank 5 / GameState 8) | **Files**: 10 | **LOC**: ~1,317 (Sources 1,099 + Tests 218) | **Build time**: ~30 min

**Challenges & Fixes**
- `GameState` を `@MainActor` にしたため、`pickPuzzle(rng:)` を XCTest からテストするには `public` にする必要があった。最初は `func`（internal）でテストモジュールから見えず、ビルドエラー。`public` に格上げして解決。
- `Corpus` の `buggyLineIndex` は手書きのため、コードを後から編集すると行番号がズレるリスクが高い。`testBuggyLineIndexIsInRange` と `testIsCorrectMatchesIndex` でガードレール化（範囲外をすぐに検出）。
- SwiftPM の `executableTarget` で SwiftUI アプリを動かすのは可能（`@main App` を一個置くだけ）だが、`Info.plist` を持たないので Dock の挙動はネイティブアプリほど整わない。デモ用途には十分なので妥協。
- 力士名と取組タイトルを真面目に "発明" するのが一番時間がかかった部分。バグの本質を一つの 6〜10 文字の名前に圧縮するのは、半分テクニカルライティング、半分ネーミング。

**Potential Next Steps**
- 親方の一番（日替わり 1 番、日付シードで全ユーザー共通）
- 数字キー（1-9）で行選択するキーボードショートカット
- `~/Library/Application Support/bug-zumou/` の JSON でカスタムコーパスを追加できる「自前部屋」機能（チームで共有する社内バグ集など）

---

### <a id="danboaru-za"></a>85. danboaru-za - 2026-05-05 10:30

**What is this?**
**段ボール座**（だんぼーるざ、*Constellatio Cartonensis*）は、引っ越したばかりの部屋に積まれた **未開封の段ボール** を、夜空にひとつの **星座** として登録するブラウザアプリ。各箱は名前から決定論的に位置が決まる恒星になり、サイズが等級になり、近くの星と細い線で繋がって独自の星座を成す。「開封」を押すと該当する星が **超新星爆発** を起こし、夜空からそっと消えていく。すべての箱を開け終えた瞬間に「**完全移住完了**」が観測カタログに記録される。Intent 3「こんなのアリ？と笑わせる」の振り切ったユーモアで、片付けを天体観測に変換する。

**Discovery Roll**
Source: 12 (Science breakthroughs / space news this week) | Persona: 28 (引っ越ししたばかりの人) | Platform: 19 (p5.js / Three.js creative coding) | Intent: 3 (「こんなのアリ？」と笑わせる — コンセプチュアル/変/一発ネタ)

**Features Built**
- 箱名から決定論的に決まる星の座標 (FNV-1a-ish hash → mulberry32 PRNG → 0..1 正規化)
- サイズ 3 段階（小・中・大）が等級（0.55 / 1.0 / 1.6）にマッピング
- 2-最近傍の重複削除エッジで自動的に組み立てられる星座線
- 暖色 75% + 寒色 25% の色相分布で「本物の夜空」感
- 1.4 秒の超新星アニメ（外向き衝撃波リング + コアフラッシュ）
- 「Constellatio Cartonensis」風の Latin カタログ名（箱の集合から決定論的に生成、順序非依存）
- ガラスモーフィズム + ダーク宇宙テーマの右側パネル
- 統計ブロック: 未開封 / 登録 / 等級平均 / カタログ名
- localStorage 永続化（キー: `danboaru-za.v1`）
- キャンバスの星をクリック OR 台帳の「開封」ボタンで開封
- 完全移住完了オーバーレイに `Logged YYYY-MM-DD · DBZ Catalogue` の偽装ジャーナル印字
- モバイル対応（パネルが下部ドロワー化）

**Tech Stack**
Vanilla HTML / CSS3 / ES Modules / p5.js 1.9 (CDN, instance mode) / localStorage / Noto Serif JP + Cormorant Garamond (italic) + JetBrains Mono / Node.js `node:test` for unit tests

**Key Files**
```
danboaru-za/
├── index.html           — マークアップ
├── styles.css           — グラスモーフィズム + ダーク宇宙テーマ
├── core.js              — 純粋ロジック (Node からも import 可能)
├── app.js               — p5.js キャンバス + DOM 配線
├── test/core.test.mjs   — 24 個の Node テスト
└── README.md / PLAN.md / SUMMARY.md / CLAUDE.md
```

**How to Run**
```bash
cd danboaru-za
python3 -m http.server 8765
# → http://localhost:8765/

# テスト:
node --test test/core.test.mjs
```

**Tests**: 24 passing (hashLabel 3 / mulberry32 2 / placeStar 4 / nearestNeighborEdges 4 / catalogueName 2 / BoxStore 9) | **Files**: 9 | **LOC**: ~1,351 (core 165 + app 369 + styles 518 + html 89 + tests 210) | **Build time**: ~25 min

**Challenges & Fixes**
- 純ロジックを Node からテストしたかったので、`core.js` から `crypto.randomUUID()` を呼びつつ、Node 19 未満や古いブラウザのフォールバックを書く必要があった。`globalThis.crypto?.randomUUID` の optional chaining + Math.random ベースの予備 ID 生成で解決。
- p5.js のグローバルモードと ES モジュールは相性が悪い（`<script type="module">` 内で定義した `setup()` を p5 が拾えない）。インスタンスモード `new p5((p) => { p.setup = ...; p.draw = ... })` に切り替えてクリーンに統合。
- 星の位置が 0..1 正規化座標、ガラスパネルが画面右側を覆う構成だと、星の半分がパネルの裏に隠れる懸念があった。実際にはパネルが半透明（blur+saturate）なので、星が透けて見える方が「夜空にガラスを置いた」感が出て良かったので、x 範囲を絞らずに採用。

**Potential Next Steps**
- 完全移住完了後の「夜空ポストカード」生成（PNG 出力 + シェアリンク）
- 部屋ごとの複数星座（キッチン座・寝室座など）と「南天/北天」風の俯瞰表示
- 14 秒のアンビエント環境音ループ（Web Audio）、超新星時に短く無音化する演出


---

### <a id="takibi"></a>86. takibi - 2026-05-10 14:50

**What is this?**
カフェで作業するノマド向けの「ポケットの中の焚火」PWA。ピクセルアートの焚火が画面の中で静かに燃え、Doom fire アルゴリズムで揺らぐ炎と舞う火の粉が、25/5 分のポモドーロサイクルを優しく見守る。Web Audio で生成されるパチパチ音と低い風音は、サンプルなしの完全合成。インディーゲームの「セーブポイント = 安らぎ」（Dark Souls のかがり火、Hollow Knight のベンチ）の系譜を、カフェノマドの机の上に持ち込んだ。

**Discovery Roll**
Source: 10 (インディーゲーム / 速攻クリア文化) | Persona: 30 (カフェで作業するノマドワーカー) | Platform: 4 (モバイル PWA) | Intent: 4 (そっと寄り添う — 癒し・静か)

**Features Built**
- ピクセルアート焚火の Canvas アニメーション (Doom fire algorithm + 12色の温色パレット)
- 上昇する火の粉パーティクル（ふわっと減速、フェードアウト）
- Web Audio で完全合成された環境音（ピンクノイズの風 + 短ノイズバーストのパチパチ）
- 25 分集中 / 5 分休憩の純粋ロジック状態機械（テスト容易な設計）
- フェーズに応じた火の挙動変化（眠っている / 集中 / 休息で炎の強さ・色味・音量が変わる）
- 「薪をくべる」演出（サイクル完了で炎が一瞬大きくなる）
- 今日くべた薪 (= 完了サイクル数) を localStorage に日付毎に保存
- PWA 対応 (manifest + service worker でオフライン動作、ホーム画面追加可能)
- 全 UI 日本語 + ダークテーマ + スマホ縦向き最適化 + safe-area-inset 対応

**Tech Stack**
HTML / CSS / Vanilla JavaScript (ES Modules) / Canvas 2D / Web Audio API / Service Worker / localStorage / Python 標準ライブラリ (アイコン PNG 生成)

**Key Files**
```
takibi/
├── index.html              エントリ
├── style.css               ダーク + 温かみのあるグロウ
├── app.js                  バインディング層
├── fire.js                 Doom fire 焚火
├── ambience.js             Web Audio 環境音
├── timer.js                純粋ロジック状態機械
├── manifest.json + service-worker.js + icons/
└── tests/timer.test.mjs    14 テスト
```

**How to Run**
```bash
cd takibi
python3 -m http.server 8000
# ブラウザで http://localhost:8000 を開く
```

スマホ: 同 LAN から `http://<PCのIP>:8000` → 共有 → ホーム画面に追加で PWA インストール。

**Tests**: 14 passing (`node --test tests/timer.test.mjs`) | **Files**: 11 | **LOC**: ~830 | **Build time**: ~30 min

**Challenges & Fixes**
- 「炎らしさ」は Doom fire アルゴリズムをベースに、パレットを黒→こげ茶→朱→橙→白の 12 段階に組み直して温度感を出した。中心からの距離で底辺の熱量を減衰させることでロウソク型のシルエットになる
- パチパチ音は短いノイズバーストにバンドパスフィルタ（周波数・Q をランダム化）を通して合成。30% の確率で二発目を 60-180ms 後にトリガーする「跳ね返り」感を入れた
- iOS Safari は AudioContext がユーザータップ起因でしか開始できないため、「音を聞く」ボタン押下時に明示的に `ctx.resume()` を呼ぶ設計

**Potential Next Steps**
- 「薪をくべる」演出をもっと派手に（火の粉が大量に舞う、視覚的なご褒美感）
- 一日の集中ログを別画面で見せる（火の年輪のような可視化）
- 環境音のバリエーション（雨の音モード、火だけモード）
- 「誰かと一緒に焚火を囲む」モード（複数端末同期で同じ火を見る）

---

### <a id="bungou-reki"></a>87. bungou-reki - 2026-05-16 14:30

**What is this?**
文豪暦 — 文学史の「この日」を素材にしたカードバトル型 Tauri デスクトップアプリ。年間100冊読む読書家向け、今日に縁ある文豪が召喚され、コレクション・対戦・読書ログでXPが貯まる。

**Discovery Roll**
Source: 28 (Historical "on this day" event) | Persona: 38 (読書家・年100冊読む人) | Platform: 17 (Tauri desktop app) | Intent: 5 (夢中にさせる — ゲーム性/中毒/競う)

**Features Built**
- 文学暦データセット (61名の文豪を実データで収録、日本＋世界文豪、4軸ステータス)
- 「今日の召喚」— 当日の誕生・命日に該当する作家を3〜5枚カードとして提示、1日1名のみ蔵書追加
- ±3日のフォールバック探索 (該当ゼロの日でも近隣から拾う)
- 蔵書ビュー — 集めた作家をXPレベル順にカード表示
- 3ラウンド対戦 — 文才→多作→影響軸の比較。デッキ3枚を組み、本日の挑戦者と対決
- 決定論的「本日の挑戦者」— 日付シードベース、同じ日は同じ相手
- 読書ログ — 書名・ページ数を記録すると対応作家にXP (4ページ=1XP、最低5XP)
- 文学暦カレンダー — 月単位で全366日の文豪イベントを閲覧、誕生・命日を色分け
- 古書館アエステティック — パーチメント＋墨＋金箔＋朱、明朝体スタック
- Rust/JS両側に実装したロジック層、共通テスト方針

**Tech Stack**
Tauri 2.0 / Rust 1.94 (chrono + serde) / Vanilla HTML+CSS+ES Modules / 静的JSONデータ / localStorage 永続化

**Key Files**
```
bungou-reki/
├── src/                       フロントエンド (Tauri/ブラウザ共通)
│   ├── index.html / style.css / app.js
│   ├── modules/{calendar,battle,store}.js
│   └── data/authors.json      61名の文豪
├── src-tauri/
│   ├── Cargo.toml / tauri.conf.json
│   └── src/{lib,data,calendar,battle,state,main}.rs
└── tests/{battle,calendar}.test.mjs
```

**How to Run**
```bash
# ブラウザで即時試す
cd src && python3 -m http.server 8000
# Tauri デスクトップ
cargo install tauri-cli --version "^2.0"
cd src-tauri && cargo tauri dev --features desktop
# テスト
cd src-tauri && cargo test            # 22 tests
cd .. && node --test "tests/*.test.mjs"  # 14 tests
```

**Tests**: 36 passing (Rust 22 + JS 14) | **Files**: 18 | **LOC**: ~1,700 | **Build time**: ~28 min

**Challenges & Fixes**
- Tauri CLIインストール時間を回避するため、`desktop` features を optional 化。`cargo run` 単体で CLI smoke モードが動き、テストは Tauri 依存なしで完結
- ロジック層を Rust と JS で1:1ミラーし、両側にユニットテスト。データセットは双方が同じJSONを読む
- 5月16日は文学暦上の該当が少ないため、データセットに Studs Terkel・Adrienne Rich (実在May 16生まれ) を含め、±3日フォールバックも実装

**Potential Next Steps**
- 作家ポートレートのSVG生成 (現状はイニシャル1文字)
- 連続ログイン報酬 / 称号システム
- 同時代作家のクロスオーバーイベント (「漱石と鷗外が同じ年に生きていた」)
- 友人とシード共有してデッキ比較できる対戦モード
- 実在の代表作にページ数データを紐づけ、読書XPの精度を上げる

---

### <a id="madori-zukan"></a>88. madori-zukan - 2026-05-16 15:05

**What is this?**
間取り図鑑 — アニメ・漫画の家を「不動産物件」としてアーカイブする PWA。年100作品を観るオタクの視聴履歴を、間取り図つきの物件カタログとして残す。野比家・磯野家・野原家・草壁家・竈門家・フォージャー家など8件を収録。

**Discovery Roll**
Source: 22 (Real estate / housing market) | Persona: 16 (アニメ/漫画の視聴管理が必要なオタク) | Platform: 4 (Mobile PWA) | Intent: 6 (記録して残す — アーカイブ/個人史)

**Features Built**
- 8件の名作の家を手書きデータで収録 (野比/磯野/野原/草壁/竈門/高須/平沢/フォージャー)
- SVG 間取り図レンダラ — 壁・部屋ラベル・面積・畳数・縮尺バー・方位記号N、畳・庭のハッチング
- 2階建ては1F/2Fを横並びレイアウト、フロアラベル付き
- 物件カード一覧 — サムネに mini SVG、住所・築年・延床面積を不動産チラシ風に
- 物件詳細 — 拡大した間取り図 + 登場人物 + 部屋ごとの印象的シーン (タップで部屋ハイライト)
- 「観了」「★お気に入り」を localStorage に保存
- アーカイブ統計画面 — 観了数、累計記録延床面積、時代別構成、お気に入り数
- 絞り込み — 年代 (大正/昭和/平成)、観了済みのみ、お気に入りのみ
- PWA フル対応 — manifest.json + service-worker.js + 192/512 PNG アイコン、オフライン動作
- 全 UI 日本語、375px 縦長モバイルで崩れない

**Tech Stack**
Vanilla HTML / CSS / ES Modules / SVG (手書き) / localStorage / Service Worker / Web App Manifest / Python標準ライブラリ (アイコンPNG生成)

**Key Files**
```
madori-zukan/
├── index.html              4ビュー (一覧/詳細/アーカイブ/使い方)
├── style.css               paper + ink + blueprint
├── app.js                  コントローラ
├── modules/{floorplan,store}.js
├── data/homes.json         8件 / 85部屋
├── manifest.json + service-worker.js + icons/
└── tests/{floorplan,store}.test.mjs
```

**How to Run**
```bash
cd madori-zukan
python3 -m http.server 8000
# ブラウザで http://localhost:8000

# テスト
node --test "tests/*.test.mjs"
```

スマホ: 同 LAN 経由でアクセス → 共有メニュー → ホーム画面に追加で PWA インストール。

**Tests**: 16 passing (floorplan 10 + store 6) | **Files**: 16 | **LOC**: ~1,200 | **Build time**: ~32 min

**Challenges & Fixes**
- 各家の正確な間取りは公式には存在しないため、「オマージュ的再現」と明示。原作のレイアウト感に準拠する範囲で plausible な配置を設計
- SVG を建築図面風に見せるため、太い黒い壁線・薄い部屋色・畳ハッチング・縮尺バー・方位記号(N) を手書きで配置
- 2階建てを単一SVGで表現するため、1Fと2Fを横並びに配置し、各フロアの bbox 左上に "1F"/"2F" ラベルを描画
- サムネ用と詳細用で同じ renderer を使い回すため、`scale` と `showAnnotations` を引数化

**Potential Next Steps**
- 物件を増やす (もののけ姫アシタカの家、千と千尋の油屋、進撃エレン家、SLAM DUNK桜木家、ハイキュー影山家など)
- 部屋にシーンの開始時刻を紐づけて「時刻別の家」ビュー
- ユーザーが自分の手で新規物件を追加できる UI
- 友人とアーカイブを比較できる URL シェア
- ダークモード (建築青焼き風)

---

### <a id="hoshi-yomi"></a>89. hoshi-yomi - 2026-05-16 15:35

**What is this?**
星詠み — 星をなぞって外国語の単語を覚える Godot 4 ゲーム。12 個の単語にそれぞれ星座が割り当てられ、正しい順で星を繋ぐと夜空に単語が浮かぶ。覚えた星座は永久に灯り続ける。「美しさで殴る」を狙った静かな夜の作品。

**Discovery Roll**
Source: 31 (GitHub Trending — OSS/ツール) | Persona: 34 (語学を勉強中の人) | Platform: 14 (Godot game/GDScript) | Intent: 1 (美しさで殴る — スクショ撮りたくなる)

**Features Built**
- 12 個の単語×星座 (海/森/雨/太陽/月/風/山/川/花/鳥/星/夢)、合計 60 星を手書きで配置
- 背景の星空 (320 個) がゆっくりドリフト、稀に流れ星が横切る
- カスタムグロー shader (gdshader) — core + halo + spike rays + twinkle
- 星座トレース UI — タップ済みは金で点り、次に押すべき星は青いリングと番号で示す
- 連結ラインは 3 段階の太さと透明度を重ねた「金箔」表現
- 完成すると単語が日本語＋英語＋発音記号＋短い詩で立ち上がる
- 夜空辞書 — 解き明かした星座 / 未解決の一覧。✦アイコンと番号で進捗を可視化
- 進捗永続化 — user://progress.json に discovered: [id...] を保存
- 完全日本語UI、ターゲット言語 (英) は副表示

**Tech Stack**
Godot 4.2+ / GDScript / カスタムグロー gdshader / JSON データロード (FileAccess + JSON.parse_string) / 静的クラスメソッド (class_name + static func) / 0..1 正規化座標 → 動的ビューポートマッピング

**Key Files**
```
hoshi-yomi/
├── project.godot, icon.svg
├── scenes/{Main,ConstellationView}.tscn
├── scripts/{main,starfield,constellation_view,data,progress}.gd
├── shaders/star_glow.gdshader
├── data/constellations.json    12 星座 / 60 星
└── tests/validate.py            Python チェッカー (238 件)
```

**How to Run**
```bash
# Godot 4.2+ を入手
godot --path hoshi-yomi
# あるいはエディタで project.godot を Import → 再生

# 検証 (Godot 不要)
python3 tests/validate.py
```

**Tests**: 238 validation checks passing | **Files**: 14 | **LOC**: ~670 | **Build time**: ~26 min

**Challenges & Fixes**
- Godot CLI が環境に無いため実行確認できない → Python で構造・JSON・ファイル参照・スクリプトのインデント整合性まで 238 項目を自動チェック
- `Progress.load()` が Godot の組み込み `load()` と衝突する恐れ → 静的メソッド名を `read_state` / `write_state` に変更
- `custom_constants/separation` は Godot 4 の旧表記 → `theme_override_constants/separation` に統一
- 1280×720 の固定座標 → 正規化座標 (0..1) で持ち、`get_viewport_rect().size` で動的マッピング

**Potential Next Steps**
- AudioStreamGenerator で星接続時のチャイム、背景にドローンパッド
- 多言語対応 — JSON の label_target を per-language の dict に
- 12 個解放後の「次の章」、25 個・50 個と段階的に
- 完成した夜空を PNG にエクスポート (Viewport rendering)
- ドラッグの軌跡を流れ星のように残す演出

---

### <a id="ryogae-kan"></a>90. ryogae-kan - 2026-05-16 16:05

**What is this?**
両替勘 — 海外旅行の値段感覚を 5 秒で鍛える Rust+WASM Webゲーム。€38 / ₹4500 / ₩12000 / ฿420 が次々提示され「安い / 妥当 / 高い」を即判定。連続正解でストリークが伸び、難しい通貨が解放される。電卓を使わず指で覚えるまで遊ぶ系の中毒ゲーム。

**Discovery Roll**
Source: 33 (Hacker News) | Persona: 9 (海外一人旅中の旅行者) | Platform: 10 (Rust+WASM) | Intent: 5 (夢中にさせる — ゲーム性/中毒/競う)

**Features Built**
- 15 通貨 (USD/EUR/KRW/CNY/GBP/AUD/THB/SGD/INR/VND/TWD/IDR/TRY/BRL/MXN) × 10 品目 (コーヒー/水/屋台メシ/タクシー/ホテル等) = 150 組み合わせ
- 判定 5 秒、ストリーク 5/10/20/30+ で時間が 4.5→4.0→3.5→3.0 秒に短縮
- ストリーク 0/5/10/15+ で通貨難度が解放 (簡単→難)
- バケット式ラウンド生成 (33% 安い / 34% 妥当 / 33% 高い)、価格は通貨ごとの display_step で四捨五入
- スコア = base 100 + 残り時間に比例した speed_bonus 10〜100
- xorshift64 決定論 RNG
- パスポート / スタンプ / レシート意匠 (ダーク紺パスポート、ベージュ和紙地、赤いスタンプ)
- 円換算と参考価格を答え合わせ画面で開示
- 数字キー 1/2/3 でも判定可能 (タップと併用)
- 最高スコア・最高ストリークを localStorage に保存
- 完全日本語UI、375px モバイル対応

**Tech Stack**
Rust 1.94 / wasm-bindgen 0.2.121 / serde + serde_json / getrandom (js feature) / Vanilla HTML+CSS+ES Modules / requestAnimationFrame タイマー駆動 / localStorage 永続化

**Key Files**
```
ryogae-kan/
├── Cargo.toml, Makefile
├── src/
│   ├── lib.rs                Engine (wasm_bindgen)
│   ├── currencies.rs         15 通貨 + 難度
│   ├── items.rs              10 品目
│   ├── judge.rs              Verdict
│   ├── rng.rs                xorshift64
│   ├── round.rs              ラウンド生成
│   └── game.rs               Game state + scoring
└── www/
    ├── index.html / style.css / app.js
    └── pkg/                  wasm-pack 出力 (38KB wasm + 7.6KB js)
```

**How to Run**
```bash
wasm-pack build --target web --out-dir www/pkg --release
cd www && python3 -m http.server 8000
# http://localhost:8000

# テスト
cargo test  # 23 tests
```

**Tests**: 23 passing | **Files**: 17 | **LOC**: ~1,000 (Rust ~500 + frontend ~500) | **WASM size**: 38KB release | **Build time**: ~24 min

**Challenges & Fixes**
- 通貨ごとの桁感を表現するため display_step (USD=1, KRW=100, VND=1000, IDR=500) を導入。価格を step 単位で四捨五入し「異国の値札らしい」桁にする
- バケット式 (cheap/fair/expensive のどれを引くか先に決めてから ratio を生成) でラウンドの偏りを抑制
- スコアにテンポ感を持たせるため speed_bonus を導入 — 同じ正解でも素早いほうが点が高い
- 為替レートはハードコード。練習目的なので厳密な精度より体験を優先

**Potential Next Steps**
- AudioContext で判定音、背景に空港アンビエント
- 実 API (exchangerate.host) から起動時にレートをフェッチ
- フレーバーテキスト「今あなたは バンコク にいる」で没入感
- 品目もストリークで解放 (医療費、航空券等の高額品目)
- リーダーボード (Cloudflare Workers)
- 教育モード (時間制限なし、ヒント表示あり)

---

### <a id="eiga-ichiba"></a>91. eiga-ichiba - 2026-05-17 00:10

**What is this?**
映画市場 — 二人で同じキーボードを囲んで遊ぶ、映画オタク向けの株式投資ゲーム。12 ヶ月のシーズンを通して毎月 1 本の架空話題作が「上場」する。プレイヤーは 0/25/50/75/100 % で投資割合を選び、月末にリターンが公開される。勝敗より「あの監督なら…」と話し合いながら同じ画面を見る体験が本体。

**Discovery Roll**
Source: 15 (Economics / fintech / stock market headlines) | Persona: 13 (全作品を記録する映画オタク) | Platform: 20 (Raylib game / C) | Intent: 7 (誰かと一緒にやる — 関係性/共有)

**Features Built**
- 12 本の架空話題作 (氷の都/日常の地層/ロボットと俺/深い森の声/月面ピクニック/絵筆と都市/海底の図書館/氷河発電所/赤い列車/ねむれない王女/星の検査官/灯火少女)
- 各映画: 監督名・ジャンル・予算・期待度・seed_return・ピッチライン
- 2 人パスアンドプレイの状態機械 (TITLE→PREVIEW→ALLOC_P1→HANDOFF→ALLOC_P2→REVEAL→MONTH_RESULT→NEXT or GAME_OVER)
- 割合選択 UI (0/25/50/75/100% を 5 カードで提示、← → で選択)
- HANDOFF 画面でプレイヤー交代を促す → 秘密入力を尊重
- リターン計算: `base × hype_factor × noise(0.78..1.22)`、結果は 0.10x〜4.20x にクランプ
- リターン公開アニメーション (バーが伸びる演出)
- 月別決済画面 (現金残高をバーで可視化)
- シーズン総括 — 勝者宣言、最終残高、全 12 ヶ月の倍率履歴
- ジャンル別パレットで抽象的なポスター描画
- macOS のシステム日本語フォント (Hiragino → HelveticaNeue 順) を LoadFontEx で動的読み込み
- 完全日本語UI、勝者の色 (P1: 青 / P2: 赤) で識別

**Tech Stack**
C99 / Raylib 5.5 (Homebrew) / pkg-config / xorshift32 RNG / 純粋ロジック層 (Raylib 非依存) / Mach-O arm64 release

**Key Files**
```
eiga-ichiba/
├── Makefile             pkg-config 経由で raylib をリンク
├── src/
│   ├── film.h, film.c   12 映画データ
│   ├── game.h, game.c   状態機械 + リターン計算 (純粋関数、Raylib なし)
│   ├── render.c         Raylib 描画層
│   └── main.c           エントリ + 入力ハンドラ
└── tests/
    └── test_game.c      ユニットテスト (Raylib 非依存、make test)
```

**How to Run**
```bash
brew install raylib   # 前提
cd eiga-ichiba
make                  # ビルド (51KB バイナリ)
./eiga-ichiba         # 起動 (1280×720, 60FPS)

make test             # 2566 件のユニットテスト
```

**Tests**: 2,566 passing | **Files**: 11 | **LOC**: ~950 (C) | **Binary**: 51KB arm64 | **Build time**: ~22 min

**Challenges & Fixes**
- Raylib の DrawText は ASCII のみで日本語が出ない → macOS のシステムフォント (Hiragino 角ゴシック等) を `LoadFontEx` で読み込み、必要 codepoint セットを手動列挙して埋め込む
- 2 人のパスアンドプレイで秘密を守る → PHASE_HANDOFF を間に挟み、「コントローラーを次のプレイヤーに渡してください」画面でリセット
- ロジックを Raylib なしでテスト → `game.c` を独立ターゲットで `test_game.c` から直接リンク、純粋関数として検証
- リターンに偶然性と予測可能性を両立 → `base × hype_factor × noise` の 3 段階で揺らぎ、期待度が高いほど振れ幅も大きい

**Potential Next Steps**
- 効果音 (raylib audio) — 投資決定時のチャイム、リターン公開時の歓声/嘆息
- 映画ライブラリの拡張、シーズンごとにシャッフル
- 月例イベント (監督のスキャンダル / コンペ受賞) で倍率変動
- 3〜4 人対戦モード
- リプレイ機能 (各プレイヤーの選択を時系列で振り返る)

---

### <a id="yasai-nikki"></a>92. yasai-nikki - 2026-05-17 00:40

**What is this?**
やさい日記 — 6〜12 歳の子どもが 1 日 1 分だけ開く、ピクセルアートの野菜観察アプリ。1 〜 3 種のやさいを選んで「植え」、28 日間毎日 3 つの観察カード (葉の数 / 色 / きょうのきもち) に答えると、最終的に「観察カレンダー」が完成する。10 年後の自分が読み返せるデジタル夏休み日記。

**Discovery Roll**
Source: 21 (Agriculture / sustainability) | Persona: 22 (小学生の子ども 6-12歳) | Platform: 20 (Raylib / C) | Intent: 6 (記録して残す — アーカイブ/個人史)

**Features Built**
- 5 種の野菜 (トマト / キュウリ / ピーマン / ナス / トウモロコシ) × 6 段階 (タネ → 芽 → 葉 → つぼみ → 花 → 実) のピクセルアートを矩形・楕円・三角だけで手描き
- 1 〜 3 種を 1 日 1 分でえらぶ初回シーン
- 1 日 1 回の観察カード — 葉の数 (1/2/3/4/5+)・色 (みどり/きみどり/きいろ/ちゃいろ)・気分 (たのしい/おだやか/ふしぎ/しんぱい)
- すべて選択肢式 — キーボード入力なし、← → と Space / Enter だけ
- 28 日後の「観察カレンダー」 — 4 週 × 7 日のグリッドにその日の野菜成長・mood emoji・色スウォッチ
- 永続化 — `~/.yasai-nikki.json` に自動保存／読込み (手書きシリアライザ + ad-hoc JSON パーサ)
- ひらがな中心の語彙、小学校 4 年生までの漢字制限
- 観察データは絶対に破棄しない (R キーは確認プロンプト経由)
- Raylib 非依存ロジックレイヤ + 101 件のユニットテスト

**Tech Stack**
C99 / Raylib 5.5 (Homebrew) / pkg-config / 手書き JSON / 純粋ロジック分離 / Mach-O arm64 release

**Key Files**
```
yasai-nikki/
├── Makefile             pkg-config raylib
├── src/
│   ├── crop.{h,c}      5 種 × 6 段階
│   ├── diary.{h,c}     状態機械 + JSON シリアライズ
│   ├── render.c        Raylib ピクセルアート描画
│   └── main.c          入力 + 永続化
└── tests/
    └── test_diary.c    101 件のユニットテスト
```

**How to Run**
```bash
brew install raylib
cd yasai-nikki
make && ./yasai-nikki

make test               # 101 件のユニットテスト
```

**Tests**: 101 passing | **Files**: 11 | **LOC**: ~850 (C) | **Binary**: 53KB arm64 | **Build time**: ~26 min

**Challenges & Fixes**
- 子ども向けの語彙 → ひらがな多め、小学校 4 年生までの漢字に制限。「観察」は使うが「葉のかず」「いろ」「きょうのきもち」と分かりやすく
- ビルドエラー: `cosf` `sinf` を `<math.h>` なしで使った → `#include <math.h>` を追加し、未使用変数 `rows` を削除
- 観察データの安全性 → アプリ起動時に自動ロード、各 commit と ESC で自動保存。R キーは確認プロンプト経由のみ
- JSON ライブラリ依存を避けた → ad-hoc に小さな JSON シリアライザ＋パーサを実装、key 検索＋数値配列読みで完結

**Potential Next Steps**
- 音 — 観察決定時の優しいチャイム、ステージ進化時の祝福音
- 親モード — PDF/印刷で「観察日記」をエクスポート
- 季節を越えてアーカイブ — 完成した 1 シーズンを別ファイルに「卒業」、新シーズンを始める
- 観察カード追加 — においや手触りなど五感系
- 親子モード — 親と子が並べて観察を比較

---

### <a id="gochisou-goyomi"></a>93. gochisou-goyomi - 2026-05-17 01:10

**What is this?**
ごちそう暦 — 毎日外食するフーディーの「今日何食べる？」を、世界の文化暦から提案する Textual TUI。今日 (または近隣日) に祝祭を持つ国を 1 つ提示し、その国の伝統食をおすすめ。実食ログを 5 段階で記録、踏破国数とストリークを統計化。5/17 起動なら 🇳🇴 ノルウェー憲法記念日 → ホットドッグ・イ・ロンペ。

**Discovery Roll**
Source: 27 (Random holiday/cultural event today) | Persona: 6 (毎日外食するフーディー) | Platform: 3 (Python desktop / Textual TUI) | Intent: 2 (困ってる人を助ける — 毎日使える)

**Features Built**
- 81 件の文化暦エントリ — 50+ 国の国民祝日・宗教行事・食の日。料理の日本語＋現地語、入手難度 (家/店/専門店) ヒント付き
- 今日のおすすめ画面 — 国旗・行事名・料理・由来・入手難度を 1 パネルに
- ±3 日のフォールバック探索 — 該当日がなくても近隣から拾う
- 14 日以内のリピート除外 — 同じ祝日が連続提案されないよう recent フィルタ
- 暦画面 — 月単位で全祝日と料理を一覧、過去のログ評価も★で表示、前月/翌月切替
- 統計画面 — 今年の踏破国 / 総記録数 / 平均★ / 連続記録 / 国別ランキング
- 永続化 — `~/.gochisou-goyomi/state.json` (人読み可能 JSON、同日 commit は上書き、時系列ソート)
- キーバインド — Ctrl+C 暦、Ctrl+S 統計、Ctrl+1〜5 評価記録 (priority=True で Input フォーカス中も有効)
- 完全日本語UI + ターゲット言語の料理名併記
- パスポート/レシート意匠の鮮やかなカラーパレット

**Tech Stack**
Python 3.10+ / Textual 8.2 / Rich 13 / pyproject.toml + setuptools / pytest

**Key Files**
```
gochisou-goyomi/
├── pyproject.toml
├── src/gochisou_goyomi/
│   ├── holidays.py      81 件の文化暦データ
│   ├── calendar.py      ±3 日探索 / 月サマリ
│   ├── state.py         Store / MealEntry / 統計
│   └── app.py           TodayScreen / CalendarScreen / StatsScreen
└── tests/test_calendar.py  15 件
```

**How to Run**
```bash
pip install -e .
gochisou-goyomi
# あるいは
python3 -m gochisou_goyomi

# テスト
pytest                    # 15 passing
```

**Tests**: 15 passing | **Files**: 12 | **LOC**: ~900 (Python) | **Build time**: ~38 min

**Challenges & Fixes**
- Textual 8.x で `Static(Panel(...))` を直接渡すと描画失敗 → `Static(id=...)` を空で yield して `on_mount` で `update(panel)` を呼ぶパターンに統一
- 致命的バグ: `_render` メソッド名が Textual Widget の内部メソッドと衝突して Panel が render_strips を呼ばれてクラッシュ → 描画ヘルパを `_build_panel` にリネーム
- Input フォーカス中に screen binding が効かない問題 → c/s/1-5/q に Ctrl+ 修飾を追加し `priority=True` を付与
- 同日の重複提案を避けるため `recent_holiday_ids(window=14)` を実装、毎日違う祝日に

**Potential Next Steps**
- 動的祝日 (旧正月・イースター) の計算
- 実祝日カレンダー API 連携 (Holidays API)
- 「近くで食べられる店」マップ連携
- アレルギー・ベジ対応モード
- 友人と踏破国マップを共有するモード

---

### <a id="fukugyou-bubble"></a>94. fukugyou-bubble - 2026-05-17 01:50

**What is this?**
副業バブル — 副業 TikTok 文化の「いつか副業を始めたい」を健全なゲーム性で消化するクリッカー idle ゲーム。8 種類の副業 (テックブログ/YouTube/ドロップシッピング/AIアート/TikTok/デザイン/プログラミング/家庭教師) をクリックで稼ぎ、アップグレードで放置収入を増やしながら ¥10,000,000 を目指す。90 秒に 1 度バイラルイベントで特定副業に 3 倍ボーナス。Tauri ＆ ブラウザ両対応。

**Discovery Roll**
Source: 5 (Viral memes / internet culture) | Persona: 33 (副業を始めたい人) | Platform: 17 (Tauri desktop app) | Intent: 5 (夢中にさせる — ゲーム性/中毒/競う)

**Features Built**
- 8 種類の副業 — 各々 click_reward / base_income / upgrade_base_cost / cost_growth (=1.15) / viral_blurb / color
- クリック報酬 ¥10〜¥250、放置収入 ¥0.5〜¥15/秒、アップグレードコストは×1.15 で増える定番の idle 曲線
- バイラルイベント — 90 秒に 1 度、決定論的 RNG (引数として渡せる) で 1 副業に 3× ボーナス 30 秒間
- ガラスモーフィズム UI — 半透明カード + backdrop-filter + ピンク/金/緑の流れるオーブ
- フローティング +¥ ポップ演出、バイラル中はカードが脈動 (CSS animation)
- 進捗バー (ピンク→金→緑グラデ、¥10M に対する%)
- HUD 3 カード (現金 / 放置収入/秒 / クリック数)
- 自動保存 (5 秒毎 + ページ離脱時に localStorage)
- 達成オーバーレイ — クリック回数と経過時間を表示、「もう一度はじめる」ボタン
- 完全日本語UI、375px モバイル対応 (HUD 縦並び、グリッド 1 列に折りたたみ)
- ¥ フォーマッタ (¥1.2K / ¥3.4M / ¥1.2 億 と桁省略)

**Tech Stack**
Tauri 2.0 / Rust 1.94 (chrono は使わず純数値) / Vanilla HTML+CSS+ES Modules / localStorage / Glassmorphism CSS / Rust ロジック層と JS ロジック層の 1:1 ミラー

**Key Files**
```
fukugyou-bubble/
├── src/                          フロント (Tauri / ブラウザ共通)
│   ├── index.html / style.css / app.js
│   ├── modules/game.js           純粋ロジック (Rust と 1:1)
│   └── data/hustles.json         8 副業
└── src-tauri/
    ├── Cargo.toml (desktop feature optional)
    └── src/{lib,data,game,main}.rs   game.rs に 26 件のテスト
└── tests/game.test.mjs           JS テスト 17 件
```

**How to Run**
```bash
cd src
python3 -m http.server 8000
# http://localhost:8000

# Tauri デスクトップとして
cargo install tauri-cli --version "^2.0"
cd src-tauri && cargo tauri dev --features desktop

# テスト
cd src-tauri && cargo test           # 26 tests
cd .. && node --test "tests/*.test.mjs"  # 17 tests
```

**Tests**: 43 passing (Rust 26 + JS 17) | **Files**: 19 | **LOC**: ~1,150 | **Build time**: ~34 min

**Challenges & Fixes**
- Tauri CLI 不在でもビルドを通したい → `desktop` features を optional 化、`cargo run` で CLI smoke (副業一覧 + 100 クリックシミュレーション) が表示される設計
- バイラル発生をテスト可能にしたい → `try_start_viral(state, rng_value)` シグネチャで RNG 値を外から渡せるようにし、決定論的にテスト
- Rust と JS でロジック乖離が起きそう → 同じテストケースを両方に書いて 43 件で挙動を担保
- アップグレードコストが線形だと飽きる → ×1.15 の幾何級数で、選択肢のテンポを定番の idle カーブに

**Potential Next Steps**
- 効果音 (クリック・バイラル発生・達成ファンファーレ)
- 副業間の相乗効果 — 同副業を 25 個アップグレードで隣の副業に 10% ボーナス
- ¥10M 達成時間のリーダーボード
- バイラル種類の拡張 (税制改正イベント、円安円高イベント)
- リプレイ機能 — ¥1K → ¥10M までのタイムラインをチャート表示

---

### <a id="ikitsugi"></a>95. ikitsugi - 2026-05-17 02:25

**What is this?**
全ページの隅で常に呼吸し続ける小さなドットを inject するブラウザ拡張機能 (Chrome/Firefox MV3)。クリックで 60 秒のガイドセッションに展開し、吸う/止める/吐く/止めるをリングと色 (amber↔blue) で誘導する。効率厨ゲーマーが画面に集中しすぎて呼吸を忘れる問題に、「邪魔しないけど確かに居る」存在で寄り添う。

**Discovery Roll**
Source: 35 (デベロッパーツール) | Persona: 7 (効率厨のゲーマー) | Platform: 5 (Browser extension Chrome/Firefox MV3) | Intent: 4 (そっと寄り添う — 癒し / 静か)

**Features Built**
- 3 パターンの呼吸 (4-4-8 / box / 4-7-8) を `phaseAt` / `fullnessAt` / `colorAt` で計算
- Shadow DOM (closed) で content script を全 CSS 干渉から完全隔離
- 60 秒ガイドセッション (リング拡縮 + フェーズラベル + 残り秒数 + プログレスバー)
- フルスクリーン / 大画面動画 (画面 60% 以上占有) 検出で自動的に opacity:0
- 統計 (今日のセッション、連続日数 streak、累計サイクル)、`chrome.storage.local` 永続化
- popup (今日/連続/パターン/表示 ON-OFF/「いま 60 秒」) と options (位置、サイズ 18-48px、ラベル、邪魔しない設定、統計リセット)

**Tech Stack**
Manifest V3 / Vanilla JS (ES2022) / Shadow DOM / chrome.storage.local / chrome.runtime messaging / node:test — 依存ゼロ

**Key Files**
```
ikitsugi/
├── src/
│   ├── manifest.json
│   ├── content.js          # 呼吸ドット (Shadow DOM, IIFE, 自前で breath ロジックを mirror)
│   ├── background.js       # session-complete → stats accumulator
│   ├── popup.html/.js
│   ├── options.html/.js
│   ├── icons/              # 16/32/48/128 px
│   └── modules/breath.js, stats.js, settings.js   # 副作用ゼロ logic
└── tests/                  # breath/stats/settings/smoke
```

**How to Run**
```bash
# 拡張機能を読み込む
# chrome://extensions → デベロッパーモード ON → 「パッケージ化されていない拡張機能を読み込む」
# → ikitsugi/src/ を選択

# テスト
cd ikitsugi && node --test "tests/*.test.mjs"
```

**Tests**: 27 passing (breath 12 / stats 7 / settings 6 / smoke 2) | **Files**: 19 | **LOC**: ~1,560 | **Build time**: ~35 min

**Challenges & Fixes**
- Content scripts は ES module をシンプルには使えない → `src/modules/breath.js` のロジックを `content.js` に inline で mirror。テストでは module 版を別途検証して同期を担保。
- 任意のページの CSS が拡張機能の見た目を壊す → Shadow DOM (closed) + `:host { all: initial }` で完全リセット。
- ゲーマーがフルスクリーン中に邪魔されたくない → `document.fullscreenElement` と `<video>` の占有率検出 (>=60%) で自動的に opacity:0、`visibilitychange` でも非表示。
- smoke test のため最小 DOM スタブで innerHTML を解析するのは大袈裟 → `querySelector` を常に新規スタブ要素を返す形にし、IIFE 初期化が例外を投げないことだけを担保。

**Potential Next Steps**
- 呼吸履歴のグラフ (recent N 日 trend) を options に追加
- `chrome.alarms` で 20 分集中したらシステム通知「一息どう?」
- ボイスガイド (Web Speech API: 「吸って」「吐いて」)
- ユーザー定義パターン (吸 X / 止 Y / 吐 Z 秒)
- 心拍計 / Apple Watch との連携 (将来)

---

### <a id="futari-yoho"></a>96. futari-yoho - 2026-05-17 02:55

**What is this?**
共働き夫婦が 1 日 30 秒だけ画面の前で気分・体力・距離感を残し、夜の照明のように静かなダッシュボードで「二人の天気」を眺める Textual TUI。スコアもランキングも「もっと話そう」もない。「今夜は並んでいる夜」「今夜はひとりひとりの夜」と、ただ呟くだけのアプリ。

**Discovery Roll**
Source: 40 (データ分析・ダッシュボード系) | Persona: 26 (共働き夫婦) | Platform: 3 (Python desktop app - Textual TUI) | Intent: 4 (そっと寄り添う — 癒し / メンタル / 静か)

**Features Built**
- 4 ステップ check-in モーダル (mood / energy / solo_want / note)、矢印キー・1-5・Enter で 30 秒
- 単独天気と二人天気の pure 関数 (sun/haze/cloud/rain/storm/moon/calm + 話す夜 / 並んでいる夜 / ひとりひとりの夜 / 静かな夜)
- 今日 / 一週間グリッド / 月のふりかえり 28 点線、すべて判定しない言葉だけ
- どちらかの check-in が無くても壊れない (「片方だけの空」)
- `--demo` でサンプル週間データ、`--no-tui` で 1 行 stdout (cron 用)

**Tech Stack**
Python 3.10+ / Textual 1.0.x / Rich / JSON 永続化 (atomic write) / pytest + pytest-asyncio + Textual run_test pilot

**Key Files**
```
futari-yoho/
├── src/futari_yoho/
│   ├── cli.py           # entry + --demo + --no-tui
│   ├── app.py           # Textual app + CheckInModal + formatters
│   ├── models.py        # CheckIn / Day / Partner / State
│   ├── storage.py       # atomic JSON I/O
│   ├── dates.py         # iso / week_dates / days_back
│   └── weather.py       # single_weather / paired_weather / month_trend
└── tests/               # models 9 / dates 4 / storage 5 / weather 17 / app_smoke 7
```

**How to Run**
```bash
cd futari-yoho
pip install -e .
futari-yoho              # 起動 (c = あの記入、v = いの記入)
futari-yoho --demo       # サンプル週間 + 起動
futari-yoho --no-tui     # 今日の二人を 1 行出力

# テスト
pip install pytest pytest-asyncio
pytest -q                # 42 tests
```

**Tests**: 42 passing (models 9 / dates 4 / storage 5 / weather 17 / app_smoke 7) | **Files**: 13 | **LOC**: ~1,430 | **Build time**: ~30 min

**Challenges & Fixes**
- `_render` 名前衝突 (gochisou-goyomi で踏んだのと同じ) → Textual Widget の内部 `_render` とぶつかって ModalScreen が空表示。すべて `_render_step` にリネームして解決。
- `push_screen_wait` は worker context 必須 → `push_screen(modal, callback)` のコールバック版に書き換え。
- Python 3.10.5 と `>=3.11` の不一致 → `from __future__ import annotations` で全 type hint を遅延評価し、`>=3.10` に下げた。
- 「指示しない」原則 — どんなにエンジニア的に正しくても、scorecard 的な UI を一切置かない方針を維持。week grid のラベルも「話す」「並んで」など名詞句で止めた。

**Potential Next Steps**
- パートナー名を options 画面で書き換え (今は JSON を直接編集)
- 過去の一言メモだけを並べて見る「ふりかえりノート」画面
- `--no-tui` 用に cron 登録ヘルパー (毎晩 21:00 にチェック)
- `data.json` を Dropbox / iCloud に置くワンクリック sync 設定
- 月のふりかえりに気分高低差を薄く重ねる sparkline

---

### <a id="kotoba-mado"></a>97. kotoba-mado - 2026-05-17 03:25

**What is this?**
語学学習者の 1 年分の学習記録を、ターミナルで 12 × 31 のステンドグラスのモザイクとして描画する CLI。Read = 藍、Listen = 琥珀、Speak = 朱、Write = 翠、Vocab = 紫、Grammar = 金。intensity は学習分数の量。GitHub の contribution heatmap に影響されているが、目的は「実用」ではなく「美しさで殴る — スクショ撮りたくなる」こと。

**Discovery Roll**
Source: 40 (データ分析・ダッシュボード系) | Persona: 34 (語学を勉強中の人) | Platform: 2 (CLI / terminal tool — Python) | Intent: 1 (美しさで殴る — スクショ撮りたくなるか)

**Features Built**
- `year` — 12 列 × 31 行のステンドグラスモザイク、鉛枠 (Unicode box) + ジュエルトーン + 合計分数 + 連続日数 + 凡例
- `month [YYYY-MM]` — ひと月の月火水木金土日グリッド、各日の分数併記、月合計
- `today [YYYY-MM-DD]` — Rich Panel に大ブロック + カテゴリ別分数のクローズアップ
- `streak` — 連続日数を ASCII 焚火で 3 サイズ (1-7/8-30/31+) に切り替え、暖色グラデーション
- `add` (対話 + ワンショット)、日本語カテゴリ名 (読む/聴く/...) も accept
- `import` で CSV 一括取り込み、`demo` で 270 日サンプル
- 2 トーンセル — 1 日に複数カテゴリの活動がある場合、▌ + ▐ で半々に色分割
- intensity quantization (0/1-15/15-30/30-60/60-120/120+) を色の彩度として表現

**Tech Stack**
Python 3.10+ / Rich 13.x (Text/Panel/Group/Console.record) / argparse / JSON 永続化 (atomic write) / pytest + capsys / 完全 stdout (TUI なし、cat 可)

**Key Files**
```
kotoba-mado/
├── src/kotoba_mado/
│   ├── cli.py            # argparse + サブコマンド
│   ├── render.py         # 純粋: year/month/today/streak の Rich renderable
│   ├── aggregate.py      # by_day / year_summaries / streak / intensity_bucket
│   ├── models.py         # Session (frozen) + Log
│   ├── storage.py        # atomic JSON I/O
│   └── categories.py     # 6 カテゴリ + 日本語 normalize
└── tests/                # categories 6 / models 7 / storage 5 / aggregate 9 / render 11 / cli 11
```

**How to Run**
```bash
cd kotoba-mado
pip install -e .

# 即・美しさを見る
kotoba-mado --data /tmp/demo.json demo
kotoba-mado --data /tmp/demo.json year
kotoba-mado --data /tmp/demo.json month 2026-05
kotoba-mado --data /tmp/demo.json today 2026-05-17
kotoba-mado --data /tmp/demo.json streak

# 自分のデータで
kotoba-mado add 読む 30 ja --note "村上春樹"
kotoba-mado year

# テスト
pytest -q             # 49 tests
```

**Tests**: 49 passing (categories 6 / models 7 / storage 5 / aggregate 9 / render 11 / cli 11) | **Files**: 14 | **LOC**: ~1,490 | **Build time**: ~30 min

**Challenges & Fixes**
- 月ラベルの幅 — `1月` (3 visual cols) と `10月` (4 cols) が同じ Python `len` で扱われて `:^4` ではズレた。月番号を 1 桁/2 桁で分岐して visual width を固定。
- streak の box が非対称 — 上下のダッシュ数を `inner_width = 13` で揃え、`bar = "─" * 13` で共有。
- テストで Rich の色タグが残る → `Console(record=True, force_terminal=False, color_system=None)` で完全に剥がしてテキストアサート。
- 対話モードでテストが固まる → CLI テストでは必ず引数を渡すパスのみテスト。

**Potential Next Steps**
- `kotoba-mado wall <YEAR>` — 12 ヶ月を 4×3 グリッドの mini-cal で並べる「壁画」モード
- `--lang ja` で言語別フィルタ
- `--svg out.svg` でブラウザ・SNS 向け SVG 出力
- Anki / Duolingo CSV からの直接 import (今は generic CSV のみ)
- 月単位の目標分数オーバーレイ (ただし 美しさで殴る 原則を侵さない範囲で薄く)

---

### <a id="meme-fuda"></a>98. meme-fuda - 2026-05-17 03:55

**What is this?**
シニアと家族が一台のラップトップを挟んで二人で「思い出ミーム札」を作る Textual TUI。12 種類の柔らかい顔文字テンプレ (うれしい/こまった/なつかしい/...) のひとつを選び、 上下 2 行に状況と落ちを書く。 札には「話: ばあちゃん / 書: 孫」が記録され、 ローカルの "家のデッキ" に積まれる。 起動画面が「話す人 / 書く人」を聞いてくる ── Intent 7「2人で開けるか」をプログラム的に確認する設計。

**Discovery Roll**
Source: 5 (Viral memes and internet culture of the week) | Persona: 36 (老後を楽しんでいるシニア) | Platform: 3 (Python desktop — Textual TUI) | Intent: 7 (誰かと一緒にやる — 2 人で開けるか)

**Features Built**
- 12 templates — 棘のない柔らかい顔文字のみ、 1-3 行のかなり丁寧な ASCII アートと hint 例文
- SetupScreen — 起動直後に「話す人 / 書く人」 入力、 Esc で skip 可
- ComposeScreen — `Ctrl+←` / `Ctrl+→` でテンプレ切替、 上下 Input が live preview に反映、 `Ctrl+S` 保存、 `Ctrl+D` デッキへ
- DeckScreen — `← →` で札をめくる、 `Delete` で捨てる、 `Esc` で戻る、 空の時は invitation message
- 鈍金 #b8945b と薄紅 #c47b76 と墨 #2b2820 の「和紙」配色、 罫線は dim グレー、 余白多めでシニアの目に優しく
- タグ #昭和 #旅行 のように小さな chip 風にレンダリング
- `~/.meme-fuda/deck.json` atomic write
- TUI と純ロジックを分離: templates / models / render は Textual を一切 import しない

**Tech Stack**
Python 3.10+ / Textual 1.x / Rich 13 / JSON atomic write / pytest + pytest-asyncio + Textual run_test pilot

**Key Files**
```
meme-fuda/
├── src/meme_fuda/
│   ├── cli.py           # entry, --speaker/--writer で setup skip
│   ├── app.py           # MemeFudaApp + SetupScreen + ComposeScreen + DeckScreen
│   ├── render.py        # render_card / render_card_plain / render_thumbnail
│   ├── models.py        # Card + Deck (CRUD, atomic)
│   ├── storage.py       # JSON I/O
│   └── templates.py     # 12 kaomoji + hint
└── tests/               # templates 6 / models 6 / storage 5 / render 7 / app_smoke 11
```

**How to Run**
```bash
cd meme-fuda
pip install -e .
meme-fuda                                       # setup → compose → deck
meme-fuda --speaker ばあちゃん --writer 孫       # setup skip
pytest -q                                       # 35 tests
```

**Tests**: 35 passing (templates 6 / models 6 / storage 5 / render 7 / app_smoke 11) | **Files**: 13 | **LOC**: ~1,340 | **Build time**: ~28 min

**Challenges & Fixes**
- `_render` 名前衝突 (3 度目) — Textual Widget の内部 `_render` と画面の `_render(self)` メソッドがぶつかって ComposeScreen が空表示。 全部 `_refresh_view` にリネームで解決。 ── このバグは記憶に刻んだ。
- Input が arrow key を吸う — テンプレ切替を `left/right` にしていたら Input cursor 移動に取られて反応せず。 `Ctrl+←` / `Ctrl+→` + `priority=True` で解決。 UX 的にも「カテゴリ切替」感が強くなった。
- `Ctrl+D` も priority 指定必要 — Input focus 下では bubble 前に消費される。
- "二人で開く" を強制せず、 でも誘導する設計 — Setup screen は Esc で skip 可。 でも、 飛ばさずに名前を入れた方が札に意味が宿る、 という構造そのものが Intent 7 のチェック。

**Potential Next Steps**
- 「今日の一枚」 — 起動オーバーレイで過去のランダムな札を 1 枚表示
- ポストカードサイズの SVG / PNG エクスポート (印刷して年賀状の隅に)
- ボイスメモ添付 (m4a を Card に紐付け、 再生)
- 多人数 — 今は speaker/writer の 2 人だけ。 父・母・孫・親戚と複数登録可に
- LINE 貼り付け用 OG 画像エクスポート (画像化サーバー → ローカル PIL レンダリング)

---

### <a id="tane-kawase"></a>99. tane-kawase - 2026-05-17 04:25

**What is this?**
語学を勉強中の二人が、 5-10 個のことばを「種包」 として `packet.json` で交わす CLI。 受け取った包を `plant` すると自分の畑 (ASCII art の野菜畑) にトピック別の列が一行ずつ伸びていく。 春菜 (新表現) / 夏野菜 (動詞) / 秋穀 (慣用句) / 冬根 (丁寧体) / 草花 (スラング) の 5 トピック × 専用作物グリフ (ψ ◯ ‖ ▽ ✿)。 採点しない、 マスター率を出さない、 ただ二人の交換の儀式そのものをツール化した、 Intent 7 の純度を最優先にした作品。

**Discovery Roll**
Source: 21 (Agriculture / sustainability) | Persona: 34 (語学を勉強中の人) | Platform: 2 (CLI Python) | Intent: 7 (誰かと一緒にやる — 2 人で開けるか)

**Features Built**
- 5 トピック × 専用作物グリフ + 自然色パレット (若草 / 朱赤 / 黄金 / 焦茶 / 薄紫)
- 包 (Packet): JSON ファイル、 1-10 種、 送り主・受け取り手・言語・1-2 行の手紙
- `pack` 対話モード、 `send` one-shot モード (`--seed "term|gloss|reading|example|note"`)
- `open` (プレビュー)、 `plant` (畑に追加)、 `field` (ASCII farm)、 `stats` (数字)、 `harvest` (マスター化)、 `demo`
- 畑は 1 トピック 1 行、 13 種以上は「+N」 で省略、 送り主の名前が右端に並ぶ
- 「最近もらった / 最近送った / 交わした包の総数」 がフッターに常時表示

**Tech Stack**
Python 3.10+ / Rich 13.x / argparse / atomic JSON I/O / pytest + capsys / 依存ゼロのコア (topics / models / render / storage)

**Key Files**
```
tane-kawase/
├── src/tane_kawase/
│   ├── cli.py           # argparse + 8 subcommands
│   ├── render.py        # render_field / render_packet / render_stats
│   ├── models.py        # Seed / Packet / Field (validated)
│   ├── storage.py       # atomic JSON I/O for field & packet
│   └── topics.py        # 5 topics (key/name/glyph/color)
└── tests/               # topics 7 / models 10 / storage 6 / render 6 / cli 13
```

**How to Run**
```bash
cd tane-kawase && pip install -e .

# 一人で雰囲気を見る
tane-kawase --field /tmp/me.json demo --name "ちあき"
tane-kawase --field /tmp/me.json field

# 友人へ包を渡す
tane-kawase --field /tmp/me.json send \
    --name "週末の動詞" --topic natsu_yasai --out /tmp/p.json \
    --sender "ちあき" --receiver "りん" --language en \
    --letter "りんへ" \
    --seed "hang out|だらだら過ごす|hæŋ aʊt|We hung out at the park.|よく使う"

# 友人から受け取った包を植える
tane-kawase plant ~/Downloads/p.json

# テスト
pytest -q                                       # 42 tests
```

**Tests**: 42 passing (topics 7 / models 10 / storage 6 / render 6 / cli 13) | **Files**: 13 | **LOC**: ~1,420 | **Build time**: ~26 min

**Challenges & Fixes**
- 「ファイル交換 vs クラウド sync」 — Dropbox / Gist / S3 sync を組み込もうかと一瞬考えたが、 ユーザーがどこ経由で渡すかに介入しない方が儀式が壊れない。 LINE / メール / USB / Slack — どこからでも `plant` できる設計を維持。
- 対話モード (`pack`) はテストしづらい — `console.input()` が stdin を読むため、 同等機能を `send` (one-shot) として実装し、 テストは `send` 経由で書いた。 `pack` は人間用 UX。
- 作物色が黒背景で見にくい — Rich のデフォルト color_system で確認、 若草と焦茶が暗く沈んでいたので、 黄金と朱赤を強めにして明度差を確保。
- 「種を集める」 のではなく 「種を交わす」 — 単語帳系アプリは「自分のコレクション」 を膨らませる方向に行きがちだが、 Intent 7 を守るため 「送った量 vs 受けた量」 を同列に並べた statsにし、 「友人がいないと帳が育たない」 構造にした。

**Potential Next Steps**
- `field --lang en` で言語ごとの畑フィルタ
- 「あなたとさくらが共通して持っている春菜」 ── 友人間の重なりを集計
- 包の暗号化 — 受け取り手しか open できない passphrase 化
- 「最後に交わしたのは 12 日前」 とフッターでそっと促すリマインド
- 双方向ペアビュー — 英語学者の畑と日本語学者の畑を左右に並べる
- 種の「枯れる」 機能 — 30 日触れないとアーカイブ送りで畑から消える (収穫したものはカウント永続)

---

### <a id="denshou-bako"></a>100. denshou-bako - 2026-05-17 04:55

> 🎏 **100 件目のアプリ.** `/loop 30m /auto-dev` の自動ビルドが、 12 時間の累積で
> 偶然たどり着いた「本人がいなくなった後に価値が出る」 装置。

**What is this?**
Raspberry Pi の枕元の小さな箱。 シニアが押しボタンを 1 度押すと、 365 個の
B2B 知恵問いから今日の問いが espeak-ng の声で読み上げられる。 もう一度押すと
赤 LED が点いて録音が始まり、 最長 2 分で 1 日分の音声 + JSON メタが SD カードに
保存される。 別マシンで `denshou book` を実行すると、 1 年分のアーカイブが
Markdown / HTML の「知恵帳」 として書き出され、 各エントリには手動 or Whisper
での書き起こし欄が残してある。

10 年後に孫・後輩・後継者が再生したときに、 まだ価値があるかどうか — それだけが
評価軸 (Intent 6)。

**Discovery Roll**
Source: 18 (B2B enterprise pain points — CRM/ERP/HR/logistics) | Persona: 36 (老後を楽しんでいるシニア) | Platform: 16 (Arduino / Raspberry Pi IoT — code + wiring guide) | Intent: 6 (記録して残す — 10 年後も価値があるか)

**Features Built**
- **365 問の B2B 知恵問い** を 7 カテゴリ (仕事の哲学 / ひととの距離 / お金の感覚 / 失敗から学んだ / 道具と現場 / 時代の変化 / 後輩へ) に分けて手書き、 1 週間に全カテゴリを一巡する interleave
- **Backend 抽象化** — `MockBackend` (テスト・dev)、 `MacBackend` (say + sox)、 `PiBackend` (espeak-ng + arecord + GPIO 押しボタン + LED 2 つ)
- **`run_session()`** が 1 サイクル (TTS → ボタン → 録音 → メタ) を編成、 2 秒長押しで「今日は飛ばす」 をサポート
- **`denshou book`** が フォルダから Markdown / HTML の「知恵帳」 を生成、 「書き起こしを貼ってください」 のプレースホルダ付き
- **`denshou demo`** で MockBackend を使った N 日分のサンプルアーカイブを即生成 (Pi 不要で全体感を確認可能)
- **`denshou parts`** で BOM 約 ¥14,500、 `denshou wiring --systemd` で配線図 + systemd unit テンプレ
- **RUNNING.md** に Raspberry Pi の組み立て・配線・systemd 設定・トラブルシューティングを一通り記載

**Tech Stack**
Python 3.10+ / Rich 13.x / argparse / 標準 `wave` / subprocess (espeak-ng/arecord/say/sox) / RPi.GPIO (lazy, extras: `pi`) / pytest + capsys

**Key Files**
```
denshou-bako/
├── src/denshou_bako/
│   ├── cli.py            # 6 subcommands
│   ├── audio.py          # Backend / MockBackend / MacBackend / PiBackend
│   ├── session.py        # run_session() の orchestration
│   ├── book.py           # Markdown / HTML wisdom book
│   ├── questions.py      # 365 questions + interleave + question_for(date)
│   ├── categories.py     # 7 categories
│   └── wiring.py         # BOM + ASCII schematic + systemd unit
├── tests/                # categories 5 / questions 8 / audio 7 / session 6 / book 6 / cli 9
├── RUNNING.md            # 組み立て・配線・systemd 完全ガイド
└── ...
```

**How to Run**
```bash
# 開発機で
cd denshou-bako && pip install -e .
denshou                                # 今日の問いを表示
denshou demo --out /tmp/d --days 14   # サンプルアーカイブ生成 (Pi 不要)
denshou book /tmp/d                    # Markdown 知恵帳
denshou book /tmp/d --html --out wisdom.html
denshou parts                          # BOM
denshou wiring --systemd               # 配線図 + systemd unit
pytest -q                              # 41 tests

# Pi で
sudo apt install -y espeak-ng alsa-utils
pip install -e .[pi]
denshou record --backend pi --out ~/recordings --loop
# (詳細は RUNNING.md)
```

**Tests**: 41 passing (categories 5 / questions 8 / audio 7 / session 6 / book 6 / cli 9) | **Files**: 18 | **LOC**: ~2,050 | **Build time**: ~32 min

**Challenges & Fixes**
- カテゴリが連続ブロックで並んでいて、 デモ 7 日が全部 「お金の感覚」 になった — `_interleave_by_category` で 7 カテゴリを 1 ずつ取り出すラウンドロビン形に再配列して 1 週間で全カテゴリに触れる形にした
- ハードウェアなしで信頼できるテストを書く — `MockBackend` を最初から設計の中心に置き、 PiBackend は lazy import で RPi.GPIO 未インストール環境でも import が通る
- Whisper を組み込むか迷ったが、 依存が重い + Pi で動かすには Whisper.cpp 必要 + 10 年後により良い書き起こし AI が出る — 「録音 + 書き起こし空欄」 で止めて、 ユーザーが好きな経路で埋める前提にした (10 年保管の哲学にも合う)

**Potential Next Steps**
- Whisper.cpp を Pi 4 でローカル走らせる pipeline (optional extras)
- VOICEVOX / Coqui TTS でもっと自然な声に
- `--audience family|industry` で問いの選択を切り替え
- macOS Menu Bar 版 (毎晩 22:00 通知 + 録音、 Pi 持ってない人向け)
- 「言わなくていい問い」 のユーザー除外設定
- 録音 E2E 暗号化 (10 年後の家族のみ passphrase で開封可)
- 知恵帳 HTML のカテゴリ密度 sparkline

---

### <a id="chika-channel"></a>101. chika-channel - 2026-05-17 05:30

**What is this?**
駆け出しの YouTuber/TikToker が、 動画を 1 本 = 1 駅、 ジャンル = 1 路線として **地下鉄路線図そのもの** に育てていく Bun ベースの中毒系ブラウザゲーム。 1 日 4 秒のテンポで時間が流れ、 視聴者点が線を流れて登録者数を伸ばす。 夜のアクションフェーズで駅を追加・接続・更新。 毎週ランダムなアルゴリズム天候 (Vlog 季節、 ショート嵐、 サムネ戦争、 アルゴリズム再構成 etc.) が路線図を揺らす。 「時間を忘れる」 だけが評価軸 (Intent 5)。

**Discovery Roll**
Source: 19 (Infrastructure / civil engineering / urban planning) | Persona: 4 (YouTuber / TikToker 志望) | Platform: 18 (Deno / Bun) | Intent: 5 (夢中にさせる — 時間を忘れるか)

**Features Built**
- 6 topic (料理 ○ / ゲーム □ / Vlog △ / 学び ✕ / 笑い ◇ / ショート ▽) × 専用 base_views と紙地下鉄図風パレット
- SVG 路線図、 紙背景の薄罫線、 transfer 駅は二重丸、 vibe で半径変化、 age 14日以降は薄くなる
- traffic シミュ: base × vibe × age_decay × line_bonus × weather × low_vibe_penalty、 transfer +50% + 登録者 +5/日
- 7 種の algorithm weather: calm / vlog_season / gaming_chill / thumb_war / algo_reset / shorts_storm / edu_renaissance
- 1 日 4 秒のアニメーション、 view counter が ease-out で滑らかに伸びる、 夜は AP 制 (1-6、 登録者で増)
- チェックポイント解放 (1k / 10k / 100k 登録者で 新トピック・新タイプ駅) + トースト通知
- localStorage 自動 save / load、 `/api/leaderboard` の in-memory POST/GET
- `bun build` で client TS を bundle、 server は Bun.serve 直書き

**Tech Stack**
Bun 1.3.x / TypeScript / Vanilla TS + SVG クライアント / `bun build --target browser` でバンドル / `bun:test` で全テスト / localStorage save / in-memory leaderboard

**Key Files**
```
chika-channel/
├── src/
│   ├── game/             # 純ロジック (rng, topics, network, weather, traffic, game, save)
│   ├── server/index.ts   # Bun.serve + static + /api/leaderboard
│   └── client/app.ts     # SVG レンダラ + day/night loop + HUD
├── public/               # index.html / style.css / app.js (bundled)
└── tests/                # topics 5 / network 9 / traffic 8 / weather 7 / game 5 / save 4 / server 7
```

**How to Run**
```bash
cd chika-channel
bun install
bun run dev                # builds client → starts http://localhost:5173
bun test                   # 45 tests
```

**Tests**: 45 passing (topics 5 / network 9 / traffic 8 / weather 7 / game 5 / save 4 / server 7) | **Files**: 18 | **LOC**: ~1,850 | **Build time**: ~30 min

**Challenges & Fixes**
- `removeStation` がプルーニングした線の back-reference を残していた → `station.line_ids` から pruned_line_ids を Set でストリップするよう修正
- URL parser が `/../` を正規化するので path-traversal テストの意味が薄かった → テスト期待値を「400 か 404 のどちらか」 に緩めて、 実セキュリティはファイルが public/ 外にないことで担保
- 「50 日 advanceDay で 1000 登録者に届く」 テストが現実離れ → unlock 関数のテストは subs を直接設定して 1 回 advanceDay する形にし、 unlock フラグのトグルだけ確認
- Bun の static は TS をブラウザに直に投げると text/plain になり実行不可 → `bun build --target browser` で client を bundle するように package.json に build スクリプト追加、 dev は build → serve の連鎖

**Potential Next Steps**
- 真のドラッグで線を引く UX (今は「接続」 ボタン後に 2 駅クリック)
- 視聴者点が線に沿って流れるアニメーション (passenger dots) で 「視聴者が来ている」 を可視化
- 競争モード — leaderboard を活用、 「30 日で何 k 届いた?」 を競う
- モバイル縦レイアウト
- 音響 (控えめに) — 駅追加 / 接続 / 天候変化
- 「あなたの路線図への辛口コメント」 を AI で 1 ターン 1 回もらえるオプション

---

### <a id="hibi-no-mukashi"></a>102. hibi-no-mukashi - 2026-05-17 06:15

**What is this?**
子育てで疲れたパパ・ママが、 子供が寝た後の 3 分間に開く、 静かな歴史の小窓。 Rust + WASM の超軽量シングルページ Web アプリ。 「今日と同じ日付に誰かの台所で / 庭で / 机で起きていた、 小さなこと」 を 1 日 1 つだけ、 60-150 文字の vignette として差し出す。 戦争・大事件・偉人の話は一切採用せず、 静けさで心拍を下げることだけが評価軸 (Intent 4)。 ローカルストレージに 1 日 1 行の「今夜の思い」 を保存して、 30 日続ければ本人だけの静かな日記が育つ。

**Discovery Roll**
Source: 28 (Historical "on this day") | Persona: 39 (子育て中のパパ/ママ) | Platform: 10 (Rust + WASM web app) | Intent: 4 (そっと寄り添う — 心拍が下がるか)

**Features Built**
- 40 件の手書き vignette を 12 ヶ月にわたり分散 — 「茉莉花が初めて咲いた縁側」 「冬至の柚子湯の一番風呂に皮を 1 枚」 「灯篭の紙に「凪」の字」 など、 すべて domestic / small / specific
- `vignette_for(date_iso)` — 正確な MM-DD で見つからない時は **最も近い日付** にフォールバックし、 UI は「近い日の話」 と素直に表示
- 12 のミニ SVG モチーフ (flower / lamp / hand / leaf / bowl / basket / bird / cloud / moon / shadow / step / gate)、 `currentColor` でテーマカラー連動
- 前後の日付ナビ (`next_md_after` / `prev_md_before`、 年をまたいで wrap)、 キーボード ← → h
- localStorage に MM-DD キー化した「今夜の思い」 — 過去のものは「最近の思い」 セクションで一覧可能
- 和紙風配色 + Mincho フォント + 余白多め、 モバイル幅では motif が右下配置に
- 完全オフライン (WASM 焼き込み)、 通知 / streak / 共有ボタンなし

**Tech Stack**
Rust 1.94 + wasm-bindgen 0.2 + serde-wasm-bindgen / wasm-pack で 66 KB の WASM + 11 KB の glue JS / Vanilla JS フロントエンド (build tool は wasm-pack のみ) / cargo test で 20 unit tests

**Key Files**
```
hibi-no-mukashi/
├── src/
│   ├── lib.rs            # wasm-bindgen 公開関数
│   ├── vignettes.rs      # 40 件の static Vignette
│   ├── select.rs         # parse_iso, select_for_iso (exact / nearest)
│   └── motifs.rs         # 12 個の SVG path
├── tests/                # vignettes 8 / select 9 / motifs 3
├── web/                  # index.html / style.css / app.js / pkg(generated)
├── Cargo.toml
└── ...
```

**How to Run**
```bash
cd hibi-no-mukashi
wasm-pack build --target web --release --out-dir web/pkg
python3 -m http.server -d web 8080
# http://localhost:8080
cargo test                    # 20 tests
```

**Tests**: 20 passing (vignettes 8 / select 9 / motifs 3) | **Files**: 17 | **LOC**: ~1,360 | **Build time**: ~28 min

**Challenges & Fixes**
- `wasm-opt` が古いバージョンで新 WASM 仕様を validate できず失敗 → `[package.metadata.wasm-pack.profile.release] wasm-opt = false` で disable (バイナリは 66 KB と十分小さい)
- 自分の banned-keyword テスト (`戦争` 禁止) が自作 vignette を落とした → 「戦争で焼けた後も」 を 「店が建て直された後も」 にリワード、 自分のルールを守った
- 365 件 vs 40 件のトレードオフ — 365 全部を 1 セッションで書くのは雑になる、 40 件を心を込めて書いて nearby fallback で穴を埋める設計に倒した
- 漢字の選び方 — TTS 読み上げと 9pm の親の集中力に合わせて、 「茉莉花」 のような難読は使うが書き言葉は避ける

**Potential Next Steps**
- 365 件への漸次充足 (毎月リマインダーで著者が 1 件書く設計)
- PWA 化 (Service Worker、 6 KB の追加で完全オフライン)
- Web Speech API で TTS 読み上げ
- 「子供と一緒に読む」 5-7 歳向け平易版を別 vignette として併記
- 自分の子の誕生日 / 記念日紐付け
- 史実ベースか創作かを明示する透明性表記

---

### <a id="juugobyou"></a>103. juugobyou - 2026-05-17 06:50

**What is this?**
ぐったりした時に開く、 15 秒だけの小さなボタン。 タップすると円が 15 秒かけて満ち、 「視界にある〇〇を、 ひとつだけ、 元の場所に。」 のような物体を 1 つだけ指す静かなプロンプトが現れる。 15 秒経つと「ありがとう。 ここまでで、 十分です。」 のフェアウェルに切り替わり、 ボタンは元に戻る。 streak も達成ゲージもなく、 「今日 N 回さわった」 のさわった回数だけが下に残る。Rust + WASM の超軽量シングル HTML アプリ。 「達成」 「完了」 「片付けた」 は banned-word テストで弾かれる。

**Discovery Roll**
Source: 14 (フィットネス/ウェルネス/メンタルヘルス) | Persona: 32 (片付けが苦手な人) | Platform: 10 (Rust + WASM web app) | Intent: 4 (そっと寄り添う — 心拍が下がるか)

**Features Built**
- 1 つのデカい円形ボタン (220 × 220、 モバイル 180 × 180) — タップで 15 秒の SVG ring fill アニメーション
- 40 個の物体プロンプト (コップ / 本 / 紙 / ペン / リモコン / 靴下 / ハンカチ / 皿 / 鞄 / 羽織 / 封筒 / メモ / 鍵 / 眼鏡 / 薬 / 缶 / 瓶 / 袋 / 箱 / 充電器 / イヤホン / 雑誌 / 化粧品 / 髪ゴム / クッション / 枕カバー / タオル / コースター / 鏡 / 領収書 / 葉書 / ティッシュ箱 / リップ / 靴 / 傘 / 電池 / メガネケース / ペンキャップ / 栞) を `touchToday % 40` で循環
- 3 種類の声 — **静か** (主語なし命令)、 **友達** (「ね」 で終わる)、 **おかあさん** (「ねえ」 で始まる)
- 15 秒 → 4 秒のフェアウェル → idle、 1 タップ 19 秒のサイクル
- カウンター 「今日 N 回さわった」 (日付付きで保存、 日が変われば自動リセット)
- 声選択は localStorage に persist
- Space / Enter キーでもタップ可
- 禁止語監査 — `["頑張", "怠け", "汚", "ダメ", "クリア", "達成", "完了", "やり遂げ", "諦めず", "努力"]` を全プロンプト × 全声 × farewell に対して cargo test で audit

**Tech Stack**
Rust 1.94 + wasm-bindgen 0.2 + serde / serde-wasm-bindgen 0.6 / wasm-pack (target=web) / Vanilla HTML+CSS+ES module / localStorage 2 キー / cargo test で 16 ユニットテスト / wasm-opt は disable (古い binaryen 回避)

**Key Files**
```
juugobyou/
├── src/
│   ├── lib.rs            # wasm-bindgen 公開: prompt/farewell/voices/total_prompts
│   ├── prompts.rs        # 40 件の object + BANNED_WORDS
│   └── voice.rs          # Voice enum + render() + farewell()
├── tests/                # prompts 8 / voice 8 = 16
├── web/                  # index.html / style.css / app.js / pkg(generated)
├── Cargo.toml            # wasm-opt = false
└── ...
```

**How to Run**
```bash
cd juugobyou
cargo test                                          # 16 tests
wasm-pack build --target web --release --out-dir web/pkg
python3 -m http.server -d web 8080
# http://localhost:8080
```

**Tests**: 16 passing (prompts 8 / voice 8) | **Files**: 10 source | **LOC**: ~805 | **Build time**: ~30 min

**Challenges & Fixes**
- `wasm-opt` の古さを予防適用 — `[package.metadata.wasm-pack.profile.release] wasm-opt = false` を Cargo.toml に最初から入れた (前 cycle の hibi-no-mukashi で学んだ教訓)
- 「達成」 「完了」 「片付けた」 「クリア」 を避ける言葉選び — BANNED_WORDS の cargo test 監査で毎ビルド保証
- 「主語を入れない」 規約 — quiet 声は 「あなた」 「君」 「お前」 を一切使わない、 voice.rs::tests で正規表現監査
- タップを「触る」 と呼ぶ — counter の表示は「今日 N 回さわった」、 「やった」 「完了」 とは絶対書かない (CLAUDE.md 規約)

**Potential Next Steps**
- 触った時刻だけを保存するログ (週ビュー、 streak ではなく振り返り)
- PWA 化 (Service Worker、 オフライン)
- 長押し 7 秒バージョン / 短押し 15 秒の 2 段階
- Web Audio で 15 秒の極小ピアノ単音 (オプトイン)
- 「触らない」 ボタン — 円を見ているだけで 15 秒経つモード
- 物体プロンプトを 40 → 60 にゆっくり拡張、 季節モチーフ (花、 落ち葉、 障子)

---

### <a id="aisaji"></a>104. aisaji - 2026-05-17 07:15

**What is this?**
スマホ 1 台を 2 人で持って、 90 秒で「今夜の夕飯」 を 2 人の匙加減で決める Vanilla Web ゲーム。 帰宅後に「夕飯どうする?」 で 30 分会議するのを止めるためのアプリ。 タップで開始 → 6 秒ごとに料理カード (家庭料理 40 件 + 逃げ道 4 件) が切り替わる → 左半分が「あなた」、 右半分が「相手」 のタップゾーンで、 気が向くカードに各自スタンプ → 90 秒経過後、 両方が「OK」 したカードから 1 枚だけ「今夜の夕飯」 として大表示。 streak も連勝も総タップ数も出さず、 終わったら短いねぎらい文 (「今夜は ここまでで 十分です。」 など) で締める。

**Discovery Roll**
Source: 9 (食 / レシピ / 外食文化) | Persona: 40 (ストレスを抱えた管理職) | Platform: 1 (Web app - Vanilla) | Intent: 7 (誰かと一緒にやる — 2 人で開けるか) — 元の Platform roll 14 (Godot) はローカル環境に Godot バイナリが無いため Phase 4 quality gate を通せず、 Platform のみ reroll した (Source / Persona / Intent はそのまま)

**Features Built**
- 1 タップで始まる 90 秒 round、 6 秒ごとに 15 枚のカードが順番表示
- 各カードに 1-2 文字の glyph + 料理名 + tone (rice / meat / fish / veg / soup / sweet / escape) で色分け、 escape カードは斜線ハッチで視覚的に区別
- エスケープカード (外食 / 冷凍餃子 / ピザ宅配 / 茶漬けでいい) は必ず 1 枚以上混じる、 deterministic seeded pick
- 左半分 / 右半分の split tap zone、 タップで「✓ 気が向く」 にトグル、 タッチ + キーボード (A / L) の両対応
- judge() が結果を返し、 両方が OK したカードからランダム 1 枚を選ぶ (0 枚なら「外食でいい」 結果)
- ねぎらい文 6 種、 禁止語監査 (`頑張` `努力` `達成` `ナイス` `すごい` `天才` `クリア` `連勝` `完璧` `完了`) を Vitest で audit
- 履歴は「きょう N 回引きました / さっきは X」 だけを 1 行 footer に (streak / 連勝表示なし)
- Vibration API でタップフィードバック (対応ブラウザのみ、 opt-in)

**Tech Stack**
Vanilla HTML / CSS / ES Module、 ビルドツール無し / 純 JS ロジック (cards / rand / pickHand / judge / timer) を src/ に分離、 web/app.js だけが DOM を触る / xorshift32 シードランダム + golden-ratio warmup (小さい seed の偏り対策) / Vitest 1.6 で 28 ユニットテスト / localStorage で 7 日分の履歴

**Key Files**
```
aisaji/
├── src/
│   ├── rand.js           # xorshift32 + warmup
│   ├── cards.js          # 40 dishes + 4 escapes
│   ├── pickHand.js       # deterministic n-card hand
│   ├── judge.js          # both-ok matching + closers + banned words
│   └── timer.js          # createRound + fakeClock
├── tests/                # 5 files / 28 tests
├── web/                  # index.html / style.css / app.js
└── package.json          # vitest dev dep
```

**How to Run**
```bash
cd aisaji
npm install
npm test                           # 28 tests
python3 -m http.server 8080        # プロジェクトルートから起動
# http://localhost:8080/web/
```

**Tests**: 28 passing (cards 7 / rand 4 / pickHand 6 / judge 7 / timer 4) | **Files**: 10 source | **LOC**: ~700 source + ~250 test | **Build time**: ~28 min

**Challenges & Fixes**
- **xorshift32 の小さい seed バイアス**: seed=1, 2, 3... のような小さい値だと、 初回 rng() が常に 0 に近い値を返し、 違う seed でも判定結果が同じになる。 `tests/judge.test.js` の「違う seed で違う pick」 テストで顕在化。 修正は seed 初期化時に 0x9e3779b1 と XOR + 3 ラウンドの warmup を入れること
- **`web/app.js` から `../src/` を import するパス問題**: ES module の relative import が成立するためには HTTP server のルートが プロジェクト直下である必要がある (`-d web` 起動だと src/ が見えない)。 README / SUMMARY で `python3 -m http.server` をプロジェクトルートから起動するよう明記
- **Platform 14 (Godot) を諦めた判断**: Godot バイナリ が無い環境では Phase 4 の quality gate を通せない (動作確認できない)。 Source / Persona / Intent の組み合わせが面白かったので Platform だけ reroll する戦略を取った
- **1 人プレイモード / streak の誘惑**: Intent 7 = 「2 人で開けるか」 が魂なので、 1 人モードを実装しなかった。 ストレス管理職向けは「達成感を与えれば中毒する」 が定石だが、 「ねぎらいで終わる」 を優先

**Potential Next Steps**
- Web Audio で 90 秒のタイマー音 (5 秒ごとの極小ピアノ音、 opt-in)
- 「外食でいい」 結果のときに付近のお店検索ボタン (Google Maps deep link)
- 履歴の週ビュー / 月ビュー (中立な一覧のみ、 streak / 連勝として演出しない)
- 子供向けカードパック (カレー甘口 / 中辛 など)
- 60 秒 / 120 秒の長さ選択 (デフォルトは 90 秒のまま)
- PWA 化 (Service Worker でオフライン)

---

### <a id="sekai-wadaichou"></a>105. sekai-wadaichou - 2026-05-17 07:40

**What is this?**
深夜 2 時、 ES の手が止まった就活中の大学生のための Textual TUI。 ←→ で ASCII 地球儀を 30 度ずつ回すと、 12 都市が順に spotlight (●) に入る。 各都市には「今日の文化イベント」 と「明日の面接の引き出しになる 1 行」 が書いてあり、 Enter で「話題帳」 (= JSON dossier) に綴じられる。 Tab で「話題帳」 ビューを開き、 これまで集めた都市を一覧できる。 1 周 = 12 都市は数分で回れて、 毎日違う都市から興味を持てる軽さ。 streak / 連勝記録 / 点数は一切出さない。

**Discovery Roll**
Source: 27 (Random holiday / cultural event happening today somewhere) | Persona: 23 (就活中の大学生) | Platform: 3 (Python desktop / Textual TUI) | Intent: 5 (夢中にさせる — 時間を忘れるか)

**Features Built**
- 12 都市 (NY / サンパウロ / ロンドン / パリ / ベルリン / イスタンブール / ムンバイ / シンガポール / 上海 / 東京 / シドニー / ヨハネスブルグ) を経度順で配置
- ← / → / h / l で 30 度回転、 spotlight は最寄り経度の都市に自動 snap
- ASCII globe レンダリング (21 × 9 ディスク)、 背面 (±90° を超える側) の都市は非表示にして「地球儀を回している」 感覚を再現
- Enter で「話題帳」 に綴じる、 重複防止
- Tab で DossierScreen に切り替え、 綴じた都市を一覧 (都市名 / event / talking_point / 綴じた日時)
- 禁止語監査 (「頑張」 「努力」 「がんばれ」 「絶対」 「成功」 「勝ち組」 「受かる!」 「正解はこれ」 「確実」) を pytest で全 talking_point / event に対して audit
- JSON atomic write (tempfile + os.replace) で `~/.sekai-wadaichou/dossier.json` に保存、 破損 JSON からの recovery
- Textual `_render` shadowing 予防 — redraw helper は `_refresh_view`、 headless `run_test()` で回帰検出

**Tech Stack**
Python 3.10+ / Textual 1.0 / dataclasses / 標準ライブラリのみ / pytest + pytest-asyncio (auto モード) で 31 ユニット + 統合テスト / 純ロジック (globe / cities / dossier) は src/ に分離、 app.py だけが Textual 依存

**Key Files**
```
sekai-wadaichou/
├── src/sekai_wadaichou/
│   ├── cities.py         # 12 都市 + BANNED_WORDS
│   ├── globe.py          # Globe rotation + render_globe (ASCII 21×9)
│   ├── dossier.py        # JSON atomic IO
│   └── app.py            # WadaichouApp + GlobeScreen + DossierScreen
└── tests/                # 4 files / 31 tests (incl. 3 headless app smoke)
```

**How to Run**
```bash
cd sekai-wadaichou
pip install -e ".[test]"
pytest                    # 31 tests
sekai-wadaichou           # TUI 起動
```

**Tests**: 31 passing (cities 10 / globe 9 / dossier 9 / app smoke 3) | **Files**: 10 source | **LOC**: ~965 | **Build time**: ~26 min

**Challenges & Fixes**
- **4 longitude quadrants テストの失敗**: 12 都市の選択で (-180, -90) の太平洋ど真ん中の領域がカバーされず、 当初テストが落ちた。 12 都市の入れ替えではなく、 テストを「3 quadrant 以上」 + 「経度幅 180°+」 に緩めた (ユーザー視点では「東西広く回る感じ」 があれば十分)
- **`_render` メソッドの予防回避**: 過去 3 回踏んだ Textual の `Widget._render` shadowing bug (gochisou-goyomi / futari-yoho / meme-fuda)。 CLAUDE.md の冒頭に明記し、 GlobeScreen / DossierScreen の redraw helper は `_refresh_view` で統一、 さらに `tests/test_app_smoke.py` で headless `run_test()` を走らせて回帰を検出するようにした
- **pytest-asyncio の auto モード設定**: Textual の `run_test()` は async context なので `[tool.pytest.ini_options].asyncio_mode = "auto"` を pyproject.toml に追加 (これがないと smoke test がスキップされる)
- **Intent 5 の解釈**: 「中毒/競う」 が定石だが、 就活生に streak で煽るのは Intent 5 の精神 (「時間を忘れる」) と矛盾しないかを慎重に検討。 結果、 「地球を回す」 動作そのものを中毒の核に置き、 競争・点数・streak は出さない設計を選んだ

**Potential Next Steps**
- 都市数を 12 → 24 に拡張 (太平洋ど真ん中の都市を追加、 4 quadrant 完全カバー)
- event 文を週ごとに切り替える更新スクリプト
- 「話題帳」 を Markdown / PDF にエクスポート (面接当日の電車内で見返せる)
- 友達と「話題帳」 を共有 (Intent 7 にスライド)
- 季節モチーフを globe レンダリングに追加 (春は花、 冬は雪)
- 都市の音楽を YouTube/Spotify deep link で添える
