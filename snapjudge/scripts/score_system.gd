## Scoring system for SnapJudge.
## Tracks points, combos, accuracy, and speed bonuses.
class_name ScoreSystem
extends RefCounted

## Points per action
const BASE_POINTS := 100
const STAR_BONUS := 50        ## Extra for correctly starring
const SPEED_BONUS_MAX := 100  ## Max speed bonus (instant decision)
const SPEED_WINDOW := 3.0     ## Seconds to earn speed bonus (linear decay)
const COMBO_MULTIPLIER := 0.1 ## Each combo level adds 10%
const MAX_COMBO := 20         ## Cap combo at 20x
const WRONG_PENALTY := -50    ## Points lost for wrong judgment

var score: int = 0
var combo: int = 0
var max_combo: int = 0
var correct_count: int = 0
var wrong_count: int = 0
var star_count: int = 0
var total_judged: int = 0
var total_speed_bonus: int = 0

func reset() -> void:
	score = 0
	combo = 0
	max_combo = 0
	correct_count = 0
	wrong_count = 0
	star_count = 0
	total_judged = 0
	total_speed_bonus = 0

## Judge a photo. Returns points earned (can be negative).
## action: "keep", "delete", or "star"
## correct_action: the right answer
## decision_time: seconds taken to decide
func judge(action: String, correct_action: String, decision_time: float) -> int:
	total_judged += 1
	var is_correct := _check_correct(action, correct_action)

	if is_correct:
		correct_count += 1
		combo += 1
		max_combo = max(max_combo, combo)

		## Calculate points
		var points := BASE_POINTS

		## Star bonus
		if action == "star" and correct_action == "star":
			points += STAR_BONUS
			star_count += 1

		## Speed bonus (linear decay over SPEED_WINDOW seconds)
		var speed_factor := clampf(1.0 - decision_time / SPEED_WINDOW, 0.0, 1.0)
		var speed_bonus := int(SPEED_BONUS_MAX * speed_factor)
		points += speed_bonus
		total_speed_bonus += speed_bonus

		## Combo multiplier
		var combo_bonus := int(points * min(combo, MAX_COMBO) * COMBO_MULTIPLIER)
		points += combo_bonus

		score += points
		return points
	else:
		wrong_count += 1
		combo = 0
		score = max(0, score + WRONG_PENALTY)
		return WRONG_PENALTY

## Check if the player's action is correct.
## Partial credit: keeping a star-worthy photo counts as correct (not optimal but ok)
func _check_correct(action: String, correct_action: String) -> bool:
	if action == correct_action:
		return true
	## Keeping a star photo is acceptable (just not optimal)
	if action == "keep" and correct_action == "star":
		return true
	## Everything else is wrong
	return false

## Get accuracy as a percentage (0-100)
func get_accuracy() -> float:
	if total_judged == 0:
		return 0.0
	return float(correct_count) / float(total_judged) * 100.0

## Get grade based on performance
func get_grade() -> String:
	var acc := get_accuracy()
	if acc >= 95.0 and max_combo >= 15:
		return "S"
	elif acc >= 90.0 and max_combo >= 10:
		return "A"
	elif acc >= 80.0:
		return "B"
	elif acc >= 65.0:
		return "C"
	elif acc >= 50.0:
		return "D"
	else:
		return "F"

## Get grade in Japanese
func get_grade_label() -> String:
	var grade := get_grade()
	match grade:
		"S": return "S — 神の目"
		"A": return "A — プロの目"
		"B": return "B — 上級者"
		"C": return "C — まあまあ"
		"D": return "D — がんばろう"
		"F": return "F — 修行が必要"
		_: return grade

## Get stats dictionary for results screen
func get_stats() -> Dictionary:
	return {
		"score": score,
		"total_judged": total_judged,
		"correct": correct_count,
		"wrong": wrong_count,
		"accuracy": get_accuracy(),
		"max_combo": max_combo,
		"stars_found": star_count,
		"speed_bonus_total": total_speed_bonus,
		"grade": get_grade(),
		"grade_label": get_grade_label(),
	}
