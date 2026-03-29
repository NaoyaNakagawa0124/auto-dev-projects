# NijiLog Implementation Plan

## Phase 1: Foundation & Particle System
- Vite + p5.js setup
- Core particle stream renderer on canvas
- Mood color palette definition (8 moods with distinct hues)
- Basic HTML/CSS shell with dark theme

## Phase 2: Diary Entry System
- Entry form: mood color picker + optional text
- localStorage persistence
- Date-based entry management (one per day)
- Entry list view

## Phase 3: Generative Flow Visualization
- Map diary entries to particle streams over time
- Continuous flow for consecutive days (smooth color transitions)
- Visible gaps/breaks for skipped days
- Interactive: hover to see entry details
- Time-based scrolling through the flow

## Phase 4: Stats & Motivation
- Streak counter and longest streak
- Mood distribution (color pie chart)
- Calendar heat map (colored by mood)
- Motivational messages when streak continues/breaks

## Phase 5: Polish
- All text in Japanese
- Responsive design
- Smooth animations and transitions
- Entry editing and deletion
