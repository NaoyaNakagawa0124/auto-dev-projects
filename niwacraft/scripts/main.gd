## Main game controller for niwacraft
extends Control

@onready var grid_manager: Node2D = $GridContainer/GridManager
@onready var season_label: Label = $UI/TopBar/SeasonLabel
@onready var season_timer_bar: ProgressBar = $UI/TopBar/SeasonTimerBar
@onready var stats_label: Label = $UI/TopBar/StatsLabel
@onready var info_panel: Panel = $UI/InfoPanel
@onready var info_title: Label = $UI/InfoPanel/VBox/InfoTitle
@onready var info_desc: Label = $UI/InfoPanel/VBox/InfoDesc
@onready var info_tip: Label = $UI/InfoPanel/VBox/InfoTip
@onready var info_status: Label = $UI/InfoPanel/VBox/InfoStatus
@onready var harvest_btn: Button = $UI/InfoPanel/VBox/HarvestBtn
@onready var palette_container: VBoxContainer = $UI/Palette/PaletteScroll/PaletteItems
@onready var category_tabs: HBoxContainer = $UI/Palette/CategoryTabs
@onready var eraser_btn: Button = $UI/Palette/EraserBtn
@onready var speed_btn: Button = $UI/TopBar/SpeedBtn
@onready var harvest_count_label: Label = $UI/TopBar/HarvestCountLabel

var current_season: GameData.Season = GameData.Season.SPRING
var season_timer: float = 0.0
var game_speed: float = 1.0
var harvest_count: int = 0
var selected_grid_pos: Vector2i = Vector2i(-1, -1)
var active_category: GameData.Category = GameData.Category.CROP

func _ready():
	_setup_category_tabs()
	_populate_palette(active_category)
	_update_season_display()
	_update_stats()
	_hide_info_panel()

	grid_manager.tile_placed.connect(_on_tile_placed)
	grid_manager.tile_removed.connect(_on_tile_removed)
	grid_manager.tile_selected.connect(_on_tile_selected)
	harvest_btn.pressed.connect(_on_harvest_pressed)
	eraser_btn.pressed.connect(_on_eraser_pressed)
	speed_btn.pressed.connect(_on_speed_pressed)

func _process(delta: float):
	season_timer += delta * game_speed
	if season_timer >= GameData.SEASON_DURATION:
		season_timer = 0.0
		_advance_season()

	season_timer_bar.value = (season_timer / GameData.SEASON_DURATION) * 100.0
	grid_manager.advance_growth(delta * game_speed)

func _advance_season():
	current_season = (current_season + 1) % 4 as GameData.Season
	grid_manager.set_season(current_season)
	_update_season_display()

func _update_season_display():
	var season_name = GameData.SEASON_NAMES[current_season]
	var season_emoji = ["🌸", "☀️", "🍂", "❄️"][current_season]
	season_label.text = "%s %s" % [season_emoji, season_name]

	var bg_color = GameData.get_season_bg_color(current_season)
	# Tint the top bar subtly
	var bar = $UI/TopBar
	if bar:
		var style = StyleBoxFlat.new()
		style.bg_color = bg_color.darkened(0.05)
		style.border_color = bg_color.darkened(0.15)
		style.set_border_width_all(1)
		style.set_corner_radius_all(4)
		bar.add_theme_stylebox_override("panel", style)

func _update_stats():
	var stats = grid_manager.get_stats()
	stats_label.text = "🌱%d  🌻%d  🌳%d  | 合計: %d" % [
		stats["crops"], stats["flowers"], stats["trees"], stats["total"]
	]
	harvest_count_label.text = "🧺 収穫: %d" % harvest_count

func _setup_category_tabs():
	for child in category_tabs.get_children():
		child.queue_free()

	var categories = [
		GameData.Category.CROP,
		GameData.Category.FLOWER,
		GameData.Category.TREE,
		GameData.Category.PATH,
		GameData.Category.STRUCTURE,
		GameData.Category.WATER,
	]
	var emojis = ["🥕", "🌻", "🌳", "🛤️", "🏗️", "💧"]

	for i in range(categories.size()):
		var btn = Button.new()
		btn.text = "%s %s" % [emojis[i], GameData.CATEGORY_NAMES[categories[i]]]
		btn.custom_minimum_size = Vector2(80, 32)
		btn.pressed.connect(_on_category_selected.bind(categories[i]))
		category_tabs.add_child(btn)

