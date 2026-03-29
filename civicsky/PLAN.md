# CivicSky — Implementation Plan

## Phase 1: Extension Shell & Weather Engine
- Chrome extension manifest (Manifest V3)
- New-tab override page (HTML/CSS)
- Canvas-based weather scene renderer (sun, clouds, rain, storm, snow)
- Weather state machine (clear → cloudy → rainy → stormy → severe)
- Smooth transitions between weather states
- Time-of-day awareness (dawn, day, dusk, night sky colors)

## Phase 2: Policy Data Layer
- Policy data model (category, severity, title, summary, effectiveDate, state, source)
- Sample policy dataset (20+ real 2026 regulations)
- Regulatory intensity scoring algorithm
- Category-based filtering
- State-based filtering
- Data storage with Chrome Storage API

## Phase 3: Policy Cards UI
- Swipeable/scrollable policy card component
- Card design with severity color coding
- Category icons and badges
- Plain-English summary display
- "Read more" links to official sources
- Card animation (slide in/out)

## Phase 4: 5-Day Forecast & Settings
- 5-day forecast bar with weather icons per day
- Forecast tooltip with upcoming regulation details
- Settings panel (state selector, category toggles)
- Persist user preferences
- Welcome/onboarding flow for first-time users

## Phase 5: Polish & Testing
- Responsive layout for various screen sizes
- Accessibility (ARIA labels, keyboard navigation, contrast)
- Unit tests for weather engine, scoring, and data layer
- Integration tests for extension lifecycle
- Performance optimization (lazy load, efficient canvas rendering)
- Final QA pass
