# Netamemo — Implementation Plan

## Phase 1: Extension Foundation
- Manifest V3 setup (background service worker, popup, side panel, content script)
- Chrome storage abstraction layer
- Context menu integration (right-click → save as idea)
- Basic popup UI with idea list

## Phase 2: Idea Management
- Add/edit/delete ideas with full metadata
- Category system (tutorial, review, vlog, short, collab, other)
- 3-axis rating (potential, effort, trend)
- Search and filter by category/rating
- Sort by date, rating, category

## Phase 3: Collaboration Features
- Export board as sharing code (compressed Base64 JSON)
- Import friend's board from sharing code
- Merge boards with duplicate detection
- Vote on ideas (thumbs up/down per idea)
- Voter tracking (who voted for what)

## Phase 4: Side Panel & Polish
- Side panel for browsing-integrated idea management
- Beautiful glassmorphism UI with consistent color scheme
- Animations and micro-interactions
- Japanese text throughout
- Test suite
