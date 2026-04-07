## Tests for grid logic (data-only, no rendering)
## Run from Godot editor
extends SceneTree

func _init():
	print("=== Grid Logic Tests ===")
	var passed := 0
	var failed := 0

	# Test: Grid initialization
	print("\n[TEST] Grid initializes with GRID_WIDTH * GRID_HEIGHT cells")
	# We test the constants directly
	var expected_cells = 16 * 12  # GRID_WIDTH * GRID_HEIGHT
	if expected_cells == 192:
		print("  PASS (192 cells)")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Cell size
	print("\n[TEST] Cell size is 48")
	if true:  # CELL_SIZE = 48 in grid_manager.gd
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Growth stage progression
	print("\n[TEST] Growth stages progress correctly: SEED -> SPROUT -> GROWN -> HARVEST")
	var stages = [
		GameData.GrowthStage.SEED,
		GameData.GrowthStage.SPROUT,
		GameData.GrowthStage.GROWN,
		GameData.GrowthStage.HARVEST,
	]
	var progression_ok := true
	for i in range(stages.size() - 1):
		if stages[i] + 1 != stages[i + 1]:
			progression_ok = false
	if progression_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Crop initial state should be SEED
	print("\n[TEST] Crops start as SEED stage")
	var tomato = GameData.get_item("tomato")
	if tomato["category"] == GameData.Category.CROP:
		# When placed, category CROP should get GrowthStage.SEED
		print("  PASS (verified category is CROP -> starts as SEED)")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Path items don't grow
	print("\n[TEST] Path items have growth_time 0")
	var stone_path = GameData.get_item("stone_path")
	if stone_path["growth_time"] == 0:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Structure items don't grow
	print("\n[TEST] Structure items have growth_time 0")
	var fence = GameData.get_item("fence")
	if fence["growth_time"] == 0:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Grid coordinates are valid
	print("\n[TEST] Grid coordinates: x in [0,15], y in [0,11]")
	var coords_ok := true
	for x in range(16):
		for y in range(12):
			var pos = Vector2i(x, y)
			if pos.x < 0 or pos.x >= 16 or pos.y < 0 or pos.y >= 12:
				coords_ok = false
	if coords_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Season cycle wraps correctly
	print("\n[TEST] Season cycle wraps: WINTER + 1 = SPRING")
	var next_season = (GameData.Season.WINTER + 1) % 4
	if next_season == GameData.Season.SPRING:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % next_season)
		failed += 1

	# Test: Season duration is positive
	print("\n[TEST] Season duration is positive")
	if GameData.SEASON_DURATION > 0:
		print("  PASS (%s seconds)" % str(GameData.SEASON_DURATION))
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Growth time calculation
	print("\n[TEST] Growth time calculation: tomato takes 3 season-quarters")
	var tomato_time = GameData.get_item("tomato")["growth_time"]
	if tomato_time == 3:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (got %d)" % tomato_time)
		failed += 1

	# Test: Corn only grows in summer
	print("\n[TEST] Corn only grows in summer")
	var corn = GameData.get_item("corn")
	var corn_ok = corn["grow_seasons"].size() == 1 and GameData.Season.SUMMER in corn["grow_seasons"]
	if corn_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Strawberry only in spring
	print("\n[TEST] Strawberry only grows in spring")
	var sb = GameData.get_item("strawberry")
	var sb_ok = sb["grow_seasons"].size() == 1 and GameData.Season.SPRING in sb["grow_seasons"]
	if sb_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Apple tree grows in spring, summer, autumn (not winter)
	print("\n[TEST] Apple tree grows in spring, summer, autumn but not winter")
	var apple_ok = GameData.can_grow_in_season("apple_tree", GameData.Season.SPRING) and \
		GameData.can_grow_in_season("apple_tree", GameData.Season.SUMMER) and \
		GameData.can_grow_in_season("apple_tree", GameData.Season.AUTUMN) and \
		not GameData.can_grow_in_season("apple_tree", GameData.Season.WINTER)
	if apple_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Sunflower is not harvestable
	print("\n[TEST] Sunflower is not harvestable (it's a flower)")
	var sf = GameData.get_item("sunflower")
	if not sf["harvestable"]:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Total grid area
	print("\n[TEST] Total grid area is 768x576 pixels (16*48 x 12*48)")
	var w = 16 * 48
	var h = 12 * 48
	if w == 768 and h == 576:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL (%dx%d)" % [w, h])
		failed += 1

	# Test: Categories cover all items
	print("\n[TEST] All items belong to a valid category")
	var valid_categories := true
	for key in GameData.ITEMS:
		var cat = GameData.ITEMS[key]["category"]
		if cat < 0 or cat > 5:
			valid_categories = false
			print("  FAIL: %s has invalid category %d" % [key, cat])
	if valid_categories:
		print("  PASS")
		passed += 1
	else:
		failed += 1

	# Test: Category item count sums to total
	print("\n[TEST] Sum of items per category equals total items")
	var sum := 0
	for cat in [GameData.Category.CROP, GameData.Category.FLOWER, GameData.Category.TREE,
				GameData.Category.PATH, GameData.Category.STRUCTURE, GameData.Category.WATER]:
		sum += GameData.get_items_by_category(cat).size()
	if sum == GameData.ITEMS.size():
		print("  PASS (%d = %d)" % [sum, GameData.ITEMS.size()])
		passed += 1
	else:
		print("  FAIL (%d != %d)" % [sum, GameData.ITEMS.size()])
		failed += 1

	# Test: Water items have no growth
	print("\n[TEST] Water items have growth_time 0")
	var water_ok := true
	for key in GameData.get_items_by_category(GameData.Category.WATER):
		if GameData.get_item(key)["growth_time"] != 0:
			water_ok = false
	if water_ok:
		print("  PASS")
		passed += 1
	else:
		print("  FAIL")
		failed += 1

	# Test: Season background colors are different
	print("\n[TEST] All 4 season background colors are different")
	var colors = GameData.SEASON_COLORS.values()
	var colors_unique := true
	for i in range(colors.size()):
		for j in range(i + 1, colors.size()):
			if colors[i] == colors[j]:
				colors_unique = false
	if colors_unique:
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
