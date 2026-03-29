## Main UI controller. Manages screens and connects to GameManager.
extends Control

@onready var game_manager: GameManager = $"../../GameManager"
@onready var title_screen: VBoxContainer = $TitleScreen
@onready var game_screen: Control = $GameScreen
@onready var results_screen: Control = $ResultsScreen

## Title
@onready var start_button: Button = $TitleScreen/StartButton
@onready var high_score_label: Label = $TitleScreen/HighScoreLabel

## Game
@onready var score_label: Label = $GameScreen/TopBar/ScoreLabel
@onready var combo_label: Label = $GameScreen/TopBar/ComboLabel
@onready var timer_label: Label = $GameScreen/TopBar/TimerLabel
@onready var timer_bar: ProgressBar = $GameScreen/TimerBar
@onready var card_container: Control = $GameScreen/CardContainer
@onready var feedback_label: Label = $GameScreen/FeedbackLabel

## Card scene (we'll create it programmatically since it's simple)
var current_card: Control = null

func _ready() -> void:
	## Connect signals
	start_button.pressed.connect(_on_start_pressed)
	game_manager.photo_ready.connect(_on_photo_ready)
	game_manager.score_changed.connect(_on_score_changed)
	game_manager.time_changed.connect(_on_time_changed)
	game_manager.judgment_result.connect(_on_judgment_result)
	game_manager.combo_broken.connect(_on_combo_broken)
	game_manager.game_over.connect(_on_game_over)

	high_score_label.text = "ハイスコア: %d" % game_manager.high_score
	_show_screen("title")

func _show_screen(screen_name: String) -> void:
	title_screen.visible = screen_name == "title"
	game_screen.visible = screen_name == "game"
	results_screen.visible = screen_name == "results"

func _on_start_pressed() -> void:
	_show_screen("game")
	game_manager.start_game()

func _on_photo_ready(photo_data: PhotoGenerator.PhotoData) -> void:
	## Remove old card
	if current_card:
		current_card.queue_free()

	## Create new card
	current_card = _create_card(photo_data)
	card_container.add_child(current_card)

func _create_card(photo_data: PhotoGenerator.PhotoData) -> Control:
	## Build card UI programmatically
	var card := Control.new()
	card.set_anchors_preset(PRESET_FULL_RECT)
	card.mouse_filter = Control.MOUSE_FILTER_STOP

	## Card background panel
	var panel := Panel.new()
	panel.set_anchors_preset(PRESET_FULL_RECT)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.1, 0.1, 0.18, 0.95)
	style.border_color = Color(0.3, 0.3, 0.5, 0.6)
	style.set_border_width_all(2)
	style.set_corner_radius_all(16)
	panel.add_theme_stylebox_override("panel", style)
	card.add_child(panel)

	## Photo canvas area
	var canvas := Control.new()
	canvas.position = Vector2(15, 15)
	canvas.size = Vector2(370, 350)
	canvas.set_script(load("res://scripts/photo_canvas.gd"))
	canvas.set_photo(photo_data)
	card.add_child(canvas)

	## Quality bars container
	var bars_container := VBoxContainer.new()
	bars_container.position = Vector2(20, 380)
	bars_container.size = Vector2(360, 100)
	card.add_child(bars_container)

	## Sharpness bar
	_add_quality_bar(bars_container, "シャープネス", photo_data.sharpness)
	## Exposure bar
	_add_quality_bar(bars_container, "露出", photo_data.exposure)
	## Composition bar
	_add_quality_bar(bars_container, "構図", photo_data.composition)

	## Action hint label
	var hint := Label.new()
	hint.name = "ActionHint"
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.position = Vector2(0, -40)
	hint.size = Vector2(400, 30)
	hint.add_theme_font_size_override("font_size", 20)
	hint.visible = false
	card.add_child(hint)

	## Input handling
	var swipe_start := Vector2.ZERO
	var is_dragging := false
	var original_pos := Vector2.ZERO

	card.gui_input.connect(func(event: InputEvent) -> void:
		if event is InputEventMouseButton:
			if event.pressed:
				is_dragging = true
				swipe_start = event.global_position
				original_pos = card.position
			else:
				is_dragging = false
				var diff := event.global_position - swipe_start
				_evaluate_card_swipe(card, diff)

		elif event is InputEventMouseMotion and is_dragging:
			var diff := event.global_position - swipe_start
			card.position = original_pos + diff * 0.5
			card.rotation = diff.x * 0.001
			_show_card_hint(hint, diff)
	)

	return card

