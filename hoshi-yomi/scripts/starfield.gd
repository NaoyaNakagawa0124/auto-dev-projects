extends Node2D

# 背景の小さな星を散らす — シェーダ無しの軽量版
const STAR_COUNT := 320
const DRIFT_SPEED := Vector2(-4.0, 1.5)
const COLORS := [
    Color(1.0, 0.97, 0.88, 0.95),
    Color(0.86, 0.91, 1.0, 0.85),
    Color(1.0, 0.86, 0.74, 0.85),
]

var _stars: Array = [] # each entry: { pos:Vector2, size:float, twinkle_phase:float, color:Color }
var _viewport_size: Vector2 = Vector2(1280, 720)
var _time_accum: float = 0.0
var _shooting_timer: float = 0.0
var _shooting_stars: Array = []

func _ready() -> void:
    _viewport_size = get_viewport_rect().size
    randomize()
    for i in STAR_COUNT:
        _stars.append(_make_star())

func _make_star() -> Dictionary:
    return {
        "pos": Vector2(randf() * _viewport_size.x, randf() * _viewport_size.y),
        "size": randf_range(0.8, 2.4),
        "twinkle_phase": randf() * TAU,
        "twinkle_speed": randf_range(0.6, 2.4),
        "color": COLORS[randi() % COLORS.size()],
    }

func _process(delta: float) -> void:
    _time_accum += delta
    for s in _stars:
        s.pos += DRIFT_SPEED * delta
        if s.pos.x < -4:
            s.pos.x = _viewport_size.x + 4
        if s.pos.x > _viewport_size.x + 4:
            s.pos.x = -4
        if s.pos.y < -4:
            s.pos.y = _viewport_size.y + 4
        if s.pos.y > _viewport_size.y + 4:
            s.pos.y = -4

    # shooting stars rare event
    _shooting_timer += delta
    if _shooting_timer > 6.0 and randf() < 0.01:
        _shooting_timer = 0.0
        _shooting_stars.append({
            "pos": Vector2(_viewport_size.x + 40, randf_range(40, _viewport_size.y * 0.6)),
            "vel": Vector2(-700, 220),
            "life": 1.0,
        })
    for s in _shooting_stars:
        s.pos += s.vel * delta
        s.life -= delta * 0.9
    _shooting_stars = _shooting_stars.filter(func(s): return s.life > 0.0 and s.pos.x > -60)

    queue_redraw()

func _draw() -> void:
    for s in _stars:
        var twinkle = 0.6 + 0.4 * sin(_time_accum * s.twinkle_speed + s.twinkle_phase)
        var col = s.color
        col.a = clamp(col.a * twinkle, 0.0, 1.0)
        draw_circle(s.pos, s.size, col)

    for s in _shooting_stars:
        var tail_count := 14
        for i in tail_count:
            var t = float(i) / float(tail_count)
            var p = s.pos - s.vel.normalized() * t * 60.0
            var c = Color(1.0, 0.93, 0.78, s.life * (1.0 - t) * 0.85)
            draw_circle(p, 1.6 * (1.0 - t * 0.6), c)
