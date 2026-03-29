# AntiScroll — Implementation Plan

## Phase 1: Core Runner Engine
- Game state machine (MENU, PLAYING, PAUSED, GAMEOVER)
- Player character with vertical movement (3 lanes)
- Scrolling background (train interior)
- Frame timing and speed management

## Phase 2: Obstacles & Collectibles
- Distraction obstacles (notification bubbles, like hearts, clickbait)
- Paper collectibles (floating documents with field labels)
- Spawning system with randomized timing
- Collision detection (player vs obstacles, player vs papers)
- Hit/collect feedback effects

## Phase 3: Paper Data & Scoring
- Embedded dataset of 50+ real ArXiv paper titles across fields
- Score tracking (papers collected, distractions dodged)
- Anti-difficulty: game speed decreases as papers increase
- HUD with score, speed indicator, current streak
- Paper display when collected (brief flash of title + field)

## Phase 4: UI Screens & Polish
- Title screen with anti-scroll messaging
- Pause screen
- Game over with session summary (all papers collected)
- Visual effects (parallax scrolling, particles)
- Color theming (dark/calm palette)

## Phase 5: Testing
- Unit tests for game logic, spawning, scoring, collision
- Build verification
- Final QA
