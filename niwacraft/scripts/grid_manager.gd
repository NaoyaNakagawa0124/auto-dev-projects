## Grid manager for the garden
## Handles tile placement, removal, and grid state
extends Node2D

signal tile_placed(pos: Vector2i, item_key: String)
signal tile_removed(pos: Vector2i)
signal tile_selected(pos: Vector2i, item_key: String)

const GRID_WIDTH := 16
const GRID_HEIGHT := 12
const CELL_SIZE := 48

var grid: Dictionary = {}  # Vector2i -> { key, growth_stage, growth_progress, planted_season }
var selected_item: String = ""
var current_season: GameData.Season = GameData.Season.SPRING
var hover_pos: Vector2i = Vector2i(-1, -1)
var is_eraser_mode: bool = false

func _ready():
	# Initialize empty grid
	for x in range(GRID_WIDTH):
		for y in range(GRID_HEIGHT):
			grid[Vector2i(x, y)] = null

func _draw():
	_draw_grid_bg()
	_draw_cells()
	_draw_grid_lines()
	_draw_hover()

func _draw_grid_bg():
	var bg_color = GameData.get_season_bg_color(current_season)
	draw_rect(Rect2(0, 0, GRID_WIDTH * CELL_SIZE, GRID_HEIGHT * CELL_SIZE), bg_color)

func _draw_grid_lines():
	var line_color = Color(0, 0, 0, 0.08)
	for x in range(GRID_WIDTH + 1):
		draw_line(Vector2(x * CELL_SIZE, 0), Vector2(x * CELL_SIZE, GRID_HEIGHT * CELL_SIZE), line_color, 1.0)
	for y in range(GRID_HEIGHT + 1):
		draw_line(Vector2(0, y * CELL_SIZE), Vector2(GRID_WIDTH * CELL_SIZE, y * CELL_SIZE), line_color, 1.0)

func _draw_cells():
	for pos in grid:
		var cell = grid[pos]
		if cell == null:
			_draw_soil(pos)
		else:
			_draw_item(pos, cell)

func _draw_soil(pos: Vector2i):
	var rect = _cell_rect(pos).grow(-1)
	var soil_color = Color(0.55, 0.42, 0.28, 0.3)
	draw_rect(rect, soil_color)

func _draw_item(pos: Vector2i, cell: Dictionary):
	var item_data = GameData.get_item(cell["key"])
	if item_data.is_empty():
		return

	var rect = _cell_rect(pos).grow(-2)
	var category = item_data["category"]
	var colors = item_data["colors"]
	var stage = cell.get("growth_stage", GameData.GrowthStage.NONE)

	match category:
		GameData.Category.CROP, GameData.Category.FLOWER:
			_draw_plant(rect, colors, stage)
		GameData.Category.TREE:
			_draw_tree(rect, colors, stage)
		GameData.Category.PATH:
			_draw_path(rect, colors[0])
		GameData.Category.STRUCTURE:
			_draw_structure(rect, colors[0], cell["key"])
		GameData.Category.WATER:
			_draw_water(rect, colors[0], cell["key"])

func _draw_plant(rect: Rect2, colors: Array, stage: GameData.GrowthStage):
	var center = rect.get_center()
	var s = rect.size.x * 0.4

	# Draw soil mound
	draw_rect(Rect2(rect.position.x, rect.position.y + rect.size.y * 0.7, rect.size.x, rect.size.y * 0.3), Color(0.5, 0.38, 0.25))

	match stage:
		GameData.GrowthStage.SEED:
			# Small brown dot
			draw_circle(center + Vector2(0, s * 0.3), s * 0.2, colors[0])
		GameData.GrowthStage.SPROUT:
			# Small green sprout
			draw_circle(center + Vector2(0, s * 0.1), s * 0.3, colors[1])
			draw_rect(Rect2(center.x - 1, center.y - s * 0.2, 2, s * 0.5), colors[1])
		GameData.GrowthStage.GROWN:
			# Full plant
			draw_circle(center - Vector2(0, s * 0.2), s * 0.45, colors[2])
			draw_rect(Rect2(center.x - 1.5, center.y - s * 0.1, 3, s * 0.6), Color(0.3, 0.5, 0.2))
		GameData.GrowthStage.HARVEST:
			# Plant with colored fruit/flower
			draw_circle(center - Vector2(0, s * 0.3), s * 0.35, colors[2])
			draw_circle(center - Vector2(s * 0.15, s * 0.45), s * 0.2, colors[3])
			draw_circle(center + Vector2(s * 0.2, s * -0.2), s * 0.18, colors[3])
			draw_rect(Rect2(center.x - 1.5, center.y - s * 0.1, 3, s * 0.6), Color(0.3, 0.5, 0.2))
		_:
			draw_circle(center, s * 0.3, colors[0] if colors.size() > 0 else Color.GRAY)

