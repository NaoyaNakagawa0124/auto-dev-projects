## Tests for GameData
## Run from Godot editor or via command line
extends SceneTree

func _init():
	print("=== GameData Tests ===")
	var passed := 0
	var failed := 0

	# Test: All items have required fields
	print("\n[TEST] All items have required fields")
	var all_valid := true
	for key in GameData.ITEMS:
		var item = GameData.ITEMS[key]
		if not item.has("name"):
			print("  FAIL: %s missing 'name'" % key)
			all_valid = false
		if not item.has("category"):
			print("  FAIL: %s missing 'category'" % key)
			all_valid = false
		if not item.has("colors"):
			print("  FAIL: %s missing 'colors'" % key)
			all_valid = false
		if not item.has("tip"):
			print("  FAIL: %s missing 'tip'" % key)
			all_valid = false
	if all_valid:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: Item count
	print("\n[TEST] Item count is 20")
	var count = GameData.ITEMS.size()
	if count == 20:
		print("  PASS (count=%d)" % count)
		passed += 1
	else:
		print("  FAIL (expected 20, got %d)" % count)
		failed += 1

	# Test: get_items_by_category returns correct items
	print("\n[TEST] get_items_by_category(CROP) returns 6 items")
	var crops = GameData.get_items_by_category(GameData.Category.CROP)
	if crops.size() == 6:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % crops.size())
		failed += 1

	# Test: get_items_by_category(FLOWER) returns 3
	print("\n[TEST] get_items_by_category(FLOWER) returns 3 items")
	var flowers = GameData.get_items_by_category(GameData.Category.FLOWER)
	if flowers.size() == 3:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % flowers.size())
		failed += 1

	# Test: get_items_by_category(TREE) returns 2
	print("\n[TEST] get_items_by_category(TREE) returns 2 items")
	var trees = GameData.get_items_by_category(GameData.Category.TREE)
	if trees.size() == 2:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % trees.size())
		failed += 1

	# Test: get_items_by_category(PATH) returns 3
	print("\n[TEST] get_items_by_category(PATH) returns 3 items")
	var paths = GameData.get_items_by_category(GameData.Category.PATH)
	if paths.size() == 3:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % paths.size())
		failed += 1

	# Test: get_items_by_category(STRUCTURE) returns 4
	print("\n[TEST] get_items_by_category(STRUCTURE) returns 4 items")
	var structures = GameData.get_items_by_category(GameData.Category.STRUCTURE)
	if structures.size() == 4:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % structures.size())
		failed += 1

	# Test: get_items_by_category(WATER) returns 2
	print("\n[TEST] get_items_by_category(WATER) returns 2 items")
	var water = GameData.get_items_by_category(GameData.Category.WATER)
	if water.size() == 2:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % water.size())
		failed += 1

	# Test: get_item returns correct data
	print("\n[TEST] get_item('tomato') returns correct data")
	var tomato = GameData.get_item("tomato")
	if tomato["name"] == "トマト" and tomato["category"] == GameData.Category.CROP:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: get_item with invalid key
	print("\n[TEST] get_item('nonexistent') returns empty dict")
	var empty = GameData.get_item("nonexistent")
	if empty.is_empty():
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: can_grow_in_season
	print("\n[TEST] can_grow_in_season('tomato', SPRING) is true")
	if GameData.can_grow_in_season("tomato", GameData.Season.SPRING):
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	print("\n[TEST] can_grow_in_season('tomato', WINTER) is false")
	if not GameData.can_grow_in_season("tomato", GameData.Season.WINTER):
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Season names
	print("\n[TEST] Season names are correct")
	if GameData.SEASON_NAMES[GameData.Season.SPRING] == "春" and \
	   GameData.SEASON_NAMES[GameData.Season.SUMMER] == "夏" and \
	   GameData.SEASON_NAMES[GameData.Season.AUTUMN] == "秋" and \
	   GameData.SEASON_NAMES[GameData.Season.WINTER] == "冬":
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Season colors exist for all seasons
	print("\n[TEST] Season colors defined for all 4 seasons")
	if GameData.SEASON_COLORS.size() == 4:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % GameData.SEASON_COLORS.size())
		failed += 1

	# Test: Category names
	print("\n[TEST] Category names are correct")
	if GameData.CATEGORY_NAMES[GameData.Category.CROP] == "作物" and \
	   GameData.CATEGORY_NAMES[GameData.Category.FLOWER] == "花":
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: All crops have grow_seasons
	print("\n[TEST] All crops have non-empty grow_seasons")
	var all_have_seasons := true
	for key in GameData.get_items_by_category(GameData.Category.CROP):
		var item = GameData.get_item(key)
		if item["grow_seasons"].size() == 0:
			print("  FAIL: %s has no grow_seasons" % key)
			all_have_seasons = false
	if all_have_seasons:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: All items have Japanese names
	print("\n[TEST] All items have Japanese names (non-ASCII)")
	var all_japanese := true
	for key in GameData.ITEMS:
		var name_str = GameData.ITEMS[key]["name"]
		# Check that name contains at least one non-ASCII character
		var has_jp := false
		for i in range(name_str.length()):
			if name_str.unicode_at(i) > 127:
				has_jp = true
				break
		if not has_jp:
			print("  FAIL: '%s' name '%s' is not Japanese" % [key, name_str])
			all_japanese = false
	if all_japanese:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: All tips are non-empty
	print("\n[TEST] All items have non-empty tips")
	var all_tips := true
	for key in GameData.ITEMS:
		if GameData.ITEMS[key]["tip"].length() == 0:
			print("  FAIL: %s has empty tip" % key)
			all_tips = false
	if all_tips:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: Harvestable items are only crops and fruit trees
	print("\n[TEST] Only crops and fruit trees are harvestable")
	var harvest_correct := true
	for key in GameData.ITEMS:
		var item = GameData.ITEMS[key]
		if item["harvestable"]:
			if item["category"] != GameData.Category.CROP and item["category"] != GameData.Category.TREE:
				print("  FAIL: %s is harvestable but not crop/tree" % key)
				harvest_correct = false
	if harvest_correct:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: Crops have 4 color stages
	print("\n[TEST] Crops have 4 color stages")
	var crop_colors_ok := true
	for key in GameData.get_items_by_category(GameData.Category.CROP):
		var item = GameData.get_item(key)
		if item["colors"].size() != 4:
			print("  FAIL: %s has %d colors (expected 4)" % [key, item["colors"].size()])
			crop_colors_ok = false
	if crop_colors_ok:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: Growth stage names
	print("\n[TEST] Growth stage names are correct")
	if GameData.GROWTH_STAGE_NAMES[GameData.GrowthStage.SEED] == "種" and \
	   GameData.GROWTH_STAGE_NAMES[GameData.GrowthStage.HARVEST] == "収穫":
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: get_all_item_keys returns all items
	print("\n[TEST] get_all_item_keys returns all 20 items")
	var all_keys = GameData.get_all_item_keys()
	if all_keys.size() == 20:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % all_keys.size())
		failed += 1

	# Test: Daikon grows in autumn and winter
	print("\n[TEST] Daikon grows in autumn and winter")
	if GameData.can_grow_in_season("daikon", GameData.Season.AUTUMN) and \
	   GameData.can_grow_in_season("daikon", GameData.Season.WINTER):
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Paths have no grow_seasons
	print("\n[TEST] Paths have empty grow_seasons")
	var path_ok := true
	for key in GameData.get_items_by_category(GameData.Category.PATH):
		var item = GameData.get_item(key)
		if item["grow_seasons"].size() != 0:
			path_ok = false
	if path_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Structures are not harvestable
	print("\n[TEST] Structures are not harvestable")
	var struct_ok := true
	for key in GameData.get_items_by_category(GameData.Category.STRUCTURE):
		if GameData.get_item(key)["harvestable"]:
			struct_ok = false
	if struct_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Sakura grows in all seasons
	print("\n[TEST] Sakura grows in all 4 seasons")
	var sakura_ok := true
	for s in [GameData.Season.SPRING, GameData.Season.SUMMER, GameData.Season.AUTUMN, GameData.Season.WINTER]:
		if not GameData.can_grow_in_season("sakura", s):
			sakura_ok = false
	if sakura_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Summary
	print("\n=== Results: %d passed, %d failed ===" % [passed, failed])
	if failed > 0:
		print("SOME TESTS FAILED!")
	else:
		print("ALL TESTS PASSED!")

	quit()
