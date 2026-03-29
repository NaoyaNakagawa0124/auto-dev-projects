#!/usr/bin/env python3
"""
LumiLink Game Logic Test Suite

Tests the core game logic that's implemented in GDScript.
This Python test harness mirrors the game_data.gd and game_state.gd logic
to validate correctness without requiring the Godot engine.
"""

import sys

passed = 0
failed = 0
failures = []

def assert_eq(expected, actual, name):
    global passed, failed
    if expected == actual:
        passed += 1
    else:
        failed += 1
        failures.append(f"{name} (expected: {expected}, got: {actual})")
        print(f"  FAIL: {name} (expected: {expected}, got: {actual})")

def assert_true(condition, name):
    global passed, failed
    if condition:
        passed += 1
    else:
        failed += 1
        failures.append(name)
        print(f"  FAIL: {name}")

def assert_false(condition, name):
    assert_true(not condition, name)

def assert_gt(a, b, name):
    assert_true(a > b, f"{name} ({a} > {b})")

def assert_gte(a, b, name):
    assert_true(a >= b, f"{name} ({a} >= {b})")

def assert_lt(a, b, name):
    assert_true(a < b, f"{name} ({a} < {b})")


# ============ Mirror of GameData constants ============
GRID_WIDTH = 12
GRID_HEIGHT = 8
TILE_SIZE = 64
RESONANCE_DECAY = 0.02
RESONANCE_GAIN = 0.05
RESONANCE_MAX = 1.0
RESONANCE_MIN = 0.0
RESONANCE_THRESHOLD = 0.5

