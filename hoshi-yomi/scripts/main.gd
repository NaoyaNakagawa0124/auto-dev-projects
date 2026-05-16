extends Node2D

# 全体のシーン制御
# - スタート画面 → 辞書画面 → 星座画面 → 完成画面 → 辞書画面…

enum Mode { TITLE, DICTIONARY, TRACE, REVEAL }

const ConstellationViewScene := preload("res://scenes/ConstellationView.tscn")

@onready var starfield := $Starfield
@onready var ui := $UI
@onready var title_panel: Control = $UI/TitlePanel
@onready var dictionary_panel: Control = $UI/DictionaryPanel
@onready var dictionary_list: VBoxContainer = $UI/DictionaryPanel/Scroll/List
@onready var reveal_panel: Control = $UI/RevealPanel
@onready var reveal_jp: Label = $UI/RevealPanel/Center/Block/LabelJp
@onready var reveal_en: Label = $UI/RevealPanel/Center/Block/LabelEn
@onready var reveal_pron: Label = $UI/RevealPanel/Center/Block/LabelPron
@onready var reveal_story: Label = $UI/RevealPanel/Center/Block/LabelStory
@onready var trace_layer := $TraceLayer
@onready var status_label: Label = $UI/StatusLabel

var _constellations: Array = []
var _progress: Dictionary = {}
var _mode: Mode = Mode.TITLE
var _current_view: Node = null
var _current_id: String = ""

func _ready() -> void:
    randomize()
    _constellations = Constellations.load_all()
    _progress = Progress.read_state()
    _enter_title()

# === modes ===

func _enter_title() -> void:
    _mode = Mode.TITLE
    title_panel.visible = true
    dictionary_panel.visible = false
    reveal_panel.visible = false
    _clear_trace_view()
    _update_status()

func _enter_dictionary() -> void:
    _mode = Mode.DICTIONARY
    title_panel.visible = false
    dictionary_panel.visible = true
    reveal_panel.visible = false
    _clear_trace_view()
    _populate_dictionary()
    _update_status()

func _enter_trace(c: Dictionary) -> void:
    _mode = Mode.TRACE
    _current_id = c.get("id", "")
    title_panel.visible = false
    dictionary_panel.visible = false
    reveal_panel.visible = false
    _clear_trace_view()
    var view = ConstellationViewScene.instantiate()
    trace_layer.add_child(view)
    view.set_constellation(c)
    view.completed.connect(_on_traced_completed)
    view.mistake.connect(_on_mistake)
    _current_view = view
    _update_status("ESC で辞書に戻る — %s をなぞる" % c.get("label_jp", ""))

func _enter_reveal(c: Dictionary) -> void:
    _mode = Mode.REVEAL
    reveal_jp.text = c.get("label_jp", "")
    reveal_en.text = c.get("label_target", "")
    reveal_pron.text = "[%s]" % c.get("label_target_pron", "")
    reveal_story.text = c.get("story", "")
    reveal_panel.visible = true
    _update_status("クリックで次へ")

func _clear_trace_view() -> void:
    if _current_view:
        _current_view.queue_free()
        _current_view = null

# === input ===

func _input(event: InputEvent) -> void:
    if event is InputEventKey and event.pressed:
        if event.keycode == KEY_ESCAPE:
            match _mode:
                Mode.TRACE: _enter_dictionary()
                Mode.REVEAL: _enter_dictionary()
                Mode.DICTIONARY: _enter_title()
    elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
        if _mode == Mode.REVEAL:
            _enter_dictionary()

# === handlers ===

func _on_start_pressed() -> void:
    _enter_dictionary()

func _on_back_to_title_pressed() -> void:
    _enter_title()

func _on_traced_completed(id: String) -> void:
    _progress = Progress.mark_discovered(_progress, id)
    Progress.write_state(_progress)
    var c = Constellations.by_id(_constellations, id)
    if not c.is_empty():
        await get_tree().create_timer(0.8).timeout
        _enter_reveal(c)

func _on_mistake() -> void:
    # subtle camera shake via UI hint only — keep it gentle
    pass

# === dictionary list ===

func _populate_dictionary() -> void:
    for child in dictionary_list.get_children():
        child.queue_free()

    for c in _constellations:
        var row := _make_dictionary_row(c)
        dictionary_list.add_child(row)

func _make_dictionary_row(c: Dictionary) -> Control:
    var row := Button.new()
    row.flat = true
    row.focus_mode = Control.FOCUS_NONE
    row.custom_minimum_size = Vector2(0, 64)
    var is_done := Progress.is_discovered(_progress, c.get("id", ""))

    var hbox := HBoxContainer.new()
    hbox.alignment = BoxContainer.ALIGNMENT_BEGIN
    hbox.add_theme_constant_override("separation", 16)
    row.add_child(hbox)

    var glyph := Label.new()
    glyph.text = "✦" if is_done else "·"
    glyph.add_theme_color_override("font_color", Color(0.96, 0.78, 0.38) if is_done else Color(0.74, 0.78, 0.95))
    glyph.add_theme_font_size_override("font_size", 24)
    hbox.add_child(glyph)

    var label_box := VBoxContainer.new()
    label_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
    hbox.add_child(label_box)

    var l1 := Label.new()
    l1.text = "%s — %s" % [c.get("label_jp", ""), c.get("label_target", "")]
    l1.add_theme_color_override("font_color", Color(1.0, 0.97, 0.88))
    l1.add_theme_font_size_override("font_size", 18)
    label_box.add_child(l1)

    var l2 := Label.new()
    var status_text = "★ 解き明かした" if is_done else "未解決 — %d 星" % c.get("stars", []).size()
    l2.text = "[%s]  %s  ·  %s" % [c.get("label_target_pron", ""), status_text, c.get("story", "")]
    l2.add_theme_color_override("font_color", Color(0.74, 0.78, 0.95, 0.85))
    l2.add_theme_font_size_override("font_size", 12)
    label_box.add_child(l2)

    row.pressed.connect(func(): _enter_trace(c))
    return row

func _update_status(msg: String = "") -> void:
    if status_label == null:
        return
    if msg.is_empty():
        var done = _progress.get("discovered", []).size()
        var total = _constellations.size()
        status_label.text = "夜空辞書 %d / %d" % [done, total]
    else:
        status_label.text = msg