func _populate_palette(category: GameData.Category):
	active_category = category
	for child in palette_container.get_children():
		child.queue_free()

	var items = GameData.get_items_by_category(category)
	for item_key in items:
		var item_data = GameData.get_item(item_key)
		var btn = Button.new()
		btn.text = item_data["name"]
		btn.custom_minimum_size = Vector2(140, 36)
		btn.tooltip_text = item_data.get("tip", "")
		btn.pressed.connect(_on_palette_item_selected.bind(item_key))

		# Color indicator
		var color = item_data["colors"][-1] if item_data["colors"].size() > 0 else Color.GRAY
		var style = StyleBoxFlat.new()
		style.bg_color = color.lightened(0.5)
		style.border_color = color
		style.set_border_width_all(2)
		style.set_corner_radius_all(6)
		style.content_margin_left = 8
		style.content_margin_right = 8
		style.content_margin_top = 4
		style.content_margin_bottom = 4
		btn.add_theme_stylebox_override("normal", style)

		var hover_style = style.duplicate()
		hover_style.bg_color = color.lightened(0.3)
		btn.add_theme_stylebox_override("hover", hover_style)

		palette_container.add_child(btn)

func _on_category_selected(category: GameData.Category):
	_populate_palette(category)
	grid_manager.is_eraser_mode = false

func _on_palette_item_selected(item_key: String):
	grid_manager.selected_item = item_key
	grid_manager.is_eraser_mode = false
	var item_data = GameData.get_item(item_key)
	_show_item_info(item_key, item_data)

func _on_eraser_pressed():
	grid_manager.is_eraser_mode = !grid_manager.is_eraser_mode
	grid_manager.selected_item = ""
	if grid_manager.is_eraser_mode:
		eraser_btn.text = "🗑️ 消しゴム ON"
	else:
		eraser_btn.text = "🗑️ 消しゴム"

func _on_speed_pressed():
	if game_speed == 1.0:
		game_speed = 2.0
		speed_btn.text = "⏩ 2倍速"
	elif game_speed == 2.0:
		game_speed = 4.0
		speed_btn.text = "⏩ 4倍速"
	else:
		game_speed = 1.0
		speed_btn.text = "▶️ 通常速度"

func _on_tile_placed(_pos: Vector2i, item_key: String):
	var item_data = GameData.get_item(item_key)
	_show_item_info(item_key, item_data)
	_update_stats()

func _on_tile_removed(_pos: Vector2i):
	_hide_info_panel()
	_update_stats()

func _on_tile_selected(pos: Vector2i, item_key: String):
	selected_grid_pos = pos
	var item_data = GameData.get_item(item_key)
	var cell = grid_manager.grid[pos]
	_show_item_info(item_key, item_data, cell)

func _show_item_info(item_key: String, item_data: Dictionary, cell: Dictionary = {}):
	info_panel.visible = true
	info_title.text = item_data.get("name", item_key)

	var category_name = GameData.CATEGORY_NAMES.get(item_data.get("category", 0), "")
	info_desc.text = "分類: %s" % category_name

	if item_data.get("grow_seasons", []).size() > 0:
		var season_names = []
		for s in item_data["grow_seasons"]:
			season_names.append(GameData.SEASON_NAMES[s])
		info_desc.text += "\n育つ季節: %s" % ", ".join(season_names)

	info_tip.text = "💡 " + item_data.get("tip", "")

	if not cell.is_empty():
		var stage = cell.get("growth_stage", GameData.GrowthStage.NONE)
		var stage_name = GameData.GROWTH_STAGE_NAMES.get(stage, "")
		if stage_name != "":
			info_status.text = "成長段階: %s" % stage_name
			info_status.visible = true
		else:
			info_status.visible = false

		harvest_btn.visible = (stage == GameData.GrowthStage.HARVEST and item_data.get("harvestable", false))
	else:
		info_status.visible = false
		harvest_btn.visible = false

func _hide_info_panel():
	info_panel.visible = false

func _on_harvest_pressed():
	if selected_grid_pos.x < 0:
		return
	var harvested = grid_manager.harvest_tile(selected_grid_pos)
	if harvested != "":
		harvest_count += 1
		_update_stats()
		var item_data = GameData.get_item(harvested)
		info_title.text = "🧺 %s を収穫した！" % item_data.get("name", harvested)
		harvest_btn.visible = false
		info_status.text = "成長段階: 種（リセット）"

func save_garden() -> Dictionary:
	return {
		"grid": grid_manager.get_grid_data(),
		"season": current_season,
		"harvest_count": harvest_count,
	}

func load_garden(data: Dictionary):
	if data.has("grid"):
		grid_manager.load_grid_data(data["grid"])
	if data.has("season"):
		current_season = data["season"]
		grid_manager.set_season(current_season)
		_update_season_display()
	if data.has("harvest_count"):
		harvest_count = data["harvest_count"]
	_update_stats()