LEVELS = [
    {"name": "First Light", "hint": "Move together to light the path.",
     "dark_tiles": [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
     "blocked_tiles": [], "p1_start": [1, 4], "p2_start": [10, 4]},
    {"name": "Crossroads", "hint": "Meet in the middle.",
     "dark_tiles": [[6,2],[6,3],[6,4],[6,5],[6,6],[4,4],[5,4],[7,4],[8,4]],
     "blocked_tiles": [], "p1_start": [2, 4], "p2_start": [10, 4]},
    {"name": "Two Paths", "hint": "Stay close even on different paths.",
     "dark_tiles": [[3,2],[4,2],[5,2],[6,2],[7,2],[3,5],[4,5],[5,5],[6,5],[7,5],[8,3],[8,4]],
     "blocked_tiles": [[5,3],[5,4],[6,3],[6,4]], "p1_start": [1, 2], "p2_start": [1, 5]},
    {"name": "Spiral", "hint": "Trace the spiral together.",
     "dark_tiles": [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[9,2],[9,3],[9,4],[9,5],[8,5],[7,5],[6,5],[5,5],[4,5],[3,5],[3,4],[3,3],[4,3],[5,3],[6,3],[7,3]],
     "blocked_tiles": [], "p1_start": [1, 1], "p2_start": [1, 6]},
    {"name": "Islands", "hint": "Bridge the gaps between islands.",
     "dark_tiles": [[2,2],[3,2],[2,3],[3,3],[7,2],[8,2],[7,3],[8,3],[4,5],[5,5],[6,5],[7,5],[5,1],[6,1],[5,6],[6,6]],
     "blocked_tiles": [[5,2],[5,3],[6,2],[6,3],[3,4],[4,4],[7,4],[8,4]], "p1_start": [1, 1], "p2_start": [10, 6]},
    {"name": "Labyrinth", "hint": "Navigate the maze as one.",
     "dark_tiles": [[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[6,5],[7,5],[7,4],[7,3],[8,3],[9,3],[9,2],[9,1],[10,1]],
     "blocked_tiles": [[2,2],[2,3],[4,1],[4,2],[6,3],[6,4],[8,4],[8,5],[10,2],[10,3]], "p1_start": [0, 1], "p2_start": [0, 6]},
    {"name": "Heart", "hint": "Light up the heart together.",
     "dark_tiles": [[4,2],[5,1],[6,1],[7,2],[8,2],[9,1],[10,1],[11,2],[7,3],[4,3],[11,3],[4,4],[11,4],[5,5],[10,5],[6,6],[9,6],[7,7],[8,7]],
     "blocked_tiles": [], "p1_start": [2, 4], "p2_start": [2, 3]},
    {"name": "Zigzag", "hint": "Weave together through the zigzag.",
     "dark_tiles": [[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[6,5],[7,5],[7,6],[7,7],[8,7],[9,7],[9,6],[9,5],[10,5],[11,5]],
     "blocked_tiles": [[2,2],[4,4],[6,6],[8,6],[10,6]], "p1_start": [0, 1], "p2_start": [0, 7]},
    {"name": "Constellation", "hint": "Connect the stars.",
     "dark_tiles": [[2,1],[5,2],[8,1],[3,4],[6,3],[9,4],[1,6],[4,7],[7,6],[10,7],[5,5]],
     "blocked_tiles": [], "p1_start": [0, 0], "p2_start": [11, 7]},
    {"name": "Together", "hint": "The final path. Walk it as one.",
     "dark_tiles": [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[5,1],[6,1],[5,2],[6,2],[5,5],[6,5],[5,6],[6,6]],
     "blocked_tiles": [], "p1_start": [0, 3], "p2_start": [0, 4]},
]


# ============ Game Logic Functions (mirror of GDScript) ============

def is_in_bounds(x, y):
    return 0 <= x < GRID_WIDTH and 0 <= y < GRID_HEIGHT

def is_blocked(level, x, y):
    return [x, y] in level["blocked_tiles"]

def manhattan_distance(p1, p2):
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

def are_adjacent_or_overlapping(p1, p2):
    return manhattan_distance(p1, p2) <= 1

def calculate_resonance_change(p1, p2, current):
    if are_adjacent_or_overlapping(p1, p2):
        return min(RESONANCE_MAX, current + RESONANCE_GAIN)
    else:
        dist = manhattan_distance(p1, p2)
        decay = RESONANCE_DECAY * (dist - 1)
        return max(RESONANCE_MIN, current - decay)

def can_light_tile(resonance):
    return resonance >= RESONANCE_THRESHOLD


class GameState:
    def __init__(self):
        self.current_level = 0
        self.p1_pos = [0, 0]
        self.p2_pos = [0, 0]
        self.resonance = 0.0
        self.lit_tiles = []
        self.moves = 0
        self.levels_completed = 0
        self.total_moves = 0
        self.best_resonance = 0.0
        self.load_level(0)

    def load_level(self, idx):
        if idx < 0 or idx >= len(LEVELS):
            return False
        self.current_level = idx
        self.level_data = LEVELS[idx]
        self.p1_pos = list(self.level_data["p1_start"])
        self.p2_pos = list(self.level_data["p2_start"])
        self.resonance = 0.0
        self.lit_tiles = []
        self.moves = 0
        return True

    def move_player(self, player, dx, dy):
        pos = self.p1_pos if player == 1 else self.p2_pos
        new_x = pos[0] + dx
        new_y = pos[1] + dy
        if not is_in_bounds(new_x, new_y):
            return False
        if is_blocked(self.level_data, new_x, new_y):
            return False
        pos[0] = new_x
        pos[1] = new_y
        self.moves += 1
        self.update_resonance()
        self.try_light_tiles()
        return True

    def update_resonance(self):
        self.resonance = calculate_resonance_change(self.p1_pos, self.p2_pos, self.resonance)
        if self.resonance > self.best_resonance:
            self.best_resonance = self.resonance

    def try_light_tiles(self):
        if not can_light_tile(self.resonance):
            return
        for pos in [self.p1_pos, self.p2_pos]:
            if self.is_dark_tile(pos) and not self.is_lit(pos):
                self.lit_tiles.append(list(pos))

    def is_dark_tile(self, pos):
        return pos in self.level_data["dark_tiles"]

    def is_lit(self, pos):
        return pos in self.lit_tiles

    def is_level_complete(self):
        return len(self.lit_tiles) >= len(self.level_data["dark_tiles"])

    def advance_level(self):
        self.levels_completed += 1
        self.total_moves += self.moves
        return self.load_level(self.current_level + 1)

    def get_completion_percent(self):
        total = len(self.level_data["dark_tiles"])
        if total == 0:
            return 100.0
        return len(self.lit_tiles) / total * 100.0


# ============ Tests ============

print("=== LumiLink Test Suite ===\n")

# ---- Level Data Tests ----
print("[Level Data Tests]")

assert_eq(10, len(LEVELS), "10 levels exist")

for i, level in enumerate(LEVELS):
    assert_true(len(level["name"]) > 0, f"Level {i} has name")
    assert_true(len(level["hint"]) > 0, f"Level {i} has hint")
    assert_true(len(level["dark_tiles"]) > 0, f"Level {i} has dark tiles")
    assert_true(len(level["p1_start"]) == 2, f"Level {i} has p1_start")
    assert_true(len(level["p2_start"]) == 2, f"Level {i} has p2_start")

    # Start positions are in bounds
    p1 = level["p1_start"]
    p2 = level["p2_start"]
    assert_true(is_in_bounds(p1[0], p1[1]), f"Level {i} p1_start in bounds")
    assert_true(is_in_bounds(p2[0], p2[1]), f"Level {i} p2_start in bounds")

    # Start positions are not blocked
    assert_false(is_blocked(level, p1[0], p1[1]), f"Level {i} p1_start not blocked")
    assert_false(is_blocked(level, p2[0], p2[1]), f"Level {i} p2_start not blocked")

    # All dark tiles are in bounds
    for tile in level["dark_tiles"]:
        assert_true(is_in_bounds(tile[0], tile[1]), f"Level {i} dark tile {tile} in bounds")

    # All blocked tiles are in bounds
    for tile in level["blocked_tiles"]:
        assert_true(is_in_bounds(tile[0], tile[1]), f"Level {i} blocked tile {tile} in bounds")

    # Dark tiles and blocked tiles don't overlap
    for tile in level["dark_tiles"]:
        assert_false(is_blocked(level, tile[0], tile[1]), f"Level {i} dark tile {tile} not blocked")

    # Start positions are not on dark tiles (players start off the path)
    # (This is a design choice, not a hard requirement)

# Level names are unique
names = [l["name"] for l in LEVELS]
assert_eq(len(names), len(set(names)), "Level names are unique")

# First level is simple
assert_eq("First Light", LEVELS[0]["name"], "First level is 'First Light'")
assert_lt(len(LEVELS[0]["dark_tiles"]), 10, "First level has < 10 dark tiles")

# Last level is "Together"
assert_eq("Together", LEVELS[-1]["name"], "Last level is 'Together'")

print("  Level data tests complete.\n")

# ---- Bounds & Collision Tests ----
print("[Bounds & Collision Tests]")

assert_true(is_in_bounds(0, 0), "0,0 in bounds")
assert_true(is_in_bounds(11, 7), "11,7 in bounds")
assert_false(is_in_bounds(-1, 0), "-1,0 out of bounds")
assert_false(is_in_bounds(12, 0), "12,0 out of bounds")
assert_false(is_in_bounds(0, 8), "0,8 out of bounds")
assert_false(is_in_bounds(0, -1), "0,-1 out of bounds")

# Blocked tiles in level 3 (Two Paths)
assert_true(is_blocked(LEVELS[2], 5, 3), "Level 3: 5,3 is blocked")
assert_true(is_blocked(LEVELS[2], 6, 4), "Level 3: 6,4 is blocked")
assert_false(is_blocked(LEVELS[2], 3, 2), "Level 3: 3,2 not blocked")
assert_false(is_blocked(LEVELS[0], 5, 4), "Level 1: 5,4 not blocked")

print("  Bounds & collision tests complete.\n")

# ---- Distance Tests ----
print("[Distance Tests]")

assert_eq(0, manhattan_distance([5, 5], [5, 5]), "Same position = 0")
assert_eq(1, manhattan_distance([5, 5], [5, 6]), "Adjacent = 1")
assert_eq(1, manhattan_distance([5, 5], [6, 5]), "Adjacent horizontal = 1")
assert_eq(2, manhattan_distance([5, 5], [6, 6]), "Diagonal = 2")
assert_eq(5, manhattan_distance([0, 0], [3, 2]), "Distance 0,0 to 3,2 = 5")
assert_eq(19, manhattan_distance([0, 0], [11, 8]), "Max distance")

assert_true(are_adjacent_or_overlapping([5, 5], [5, 5]), "Overlapping = adjacent")
assert_true(are_adjacent_or_overlapping([5, 5], [5, 6]), "1 away = adjacent")
assert_true(are_adjacent_or_overlapping([5, 5], [4, 5]), "1 left = adjacent")
assert_false(are_adjacent_or_overlapping([5, 5], [5, 7]), "2 away = not adjacent")
assert_false(are_adjacent_or_overlapping([5, 5], [6, 6]), "Diagonal = not adjacent")

print("  Distance tests complete.\n")

# ---- Resonance Tests ----
print("[Resonance Tests]")

# Adjacent: gain resonance
r1 = calculate_resonance_change([5, 5], [5, 6], 0.0)
assert_eq(RESONANCE_GAIN, r1, "Adjacent gain from 0")

r2 = calculate_resonance_change([5, 5], [5, 5], 0.0)
assert_eq(RESONANCE_GAIN, r2, "Overlapping gain from 0")

# Max cap
r3 = calculate_resonance_change([5, 5], [5, 6], 0.98)
assert_eq(RESONANCE_MAX, r3, "Capped at max")

# Apart: decay
r4 = calculate_resonance_change([0, 0], [5, 5], 0.5)
assert_lt(r4, 0.5, "Decay when apart")
assert_gt(r4, 0.0, "Doesn't go negative")

# Decay scales with distance
r5a = calculate_resonance_change([0, 0], [3, 0], 0.5)  # dist 3
r5b = calculate_resonance_change([0, 0], [8, 0], 0.5)  # dist 8
assert_gt(r5a, r5b, "Farther apart decays more")

# Min cap
r6 = calculate_resonance_change([0, 0], [11, 7], 0.01)
assert_eq(RESONANCE_MIN, r6, "Capped at min")

# Threshold
assert_false(can_light_tile(0.0), "Can't light at 0")
assert_false(can_light_tile(0.49), "Can't light at 0.49")
assert_true(can_light_tile(0.5), "Can light at 0.5")
assert_true(can_light_tile(1.0), "Can light at 1.0")

# Resonance build-up simulation
resonance = 0.0
steps_to_threshold = 0
for _ in range(100):
    resonance = calculate_resonance_change([5, 5], [5, 6], resonance)
    steps_to_threshold += 1
    if resonance >= RESONANCE_THRESHOLD:
        break
assert_gte(resonance, RESONANCE_THRESHOLD, "Resonance reaches threshold when adjacent")
assert_gt(steps_to_threshold, 1, "Takes multiple steps to reach threshold")
assert_lt(steps_to_threshold, 50, "Reaches threshold in reasonable steps")

print("  Resonance tests complete.\n")

# ---- Game State Tests ----
print("[Game State Tests]")

gs = GameState()
assert_eq(0, gs.current_level, "Starts at level 0")
assert_eq([1, 4], gs.p1_pos, "P1 starts at level 0 p1_start")
assert_eq([10, 4], gs.p2_pos, "P2 starts at level 0 p2_start")
assert_eq(0.0, gs.resonance, "Resonance starts at 0")
assert_eq(0, len(gs.lit_tiles), "No lit tiles initially")
assert_eq(0, gs.moves, "0 moves initially")
assert_false(gs.is_level_complete(), "Level not complete initially")
assert_eq(0.0, gs.get_completion_percent(), "0% completion initially")

# Move P1 right
moved = gs.move_player(1, 1, 0)
assert_true(moved, "P1 moves right")
assert_eq([2, 4], gs.p1_pos, "P1 at 2,4")
assert_eq(1, gs.moves, "1 move")

# Can't move out of bounds
gs2 = GameState()
gs2.load_level(0)
gs2.p1_pos = [0, 0]
moved = gs2.move_player(1, -1, 0)
assert_false(moved, "Can't move left from x=0")
moved = gs2.move_player(1, 0, -1)
assert_false(moved, "Can't move up from y=0")

# Can't move into blocked tile
gs3 = GameState()
gs3.load_level(2)  # Two Paths - has blocks at 5,3 and 5,4
gs3.p1_pos = [4, 3]
moved = gs3.move_player(1, 1, 0)  # Try to move to 5,3 (blocked)
assert_false(moved, "Can't move into blocked tile")

# Load level
gs4 = GameState()
assert_true(gs4.load_level(5), "Load level 5")
assert_eq(5, gs4.current_level, "Current level is 5")
assert_false(gs4.load_level(-1), "Can't load negative level")
assert_false(gs4.load_level(99), "Can't load level 99")

# Level advance
gs5 = GameState()
gs5.load_level(0)
gs5.moves = 10
result = gs5.advance_level()
assert_true(result, "Advance to level 1")
assert_eq(1, gs5.current_level, "Now on level 1")
assert_eq(1, gs5.levels_completed, "1 level completed")
assert_eq(10, gs5.total_moves, "Total moves tracked")
assert_eq(0, gs5.moves, "Current moves reset")

# Can't advance past last level
gs6 = GameState()
gs6.load_level(9)
gs6.levels_completed = 9
result = gs6.advance_level()
assert_false(result, "Can't advance past last level")

print("  Game state tests complete.\n")

# ---- Lighting Tests ----
print("[Lighting Tests]")

# Tiles only light when resonance >= threshold
gs7 = GameState()
gs7.load_level(0)
gs7.p1_pos = [3, 4]  # On a dark tile
gs7.resonance = 0.3  # Below threshold
gs7.try_light_tiles()
assert_eq(0, len(gs7.lit_tiles), "No lighting below threshold")

gs7.resonance = 0.5  # At threshold
gs7.try_light_tiles()
assert_eq(1, len(gs7.lit_tiles), "Lights tile at threshold")
assert_eq([3, 4], gs7.lit_tiles[0], "Correct tile lit")

# Don't re-light already lit tiles
gs7.try_light_tiles()
assert_eq(1, len(gs7.lit_tiles), "No double lighting")

# Both players can light tiles
gs8 = GameState()
gs8.load_level(0)
gs8.p1_pos = [3, 4]
gs8.p2_pos = [4, 4]
gs8.resonance = 0.6
gs8.try_light_tiles()
assert_eq(2, len(gs8.lit_tiles), "Both players light tiles")

# Non-dark tiles don't light
gs9 = GameState()
gs9.load_level(0)
gs9.p1_pos = [0, 0]  # Not a dark tile
gs9.resonance = 1.0
gs9.try_light_tiles()
assert_eq(0, len(gs9.lit_tiles), "Non-dark tiles don't light")

print("  Lighting tests complete.\n")

# ---- Integration: Play Level 1 ----
print("[Integration: Level 1 Playthrough]")

gs10 = GameState()
gs10.load_level(0)

# Level 1: dark tiles at x=3-8, y=4. P1 at 1,4, P2 at 10,4
# Strategy: move both toward center, build resonance, then sweep together

# Move P1 right to x=4 and P2 left to x=5 (adjacent)
for _ in range(3):
    gs10.move_player(1, 1, 0)
for _ in range(5):
    gs10.move_player(2, -1, 0)

# Now P1 at 4,4 and P2 at 5,4 - adjacent!
assert_eq([4, 4], gs10.p1_pos, "P1 reached 4,4")
assert_eq([5, 4], gs10.p2_pos, "P2 reached 5,4")

# Build resonance by staying adjacent
for _ in range(15):
    gs10.move_player(1, 0, 0)  # Stay still but update resonance

assert_gt(gs10.resonance, 0, "Resonance built up while adjacent")

# Now move together through dark tiles (both right)
for _ in range(6):
    gs10.move_player(1, 1, 0)
    gs10.move_player(2, 1, 0)

assert_gt(len(gs10.lit_tiles), 0, "Some tiles lit during playthrough")

print(f"  Level 1 playthrough: {len(gs10.lit_tiles)}/{len(gs10.level_data['dark_tiles'])} tiles lit, resonance={gs10.resonance:.2f}")
print("  Integration test complete.\n")

# ---- Completion Percent Tests ----
print("[Completion Tests]")

gs11 = GameState()
gs11.load_level(0)
assert_eq(0.0, gs11.get_completion_percent(), "0% at start")

gs11.lit_tiles = [[3, 4], [4, 4], [5, 4]]
pct = gs11.get_completion_percent()
assert_eq(50.0, pct, "50% with 3/6 tiles")

gs11.lit_tiles = [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]]
assert_true(gs11.is_level_complete(), "Level complete with all tiles")
assert_eq(100.0, gs11.get_completion_percent(), "100% when complete")

print("  Completion tests complete.\n")

# ---- Full Game Simulation ----
print("[Full Game Simulation]")

gs12 = GameState()
levels_played = 0

for level_idx in range(len(LEVELS)):
    gs12.load_level(level_idx)
    dark_count = len(gs12.level_data["dark_tiles"])
    assert_gt(dark_count, 0, f"Level {level_idx} has dark tiles")

    # Verify level loads correctly
    assert_eq(level_idx, gs12.current_level, f"Level {level_idx} loaded")
    assert_eq(0, len(gs12.lit_tiles), f"Level {level_idx} starts with no lit tiles")
    assert_eq(0.0, gs12.resonance, f"Level {level_idx} starts with 0 resonance")
    levels_played += 1

assert_eq(10, levels_played, "Played all 10 levels")

# Stats tracking
gs13 = GameState()
gs13.load_level(0)
gs13.moves = 20
gs13.best_resonance = 0.8
gs13.advance_level()
stats = {
    "levels_completed": gs13.levels_completed,
    "total_moves": gs13.total_moves,
    "best_resonance": gs13.best_resonance,
}
assert_eq(1, stats["levels_completed"], "Stats: 1 level completed")
assert_eq(20, stats["total_moves"], "Stats: 20 total moves")
assert_eq(0.8, stats["best_resonance"], "Stats: best resonance tracked")

print("  Full game simulation complete.\n")

# ---- Edge Cases ----
print("[Edge Cases]")

# Move player 0 distance
gs14 = GameState()
gs14.load_level(0)
old_pos = list(gs14.p1_pos)
gs14.move_player(1, 0, 0)  # No movement
assert_eq(old_pos, gs14.p1_pos, "No movement with dx=0, dy=0")
assert_eq(1, gs14.moves, "Move counted even for 0,0")

# Resonance never exceeds bounds
resonance = 0.0
for _ in range(200):
    resonance = calculate_resonance_change([5, 5], [5, 5], resonance)
assert_eq(RESONANCE_MAX, resonance, "Resonance maxes at 1.0 after many steps")

resonance = 1.0
for _ in range(200):
    resonance = calculate_resonance_change([0, 0], [11, 7], resonance)
assert_eq(RESONANCE_MIN, resonance, "Resonance mins at 0.0 after many steps")

# All levels have start positions that are different or allow movement
for i, level in enumerate(LEVELS):
    p1 = level["p1_start"]
    p2 = level["p2_start"]
    # At least one adjacent cell should be unblocked for each player
    has_move_p1 = False
    has_move_p2 = False
    for dx, dy in [(0,1),(0,-1),(1,0),(-1,0)]:
        nx1, ny1 = p1[0]+dx, p1[1]+dy
        nx2, ny2 = p2[0]+dx, p2[1]+dy
        if is_in_bounds(nx1, ny1) and not is_blocked(level, nx1, ny1):
            has_move_p1 = True
        if is_in_bounds(nx2, ny2) and not is_blocked(level, nx2, ny2):
            has_move_p2 = True
    assert_true(has_move_p1, f"Level {i} P1 can move from start")
    assert_true(has_move_p2, f"Level {i} P2 can move from start")

print("  Edge case tests complete.\n")

# ============ Results ============
print("================================")
print(f"  Results: {passed} passed, {failed} failed")
print("================================")
if failures:
    print("\nFailures:")
    for f in failures:
        print(f"  - {f}")
sys.exit(1 if failed > 0 else 0)
