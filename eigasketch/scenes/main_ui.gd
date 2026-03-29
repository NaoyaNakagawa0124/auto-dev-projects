## Main UI for EigaSketch quiz game.
extends Control

@onready var title_screen: VBoxContainer = $TitleScreen
@onready var game_screen: Control = $GameScreen
@onready var result_screen: Control = $ResultScreen
@onready var start_btn: Button = $TitleScreen/StartButton
@onready var start_all_btn: Button = $TitleScreen/StartAllButton

var quiz: QuizEngine
var sketch_drawer: Control  ## SketchDrawer node created dynamically
var question_timer: float = 0.0

func _ready() -> void:
	quiz = QuizEngine.new()
	start_btn.pressed.connect(func(): _start_quiz(10))
	start_all_btn.pressed.connect(func(): _start_quiz(30))
	_show_screen("title")

func _show_screen(name: String) -> void:
	title_screen.visible = name == "title"
	game_screen.visible = name == "game"
	result_screen.visible = name == "result"

func _start_quiz(count: int) -> void:
	var pool: Array = MovieData.movies.duplicate()
	pool.shuffle()
	var selected: Array = pool.slice(0, min(count, pool.size()))
	quiz.setup(selected)
	_show_screen("game")
	_setup_game_screen()
	_show_question()

func _setup_game_screen() -> void:
	## Clear previous
	for child in game_screen.get_children():
		child.queue_free()

	## Sketch area
	sketch_drawer = Control.new()
	sketch_drawer.set_script(load("res://scripts/sketch_drawer.gd"))
	sketch_drawer.position = Vector2(30, 50)
	sketch_drawer.size = Vector2(400, 300)
	game_screen.add_child(sketch_drawer)

func _show_question() -> void:
	question_timer = 0.0
	var q := quiz.current_question()
	if q.is_empty():
		return

	var movie: MovieData.Movie = q["movie"]
	sketch_drawer.set_hints(movie.hints, q["hints_shown"])
	queue_redraw()

func _process(delta: float) -> void:
	if not game_screen.visible:
		return
	if quiz.is_finished():
		return

	var q := quiz.current_question()
	if q.is_empty() or q["answered"]:
		return

	question_timer += delta
	q["time"] = question_timer

	## Auto-reveal hints over time
	var interval := QuizEngine.TIME_PER_QUESTION / float(QuizEngine.HINTS_PER_MOVIE)
	var should_show := int(question_timer / interval) + 1
	if should_show > q["hints_shown"] and should_show <= QuizEngine.HINTS_PER_MOVIE:
		q["hints_shown"] = should_show
		sketch_drawer.set_visible_count(should_show)

	queue_redraw()

func _draw() -> void:
	if not game_screen.visible:
		return
	if quiz == null or quiz.is_finished():
		return

	var q := quiz.current_question()
	if q.is_empty():
		return

	## HUD
	var hud_y := 15
	draw_string(ThemeDB.fallback_font, Vector2(30, hud_y),
		"問題 %d / %d" % [quiz.current_index + 1, quiz.question_count()],
		HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.6, 0.6, 0.8))

	draw_string(ThemeDB.fallback_font, Vector2(400, hud_y),
		"スコア: %d" % quiz.score,
		HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(1.0, 0.85, 0.0))

	## Timer bar
	var time_ratio := clampf(1.0 - question_timer / QuizEngine.TIME_PER_QUESTION, 0.0, 1.0)
	draw_rect(Rect2(30, 370, 400 * time_ratio, 6),
		Color(0.3, 0.8, 0.4) if time_ratio > 0.3 else Color(0.9, 0.3, 0.2))

	## Genre badge
	var movie: MovieData.Movie = q["movie"]
	var genre_info: Dictionary = MovieData.genres.get(movie.genre, {"name": "", "color": Color.WHITE})
	draw_string(ThemeDB.fallback_font, Vector2(30, 400),
		genre_info["name"], HORIZONTAL_ALIGNMENT_LEFT, -1, 12, genre_info["color"])

	## Hint count
	draw_string(ThemeDB.fallback_font, Vector2(350, 400),
		"ヒント: %d/%d" % [q["hints_shown"], QuizEngine.HINTS_PER_MOVIE],
		HORIZONTAL_ALIGNMENT_LEFT, -1, 12, Color(0.5, 0.5, 0.7))

	## Choice buttons (drawn as text, click areas)
	if not q["answered"]:
		var choices: Array = q["choices"]
		for i in range(choices.size()):
			var cx: float = 480
			var cy: float = 80 + i * 70.0
			var cw: float = 380.0
			var ch: float = 55.0

			draw_rect(Rect2(cx, cy, cw, ch), Color(0.12, 0.1, 0.2))
			draw_rect(Rect2(cx, cy, cw, ch), Color(0.3, 0.3, 0.5, 0.5), false, 1)

			var m: MovieData.Movie = choices[i]
			draw_string(ThemeDB.fallback_font, Vector2(cx + 15, cy + 22),
				m.title, HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.9, 0.9, 0.95))
			draw_string(ThemeDB.fallback_font, Vector2(cx + 15, cy + 42),
				"%s (%d)" % [m.title_en, m.year], HORIZONTAL_ALIGNMENT_LEFT, -1, 11, Color(0.5, 0.5, 0.7))
	else:
		## Show result
		var result_text := "正解！ 🎉" if q["correct"] else "不正解... 😢"
		var result_color := Color(0.3, 0.9, 0.4) if q["correct"] else Color(0.9, 0.3, 0.3)
		draw_string(ThemeDB.fallback_font, Vector2(550, 150), result_text,
			HORIZONTAL_ALIGNMENT_LEFT, -1, 24, result_color)

		draw_string(ThemeDB.fallback_font, Vector2(500, 200),
			"正解: %s" % movie.title,
			HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(1.0, 0.85, 0.0))

		draw_string(ThemeDB.fallback_font, Vector2(500, 280),
			"Enter で次の問題", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, Color(0.5, 0.5, 0.7))

