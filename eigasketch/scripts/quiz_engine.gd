## Quiz game engine — manages rounds, scoring, and progression.
class_name QuizEngine
extends RefCounted

const HINTS_PER_MOVIE := 4
const TIME_PER_QUESTION := 15.0  ## Seconds
const SPEED_BONUS_MAX := 500
const BASE_POINTS := 100
const HINT_PENALTY := 50  ## Points lost per extra hint revealed

var questions: Array[Dictionary]  ## {movie, choices, answered, correct, time, hints_shown}
var current_index: int = 0
var score: int = 0
var correct_count: int = 0
var total_time: float = 0.0

func setup(movie_list: Array) -> void:
	questions.clear()
	current_index = 0
	score = 0
	correct_count = 0
	total_time = 0.0

	for movie in movie_list:
		var choices = MovieData.get_random_choices(movie, 4)
		questions.append({
			"movie": movie,
			"choices": choices,
			"answered": false,
			"correct": false,
			"time": 0.0,
			"hints_shown": 1,  ## Start with 1 hint visible
		})

func current_question() -> Dictionary:
	if current_index >= 0 and current_index < questions.size():
		return questions[current_index]
	return {}

func reveal_next_hint() -> bool:
	var q := current_question()
	if q.is_empty():
		return false
	if q["hints_shown"] < HINTS_PER_MOVIE:
		q["hints_shown"] += 1
		return true
	return false

func answer(choice_index: int) -> Dictionary:
	var q := current_question()
	if q.is_empty() or q["answered"]:
		return {"correct": false, "points": 0}

	q["answered"] = true
	var movie: MovieData.Movie = q["movie"]
	var chosen: MovieData.Movie = q["choices"][choice_index]
	var is_correct := (chosen.id == movie.id)
	q["correct"] = is_correct

	var points := 0
	if is_correct:
		correct_count += 1
		## Base + speed bonus - hint penalty
		var speed_factor := clampf(1.0 - q["time"] / TIME_PER_QUESTION, 0.0, 1.0)
		var speed_bonus := int(SPEED_BONUS_MAX * speed_factor)
		var hint_penalty := (q["hints_shown"] - 1) * HINT_PENALTY
		points = max(BASE_POINTS, BASE_POINTS + speed_bonus - hint_penalty)
		score += points

	total_time += q["time"]
	return {"correct": is_correct, "points": points}

func next_question() -> bool:
	current_index += 1
	return current_index < questions.size()

func is_finished() -> bool:
	return current_index >= questions.size()

func question_count() -> int:
	return questions.size()

func get_accuracy() -> float:
	if questions.size() == 0:
		return 0.0
	return float(correct_count) / float(questions.size()) * 100.0

func get_grade() -> String:
	var acc := get_accuracy()
	if acc >= 90.0 and score >= 5000:
		return "S"
	elif acc >= 80.0:
		return "A"
	elif acc >= 60.0:
		return "B"
	elif acc >= 40.0:
		return "C"
	else:
		return "D"

func get_grade_label() -> String:
	match get_grade():
		"S": return "S — 映画博士！"
		"A": return "A — シネフィル"
		"B": return "B — なかなかの映画通"
		"C": return "C — もう少し映画を観よう"
		"D": return "D — 映画館へ行こう！"
		_: return ""

func get_results() -> Dictionary:
	return {
		"score": score,
		"correct": correct_count,
		"total": questions.size(),
		"accuracy": get_accuracy(),
		"total_time": total_time,
		"avg_time": total_time / max(1, questions.size()),
		"grade": get_grade(),
		"grade_label": get_grade_label(),
	}
