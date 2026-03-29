# GigRank - Implementation Plan

## Phase 1: Backend API & Database
- Express server setup
- SQLite schema: groups, users, gigs, ratings
- CRUD endpoints for groups, gigs, ratings
- Join code generation

## Phase 2: WebSocket Real-time
- WebSocket server alongside Express
- Broadcast rating updates to group members
- Connection management by group

## Phase 3: Frontend - Core UI
- Landing page with create/join group
- Group dashboard showing members and gigs
- Add gig form
- Rating interface with 5 sliders

## Phase 4: Visualizations & Comparison
- Radar chart comparing group members' ratings
- Aggregate score display
- Gig history list with averages

## Phase 5: Testing & Polish
- Unit tests for API logic
- Integration tests for rating calculations
- Dark theme styling
- Responsive layout
