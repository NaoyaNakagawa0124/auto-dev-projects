## Game state manager for LumiLink
## Tracks positions, resonance, lit tiles, and level progress

class_name GameState

var current_level: int = 0
var p1_pos: Array = [0, 0]  # [x, y]
var p2_pos: Array = [0, 0]
var resonance: float = 0.0
var lit_tiles: Array = []  # array of [x, y]
var moves: int = 0
var level_data: Dictionary = {}
var total_levels: int = 0
var levels_completed: int = 0
var total_moves: int = 0
var best_resonance: float = 0.0

func _init():
	var levels = GameData.get_levels()
	total_levels = levels.size()
	if total_levels > 0:
		load_level(0)

func load_level(idx: int) -> bool:
	var levels = GameData.get_levels()
	if idx < 0 or idx >= levels.size():
		return false
	current_level = idx
	level_data = levels[idx]
	p1_pos = level_data["p1_start"].duplicate()
	p2_pos = level_data["p2_start"].duplicate()
	resonance = 0.0
	lit_tiles = []
	moves = 0
	return true

func move_player(player: int, dx: int, dy: int) -> bool:
	var pos = p1_pos if player == 1 else p2_pos
	var new_x = pos[0] + dx
	var new_y = pos[1] + dy

	if not GameData.is_in_bounds(new_x, new_y):
		return false
	if GameData.is_blocked(level_data, new_x, new_y):
		return false

	pos[0] = new_x
	pos[1] = new_y
	if player == 1:
		p1_pos = pos
	else:
		p2_pos = pos

	moves += 1
	update_resonance()
	try_light_current_tiles()
	return true

func update_resonance():
	resonance = GameData.calculate_resonance_change(p1_pos, p2_pos, resonance)
	if resonance > best_resonance:
		best_resonance = resonance

func try_light_current_tiles():
	if not GameData.can_light_tile(resonance):
		return

	# Light tiles at both player positions
	for pos in [p1_pos, p2_pos]:
		if is_dark_tile(pos) and not is_lit(pos):
			lit_tiles.append(pos.duplicate())

func is_dark_tile(pos: Array) -> bool:
	for tile in level_data["dark_tiles"]:
		if tile[0] == pos[0] and tile[1] == pos[1]:
			return true
	return false

func is_lit(pos: Array) -> bool:
	for tile in lit_tiles:
		if tile[0] == pos[0] and tile[1] == pos[1]:
			return true
	return false

func is_level_complete() -> bool:
	return GameData.check_level_complete(lit_tiles.size(), GameData.count_dark_tiles(level_data))

func advance_level() -> bool:
	levels_completed += 1
	total_moves += moves
	return load_level(current_level + 1)

func is_game_complete() -> bool:
	return levels_completed >= total_levels

func get_completion_percent() -> float:
	var total = GameData.count_dark_tiles(level_data)
	if total == 0:
		return 100.0
	return float(lit_tiles.size()) / float(total) * 100.0

func get_stats() -> Dictionary:
	return {
		"levels_completed": levels_completed,
		"total_levels": total_levels,
		"total_moves": total_moves,
		"best_resonance": best_resonance,
		"current_level_name": level_data.get("name", ""),
	}
