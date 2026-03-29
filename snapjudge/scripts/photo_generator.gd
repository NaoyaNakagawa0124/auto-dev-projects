## Procedurally generates "photo" data with quality attributes.
## Each photo has sharpness, exposure, composition scores (0.0-1.0)
## and an overall quality that determines the correct judgment.
class_name PhotoGenerator
extends RefCounted

## Quality thresholds
const STAR_THRESHOLD := 0.85    ## Overall quality >= this → star-worthy
const KEEP_THRESHOLD := 0.45    ## Overall quality >= this → keep
## Below KEEP_THRESHOLD → delete

## Attribute weights for overall quality
const WEIGHT_SHARPNESS := 0.35
const WEIGHT_EXPOSURE := 0.35
const WEIGHT_COMPOSITION := 0.30

## Visual properties for rendering
class PhotoData:
	var sharpness: float      ## 0.0 (blurry) to 1.0 (tack sharp)
	var exposure: float       ## 0.0 (under/over) to 1.0 (perfect)
	var composition: float    ## 0.0 (bad framing) to 1.0 (perfect)
	var overall_quality: float
	var correct_action: String  ## "star", "keep", or "delete"

	## Visual generation parameters
	var base_hue: float       ## 0.0-1.0 for HSV color
	var saturation: float
	var num_shapes: int       ## Complexity of the "photo"
	var blur_amount: float    ## Visual blur (derived from sharpness)
	var brightness: float     ## Visual brightness (derived from exposure)
	var balance: float        ## Visual balance (derived from composition)

	func _init() -> void:
		pass

static func generate_photo() -> PhotoData:
	var photo := PhotoData.new()

	## Generate quality attributes with slight bias toward middle range
	photo.sharpness = _weighted_random()
	photo.exposure = _weighted_random()
	photo.composition = _weighted_random()

	## Calculate overall quality
	photo.overall_quality = calculate_quality(
		photo.sharpness, photo.exposure, photo.composition
	)

	## Determine correct action
	photo.correct_action = get_correct_action(photo.overall_quality)

	## Generate visual properties
	photo.base_hue = randf()
	photo.saturation = randf_range(0.3, 1.0)
	photo.num_shapes = randi_range(3, 12)
	photo.blur_amount = 1.0 - photo.sharpness  ## More blur = less sharp
	photo.brightness = 0.3 + photo.exposure * 0.7  ## Map to visible range
	photo.balance = photo.composition

	return photo

static func calculate_quality(sharpness: float, exposure: float, composition: float) -> float:
	return (
		sharpness * WEIGHT_SHARPNESS +
		exposure * WEIGHT_EXPOSURE +
		composition * WEIGHT_COMPOSITION
	)

static func get_correct_action(quality: float) -> String:
	if quality >= STAR_THRESHOLD:
		return "star"
	elif quality >= KEEP_THRESHOLD:
		return "keep"
	else:
		return "delete"

## Weighted random that slightly favors middle values
## Produces a more interesting distribution than pure uniform
static func _weighted_random() -> float:
	var r1 := randf()
	var r2 := randf()
	## Average of two randoms gives a bell-curve-ish distribution
	return (r1 + r2) / 2.0

## Generate a batch of photos with guaranteed variety
static func generate_batch(count: int) -> Array[PhotoData]:
	var photos: Array[PhotoData] = []
	var star_count := 0
	var keep_count := 0
	var delete_count := 0

	for i in range(count):
		var photo := generate_photo()

		## Ensure minimum variety (at least 20% of each type)
		var min_each := int(count * 0.2)
		if i >= count - 3:
			## Last 3 photos: fill gaps
			if star_count < max(1, min_each):
				photo = _force_quality(0.9)
			elif delete_count < max(1, min_each):
				photo = _force_quality(0.2)
			elif keep_count < max(1, min_each):
				photo = _force_quality(0.6)

		match photo.correct_action:
			"star": star_count += 1
			"keep": keep_count += 1
			"delete": delete_count += 1

		photos.append(photo)

	## Shuffle
	photos.shuffle()
	return photos

static func _force_quality(target: float) -> PhotoData:
	var photo := PhotoData.new()
	var variance := 0.1
	photo.sharpness = clampf(target + randf_range(-variance, variance), 0.0, 1.0)
	photo.exposure = clampf(target + randf_range(-variance, variance), 0.0, 1.0)
	photo.composition = clampf(target + randf_range(-variance, variance), 0.0, 1.0)
	photo.overall_quality = calculate_quality(photo.sharpness, photo.exposure, photo.composition)
	photo.correct_action = get_correct_action(photo.overall_quality)
	photo.base_hue = randf()
	photo.saturation = randf_range(0.3, 1.0)
	photo.num_shapes = randi_range(3, 12)
	photo.blur_amount = 1.0 - photo.sharpness
	photo.brightness = 0.3 + photo.exposure * 0.7
	photo.balance = photo.composition
	return photo