func _input(event: InputEvent) -> void:
	if not game_screen.visible:
		return

	var q := quiz.current_question()
	if q.is_empty():
		return

	## Click on choice
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if not q["answered"]:
			for i in range(4):
				var cx: float = 480
				var cy: float = 80 + i * 70.0
				if event.position.x >= cx and event.position.x <= cx + 380 and \
				   event.position.y >= cy and event.position.y <= cy + 55:
					var result := quiz.answer(i)
					queue_redraw()
					break

	## Next question
	if event is InputEventKey and event.pressed and event.keycode == KEY_ENTER:
		if q["answered"]:
			if quiz.next_question():
				_show_question()
			else:
				_show_results()

	## Keyboard shortcuts for choices (1-4)
	if event is InputEventKey and event.pressed and not q["answered"]:
		var choice := -1
		if event.keycode == KEY_1: choice = 0
		elif event.keycode == KEY_2: choice = 1
		elif event.keycode == KEY_3: choice = 2
		elif event.keycode == KEY_4: choice = 3
		if choice >= 0:
			quiz.answer(choice)
			queue_redraw()

func _show_results() -> void:
	_show_screen("result")
	_build_result_screen()

func _build_result_screen() -> void:
	for child in result_screen.get_children():
		child.queue_free()

	var results := quiz.get_results()
	var vbox := VBoxContainer.new()
	vbox.set_anchors_preset(PRESET_CENTER)
	vbox.offset_left = -220
	vbox.offset_right = 220
	vbox.offset_top = -200
	vbox.offset_bottom = 200
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	result_screen.add_child(vbox)

	var title := Label.new()
	title.text = "🎬 クイズ結果"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 32)
	title.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
	vbox.add_child(title)

	var grade := Label.new()
	grade.text = results["grade_label"]
	grade.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	grade.add_theme_font_size_override("font_size", 22)
	grade.add_theme_color_override("font_color", Color(0.4, 0.8, 1.0))
	vbox.add_child(grade)

	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, 10)
	vbox.add_child(spacer)

	var stats := Label.new()
	stats.text = """スコア: %d
正解: %d / %d (%.0f%%)
平均回答時間: %.1f秒""" % [
		results["score"], results["correct"], results["total"],
		results["accuracy"], results["avg_time"]]
	stats.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	stats.add_theme_font_size_override("font_size", 16)
	vbox.add_child(stats)

	var spacer2 := Control.new()
	spacer2.custom_minimum_size = Vector2(0, 20)
	vbox.add_child(spacer2)

	var retry := Button.new()
	retry.text = "もう一度"
	retry.custom_minimum_size = Vector2(0, 45)
	retry.add_theme_font_size_override("font_size", 18)
	retry.pressed.connect(func(): _show_screen("title"))
	vbox.add_child(retry)