func _add_quality_bar(container: VBoxContainer, label_text: String, value: float) -> void:
	var row := HBoxContainer.new()
	row.custom_minimum_size.y = 22

	var lbl := Label.new()
	lbl.text = label_text
	lbl.custom_minimum_size.x = 100
	lbl.add_theme_font_size_override("font_size", 12)
	lbl.add_theme_color_override("font_color", Color(0.6, 0.6, 0.8, 0.7))
	row.add_child(lbl)

	var bar := ProgressBar.new()
	bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bar.custom_minimum_size.y = 10
	bar.value = value * 100.0
	bar.show_percentage = false

	var fill_style := StyleBoxFlat.new()
	if value >= 0.7:
		fill_style.bg_color = Color(0.3, 0.85, 0.5)
	elif value >= 0.4:
		fill_style.bg_color = Color(0.95, 0.75, 0.2)
	else:
		fill_style.bg_color = Color(0.9, 0.3, 0.3)
	fill_style.set_corner_radius_all(3)
	bar.add_theme_stylebox_override("fill", fill_style)

	var bg_style := StyleBoxFlat.new()
	bg_style.bg_color = Color(0.15, 0.15, 0.25, 0.8)
	bg_style.set_corner_radius_all(3)
	bar.add_theme_stylebox_override("background", bg_style)

	row.add_child(bar)
	container.add_child(row)

func _show_card_hint(hint: Label, diff: Vector2) -> void:
	if diff.y < -60 and abs(diff.x) < 80:
		hint.text = "⭐ スター"
		hint.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
		hint.visible = true
	elif diff.x > 40:
		hint.text = "✓ 残す"
		hint.add_theme_color_override("font_color", Color(0.3, 0.85, 0.5))
		hint.visible = true
	elif diff.x < -40:
		hint.text = "✗ 削除"
		hint.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3))
		hint.visible = true
	else:
		hint.visible = false

func _evaluate_card_swipe(card: Control, diff: Vector2) -> void:
	var action := ""
	if diff.y < -60 and abs(diff.x) < 80:
		action = "star"
	elif diff.x > 80:
		action = "keep"
	elif diff.x < -80:
		action = "delete"

	if action != "":
		## Animate card away
		var tween := create_tween()
		tween.set_ease(Tween.EASE_IN)
		match action:
			"keep":
				tween.tween_property(card, "position:x", card.position.x + 800, 0.25)
			"delete":
				tween.tween_property(card, "position:x", card.position.x - 800, 0.25)
			"star":
				tween.tween_property(card, "position:y", card.position.y - 600, 0.25)
		tween.parallel().tween_property(card, "modulate:a", 0.0, 0.25)
		tween.tween_callback(func(): game_manager.handle_judgment(action))
	else:
		## Snap back
		var tween := create_tween()
		tween.set_ease(Tween.EASE_OUT)
		tween.set_trans(Tween.TRANS_ELASTIC)
		tween.tween_property(card, "position", Vector2.ZERO, 0.3)
		tween.parallel().tween_property(card, "rotation", 0.0, 0.2)

func _input(event: InputEvent) -> void:
	if game_manager.state != GameManager.State.PLAYING:
		return
	if event.is_action_pressed("swipe_right"):
		_quick_swipe("keep")
	elif event.is_action_pressed("swipe_left"):
		_quick_swipe("delete")
	elif event.is_action_pressed("swipe_up"):
		_quick_swipe("star")

func _quick_swipe(action: String) -> void:
	if current_card:
		var tween := create_tween()
		match action:
			"keep":
				tween.tween_property(current_card, "position:x", 800, 0.2)
			"delete":
				tween.tween_property(current_card, "position:x", -800, 0.2)
			"star":
				tween.tween_property(current_card, "position:y", -600, 0.2)
		tween.parallel().tween_property(current_card, "modulate:a", 0.0, 0.2)
		tween.tween_callback(func(): game_manager.handle_judgment(action))

func _on_score_changed(score: int, combo: int) -> void:
	score_label.text = str(score)
	if combo >= 2:
		combo_label.text = "%dx コンボ" % combo
		combo_label.modulate = Color(1, 0.85, 0, 1)
	else:
		combo_label.text = ""

