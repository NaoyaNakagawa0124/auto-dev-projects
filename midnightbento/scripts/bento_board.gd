## Bento box grid logic. Handles placement validation and scoring.
class_name BentoBoard
extends RefCounted

var width: int
var height: int
var grid: Array  ## 2D array of food IDs (empty string = empty)
var placed_foods: Array[Dictionary]  ## {food_id, rotation, x, y}

func _init(w: int = 4, h: int = 4) -> void:
	width = w
	height = h
	grid = []
	placed_foods = []
	_clear_grid()

func _clear_grid() -> void:
	grid.clear()
	for y in range(height):
		var row: Array[String] = []
		for x in range(width):
			row.append("")
		grid.append(row)

func reset() -> void:
	_clear_grid()
	placed_foods.clear()

func get_cell(x: int, y: int) -> String:
	if x < 0 or x >= width or y < 0 or y >= height:
		return "OUT"
	return grid[y][x]

func is_cell_empty(x: int, y: int) -> bool:
	return get_cell(x, y) == ""

func can_place(food: FoodData.FoodItem, rotation: int, place_x: int, place_y: int) -> bool:
	var shape := food.get_rotated_shape(rotation)
	for offset in shape:
		var cx := place_x + offset.x
		var cy := place_y + offset.y
		if cx < 0 or cx >= width or cy < 0 or cy >= height:
			return false
		if grid[cy][cx] != "":
			return false
	return true

func place(food: FoodData.FoodItem, rotation: int, place_x: int, place_y: int) -> bool:
	if not can_place(food, rotation, place_x, place_y):
		return false

	var shape := food.get_rotated_shape(rotation)
	for offset in shape:
		grid[place_y + offset.y][place_x + offset.x] = food.id

	placed_foods.append({
		"food_id": food.id,
		"rotation": rotation,
		"x": place_x,
		"y": place_y,
	})
	return true

func remove_last() -> bool:
	if placed_foods.is_empty():
		return false

	var last: Dictionary = placed_foods.pop_back()
	var food := FoodData.get_food(last["food_id"])
	if food == null:
		return false

	var shape := food.get_rotated_shape(last["rotation"])
	for offset in shape:
		var cx: int = last["x"] + offset.x
		var cy: int = last["y"] + offset.y
		if cx >= 0 and cx < width and cy >= 0 and cy < height:
			grid[cy][cx] = ""
	return true

func is_full() -> bool:
	for y in range(height):
		for x in range(width):
			if grid[y][x] == "":
				return false
	return true

func empty_cells() -> int:
	var count := 0
	for y in range(height):
		for x in range(width):
			if grid[y][x] == "":
				count += 1
	return count

func filled_cells() -> int:
	return width * height - empty_cells()

func fill_percentage() -> float:
	return float(filled_cells()) / float(width * height) * 100.0

func calculate_score() -> int:
	var base_score := filled_cells() * 10
	var bonus := 0

	## Full board bonus
	if is_full():
		bonus += 500

	## Variety bonus: unique food types
	var unique_foods: Array[String] = []
	for entry in placed_foods:
		if not unique_foods.has(entry["food_id"]):
			unique_foods.append(entry["food_id"])
	bonus += unique_foods.size() * 50

	## Effect score
	for entry in placed_foods:
		var food := FoodData.get_food(entry["food_id"])
		if food:
			bonus += food.effect_value

	return base_score + bonus

func get_study_effects() -> Dictionary:
	var effects: Dictionary = {}
	for entry in placed_foods:
		var food := FoodData.get_food(entry["food_id"])
		if food:
			if not effects.has(food.effect_name):
				effects[food.effect_name] = 0
			effects[food.effect_name] += food.effect_value
	return effects
