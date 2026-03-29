## Visual representation of a photo card.
## Draws a procedurally generated "photo" based on PhotoData attributes.
extends Control

signal swiped(direction: String)  ## "keep", "delete", or "star"

var photo_data: PhotoGenerator.PhotoData
var is_animating := false
var swipe_start := Vector2.ZERO
var is_dragging := false

const SWIPE_THRESHOLD := 80.0
const SWIPE_UP_THRESHOLD := -60.0
const CARD_WIDTH := 400.0
const CARD_HEIGHT := 500.0

@onready var card_panel: Panel = $CardPanel
@onready var quality_bars: Control = $CardPanel/QualityBars
@onready var sharpness_bar: ProgressBar = $CardPanel/QualityBars/SharpnessBar
@onready var exposure_bar: ProgressBar = $CardPanel/QualityBars/ExposureBar
@onready var composition_bar: ProgressBar = $CardPanel/QualityBars/CompositionBar
@onready var photo_canvas: Control = $CardPanel/PhotoCanvas
@onready var action_label: Label = $ActionLabel

var original_position: Vector2

func _ready() -> void:
	original_position = position
	action_label.visible = false
	pivot_offset = size / 2.0

func setup(data: PhotoGenerator.PhotoData) -> void:
	photo_data = data

	## Set quality indicator bars
	sharpness_bar.value = data.sharpness * 100.0
	exposure_bar.value = data.exposure * 100.0
	composition_bar.value = data.composition * 100.0

	## Color the bars based on quality
	_color_bar(sharpness_bar, data.sharpness)
	_color_bar(exposure_bar, data.exposure)
	_color_bar(composition_bar, data.composition)

	## Trigger photo canvas redraw
	photo_canvas.queue_redraw()

	## Reset position and state
	position = original_position
	rotation = 0.0
	modulate.a = 1.0
	scale = Vector2.ONE
	is_animating = false
	action_label.visible = false

func _color_bar(bar: ProgressBar, value: float) -> void:
	var style := StyleBoxFlat.new()
	if value >= 0.7:
		style.bg_color = Color(0.3, 0.85, 0.5)  ## Green
	elif value >= 0.4:
		style.bg_color = Color(0.95, 0.75, 0.2)  ## Yellow
	else:
		style.bg_color = Color(0.9, 0.3, 0.3)    ## Red
	style.corner_radius_top_left = 3
	style.corner_radius_top_right = 3
	style.corner_radius_bottom_left = 3
	style.corner_radius_bottom_right = 3
	bar.add_theme_stylebox_override("fill", style)

func _gui_input(event: InputEvent) -> void:
	if is_animating:
		return

	if event is InputEventMouseButton:
		if event.pressed:
			is_dragging = true
			swipe_start = event.position
		else:
			is_dragging = false
			_evaluate_swipe(event.position - swipe_start)

	elif event is InputEventMouseMotion and is_dragging:
		var diff := event.position - swipe_start
		## Tilt card based on drag
		position = original_position + diff * 0.5
		rotation = diff.x * 0.001
		_show_action_hint(diff)

	elif event is InputEventScreenTouch:
		if event.pressed:
			is_dragging = true
			swipe_start = event.position
		else:
			is_dragging = false
			_evaluate_swipe(event.position - swipe_start)

	elif event is InputEventScreenDrag and is_dragging:
		var diff := event.position - swipe_start
		position = original_position + diff * 0.5
		rotation = diff.x * 0.001
		_show_action_hint(diff)

func _input(event: InputEvent) -> void:
	if is_animating:
		return

	if event.is_action_pressed("swipe_right"):
		_do_swipe("keep")
	elif event.is_action_pressed("swipe_left"):
		_do_swipe("delete")
	elif event.is_action_pressed("swipe_up"):
		_do_swipe("star")

func _show_action_hint(diff: Vector2) -> void:
	if diff.y < SWIPE_UP_THRESHOLD and abs(diff.x) < SWIPE_THRESHOLD:
		action_label.text = "⭐ スター"
		action_label.add_theme_color_override("font_color", Color(1.0, 0.85, 0.0))
		action_label.visible = true
	elif diff.x > SWIPE_THRESHOLD * 0.5:
		action_label.text = "✓ 残す"
		action_label.add_theme_color_override("font_color", Color(0.3, 0.85, 0.5))
		action_label.visible = true
	elif diff.x < -SWIPE_THRESHOLD * 0.5:
		action_label.text = "✗ 削除"
		action_label.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3))
		action_label.visible = true
	else:
		action_label.visible = false

func _evaluate_swipe(diff: Vector2) -> void:
	if diff.y < SWIPE_UP_THRESHOLD and abs(diff.x) < SWIPE_THRESHOLD:
		_do_swipe("star")
	elif diff.x > SWIPE_THRESHOLD:
		_do_swipe("keep")
	elif diff.x < -SWIPE_THRESHOLD:
		_do_swipe("delete")
	else:
		## Snap back
		_animate_snapback()

func _do_swipe(direction: String) -> void:
	is_animating = true
	action_label.visible = false

	var tween := create_tween()
	tween.set_ease(Tween.EASE_IN)
	tween.set_trans(Tween.TRANS_BACK)

	match direction:
		"keep":
			tween.tween_property(self, "position:x", position.x + 800.0, 0.3)
			tween.parallel().tween_property(self, "rotation", 0.3, 0.3)
		"delete":
			tween.tween_property(self, "position:x", position.x - 800.0, 0.3)
			tween.parallel().tween_property(self, "rotation", -0.3, 0.3)
		"star":
			tween.tween_property(self, "position:y", position.y - 600.0, 0.3)
			tween.parallel().tween_property(self, "scale", Vector2(1.2, 1.2), 0.15)

	tween.parallel().tween_property(self, "modulate:a", 0.0, 0.3)
	tween.tween_callback(func(): swiped.emit(direction))

func _animate_snapback() -> void:
	var tween := create_tween()
	tween.set_ease(Tween.EASE_OUT)
	tween.set_trans(Tween.TRANS_ELASTIC)
	tween.tween_property(self, "position", original_position, 0.4)
	tween.parallel().tween_property(self, "rotation", 0.0, 0.3)