func _draw_tree(rect: Rect2, colors: Array, stage: GameData.GrowthStage):
	var center = rect.get_center()
	var s = rect.size.x * 0.4

	match stage:
		GameData.GrowthStage.SEED:
			draw_circle(center + Vector2(0, s * 0.3), s * 0.2, colors[0])
		GameData.GrowthStage.SPROUT:
			draw_rect(Rect2(center.x - 2, center.y, 4, s * 0.5), colors[0])
			draw_circle(center - Vector2(0, s * 0.1), s * 0.3, colors[1])
		GameData.GrowthStage.GROWN:
			# Trunk
			draw_rect(Rect2(center.x - 3, center.y - s * 0.1, 6, s * 0.8), colors[0])
			# Canopy
			draw_circle(center - Vector2(0, s * 0.4), s * 0.55, colors[2])
		GameData.GrowthStage.HARVEST:
			# Trunk
			draw_rect(Rect2(center.x - 3, center.y - s * 0.1, 6, s * 0.8), colors[0])
			# Canopy with fruits
			draw_circle(center - Vector2(0, s * 0.4), s * 0.55, colors[2])
			draw_circle(center - Vector2(s * 0.2, s * 0.6), s * 0.12, colors[3])
			draw_circle(center + Vector2(s * 0.25, s * -0.55), s * 0.12, colors[3])
			draw_circle(center - Vector2(s * -0.1, s * 0.35), s * 0.12, colors[3])
		_:
			draw_rect(Rect2(center.x - 3, center.y - s * 0.1, 6, s * 0.8), colors[0])
			draw_circle(center - Vector2(0, s * 0.4), s * 0.55, colors[2] if colors.size() > 2 else Color.GREEN)

func _draw_path(rect: Rect2, color: Color):
	draw_rect(rect, color)
	# Add subtle pattern
	var step = rect.size.x / 4
	for i in range(4):
		for j in range(4):
			if (i + j) % 2 == 0:
				var small_rect = Rect2(
					rect.position + Vector2(i * step, j * step),
					Vector2(step, step)
				)
				draw_rect(small_rect, color.darkened(0.1))

