# ChakraForge - Implementation Plan

## Phase 1: HTML Shell & p5.js Setup
- Create index.html with dark theme, canvas, and UI overlay
- Include p5.js from CDN
- Set up main sketch with dark background
- Basic particle system foundation

## Phase 2: Core Particle Engine
- Particle class with position, velocity, lifespan, color
- Emitter system with configurable parameters
- Mouse-following emission point
- Smooth particle trails with alpha decay

## Phase 3: Elemental Techniques
- Flame: warm colors, upward drift, flickering size
- Lightning: branching paths, white-blue, sharp angles
- Void: dark purple spirals, gravitational pull effect
- Sakura: pink petals, gentle floating, rotation
- Cosmic: multi-color nebula, expanding rings, star bursts

## Phase 4: Skill Tree & Narrative
- XP system: each effect created earns XP
- Skill tree data structure with unlock thresholds
- LocalStorage persistence
- UI overlay showing current rank and progress
- Unlock notifications with animation

## Phase 5: Controls & Export
- Keyboard controls for technique switching
- Mouse scroll for intensity
- Save frame as PNG (p5.js saveCanvas)
- Pause/resume toggle
- UI panel with sliders for fine-tuning

## Phase 6: Polish
- Smooth transitions between techniques
- Screen shake on powerful effects
- Ambient background particles
- Title screen with narrative intro
- Final testing
