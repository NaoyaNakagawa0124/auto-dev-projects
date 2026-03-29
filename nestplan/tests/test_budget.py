"""Tests for NestPlan budget utilities."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from nestplan.models import Plan, Room, Project, Partner, ProjectStatus
from nestplan.budget import (
    total_budget,
    spent_budget,
    remaining_budget,
    room_budget_breakdown,
    partner_budget_breakdown,
    format_currency,
)

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


print("Budget Tests")
print("============")

# Setup test plan
plan = Plan(name="Budget Test")
plan.partners = [Partner("Alice"), Partner("Bob")]

kitchen = Room(name="Kitchen")
kitchen.add_project(Project(name="Cabinets", budget=3000, assigned_to="Alice", status=ProjectStatus.DONE))
kitchen.add_project(Project(name="Flooring", budget=1500, assigned_to="Bob"))
kitchen.add_project(Project(name="Paint", budget=200, assigned_to="Alice", status=ProjectStatus.DONE))

bedroom = Room(name="Bedroom")
bedroom.add_project(Project(name="Bed frame", budget=800, assigned_to="Bob", status=ProjectStatus.DONE))
bedroom.add_project(Project(name="Curtains", budget=150))  # Unassigned

plan.add_room(kitchen)
plan.add_room(bedroom)

# --- Total/Spent/Remaining ---
print("\n--- Total/Spent/Remaining ---")
assert_eq(total_budget(plan), 5650.0, "total budget")
assert_eq(spent_budget(plan), 4000.0, "spent budget (done projects)")
assert_eq(remaining_budget(plan), 1650.0, "remaining budget")

# --- Room Breakdown ---
print("\n--- Room Breakdown ---")
rooms = room_budget_breakdown(plan)
assert_eq(len(rooms), 2, "2 rooms in breakdown")

kitchen_b = rooms[0]
assert_eq(kitchen_b["room"], "Kitchen", "kitchen name")
assert_eq(kitchen_b["total"], 4700.0, "kitchen total")
assert_eq(kitchen_b["spent"], 3200.0, "kitchen spent")
assert_eq(kitchen_b["remaining"], 1500.0, "kitchen remaining")
assert_eq(kitchen_b["projects"], 3, "kitchen project count")
assert_eq(kitchen_b["completed"], 2, "kitchen completed")

bedroom_b = rooms[1]
assert_eq(bedroom_b["room"], "Bedroom", "bedroom name")
assert_eq(bedroom_b["total"], 950.0, "bedroom total")
assert_eq(bedroom_b["spent"], 800.0, "bedroom spent")

# --- Partner Breakdown ---
print("\n--- Partner Breakdown ---")
partners = partner_budget_breakdown(plan)
assert_eq(partners["Alice"]["total"], 3200.0, "Alice total")
assert_eq(partners["Alice"]["spent"], 3200.0, "Alice spent")
assert_eq(partners["Alice"]["projects"], 2, "Alice projects")

assert_eq(partners["Bob"]["total"], 2300.0, "Bob total")
assert_eq(partners["Bob"]["spent"], 800.0, "Bob spent")
assert_eq(partners["Bob"]["projects"], 2, "Bob projects")

# --- Format Currency ---
print("\n--- Format Currency ---")
assert_eq(format_currency(0), "$0.00", "zero")
assert_eq(format_currency(99.5), "$99.50", "small amount")
assert_eq(format_currency(1000), "$1,000", "thousands")
assert_eq(format_currency(25000), "$25,000", "larger")
assert_eq(format_currency(1234567), "$1,234,567", "millions")

# --- Empty plan ---
print("\n--- Empty Plan ---")
empty = Plan()
assert_eq(total_budget(empty), 0.0, "empty total")
assert_eq(spent_budget(empty), 0.0, "empty spent")
assert_eq(remaining_budget(empty), 0.0, "empty remaining")
assert_eq(room_budget_breakdown(empty), [], "empty room breakdown")
assert_eq(partner_budget_breakdown(empty), {}, "empty partner breakdown")

print(f"\n{passed} passed, {failed} failed")
exit(1 if failed > 0 else 0)
