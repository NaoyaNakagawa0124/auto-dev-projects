# Implementation Plan — sodachi-graph

## Phase 1: Project skeleton ✅
- C project with Makefile
- Raylib 5.5 link
- 1280x720 window, NotoSansJP font, dynamic codepoint loading
- Basic scene state machine

## Phase 2: Story content ✅
- 5 chapters × 2 choice points = 10 binary decisions
- Each choice has prompt, two options, two response narrations, two stat-delta tuples
- 12 ending texts with min-stat thresholds and dominance-threshold logic
- All Japanese, polished prose

## Phase 3: Visual novel rendering ✅
- Per-chapter background using Raylib primitives (gradient + simple shapes)
- Translucent dialogue panel (rounded rectangle)
- Word-wrapped text drawer that handles UTF-8 codepoints character-by-character
- Choice screen with two large buttons (hover state)
- Chapter header chip in top-left

## Phase 4: Dashboard ✅
- 4 horizontal stat bars (智 / 徳 / 体 / 情) with color coding
- Smooth ease-in-out animation from previous-chapter values to current
- +/- delta indicators next to each value
- "Click to continue" hint that appears once animation completes

## Phase 5: Ending ✅
- Selection logic based on stat profile (single dominant, dual top-tier, balanced, fallback)
- Dark starry background with title in cream and a body-text panel
- Final stat line and replay prompt

## Phase 6: Polish ✅
- Smoke-tested binary boot
- Glyph atlas (96px) covers all displayed characters (~533 glyphs)
- Click/Space/Enter unified as "advance"
- Compile with -Wall -Wextra, no warnings
