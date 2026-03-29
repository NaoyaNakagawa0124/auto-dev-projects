"""Tests for NestPlan storage."""

import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from nestplan.models import Plan, Room, Project, Partner
from nestplan.storage import save_plan, load_plan, plan_exists

passed = 0
failed = 0


def assert_eq(a, b, msg=""):
    global passed, failed
    if a == b:
        passed += 1
    else:
        failed += 1
        print(f"  FAIL: {msg} (got {a!r}, expected {b!r})")


def assert_true(cond, msg=""):
    global passed, failed
    if cond:
        passed += 1
    else:
        failed += 1
        print(f"  FAIL: {msg}")


print("Storage Tests")
print("=============")

# --- Save and Load ---
print("\n--- Save and Load ---")

plan = Plan(name="Test Home")
plan.partners = [Partner("Alice"), Partner("Bob")]
room = Room(name="Kitchen")
proj = Project(name="Backsplash", budget=500, description="Subway tile")
proj.set_vote("Alice", 5)
proj.set_vote("Bob", 3)
room.add_project(proj)
plan.add_room(room)

with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
    tmpfile = f.name

try:
    # Save
    result_path = save_plan(plan, tmpfile)
    assert_true(os.path.exists(tmpfile), "file created")
    assert_eq(str(result_path), tmpfile, "returned correct path")

    # Verify JSON structure
    with open(tmpfile, "r") as f:
        data = json.load(f)
    assert_eq(data["name"], "Test Home", "JSON name")
    assert_eq(len(data["partners"]), 2, "JSON partners")
    assert_eq(len(data["rooms"]), 1, "JSON rooms")
    assert_eq(data["rooms"][0]["projects"][0]["name"], "Backsplash", "JSON deep project")

    # Load
    loaded = load_plan(tmpfile)
    assert_eq(loaded.name, "Test Home", "loaded name")
    assert_eq(len(loaded.partners), 2, "loaded partners")
    assert_eq(len(loaded.rooms), 1, "loaded rooms")
    assert_eq(loaded.rooms[0].projects[0].name, "Backsplash", "loaded project name")
    assert_eq(loaded.rooms[0].projects[0].budget, 500, "loaded project budget")
    assert_eq(len(loaded.rooms[0].projects[0].votes), 2, "loaded votes")

    # plan_exists
    assert_true(plan_exists(tmpfile), "plan_exists for existing file")
    assert_true(not plan_exists("/nonexistent/path/nope.json"), "plan_exists for missing file")

    # Load nonexistent
    try:
        load_plan("/nonexistent/path/nope.json")
        assert_true(False, "should raise FileNotFoundError")
    except FileNotFoundError:
        assert_true(True, "raises FileNotFoundError for missing file")

finally:
    if os.path.exists(tmpfile):
        os.unlink(tmpfile)

# --- Unicode handling ---
print("\n--- Unicode ---")
plan_unicode = Plan(name="Our Dream \U0001f3e0")
plan_unicode.add_room(Room(name="Bedroom"))
plan_unicode.rooms[0].add_project(Project(name="Buy cute curtains \u2764\ufe0f"))

with tempfile.NamedTemporaryFile(suffix=".json", delete=False, mode="w") as f:
    tmpfile2 = f.name

try:
    save_plan(plan_unicode, tmpfile2)
    loaded2 = load_plan(tmpfile2)
    assert_eq(loaded2.name, "Our Dream \U0001f3e0", "unicode plan name")
    assert_true("\u2764" in loaded2.rooms[0].projects[0].name, "unicode in project name")
finally:
    if os.path.exists(tmpfile2):
        os.unlink(tmpfile2)

print(f"\n{passed} passed, {failed} failed")
exit(1 if failed > 0 else 0)
