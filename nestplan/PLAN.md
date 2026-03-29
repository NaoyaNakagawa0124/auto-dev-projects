# NestPlan — Implementation Plan

## Phase 1: Data Model & Storage
- Define data classes: Plan, Room, Project, Partner, Vote
- JSON serialization / deserialization
- File I/O (save/load plans)
- Budget calculation utilities
- Unit tests for all data operations

## Phase 2: Core TUI Shell
- Textual app skeleton with header, footer, sidebar
- Room list sidebar with add/remove
- Main content area switching by selected room
- Partner setup screen (enter two names)
- Welcome/new plan flow
- Navigation and keybindings

## Phase 3: Project Management
- Add/edit/delete projects within a room
- Project detail view (name, description, budget, status, assigned partner)
- Status workflow: planned → in_progress → done
- Priority voting per partner (1-5 stars)
- Combined priority score display
- Sort projects by priority

## Phase 4: Budget Dashboard & Export
- Budget summary widget (total, per-room, per-partner)
- Progress bar for overall completion
- Visual budget breakdown (Rich bar charts)
- Export plan to JSON file
- Import plan from JSON file
- Stats display (total projects, completion %, budget remaining)

## Phase 5: Polish & Testing
- Color theme and visual polish
- Keyboard shortcuts guide
- Edge case handling (empty rooms, zero budget, etc.)
- Comprehensive unit tests for data layer
- Integration tests for TUI components
- Final QA pass
