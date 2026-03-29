## Level definitions — each level specifies board size and available food items.
class_name LevelData
extends RefCounted

class Level:
	var number: int
	var board_width: int
	var board_height: int
	var food_indices: Array[int]  ## Indices into FoodData.foods
	var title: String
	var description: String
	var par_score: int  ## Target score for "perfect" rating

	func _init(p_num: int, p_w: int, p_h: int, p_foods: Array[int],
			   p_title: String, p_desc: String, p_par: int) -> void:
		number = p_num
		board_width = p_w
		board_height = p_h
		food_indices = p_foods
		title = p_title
		description = p_desc
		par_score = p_par

	func total_food_cells() -> int:
		var total := 0
		for idx in food_indices:
			var food := FoodData.get_food_by_index(idx)
			if food:
				total += food.shape.size()
		return total

	func board_cells() -> int:
		return board_width * board_height

static var levels: Array[Level] = [
	# Level 1: Tutorial - small board, simple shapes
	Level.new(1, 3, 2, [0, 1, 3],
		"はじめての弁当",
		"小さな弁当箱に3つの食材を詰めよう",
		120),

	# Level 2: 3x3 with 4 items
	Level.new(2, 3, 3, [0, 1, 2, 3],
		"朝ごはん弁当",
		"3x3の弁当箱。余りなく詰められるかな？",
		180),

	# Level 3: 4x3 with L-shape
	Level.new(3, 4, 3, [1, 2, 5, 3],
		"お昼の弁当",
		"ブロッコリーのL字型に注意！",
		220),

	# Level 4: 4x4 with more items
	Level.new(4, 4, 4, [0, 1, 4, 5, 3],
		"豪華弁当",
		"唐揚げの2x2ブロックをうまく配置しよう",
		350),

	# Level 5: 4x4 tight fit
	Level.new(5, 4, 4, [1, 6, 9, 0, 3],
		"パズル弁当",
		"寿司とS字型の枝豆がポイント",
		380),

	# Level 6: 5x3 with T-shape
	Level.new(6, 5, 3, [7, 1, 2, 0, 3],
		"深夜の特製弁当",
		"餃子のT字型を先に置くのがコツ",
		300),

	# Level 7: 5x4 challenge
	Level.new(7, 5, 4, [4, 6, 7, 1, 0, 3],
		"チャレンジ弁当",
		"6つの食材をぴったり詰め込め！",
		450),

	# Level 8: Large board
	Level.new(8, 5, 4, [8, 1, 5, 0, 0, 3],
		"とんかつ弁当",
		"巨大なとんかつ（2x3）をどう配置する？",
		480),

	# Level 9: Complex shapes
	Level.new(9, 6, 4, [8, 7, 6, 9, 0, 0, 3],
		"二段弁当・上",
		"7つの食材！複雑な形の組み合わせ",
		550),

	# Level 10: Final challenge
	Level.new(10, 6, 5, [8, 7, 6, 4, 1, 2, 9, 0, 3],
		"究極の弁当",
		"全食材を使って完璧な弁当を完成させろ！",
		700),
]

static func get_level(number: int) -> Level:
	if number >= 1 and number <= levels.size():
		return levels[number - 1]
	return null

static func level_count() -> int:
	return levels.size()
