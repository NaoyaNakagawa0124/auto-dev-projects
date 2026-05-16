#!/usr/bin/env python3
"""hoshi-yomi project validator.

Since Godot isn't always available in the build environment, this Python
script does the next best thing: it parses the JSON dataset and walks the
Godot project files to catch structural problems early.

Run: python3 tests/validate.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAILURES: list[str] = []
PASSED: list[str] = []


def check(name: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSED.append(name)
    else:
        FAILURES.append(f"{name}{' — ' + detail if detail else ''}")


def expect_exists(path: Path, label: str | None = None) -> None:
    label = label or str(path.relative_to(ROOT))
    check(f"exists: {label}", path.exists(), f"missing {path}")


def main() -> int:
    # --- project structure ---
    for p in [
        "project.godot",
        "icon.svg",
        "scenes/Main.tscn",
        "scenes/ConstellationView.tscn",
        "scripts/main.gd",
        "scripts/starfield.gd",
        "scripts/constellation_view.gd",
        "scripts/data.gd",
        "scripts/progress.gd",
        "shaders/star_glow.gdshader",
        "data/constellations.json",
        "README.md",
        "PLAN.md",
        "CLAUDE.md",
    ]:
        expect_exists(ROOT / p)

    # --- constellations.json ---
    data_path = ROOT / "data" / "constellations.json"
    if data_path.exists():
        with data_path.open(encoding="utf-8") as f:
            data = json.load(f)
        items = data.get("constellations", [])
        check("data: >= 10 constellations", len(items) >= 10, f"got {len(items)}")

        ids: set[str] = set()
        for c in items:
            cid = c.get("id")
            check(f"data: id present for entry", bool(cid))
            check(f"data: id unique ({cid})", cid not in ids, "duplicate")
            ids.add(cid)
            for field in ("label_jp", "label_target", "label_target_pron", "story"):
                check(
                    f"data: {cid} has {field}",
                    bool(c.get(field)),
                    f"missing {field}",
                )
            stars = c.get("stars", [])
            check(
                f"data: {cid} stars 3..8",
                3 <= len(stars) <= 8,
                f"got {len(stars)} stars",
            )
            for i, s in enumerate(stars):
                x = s.get("x")
                y = s.get("y")
                check(
                    f"data: {cid}[{i}] x in 0..1",
                    isinstance(x, (int, float)) and 0.0 <= x <= 1.0,
                    f"x={x}",
                )
                check(
                    f"data: {cid}[{i}] y in 0..1",
                    isinstance(y, (int, float)) and 0.0 <= y <= 1.0,
                    f"y={y}",
                )

    # --- scenes reference scripts that exist ---
    for scene_name in ("Main.tscn", "ConstellationView.tscn"):
        scene_path = ROOT / "scenes" / scene_name
        if not scene_path.exists():
            continue
        text = scene_path.read_text(encoding="utf-8")
        refs = re.findall(r'path="res://([^"]+)"', text)
        for ref in refs:
            check(
                f"{scene_name}: script path exists ({ref})",
                (ROOT / ref).exists(),
                f"missing {ref}",
            )

    # --- gd scripts have balanced indentation (rudimentary) ---
    for gd_path in (ROOT / "scripts").glob("*.gd"):
        text = gd_path.read_text(encoding="utf-8")
        # tabs vs spaces consistency: Godot accepts both but per-file should be consistent
        has_tab = re.search(r"^\t", text, re.MULTILINE) is not None
        has_4sp = re.search(r"^    ", text, re.MULTILINE) is not None
        check(
            f"{gd_path.name}: consistent indentation (tabs xor 4sp)",
            not (has_tab and has_4sp),
            "mixed tabs and spaces detected",
        )
        # class_name at top if declared
        if "class_name " in text:
            first_lines = "\n".join(text.splitlines()[:5])
            check(
                f"{gd_path.name}: class_name within first 5 lines",
                "class_name " in first_lines,
                "class_name should be near the top",
            )
        # `extends` declared
        check(
            f"{gd_path.name}: has `extends`",
            re.search(r"^extends\b", text, re.MULTILINE) is not None,
            "missing extends",
        )

    # --- project.godot version sanity ---
    pg = ROOT / "project.godot"
    if pg.exists():
        text = pg.read_text(encoding="utf-8")
        check("project.godot: 4.x features", '"4.' in text, "missing 4.x features")
        check(
            "project.godot: main scene set",
            'run/main_scene="res://scenes/Main.tscn"' in text,
            "main_scene mismatch",
        )

    # --- shader has fragment function ---
    sh = ROOT / "shaders" / "star_glow.gdshader"
    if sh.exists():
        text = sh.read_text(encoding="utf-8")
        check("shader: declares canvas_item", "shader_type canvas_item" in text)
        check("shader: has fragment()", "void fragment()" in text)

    # --- report ---
    total = len(PASSED) + len(FAILURES)
    if FAILURES:
        print(f"❌ {len(FAILURES)} of {total} checks failed:")
        for f in FAILURES:
            print(f"   - {f}")
        return 1
    print(f"✅ All {total} checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
