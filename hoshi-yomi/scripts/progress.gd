extends RefCounted
class_name Progress

const SAVE_PATH := "user://progress.json"

static func read_state() -> Dictionary:
    if not FileAccess.file_exists(SAVE_PATH):
        return _empty()
    var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
    if file == null:
        return _empty()
    var text := file.get_as_text()
    file.close()
    var parsed = JSON.parse_string(text)
    if parsed == null or typeof(parsed) != TYPE_DICTIONARY:
        return _empty()
    if not parsed.has("discovered"):
        parsed["discovered"] = []
    return parsed

static func write_state(state: Dictionary) -> void:
    var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file == null:
        push_error("進捗を保存できませんでした")
        return
    file.store_string(JSON.stringify(state, "\t"))
    file.close()

static func mark_discovered(state: Dictionary, id: String) -> Dictionary:
    var discovered: Array = state.get("discovered", [])
    if not discovered.has(id):
        discovered.append(id)
        state["discovered"] = discovered
    return state

static func is_discovered(state: Dictionary, id: String) -> bool:
    var discovered: Array = state.get("discovered", [])
    return discovered.has(id)

static func _empty() -> Dictionary:
    return {
        "discovered": [],
        "version": 1,
    }
