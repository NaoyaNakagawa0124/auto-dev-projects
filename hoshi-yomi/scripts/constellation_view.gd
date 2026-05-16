extends Node2D

# 1つの星座を描き、プレイヤーの入力で順番にトレースする。
# 完成時に "completed" シグナルを発火する。

signal completed(constellation_id: String)
signal traced_one(index: int)
signal mistake()
signal cancelled()

const STAR_RADIUS_HIT := 36.0
const STAR_RADIUS_DRAW := 11.0
const STAR_HALO := 28.0

@export var constellation: Dictionary = {}
@export var preview_only: bool = false

var _viewport_size: Vector2 = Vector2(1280, 720)
var _star_positions: Array = []
var _next_index: int = 0
var _connections: Array = [] # Array of Vector2 pairs

func _ready() -> void:
    _viewport_size = get_viewport_rect().size
    _recompute_positions()
    set_process(true)
    set_process_input(not preview_only)

func set_constellation(c: Dictionary) -> void:
    constellation = c
    _next_index = 0
    _connections.clear()
    if is_inside_tree():
        _recompute_positions()
    queue_redraw()

func mark_completed_state() -> void:
    # used by preview to show full lines (already discovered)
    _next_index = _star_positions.size()
    _connections.clear()
    for i in range(_star_positions.size() - 1):
        _connections.append([_star_positions[i], _star_positions[i + 1]])
    queue_redraw()

func _recompute_positions() -> void:
    _star_positions.clear()
    if constellation.is_empty():
        return
    var stars: Array = constellation.get("stars", [])
    var margin := Vector2(120, 100)
    var size := _viewport_size - margin * 2.0
    for raw in stars:
        var pos = Vector2(raw.x * size.x + margin.x, raw.y * size.y + margin.y)
        _star_positions.append(pos)

func _input(event: InputEvent) -> void:
    if preview_only:
        return
    if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
        _attempt_tap(event.position)
    elif event is InputEventScreenTouch and event.pressed:
        _attempt_tap(event.position)

func _attempt_tap(p: Vector2) -> void:
    if _next_index >= _star_positions.size():
        return
    var target = _star_positions[_next_index]
    if p.distance_to(target) <= STAR_RADIUS_HIT:
        if _next_index > 0:
            _connections.append([_star_positions[_next_index - 1], target])
        _next_index += 1
        traced_one.emit(_next_index)
        queue_redraw()
        if _next_index >= _star_positions.size():
            completed.emit(constellation.get("id", ""))
    else:
        # find if user tapped a wrong, future star
        for i in range(_star_positions.size()):
            if i == _next_index:
                continue
            if p.distance_to(_star_positions[i]) <= STAR_RADIUS_HIT:
                mistake.emit()
                return

func _process(_delta: float) -> void:
    queue_redraw()

func _draw() -> void:
    # connection lines (gold)
    for pair in _connections:
        _draw_glow_line(pair[0], pair[1])

    # stars
    for i in range(_star_positions.size()):
        var pos = _star_positions[i]
        var traced = i < _next_index
        _draw_star(pos, traced, i, i == _next_index)

func _draw_star(p: Vector2, traced: bool, index: int, is_next: bool) -> void:
    var time = Engine.get_process_frames() / 60.0
    var pulse = 0.85 + 0.15 * sin(time * 2.6 + index * 0.5)
    var halo_color := Color(0.85, 0.78, 0.55, 0.18 * pulse)
    var core_color := Color(1.0, 0.97, 0.88, 0.95)
    var ring_color := Color(0.74, 0.55, 0.32, 0.45)
    if traced:
        halo_color = Color(0.95, 0.78, 0.36, 0.34 * pulse)
        core_color = Color(1.0, 0.93, 0.74, 1.0)
    elif is_next and not preview_only:
        halo_color = Color(0.7, 0.78, 0.95, 0.32 * pulse)
        ring_color = Color(0.55, 0.65, 0.95, 0.85)

    # halo
    for r in [STAR_HALO * 1.5, STAR_HALO, STAR_HALO * 0.6]:
        draw_circle(p, r, Color(halo_color.r, halo_color.g, halo_color.b, halo_color.a * (STAR_HALO / r) * 0.5))
    draw_circle(p, STAR_RADIUS_DRAW, core_color)
    # spike rays
    for a in [0.0, PI * 0.5]:
        var d = Vector2.RIGHT.rotated(a)
        draw_line(p - d * STAR_RADIUS_DRAW * 2.4, p + d * STAR_RADIUS_DRAW * 2.4, Color(1.0, 0.96, 0.78, 0.55), 1.2, true)
    # next-star hint ring
    if is_next and not preview_only:
        draw_arc(p, STAR_RADIUS_DRAW + 14, 0, TAU, 32, ring_color, 1.5, true)
    # number badge (for next + untraced)
    if not traced and not preview_only:
        var font := ThemeDB.fallback_font
        var size := 18
        if font:
            var s := str(index + 1)
            var w = font.get_string_size(s, HORIZONTAL_ALIGNMENT_CENTER, -1, size).x
            draw_string(font, p + Vector2(-w / 2.0, -STAR_RADIUS_DRAW - 16),
                s, HORIZONTAL_ALIGNMENT_CENTER, -1, size,
                Color(1.0, 0.95, 0.78, 0.85))

func _draw_glow_line(a: Vector2, b: Vector2) -> void:
    # multiple lines of decreasing width for glow effect
    var colors = [
        Color(0.96, 0.78, 0.38, 0.25),
        Color(0.99, 0.85, 0.50, 0.45),
        Color(1.0, 0.93, 0.74, 1.0),
    ]
    var widths = [10.0, 5.0, 2.2]
    for i in range(colors.size()):
        draw_line(a, b, colors[i], widths[i], true)
