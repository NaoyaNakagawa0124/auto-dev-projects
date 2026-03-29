## Food item definitions with shapes, colors, and study effects.
class_name FoodData
extends RefCounted

## Food shape defined as array of Vector2i offsets from origin
class FoodItem:
	var id: String
	var name: String          ## Japanese name
	var emoji: String
	var shape: Array[Vector2i]  ## Cell offsets
	var color: Color
	var effect_name: String   ## Study effect name
	var effect_value: int     ## Effect strength

	func _init(p_id: String, p_name: String, p_emoji: String,
			   p_shape: Array[Vector2i], p_color: Color,
			   p_effect: String, p_value: int) -> void:
		id = p_id
		name = p_name
		emoji = p_emoji
		shape = p_shape
		color = p_color
		effect_name = p_effect
		effect_value = p_value

	func get_rotated_shape(rotation: int) -> Array[Vector2i]:
		var result := shape.duplicate()
		for _r in range(rotation % 4):
			var new_result: Array[Vector2i] = []
			for pos in result:
				new_result.append(Vector2i(pos.y, -pos.x))
			result = new_result
		return result

	func get_width(rotation: int) -> int:
		var rotated := get_rotated_shape(rotation)
		var min_x := 999
		var max_x := -999
		for pos in rotated:
			min_x = min(min_x, pos.x)
			max_x = max(max_x, pos.x)
		return max_x - min_x + 1

	func get_height(rotation: int) -> int:
		var rotated := get_rotated_shape(rotation)
		var min_y := 999
		var max_y := -999
		for pos in rotated:
			min_y = min(min_y, pos.y)
			max_y = max(max_y, pos.y)
		return max_y - min_y + 1

static var foods: Array[FoodItem] = [
	# 1x1 items
	FoodItem.new("umeboshi", "梅干し", "🔴",
		[Vector2i(0,0)],
		Color(0.8, 0.1, 0.2), "集中力", 5),

	# 1x2 items
	FoodItem.new("onigiri", "おにぎり", "🍙",
		[Vector2i(0,0), Vector2i(1,0)],
		Color(0.95, 0.95, 0.9), "集中力", 15),

	FoodItem.new("tamagoyaki", "卵焼き", "🥚",
		[Vector2i(0,0), Vector2i(1,0)],
		Color(1.0, 0.85, 0.2), "記憶力", 15),

	# 2x1 items
	FoodItem.new("sausage", "ソーセージ", "🌭",
		[Vector2i(0,0), Vector2i(0,1)],
		Color(0.7, 0.3, 0.2), "スタミナ", 10),

	# 2x2 items
	FoodItem.new("karaage", "唐揚げ", "🍗",
		[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],
		Color(0.8, 0.5, 0.15), "スタミナ", 25),

	# L-shape (3 cells)
	FoodItem.new("broccoli", "ブロッコリー", "🥦",
		[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],
		Color(0.2, 0.6, 0.15), "健康", 20),

	# 1x3 items
	FoodItem.new("sushi", "巻き寿司", "🍣",
		[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],
		Color(0.1, 0.5, 0.3), "ご褒美", 30),

	# T-shape (4 cells)
	FoodItem.new("gyoza", "餃子", "🥟",
		[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)],
		Color(0.9, 0.8, 0.5), "コンボ", 20),

	# 2x3 (6 cells)
	FoodItem.new("tonkatsu", "とんかつ", "🥩",
		[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0),
		 Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)],
		Color(0.7, 0.4, 0.1), "満腹", 35),

	# S-shape
	FoodItem.new("edamame", "枝豆", "🫛",
		[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1), Vector2i(2,1)],
		Color(0.4, 0.7, 0.2), "リラックス", 15),
]

static func get_food(id: String) -> FoodItem:
	for food in foods:
		if food.id == id:
			return food
	return null

static func get_food_by_index(idx: int) -> FoodItem:
	if idx >= 0 and idx < foods.size():
		return foods[idx]
	return null

static func food_count() -> int:
	return foods.size()
