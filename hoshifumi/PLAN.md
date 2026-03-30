# Hoshifumi — Implementation Plan

## Phase 1: Core Three.js Scene & Starry Sky
- Set up Three.js scene, camera, renderer
- Create starfield background (hundreds of small stars)
- Implement Van Gogh swirl post-processing shader
- Dark blue/purple gradient sky with animated nebula clouds
- Responsive canvas

## Phase 2: Typing Engine
- Display Japanese/English prompt text on screen
- Capture keyboard input, highlight correct/incorrect characters
- Calculate WPM, accuracy, combo streak
- Combo multiplier system (×1 → ×2 → ×4 → ×8)
- Visual feedback for hits/misses (screen flash, shake)

## Phase 3: Constellation Generation
- Convert completed text into star positions (character → star mapping)
- Animate stars spawning with particle burst
- Draw constellation lines between stars
- Stars brightness/size scales with combo multiplier at time of typing
- Each completed message becomes a drifting constellation group

## Phase 4: Letter Mode & UI Polish
- Free-type "letter mode" where user writes their own message
- Message transforms into constellation on completion
- Beautiful UI overlay: score, combo, WPM, accuracy
- Start screen, results screen with stats
- Sound effects (optional, Web Audio API)

## Phase 5: Final Polish
- Japanese UI text throughout
- Mobile-responsive layout
- Performance optimization
- Color scheme refinement (Van Gogh palette)
- Screenshot-worthy visual quality
