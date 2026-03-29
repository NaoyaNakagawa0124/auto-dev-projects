## Main UI controller for MidnightBento.
## Manages screen transitions, board rendering, and food selection.
extends Control

@onready var gm: GameManager = $"../../GameManager"
@onready var title_screen: VBoxContainer = $TitleScreen
@onready var game_screen: Control = $GameScreen
@onready var level_complete_screen: Control = $LevelCompleteScreen
@onready var game_complete_screen: Control = $GameCompleteScreen
@onready var start_button: Button = $TitleScreen/StartButton

const CELL_SIZE := 60
const BOARD_OFFSET := Vector2(50, 80)
const FOOD_PANEL_X := 500
const FOOD_PANEL_Y := 80

func _ready() -> void:
	start_button.pressed.connect(_on_start)
	gm.level_started.connect(_on_level_started)
	gm.food_placed.connect(_on_food_placed)
	gm.level_completed.connect(_on_level_completed)
	gm.game_completed.connect(_on_game_completed)
	_show_screen("title")

func _show_screen(name: String) -> void:
	title_screen.visible = name == "title"
	game_screen.visible = name == "game"
	level_complete_screen.visible = name == "level_complete"
	game_complete_screen.visible = name == "game_complete"

func _on_start() -> void:
	gm.start_game()

func _on_level_started(_level_num: int) -> void:
	_show_screen("game")

func _on_food_placed(_food_id: String, _score: int) -> void:
	pass  ## Visual feedback handled in _draw

func _on_level_completed(score: int, is_perfect: bool) -> void:
	_show_screen("level_complete")
	_build_level_complete(score, is_perfect)

func _on_game_completed(total_score: int) -> void:
	_show_screen("game_complete")
	_build_game_complete(total_score)

func _build_level_complete(score: int, is_perfect: bool) -> void:
	for child in level_complete_screen.get_children():
		child.queue_free()

	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(PRESET_CENTER)
	vbox.offset_left = -200
	vbox.offset_right = 200
	vbox.offset_top = -150
	vbox.offset_bottom = 150
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	level_complete_screen.add_child(vbox)

	var title_lbl := Label.new()
	title_lbl.text = "ステージクリア！" if not is_perfect else "完璧！ パーフェクト！"
	title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_lbl.add_theme_font_size_override("font_size", 28)
	title_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0) if is_perfect else Color(0.4, 0.8, 1.0))
	vbox.add_child(title_lbl)

	var score_lbl := Label.new()
	score_lbl.text = "スコア: %d" % score
	score_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	score_lbl.add_theme_font_size_override("font_size", 22)
	vbox.add_child(score_lbl)

	var grade_lbl := Label.new()
	grade_lbl.text = "評価: %s" % gm.get_grade(score)
	grade_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	grade_lbl.add_theme_font_size_override("font_size", 18)
	grade_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
	vbox.add_child(grade_lbl)

	## Study effects
	var effects := gm.board.get_study_effects()
	if effects.size() > 0:
		var effects_lbl := Label.new()
		var text := "勉強効果:\n"
		for effect_name in effects:
			text += "  %s +%d\n" % [effect_name, effects[effect_name]]
		effects_lbl.text = text
		effects_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		effects_lbl.add_theme_font_size_override("font_size", 14)
		effects_lbl.add_theme_color_override("font_color", Color(0.5, 0.8, 0.5))
		vbox.add_child(effects_lbl)

	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, 20)
	vbox.add_child(spacer)

	var next_btn := Button.new()
	next_btn.text = "次のステージへ" if gm.current_level_num < LevelData.level_count() else "結果を見る"
	next_btn.custom_minimum_size = Vector2(0, 45)
	next_btn.add_theme_font_size_override("font_size", 18)
	next_btn.pressed.connect(func(): gm.next_level())
	vbox.add_child(next_btn)

