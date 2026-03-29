## Draws a procedural "photo" on a Control node using _draw().
## The visual quality reflects the photo's sharpness, exposure, and composition.
extends Control

var photo_data: PhotoGenerator.PhotoData = null

func set_photo(data: PhotoGenerator.PhotoData) -> void:
	photo_data = data
	queue_redraw()

func _draw() -> void:
	if photo_data == null:
		return

	var rect := get_rect()
	var w := rect.size.x
	var h := rect.size.y

	## Background — brightness reflects exposure
	var bg_brightness := photo_data.brightness
	var bg_color := Color.from_hsv(photo_data.base_hue, 0.15, bg_brightness * 0.4)
	draw_rect(Rect2(0, 0, w, h), bg_color)

	## Draw shapes — number and arrangement reflect composition
	var rng := RandomNumberGenerator.new()
	rng.seed = int(photo_data.base_hue * 100000)  ## Deterministic per photo

	for i in range(photo_data.num_shapes):
		var shape_hue := fmod(photo_data.base_hue + float(i) * 0.08, 1.0)
		var shape_sat := photo_data.saturation * (0.5 + rng.randf() * 0.5)
		var shape_bright := photo_data.brightness * (0.6 + rng.randf() * 0.4)
		var shape_color := Color.from_hsv(shape_hue, shape_sat, shape_bright, 0.85)

		## Position — good composition = balanced, bad = clustered
		var cx: float
		var cy: float
		if photo_data.balance > 0.6:
			## Well-composed: spread across rule-of-thirds
			var grid_x := (i % 3) * (w / 3.0) + w / 6.0
			var grid_y := (i / 3) * (h / 3.0) + h / 6.0
			cx = grid_x + rng.randf_range(-30.0, 30.0)
			cy = grid_y + rng.randf_range(-30.0, 30.0)
		else:
			## Poor composition: random clustering
			cx = w * 0.5 + rng.randf_range(-w * 0.3, w * 0.3)
			cy = h * 0.5 + rng.randf_range(-h * 0.3, h * 0.3)

		## Size varies by shape count
		var shape_size := rng.randf_range(20.0, 60.0)

		## Draw circle or rect
		if i % 3 == 0:
			draw_circle(Vector2(cx, cy), shape_size, shape_color)
		elif i % 3 == 1:
			draw_rect(Rect2(cx - shape_size/2, cy - shape_size/2, shape_size, shape_size * 0.8), shape_color)
		else:
			## Triangle
			var points := PackedVector2Array([
				Vector2(cx, cy - shape_size * 0.6),
				Vector2(cx - shape_size * 0.5, cy + shape_size * 0.4),
				Vector2(cx + shape_size * 0.5, cy + shape_size * 0.4),
			])
			draw_colored_polygon(points, shape_color)

	## Apply blur effect overlay (semi-transparent for blur simulation)
	if photo_data.blur_amount > 0.3:
		var blur_alpha := (photo_data.blur_amount - 0.3) * 0.6
		var blur_color := Color(bg_color.r, bg_color.g, bg_color.b, blur_alpha)
		draw_rect(Rect2(0, 0, w, h), blur_color)

	## Exposure problems: overlay for over/under exposure
	if photo_data.exposure < 0.3:
		## Underexposed — dark overlay
		draw_rect(Rect2(0, 0, w, h), Color(0, 0, 0, (0.3 - photo_data.exposure) * 1.5))
	elif photo_data.exposure > 0.85:
		## Overexposed — white overlay
		draw_rect(Rect2(0, 0, w, h), Color(1, 1, 1, (photo_data.exposure - 0.85) * 2.0))

	## Border
	draw_rect(Rect2(0, 0, w, h), Color(0.3, 0.3, 0.4, 0.5), false, 2.0)
