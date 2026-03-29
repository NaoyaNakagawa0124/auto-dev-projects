## Game state management for MidnightBento.
class_name GameManager
extends Node

signal level_started(level_num: int)
signal food_placed(food_id: String, score: int)
signal food_removed()
signal level_completed(score: int, is_perfect: bool)
signal game_completed(total_score: int)

enum State { TITLE, PLAYING, LEVEL_COMPLETE, GAME_COMPLETE }

var state: State = State.TITLE
var current_level_num: int = 0
var current_level: LevelData.Level
var board: BentoBoard
var available_foods: Array[FoodData.FoodItem]  ## Foods not yet placed
var selected_food_index: int = -1
var selected_rotation: int = 0
var level_scores: Array[int]
var total_score: int = 0

func _ready() -> void:
	level_scores = []

func start_game() -> void:
	current_level_num = 0
	level_scores.clear()
	total_score = 0
	next_level()

func next_level() -> void:
	current_level_num += 1
	if current_level_num > LevelData.level_count():
		state = State.GAME_COMPLETE
		game_completed.emit(total_score)
		return

	current_level = LevelData.get_level(current_level_num)
	board = BentoBoard.new(current_level.board_width, current_level.board_height)

	## Build available foods list from level definition
	available_foods.clear()
	for idx in current_level.food_indices:
		var food := FoodData.get_food_by_index(idx)
		if food:
			available_foods.append(food)

	selected_food_index = -1
	selected_rotation = 0
	state = State.PLAYING
	level_started.emit(current_level_num)

func select_food(index: int) -> void:
	if index >= 0 and index < available_foods.size():
		selected_food_index = index
		selected_rotation = 0

func rotate_selected() -> void:
	selected_rotation = (selected_rotation + 1) % 4

func try_place(grid_x: int, grid_y: int) -> bool:
	if selected_food_index < 0 or selected_food_index >= available_foods.size():
		return false

	var food := available_foods[selected_food_index]
	if board.place(food, selected_rotation, grid_x, grid_y):
		available_foods.remove_at(selected_food_index)
		selected_food_index = -1
		selected_rotation = 0

		var score := board.calculate_score()
		food_placed.emit(food.id, score)

		## Check if level is complete (all foods placed or board full)
		if available_foods.is_empty() or board.is_full():
			_complete_level()
		return true
	return false

func undo() -> void:
	if board.placed_foods.is_empty():
		return

	var last: Dictionary = board.placed_foods.back()
	var food := FoodData.get_food(last["food_id"])
	if food and board.remove_last():
		available_foods.append(food)
		food_removed.emit()

func _complete_level() -> void:
	var score := board.calculate_score()
	var is_perfect := board.is_full()
	level_scores.append(score)
	total_score += score
	state = State.LEVEL_COMPLETE
	level_completed.emit(score, is_perfect)

func get_grade(score: int) -> String:
	if current_level == null:
		return "C"
	var ratio := float(score) / float(current_level.par_score)
	if ratio >= 1.2:
		return "S"
	elif ratio >= 1.0:
		return "A"
	elif ratio >= 0.7:
		return "B"
	else:
		return "C"

func get_final_grade() -> String:
	var total_par := 0
	for i in range(LevelData.level_count()):
		var lvl := LevelData.get_level(i + 1)
		if lvl:
			total_par += lvl.par_score
	var ratio := float(total_score) / float(total_par)
	if ratio >= 1.2:
		return "S - 弁当の神！"
	elif ratio >= 1.0:
		return "A - 弁当マスター"
	elif ratio >= 0.7:
		return "B - なかなかの腕前"
	else:
		return "C - もっと練習しよう"
