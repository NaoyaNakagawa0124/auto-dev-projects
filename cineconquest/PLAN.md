# CineConquest Implementation Plan

## Phase 1: Project Foundation & 3D Globe
- Initialize Vite project with Three.js
- Create rotating 3D Earth with country boundaries (using GeoJSON)
- Implement camera controls (orbit, zoom)
- Basic HTML/CSS shell with glassmorphism design

## Phase 2: Movie Logging System
- Movie entry form (title, country, genre, rating, date)
- localStorage persistence layer
- Country-to-coordinate mapping
- Visual feedback when a movie is logged (country lights up on globe)

## Phase 3: Conquest & Scoring System
- Country conquest levels (0-5 based on films watched)
- Color gradient for conquest levels (dark → bright glow)
- Diversity score calculation
- Streak tracking (consecutive days logging)
- Achievement badges

## Phase 4: Leaderboard & Competition
- Personal stats dashboard
- Simulated global leaderboard with AI opponents
- Weekly challenge system (watch films from specific regions)
- Rankings by: total countries, diversity score, total films, streaks

## Phase 5: Polish & News Integration
- Pulsing highlights on news-relevant countries
- Particle effects for newly conquered countries
- Responsive design for mobile
- Japanese UI text throughout
- Sound effects for achievements