func _build_game_complete(total_score: int) -> void:
	for child in game_complete_screen.get_children():
		child.queue_free()

	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(PRESET_CENTER)
	vbox.offset_left = -200
	vbox.offset_right = 200
	vbox.offset_top = -180
	vbox.offset_bottom = 180
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	game_complete_screen.add_child(vbox)

	var title_lbl := Label.new()
	title_lbl.text = "🍱 全ステージクリア！"
	title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_lbl.add_theme_font_size_override("font_size", 30)
	title_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
	vbox.add_child(title_lbl)

	var score_lbl := Label.new()
	score_lbl.text = "合計スコア: %d" % total_score
	score_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	score_lbl.add_theme_font_size_override("font_size", 24)
	vbox.add_child(score_lbl)

	var grade_lbl := Label.new()
	grade_lbl.text = gm.get_final_grade()
	grade_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	grade_lbl.add_theme_font_size_override("font_size", 20)
	grade_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
	vbox.add_child(grade_lbl)

	## Per-level scores
	var scores_text := ""
	for i in range(gm.level_scores.size()):
		scores_text += "ステージ%d: %d\n" % [i + 1, gm.level_scores[i]]

	var scores_lbl := Label.new()
	scores_lbl.text = scores_text
	scores_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	scores_lbl.add_theme_font_size_override("font_size", 14)
	scores_lbl.add_theme_color_override("font_color", Color(0.7, 0.7, 0.9))
	vbox.add_child(scores_lbl)

	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, 15)
	vbox.add_child(spacer)

	var retry_btn := Button.new()
	retry_btn.text = "もう一度"
	retry_btn.custom_minimum_size = Vector2(0, 40)
	retry_btn.add_theme_font_size_override("font_size", 18)
	retry_btn.pressed.connect(func():
		_show_screen("title")
		gm.state = GameManager.State.TITLE
	)
	vbox.add_child(retry_btn)

func _input(event: InputEvent) -> void:
	if gm.state != GameManager.State.PLAYING:
		return

	if event is InputEventMouseButton and event.pressed:
		var pos: Vector2 = event.position

		## Check if clicking on board
		var grid_x := int((pos.x - BOARD_OFFSET.x) / CELL_SIZE)
		var grid_y := int((pos.y - BOARD_OFFSET.y) / CELL_SIZE)

		if event.button_index == MOUSE_BUTTON_RIGHT:
			gm.rotate_selected()
			queue_redraw()
			return

		if grid_x >= 0 and grid_x < gm.board.width and grid_y >= 0 and grid_y < gm.board.height:
			if gm.selected_food_index >= 0:
				gm.try_place(grid_x, grid_y)
				queue_redraw()
			return

		## Check if clicking on food panel
		for i in range(gm.available_foods.size()):
			var fy: float = FOOD_PANEL_Y + i * 50.0
			if pos.x >= FOOD_PANEL_X and pos.x <= 780 and pos.y >= fy and pos.y <= fy + 45:
				gm.select_food(i)
				queue_redraw()
				return

	## Keyboard shortcuts
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_R:
			gm.rotate_selected()
			queue_redraw()
		elif event.keycode == KEY_Z:
			gm.undo()
			queue_redraw()

