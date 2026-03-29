# CramSleuths — Implementation Plan

## Phase 1: Game Engine Core
- Makefile with raylib linking
- Game state machine (MENU, PLAYING, DEDUCTION, WIN)
- Two-player input handling (WASD + Arrows)
- Player struct with position, movement, collision
- Basic room rendering with walls and floor
- Camera and viewport

## Phase 2: Room System & Objects
- Room data structure (walls, objects, doors, spawn points)
- 3 rooms: Library, Lab, Office
- Object/clue interaction system (press E/Space near objects)
- Door transitions between rooms
- Collision detection with walls and objects
- Room rendering with colored tiles and objects

## Phase 3: Clue & Puzzle System
- Clue data model (id, name, description, room, found_by)
- Clue collection and inventory display
- Co-op puzzle mechanics (both players on triggers)
- Hidden clues revealed by co-op actions
- Clue combination/deduction logic

## Phase 4: Deduction Screen & Win Condition
- Deduction UI: present collected clues
- Multiple-choice solution selection
- Win/lose screen based on correct deduction
- Case narrative text
- Game timer and score

## Phase 5: Polish & Testing
- Title screen with instructions
- Sound effects (footsteps, clue found, door open)
- Visual polish (shadows, ambient particles)
- Unit tests for game logic (clue system, collision, state machine)
- Build verification on clean compile
