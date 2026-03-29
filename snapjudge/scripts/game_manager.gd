## Main game manager. Controls game flow, timer, and state transitions.
class_name GameManager
extends Node

signal photo_ready(photo_data: PhotoGenerator.PhotoData)
signal score_changed(score: int, combo: int)
signal time_changed(seconds_left: float)
signal judgment_result(is_correct: bool, points: int, action: String)
signal combo_broken()
signal game_over(stats: Dictionary)

const ROUND_DURATION := 60.0   ## Seconds per round
const PHOTOS_PER_ROUND := 40   ## Generate this many photos

enum State { TITLE, PLAYING, RESULTS }

var state: State = State.TITLE
var score_system: ScoreSystem
var photos: Array = []
var current_photo_index: int = 0
var time_remaining: float = ROUND_DURATION
var current_photo_show_time: float = 0.0
var high_score: int = 0

func _ready() -> void:
	score_system = ScoreSystem.new()
	_load_high_score()

func _process(delta: float) -> void:
	if state != State.PLAYING:
		return

	time_remaining -= delta
	current_photo_show_time += delta
	time_changed.emit(time_remaining)

	if time_remaining <= 0.0:
		_end_game()

func start_game() -> void:
	state = State.PLAYING
	score_system.reset()
	time_remaining = ROUND_DURATION
	current_photo_index = 0
	current_photo_show_time = 0.0

	## Generate photos for the round
	photos = PhotoGenerator.generate_batch(PHOTOS_PER_ROUND)

	score_changed.emit(0, 0)
	time_changed.emit(ROUND_DURATION)
	_show_next_photo()

func handle_judgment(action: String) -> void:
	if state != State.PLAYING:
		return
	if current_photo_index >= photos.size():
		return

	var photo: PhotoGenerator.PhotoData = photos[current_photo_index]
	var decision_time := current_photo_show_time

	var points := score_system.judge(action, photo.correct_action, decision_time)
	var is_correct := points > 0

	judgment_result.emit(is_correct, points, action)
	score_changed.emit(score_system.score, score_system.combo)

	if not is_correct:
		combo_broken.emit()

	current_photo_index += 1
	current_photo_show_time = 0.0

	if current_photo_index >= photos.size():
		## Out of photos — generate more
		var new_batch := PhotoGenerator.generate_batch(PHOTOS_PER_ROUND)
		photos.append_array(new_batch)

	_show_next_photo()

func _show_next_photo() -> void:
	if current_photo_index < photos.size():
		photo_ready.emit(photos[current_photo_index])

func _end_game() -> void:
	state = State.RESULTS
	var stats := score_system.get_stats()

	## Update high score
	if stats["score"] > high_score:
		high_score = stats["score"]
		_save_high_score()
		stats["new_high_score"] = true
	else:
		stats["new_high_score"] = false

	stats["high_score"] = high_score
	game_over.emit(stats)

func go_to_title() -> void:
	state = State.TITLE

func _load_high_score() -> void:
	if FileAccess.file_exists("user://highscore.dat"):
		var file := FileAccess.open("user://highscore.dat", FileAccess.READ)
		if file:
			high_score = file.get_32()
			file.close()

func _save_high_score() -> void:
	var file := FileAccess.open("user://highscore.dat", FileAccess.WRITE)
	if file:
		file.store_32(high_score)
		file.close()
