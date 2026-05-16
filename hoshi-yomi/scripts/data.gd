extends RefCounted
class_name Constellations

const DATA_PATH := "res://data/constellations.json"

static func load_all() -> Array:
    var file := FileAccess.open(DATA_PATH, FileAccess.READ)
    if file == null:
        push_error("星座データを読み込めませんでした: %s" % DATA_PATH)
        return []
    var json_text := file.get_as_text()
    file.close()
    var parsed = JSON.parse_string(json_text)
    if parsed == null or typeof(parsed) != TYPE_DICTIONARY:
        push_error("星座データの JSON が不正です")
        return []
    return parsed.get("constellations", [])

static func by_id(items: Array, id: String) -> Dictionary:
    for c in items:
        if c.get("id") == id:
            return c
    return {}