func _draw() -> void:
	if gm.state != GameManager.State.PLAYING or gm.board == null:
		return

	## Draw board
	var bw: int = gm.board.width
	var bh: int = gm.board.height

	## Board background
	draw_rect(Rect2(BOARD_OFFSET.x - 4, BOARD_OFFSET.y - 4,
		bw * CELL_SIZE + 8, bh * CELL_SIZE + 8),
		Color(0.3, 0.15, 0.05, 0.8))
	draw_rect(Rect2(BOARD_OFFSET.x - 2, BOARD_OFFSET.y - 2,
		bw * CELL_SIZE + 4, bh * CELL_SIZE + 4),
		Color(0.5, 0.3, 0.1), false, 2)

	## Grid cells
	for y in range(bh):
		for x in range(bw):
			var cell_x: float = BOARD_OFFSET.x + x * CELL_SIZE
			var cell_y: float = BOARD_OFFSET.y + y * CELL_SIZE
			var cell_val: String = gm.board.get_cell(x, y)

			if cell_val == "":
				draw_rect(Rect2(cell_x + 1, cell_y + 1, CELL_SIZE - 2, CELL_SIZE - 2),
					Color(0.12, 0.08, 0.2))
			else:
				var food := FoodData.get_food(cell_val)
				if food:
					draw_rect(Rect2(cell_x + 1, cell_y + 1, CELL_SIZE - 2, CELL_SIZE - 2),
						food.color)
					## Inner highlight
					draw_rect(Rect2(cell_x + 3, cell_y + 3, CELL_SIZE - 6, 4),
						Color(1, 1, 1, 0.2))

			## Grid line
			draw_rect(Rect2(cell_x, cell_y, CELL_SIZE, CELL_SIZE),
				Color(0.4, 0.25, 0.1, 0.3), false, 1)

	## Level info
	if gm.current_level:
		var level_text := "ステージ %d: %s" % [gm.current_level.number, gm.current_level.title]
		draw_string(ThemeDB.fallback_font, Vector2(BOARD_OFFSET.x, 30), level_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(1.0, 0.85, 0.0))
		draw_string(ThemeDB.fallback_font, Vector2(BOARD_OFFSET.x, 55), gm.current_level.description, HORIZONTAL_ALIGNMENT_LEFT, -1, 12, Color(0.6, 0.6, 0.8, 0.7))

	## Score
	var score_text := "スコア: %d  |  充填率: %.0f%%" % [gm.board.calculate_score(), gm.board.fill_percentage()]
	draw_string(ThemeDB.fallback_font, Vector2(BOARD_OFFSET.x, BOARD_OFFSET.y + bh * CELL_SIZE + 30), score_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.8, 0.8, 0.9))

	## Food panel
	draw_string(ThemeDB.fallback_font, Vector2(FOOD_PANEL_X, FOOD_PANEL_Y - 15), "食材:", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.6, 0.6, 0.8, 0.7))

	for i in range(gm.available_foods.size()):
		var food := gm.available_foods[i]
		var fy: float = FOOD_PANEL_Y + i * 50.0
		var is_selected := (i == gm.selected_food_index)

		## Background
		var bg_color := Color(0.2, 0.15, 0.35, 0.8) if is_selected else Color(0.1, 0.08, 0.2, 0.6)
		draw_rect(Rect2(FOOD_PANEL_X, fy, 270, 45), bg_color)
		if is_selected:
			draw_rect(Rect2(FOOD_PANEL_X, fy, 270, 45), Color(0.4, 0.6, 1.0, 0.5), false, 2)

		## Food color swatch
		draw_rect(Rect2(FOOD_PANEL_X + 8, fy + 8, 28, 28), food.color)

		## Name and effect
		draw_string(ThemeDB.fallback_font, Vector2(FOOD_PANEL_X + 45, fy + 20), food.name, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.9, 0.9, 0.95))
		draw_string(ThemeDB.fallback_font, Vector2(FOOD_PANEL_X + 45, fy + 36), food.effect_name + " +" + str(food.effect_value), HORIZONTAL_ALIGNMENT_LEFT, -1, 10, Color(0.5, 0.8, 0.5, 0.7))

	## Controls hint
	var hint_y: float = FOOD_PANEL_Y + gm.available_foods.size() * 50 + 20
	draw_string(ThemeDB.fallback_font, Vector2(FOOD_PANEL_X, hint_y), "右クリック/R: 回転", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color(0.4, 0.4, 0.6, 0.5))
	draw_string(ThemeDB.fallback_font, Vector2(FOOD_PANEL_X, hint_y + 16), "Z: 元に戻す", HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color(0.4, 0.4, 0.6, 0.5))

func _process(_delta: float) -> void:
	if gm.state == GameManager.State.PLAYING:
		queue_redraw()
