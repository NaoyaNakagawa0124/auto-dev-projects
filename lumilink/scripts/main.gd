## Main game scene controller
extends Node2D

@onready var grid_container = $GridContainer
@onready var p1_sprite = $Player1
@onready var p2_sprite = $Player2
@onready var resonance_bar = $UI/ResonanceBar
@onready var resonance_label = $UI/ResonanceLabel
@onready var level_label = $UI/LevelLabel
@onready var hint_label = $UI/HintLabel
@onready var progress_label = $UI/ProgressLabel
@onready var complete_panel = $UI/CompletePanel

var state: GameState
var tiles: Array = []  # 2D array of ColorRect nodes

func _ready():
	state = GameState.new()
	create_grid()
	update_display()

func _process(_delta):
	handle_input()

func handle_input():
	# Player 1: WASD
	if Input.is_action_just_pressed("p1_up"):
		state.move_player(1, 0, -1)
		update_display()
	elif Input.is_action_just_pressed("p1_down"):
		state.move_player(1, 0, 1)
		update_display()
	elif Input.is_action_just_pressed("p1_left"):
		state.move_player(1, -1, 0)
		update_display()
	elif Input.is_action_just_pressed("p1_right"):
		state.move_player(1, 1, 0)
		update_display()

	# Player 2: Arrow keys
	if Input.is_action_just_pressed("p2_up"):
		state.move_player(2, 0, -1)
		update_display()
	elif Input.is_action_just_pressed("p2_down"):
		state.move_player(2, 0, 1)
		update_display()
	elif Input.is_action_just_pressed("p2_left"):
		state.move_player(2, -1, 0)
		update_display()
	elif Input.is_action_just_pressed("p2_right"):
		state.move_player(2, 1, 0)
		update_display()

func create_grid():
	tiles.clear()
	for y in range(GameData.GRID_HEIGHT):
		var row = []
		for x in range(GameData.GRID_WIDTH):
			var tile = ColorRect.new()
			tile.size = Vector2(GameData.TILE_SIZE - 2, GameData.TILE_SIZE - 2)
			tile.position = Vector2(x * GameData.TILE_SIZE + 1, y * GameData.TILE_SIZE + 1)
			tile.color = Color(0.08, 0.08, 0.12)  # dark
			add_child(tile)
			row.append(tile)
		tiles.append(row)

func update_display():
	# Update tile colors
	for y in range(GameData.GRID_HEIGHT):
		for x in range(GameData.GRID_WIDTH):
			var tile = tiles[y][x]
			if GameData.is_blocked(state.level_data, x, y):
				tile.color = Color(0.15, 0.12, 0.18)  # blocked - dark purple
			elif state.is_lit([x, y]):
				var glow = 0.6 + state.resonance * 0.4
				tile.color = Color(0.9 * glow, 0.75 * glow, 0.3 * glow)  # warm gold
			elif state.is_dark_tile([x, y]):
				tile.color = Color(0.12, 0.12, 0.2)  # dark blue tint
			else:
				tile.color = Color(0.08, 0.08, 0.12)  # empty dark

	# Update player positions
	p1_sprite.position = Vector2(state.p1_pos[0] * GameData.TILE_SIZE + GameData.TILE_SIZE / 2,
								  state.p1_pos[1] * GameData.TILE_SIZE + GameData.TILE_SIZE / 2)
	p2_sprite.position = Vector2(state.p2_pos[0] * GameData.TILE_SIZE + GameData.TILE_SIZE / 2,
								  state.p2_pos[1] * GameData.TILE_SIZE + GameData.TILE_SIZE / 2)

	# Resonance bar
	resonance_bar.value = state.resonance * 100
	var res_color = Color(1.0 - state.resonance, state.resonance, 0.3)
	resonance_label.text = "Resonance: %d%%" % int(state.resonance * 100)

	# Level info
	level_label.text = "Level %d: %s" % [state.current_level + 1, state.level_data.get("name", "")]
	hint_label.text = state.level_data.get("hint", "")
	progress_label.text = "%d/%d tiles lit" % [state.lit_tiles.size(), GameData.count_dark_tiles(state.level_data)]

	# Check completion
	if state.is_level_complete():
		show_level_complete()

func show_level_complete():
	complete_panel.visible = true
	if state.current_level + 1 >= state.total_levels:
		complete_panel.get_node("Label").text = "YOU ARE TOGETHER.\nAll %d levels complete!\nTotal moves: %d" % [state.total_levels, state.total_moves + state.moves]
	else:
		complete_panel.get_node("Label").text = "Level Complete!\nMoves: %d\nPress SPACE for next level" % state.moves

func _input(event):
	if event is InputEventKey and event.pressed and event.keycode == KEY_SPACE:
		if state.is_level_complete():
			complete_panel.visible = false
			if state.advance_level():
				update_display()
