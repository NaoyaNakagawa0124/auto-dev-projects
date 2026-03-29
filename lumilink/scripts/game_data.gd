## Game data and level definitions for LumiLink
## Pure data - no Godot node dependencies, testable standalone

class_name GameData

# Grid dimensions
const GRID_WIDTH := 12
const GRID_HEIGHT := 8
const TILE_SIZE := 64

# Tile states
enum TileState { DARK, LIT, BLOCKED }

# Resonance thresholds
const RESONANCE_DECAY := 0.02  # per frame when apart
const RESONANCE_GAIN := 0.05  # per frame when overlapping
const RESONANCE_MAX := 1.0
const RESONANCE_MIN := 0.0
const RESONANCE_THRESHOLD := 0.5  # minimum to light tiles

# Level definitions: arrays of tile positions that need lighting
# Each level is a dictionary with:
#   "dark_tiles": array of [x, y] positions
#   "blocked_tiles": array of [x, y] positions
#   "p1_start": [x, y]
#   "p2_start": [x, y]
#   "name": string
#   "hint": string

static func get_levels() -> Array:
	return [
		# Level 1: Simple line
		{
			"name": "First Light",
			"hint": "Move together to light the path.",
			"dark_tiles": [[3,4],[4,4],[5,4],[6,4],[7,4],[8,4]],
			"blocked_tiles": [],
			"p1_start": [1, 4],
			"p2_start": [10, 4],
		},
		# Level 2: Cross
		{
			"name": "Crossroads",
			"hint": "Meet in the middle.",
			"dark_tiles": [[6,2],[6,3],[6,4],[6,5],[6,6],[4,4],[5,4],[7,4],[8,4]],
			"blocked_tiles": [],
			"p1_start": [2, 4],
			"p2_start": [10, 4],
		},
		# Level 3: Two paths
		{
			"name": "Two Paths",
			"hint": "Stay close even on different paths.",
			"dark_tiles": [[3,2],[4,2],[5,2],[6,2],[7,2],[3,5],[4,5],[5,5],[6,5],[7,5],[8,3],[8,4]],
			"blocked_tiles": [[5,3],[5,4],[6,3],[6,4]],
			"p1_start": [1, 2],
			"p2_start": [1, 5],
		},
		# Level 4: Spiral
		{
			"name": "Spiral",
			"hint": "Trace the spiral together.",
			"dark_tiles": [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[9,2],[9,3],[9,4],[9,5],[8,5],[7,5],[6,5],[5,5],[4,5],[3,5],[3,4],[3,3],[4,3],[5,3],[6,3],[7,3]],
			"blocked_tiles": [],
			"p1_start": [1, 1],
			"p2_start": [1, 6],
		},
		# Level 5: Islands
		{
			"name": "Islands",
			"hint": "Bridge the gaps between islands.",
			"dark_tiles": [[2,2],[3,2],[2,3],[3,3],[7,2],[8,2],[7,3],[8,3],[4,5],[5,5],[6,5],[7,5],[5,1],[6,1],[5,6],[6,6]],
			"blocked_tiles": [[5,2],[5,3],[6,2],[6,3],[3,4],[4,4],[7,4],[8,4]],
			"p1_start": [1, 1],
			"p2_start": [10, 6],
		},
		# Level 6: Maze
		{
			"name": "Labyrinth",
			"hint": "Navigate the maze as one.",
			"dark_tiles": [[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[6,5],[7,5],[7,4],[7,3],[8,3],[9,3],[9,2],[9,1],[10,1]],
			"blocked_tiles": [[2,2],[2,3],[4,1],[4,2],[6,3],[6,4],[8,4],[8,5],[10,2],[10,3]],
			"p1_start": [0, 1],
			"p2_start": [0, 6],
		},
		# Level 7: Heart shape
		{
			"name": "Heart",
			"hint": "Light up the heart together.",
			"dark_tiles": [[4,2],[5,1],[6,1],[7,2],[8,2],[9,1],[10,1],[11,2],[7,3],[4,3],[11,3],[4,4],[11,4],[5,5],[10,5],[6,6],[9,6],[7,7],[8,7]],
			"blocked_tiles": [],
			"p1_start": [2, 4],
			"p2_start": [2, 3],
		},
		# Level 8: Zigzag
		{
			"name": "Zigzag",
			"hint": "Weave together through the zigzag.",
			"dark_tiles": [[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[6,5],[7,5],[7,6],[7,7],[8,7],[9,7],[9,6],[9,5],[10,5],[11,5]],
			"blocked_tiles": [[2,2],[4,4],[6,6],[8,6],[10,6]],
			"p1_start": [0, 1],
			"p2_start": [0, 7],
		},
		# Level 9: Constellation
		{
			"name": "Constellation",
			"hint": "Connect the stars.",
			"dark_tiles": [[2,1],[5,2],[8,1],[3,4],[6,3],[9,4],[1,6],[4,7],[7,6],[10,7],[5,5]],
			"blocked_tiles": [],
			"p1_start": [0, 0],
			"p2_start": [11, 7],
		},
		# Level 10: Together
		{
			"name": "Together",
			"hint": "The final path. Walk it as one.",
			"dark_tiles": [[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[5,1],[6,1],[5,2],[6,2],[5,5],[6,5],[5,6],[6,6]],
			"blocked_tiles": [],
			"p1_start": [0, 3],
			"p2_start": [0, 4],
		},
	]

static func count_dark_tiles(level: Dictionary) -> int:
	return level["dark_tiles"].size()

static func is_blocked(level: Dictionary, x: int, y: int) -> bool:
	for tile in level["blocked_tiles"]:
		if tile[0] == x and tile[1] == y:
			return true
	return false

static func is_in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID_WIDTH and y >= 0 and y < GRID_HEIGHT

static func manhattan_distance(p1: Array, p2: Array) -> int:
	return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

static func are_adjacent_or_overlapping(p1: Array, p2: Array) -> bool:
	return manhattan_distance(p1, p2) <= 1

static func calculate_resonance_change(p1: Array, p2: Array, current: float) -> float:
	if are_adjacent_or_overlapping(p1, p2):
		return min(RESONANCE_MAX, current + RESONANCE_GAIN)
	else:
		var dist = manhattan_distance(p1, p2)
		var decay = RESONANCE_DECAY * (dist - 1)
		return max(RESONANCE_MIN, current - decay)

static func can_light_tile(resonance: float) -> bool:
	return resonance >= RESONANCE_THRESHOLD

static func check_level_complete(lit_count: int, total_dark: int) -> bool:
	return lit_count >= total_dark
