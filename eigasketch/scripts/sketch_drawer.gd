## Draws sketch-style hints on a canvas Control.
## Uses wobbly lines and hand-drawn aesthetics.
extends Control

var hints: Array[Dictionary] = []
var hints_visible: int = 0
var sketch_color := Color(0.94, 0.9, 0.7)  ## Pencil yellow
var draw_progress: float = 0.0  ## 0-1 animation progress

func set_hints(p_hints: Array[Dictionary], visible: int) -> void:
	hints = p_hints
	hints_visible = visible
	draw_progress = 0.0
	queue_redraw()

func set_visible_count(count: int) -> void:
	hints_visible = count
	queue_redraw()

func _draw() -> void:
	## Background (paper texture)
	draw_rect(Rect2(0, 0, size.x, size.y), Color(0.12, 0.1, 0.18))

	## Paper grid (faint)
	var grid_color := Color(0.18, 0.16, 0.24, 0.3)
	for x in range(0, int(size.x), 20):
		draw_line(Vector2(x, 0), Vector2(x, size.y), grid_color, 0.5)
	for y in range(0, int(size.y), 20):
		draw_line(Vector2(0, y), Vector2(size.x, y), grid_color, 0.5)

	## Draw visible hints
	for i in range(min(hints_visible, hints.size())):
		_draw_hint(hints[i], i)

func _draw_hint(hint: Dictionary, index: int) -> void:
	var offset := Vector2(50, 10)  ## Margin
	var color := sketch_color
	color.a = 0.7 + float(index) * 0.1

	## Seed for wobble based on hint
	var seed_val := index * 137 + 42

	match hint.get("type", ""):
		"circle":
			var cx: float = hint["x"] + offset.x
			var cy: float = hint["y"] + offset.y
			var r: float = hint["r"]
			_draw_wobbly_circle(Vector2(cx, cy), r, color, seed_val)

		"rect":
			var rx: float = hint["x"] + offset.x
			var ry: float = hint["y"] + offset.y
			var rw: float = hint["w"]
			var rh: float = hint["h"]
			_draw_wobbly_rect(Vector2(rx, ry), Vector2(rw, rh), color, seed_val)

		"line":
			var x1: float = hint["x1"] + offset.x
			var y1: float = hint["y1"] + offset.y
			var x2: float = hint["x2"] + offset.x
			var y2: float = hint["y2"] + offset.y
			_draw_wobbly_line(Vector2(x1, y1), Vector2(x2, y2), color, seed_val)

		"text_hint":
			var tx: float = hint["x"] + offset.x
			var ty: float = hint["y"] + offset.y
			draw_string(ThemeDB.fallback_font, Vector2(tx, ty),
				hint["text"], HORIZONTAL_ALIGNMENT_LEFT, -1, 14,
				Color(0.9, 0.85, 0.6, 0.8))

		"star":
			var sx: float = hint["x"] + offset.x
			var sy: float = hint["y"] + offset.y
			var sr: float = hint["r"]
			_draw_wobbly_star(Vector2(sx, sy), sr, color, seed_val)

		"wave":
			var wx: float = hint["x"] + offset.x
			var wy: float = hint["y"] + offset.y
			var ww: float = hint["w"]
			_draw_wobbly_wave(Vector2(wx, wy), ww, color, seed_val)

	## Hint label
	if hint.has("hint"):
		var lx: float = hint.get("x", hint.get("x1", 0)) + offset.x
		var ly: float = hint.get("y", hint.get("y1", 0)) + offset.y - 8
		draw_string(ThemeDB.fallback_font, Vector2(lx, ly),
			hint["hint"], HORIZONTAL_ALIGNMENT_LEFT, -1, 10,
			Color(0.6, 0.8, 0.6, 0.5))

func _wobble(val: float, seed: int, amp: float) -> float:
	return val + sin(float(seed) * 0.7) * amp

func _draw_wobbly_line(from: Vector2, to: Vector2, color: Color, seed: int) -> void:
	var steps := 8
	var prev := from
	for i in range(1, steps + 1):
		var t := float(i) / float(steps)
		var p := from.lerp(to, t)
		p.x = _wobble(p.x, seed + i, 2.0)
		p.y = _wobble(p.y, seed + i * 3, 2.0)
		draw_line(prev, p, color, 2.0, true)
		prev = p

func _draw_wobbly_circle(center: Vector2, radius: float, color: Color, seed: int) -> void:
	var segments := 20
	var prev := center + Vector2(radius, 0)
	for i in range(1, segments + 1):
		var angle := float(i) / float(segments) * TAU
		var r := radius + sin(float(seed + i) * 1.3) * 2.0
		var p := center + Vector2(cos(angle) * r, sin(angle) * r)
		draw_line(prev, p, color, 2.0, true)
		prev = p

func _draw_wobbly_rect(pos: Vector2, sz: Vector2, color: Color, seed: int) -> void:
	var tl := pos
	var tr := pos + Vector2(sz.x, 0)
	var br := pos + sz
	var bl := pos + Vector2(0, sz.y)
	_draw_wobbly_line(tl, tr, color, seed)
	_draw_wobbly_line(tr, br, color, seed + 10)
	_draw_wobbly_line(br, bl, color, seed + 20)
	_draw_wobbly_line(bl, tl, color, seed + 30)

func _draw_wobbly_star(center: Vector2, radius: float, color: Color, seed: int) -> void:
	var points := 5
	var prev := Vector2.ZERO
	for i in range(points * 2 + 1):
		var angle := float(i) / float(points * 2) * TAU - PI / 2
		var r := radius if i % 2 == 0 else radius * 0.4
		r += sin(float(seed + i) * 0.9) * 1.5
		var p := center + Vector2(cos(angle) * r, sin(angle) * r)
		if i > 0:
			draw_line(prev, p, color, 2.0, true)
		prev = p

func _draw_wobbly_wave(start: Vector2, width: float, color: Color, seed: int) -> void:
	var steps := 15
	var prev := start
	for i in range(1, steps + 1):
		var t := float(i) / float(steps)
		var p := Vector2(
			start.x + t * width,
			start.y + sin(t * PI * 3 + float(seed) * 0.5) * 15.0
		)
		draw_line(prev, p, color, 2.0, true)
		prev = p