func _on_time_changed(seconds_left: float) -> void:
	timer_label.text = str(int(max(0, seconds_left)))
	timer_bar.value = (seconds_left / GameManager.ROUND_DURATION) * 100.0

	## Color change when time is low
	if seconds_left <= 10.0:
		timer_label.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3))
	elif seconds_left <= 20.0:
		timer_label.add_theme_color_override("font_color", Color(0.95, 0.75, 0.2))

func _on_judgment_result(is_correct: bool, points: int, action: String) -> void:
	if is_correct:
		feedback_label.text = "+%d" % points
		feedback_label.add_theme_color_override("font_color", Color(0.3, 0.85, 0.5))
	else:
		feedback_label.text = "%d" % points
		feedback_label.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3))

	## Fade out feedback
	var tween := create_tween()
	feedback_label.modulate.a = 1.0
	tween.tween_property(feedback_label, "modulate:a", 0.0, 0.8)

func _on_combo_broken() -> void:
	combo_label.text = "コンボ切れ！"
	combo_label.modulate = Color(0.9, 0.3, 0.3)
	var tween := create_tween()
	tween.tween_property(combo_label, "modulate:a", 0.0, 0.8)

func _on_game_over(stats: Dictionary) -> void:
	_show_screen("results")
	_build_results_screen(stats)

func _build_results_screen(stats: Dictionary) -> void:
	## Clear previous results
	for child in results_screen.get_children():
		child.queue_free()

	var container := VBoxContainer.new()
	container.set_anchors_preset(PRESET_CENTER)
	container.offset_left = -200
	container.offset_right = 200
	container.offset_top = -350
	container.offset_bottom = 350
	container.alignment = BoxContainer.ALIGNMENT_CENTER
	results_screen.add_child(container)

	## Title
	var title := Label.new()
	title.text = "結果発表"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 36)
	container.add_child(title)

	## Grade
	var grade := Label.new()
	grade.text = stats["grade_label"]
	grade.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	grade.add_theme_font_size_override("font_size", 28)
	var grade_color := Color(1, 0.85, 0) if stats["grade"] in ["S", "A"] else Color(0.7, 0.7, 0.9)
	grade.add_theme_color_override("font_color", grade_color)
	container.add_child(grade)

	_add_spacer(container, 20)

	## Stats
	var stats_text := """スコア: %d
判定数: %d
正解: %d
ミス: %d
正確率: %.1f%%
最大コンボ: %dx
スター発見: %d
スピードボーナス: +%d""" % [
		stats["score"], stats["total_judged"],
		stats["correct"], stats["wrong"],
		stats["accuracy"], stats["max_combo"],
		stats["stars_found"], stats["speed_bonus_total"]
	]

	var stats_label := Label.new()
	stats_label.text = stats_text
	stats_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stats_label.add_theme_font_size_override("font_size", 18)
	stats_label.add_theme_color_override("font_color", Color(0.8, 0.8, 0.9))
	container.add_child(stats_label)

	_add_spacer(container, 10)

	## High score
	if stats.get("new_high_score", false):
		var hs_label := Label.new()
		hs_label.text = "🎉 ハイスコア更新！"
		hs_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		hs_label.add_theme_font_size_override("font_size", 22)
		hs_label.add_theme_color_override("font_color", Color(1, 0.85, 0))
		container.add_child(hs_label)
	else:
		var hs_label := Label.new()
		hs_label.text = "ハイスコア: %d" % stats.get("high_score", 0)
		hs_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		hs_label.add_theme_font_size_override("font_size", 14)
		hs_label.add_theme_color_override("font_color", Color(0.5, 0.5, 0.7))
		container.add_child(hs_label)

	_add_spacer(container, 20)

	## Retry button
	var retry_btn := Button.new()
	retry_btn.text = "▶ もう一度"
	retry_btn.custom_minimum_size = Vector2(0, 50)
	retry_btn.add_theme_font_size_override("font_size", 22)
	retry_btn.pressed.connect(func():
		_show_screen("game")
		game_manager.start_game()
	)
	container.add_child(retry_btn)

	## Back to title button
	var back_btn := Button.new()
	back_btn.text = "タイトルへ"
	back_btn.custom_minimum_size = Vector2(0, 40)
	back_btn.add_theme_font_size_override("font_size", 16)
	back_btn.pressed.connect(func():
		_show_screen("title")
		game_manager.go_to_title()
		high_score_label.text = "ハイスコア: %d" % game_manager.high_score
	)
	container.add_child(back_btn)

func _add_spacer(container: VBoxContainer, height: float) -> void:
	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, height)
	container.add_child(spacer)
