# 種交わせ — Plan

## Phase 1 — Scaffold
- pyproject (Rich), src layout, entry `tane-kawase`

## Phase 2 — Topics + Models + Storage
- `topics.py`: 5 トピック (春菜/夏野菜/秋穀/冬根/草花) with ASCII crop glyph + color
- `models.py`:
  - `Seed(term, reading, gloss, example, note)` (1 単語 / 句)
  - `Packet(id, name, topic, sender, receiver, language, seeds[], letter, created_at)`
  - `Field(version, my_name, packets[Packet], harvested[id list])`
- `storage.py`:
  - `default_field_path()` → `~/.tane-kawase/field.json`
  - `load_field` / `save_field` (atomic)
  - `read_packet(path)` / `write_packet(packet, path)`

## Phase 3 — Renderer
- `render.py`:
  - `render_field(field)` — Rich Group with rows by topic, crop glyphs scaled with seed count
  - `render_packet(packet)` — Panel preview with sender/topic/letter and seed list
  - `render_stats(field)` — totals + recent activity
  - dim earth-tone palette (春菜=若草, 夏野菜=朱赤, 秋穀=黄金, 冬根=焦茶, 草花=薄紫)

## Phase 4 — CLI
- `cli.py` argparse:
  - `pack` — interactive 対話 or one-shot args
  - `send PATH` — write packet JSON to a path
  - `open PATH` — preview without planting
  - `plant PATH` — append packet to field
  - `field` — render my farm
  - `harvest <seed_id>` — mark as mastered, moves into "harvest log"
  - `stats` — summary
  - `demo` — write sample field + sample packet

## Phase 5 — Tests
- `tests/test_topics.py`
- `tests/test_models.py`
- `tests/test_storage.py`
- `tests/test_render.py`
- `tests/test_cli.py`

## Phase 6 — Polish + ship
- SUMMARY, dashboard, state, commit & push