func _draw_structure(rect: Rect2, color: Color, key: String):
	var center = rect.get_center()
	var s = rect.size.x * 0.4

	match key:
		"fence":
			# Vertical posts
			draw_rect(Rect2(rect.position.x + s * 0.2, rect.position.y + s * 0.3, 3, rect.size.y * 0.7), color)
			draw_rect(Rect2(rect.position.x + rect.size.x - s * 0.4, rect.position.y + s * 0.3, 3, rect.size.y * 0.7), color)
			# Horizontal bars
			draw_rect(Rect2(rect.position.x + s * 0.2, center.y - s * 0.3, rect.size.x * 0.7, 3), color)
			draw_rect(Rect2(rect.position.x + s * 0.2, center.y + s * 0.2, rect.size.x * 0.7, 3), color)
		"bench":
			# Seat
			draw_rect(Rect2(rect.position.x + s * 0.1, center.y, rect.size.x * 0.8, s * 0.3), color)
			# Legs
			draw_rect(Rect2(rect.position.x + s * 0.3, center.y + s * 0.3, 3, s * 0.5), color.darkened(0.2))
			draw_rect(Rect2(rect.position.x + rect.size.x - s * 0.5, center.y + s * 0.3, 3, s * 0.5), color.darkened(0.2))
			# Back
			draw_rect(Rect2(rect.position.x + s * 0.1, center.y - s * 0.4, rect.size.x * 0.8, s * 0.15), color.lightened(0.1))
		"scarecrow":
			# Body
			draw_rect(Rect2(center.x - 1.5, center.y - s * 0.3, 3, s), color)
			# Arms
			draw_rect(Rect2(center.x - s * 0.5, center.y - s * 0.1, s, 3), color)
			# Head
			draw_circle(center - Vector2(0, s * 0.5), s * 0.22, color.lightened(0.2))
			# Hat
			draw_rect(Rect2(center.x - s * 0.35, center.y - s * 0.8, s * 0.7, s * 0.15), color.darkened(0.2))
		"birdhouse":
			# House body
			draw_rect(Rect2(center.x - s * 0.3, center.y - s * 0.1, s * 0.6, s * 0.6), color)
			# Roof triangle via lines
			draw_rect(Rect2(center.x - s * 0.4, center.y - s * 0.25, s * 0.8, s * 0.15), color.darkened(0.2))
			# Hole
			draw_circle(center + Vector2(0, s * 0.1), s * 0.1, Color(0.2, 0.15, 0.1))
			# Post
			draw_rect(Rect2(center.x - 1.5, center.y + s * 0.5, 3, s * 0.5), color.darkened(0.15))

func _draw_water(rect: Rect2, color: Color, key: String):
	var center = rect.get_center()
	var s = rect.size.x * 0.4

	match key:
		"pond":
			draw_rect(rect, Color(0.25, 0.45, 0.65, 0.8))
			# Ripple
			draw_arc(center, s * 0.3, 0, TAU, 16, Color(0.4, 0.6, 0.8, 0.5), 1.5)
			draw_arc(center + Vector2(s * 0.15, s * 0.1), s * 0.15, 0, TAU, 12, Color(0.4, 0.6, 0.8, 0.4), 1.0)
		"well":
			# Stone circle
			draw_circle(center, s * 0.45, Color(0.55, 0.55, 0.55))
			# Water inside
			draw_circle(center, s * 0.3, Color(0.2, 0.4, 0.65))
			# Crossbar
			draw_rect(Rect2(center.x - s * 0.5, center.y - s * 0.6, s, 2), Color(0.45, 0.35, 0.2))

func _draw_hover():
	if hover_pos.x < 0 or hover_pos.y < 0:
		return
	if hover_pos.x >= GRID_WIDTH or hover_pos.y >= GRID_HEIGHT:
		return
	var rect = _cell_rect(hover_pos)
	if is_eraser_mode:
		draw_rect(rect, Color(1, 0.2, 0.2, 0.25))
	elif selected_item != "":
		draw_rect(rect, Color(1, 1, 1, 0.2))
	else:
		draw_rect(rect, Color(1, 1, 1, 0.1))

func _cell_rect(pos: Vector2i) -> Rect2:
	return Rect2(pos.x * CELL_SIZE, pos.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

func _input(event: InputEvent):
	if event is InputEventMouseMotion:
		var local_pos = to_local((event as InputEventMouseMotion).position)
		var gp = _pos_to_grid(local_pos)
		if gp != hover_pos:
			hover_pos = gp
			queue_redraw()

	if event is InputEventMouseButton:
		var mb = event as InputEventMouseButton
		if mb.pressed:
			var local_pos = to_local(mb.position)
			var gp = _pos_to_grid(local_pos)
			if gp.x < 0 or gp.y < 0 or gp.x >= GRID_WIDTH or gp.y >= GRID_HEIGHT:
				return

			if mb.button_index == MOUSE_BUTTON_LEFT:
				if is_eraser_mode:
					remove_tile(gp)
				elif selected_item != "":
					place_tile(gp, selected_item)
				else:
					# Select existing tile for info
					if grid[gp] != null:
						tile_selected.emit(gp, grid[gp]["key"])
			elif mb.button_index == MOUSE_BUTTON_RIGHT:
				remove_tile(gp)

func _pos_to_grid(local_pos: Vector2) -> Vector2i:
	var gx = int(local_pos.x / CELL_SIZE)
	var gy = int(local_pos.y / CELL_SIZE)
	return Vector2i(gx, gy)

func place_tile(pos: Vector2i, item_key: String):
	if pos.x < 0 or pos.y < 0 or pos.x >= GRID_WIDTH or pos.y >= GRID_HEIGHT:
		return
	var item_data = GameData.get_item(item_key)
	if item_data.is_empty():
		return

	var growth_stage = GameData.GrowthStage.NONE
	if item_data["category"] in [GameData.Category.CROP, GameData.Category.FLOWER, GameData.Category.TREE]:
		growth_stage = GameData.GrowthStage.SEED

	grid[pos] = {
		"key": item_key,
		"growth_stage": growth_stage,
		"growth_progress": 0.0,
		"planted_season": current_season,
	}

	tile_placed.emit(pos, item_key)
	queue_redraw()

func remove_tile(pos: Vector2i):
	if pos.x < 0 or pos.y < 0 or pos.x >= GRID_WIDTH or pos.y >= GRID_HEIGHT:
		return
	if grid[pos] != null:
		grid[pos] = null
		tile_removed.emit(pos)
		queue_redraw()

func harvest_tile(pos: Vector2i) -> String:
	if grid[pos] == null:
		return ""
	var cell = grid[pos]
	if cell["growth_stage"] != GameData.GrowthStage.HARVEST:
		return ""
	var key = cell["key"]
	# Reset to seed stage
	cell["growth_stage"] = GameData.GrowthStage.SEED
	cell["growth_progress"] = 0.0
	queue_redraw()
	return key

func advance_growth(delta: float):
	for pos in grid:
		var cell = grid[pos]
		if cell == null:
			continue
		if cell["growth_stage"] == GameData.GrowthStage.NONE:
			continue
		if cell["growth_stage"] == GameData.GrowthStage.HARVEST:
			continue

		var item_data = GameData.get_item(cell["key"])
		if not GameData.can_grow_in_season(cell["key"], current_season):
			continue

		cell["growth_progress"] += delta
		var growth_time = item_data.get("growth_time", 3) * GameData.SEASON_DURATION / 4.0

		if cell["growth_progress"] >= growth_time:
			cell["growth_progress"] = 0.0
			var next_stage = cell["growth_stage"] + 1
			if next_stage > GameData.GrowthStage.HARVEST:
				next_stage = GameData.GrowthStage.HARVEST
			cell["growth_stage"] = next_stage

	queue_redraw()

func set_season(season: GameData.Season):
	current_season = season
	queue_redraw()

func get_grid_data() -> Dictionary:
	return grid.duplicate(true)

func load_grid_data(data: Dictionary):
	grid = data.duplicate(true)
	queue_redraw()

func get_stats() -> Dictionary:
	var total_items := 0
	var crops := 0
	var flowers := 0
	var trees := 0
	var harvestable := 0

	for pos in grid:
		if grid[pos] != null:
			total_items += 1
			var item = GameData.get_item(grid[pos]["key"])
			match item.get("category", -1):
				GameData.Category.CROP:
					crops += 1
				GameData.Category.FLOWER:
					flowers += 1
				GameData.Category.TREE:
					trees += 1
			if grid[pos].get("growth_stage") == GameData.GrowthStage.HARVEST:
				harvestable += 1

	return {
		"total": total_items,
		"crops": crops,
		"flowers": flowers,
		"trees": trees,
		"harvestable": harvestable,
	}

func clear_grid():
	for pos in grid:
		grid[pos] = null
	queue_redraw()
