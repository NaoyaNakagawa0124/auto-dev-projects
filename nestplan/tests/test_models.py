"""Tests for NestPlan data models."""

import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from nestplan.models import (
    Plan, Room, Project, Partner, Vote,
    ProjectStatus, get_room_icon, ROOM_ICONS,
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


print("Model Tests")
print("===========")

# --- Vote ---
print("\n--- Vote ---")
v = Vote(partner_name="Alice", stars=4)
assert_eq(v.partner_name, "Alice", "vote partner_name")
assert_eq(v.stars, 4, "vote stars")

d = v.to_dict()
assert_eq(d, {"partner_name": "Alice", "stars": 4}, "vote to_dict")

v2 = Vote.from_dict(d)
assert_eq(v2.partner_name, "Alice", "vote from_dict name")
assert_eq(v2.stars, 4, "vote from_dict stars")

# --- Project ---
print("\n--- Project ---")
p = Project(name="Paint walls", description="Blue accent wall", budget=200.0)
assert_eq(p.name, "Paint walls", "project name")
assert_eq(p.status, ProjectStatus.PLANNED, "project default status")
assert_eq(p.priority_score, 0.0, "project no votes = 0 priority")
assert_eq(p.total_votes, 0, "project no votes count")

p.set_vote("Alice", 5)
p.set_vote("Bob", 3)
assert_eq(p.priority_score, 4.0, "project priority avg")
assert_eq(p.total_votes, 2, "project vote count")

p.set_vote("Alice", 4)  # Update vote
assert_eq(p.get_vote("Alice").stars, 4, "vote update")
assert_eq(p.priority_score, 3.5, "priority after update")

assert_true(p.get_vote("Charlie") is None, "nonexistent vote is None")

# Clamp votes
p2 = Project(name="Test")
p2.set_vote("A", 0)  # should clamp to 1
assert_eq(p2.get_vote("A").stars, 1, "vote clamped to 1")
p2.set_vote("B", 10)  # should clamp to 5
assert_eq(p2.get_vote("B").stars, 5, "vote clamped to 5")

# Serialization round-trip
d = p.to_dict()
p3 = Project.from_dict(d)
assert_eq(p3.name, p.name, "project roundtrip name")
assert_eq(p3.budget, p.budget, "project roundtrip budget")
assert_eq(p3.status, p.status, "project roundtrip status")
assert_eq(len(p3.votes), 2, "project roundtrip votes")

# --- Room ---
print("\n--- Room ---")
r = Room(name="Kitchen")
assert_eq(r.icon, get_room_icon("Kitchen"), "room icon")
assert_eq(r.total_budget, 0.0, "room empty budget")
assert_eq(r.project_count, 0, "room empty projects")

proj1 = Project(id="p1", name="Backsplash", budget=500)
proj2 = Project(id="p2", name="Countertops", budget=1200, status=ProjectStatus.DONE)
r.add_project(proj1)
r.add_project(proj2)

assert_eq(r.project_count, 2, "room project count")
assert_eq(r.total_budget, 1700.0, "room total budget")
assert_eq(r.completed_count, 1, "room completed count")

assert_true(r.get_project("p1") is not None, "get project by id")
assert_true(r.get_project("nope") is None, "get nonexistent project")

assert_true(r.remove_project("p1"), "remove existing project")
assert_eq(r.project_count, 1, "room count after remove")
assert_true(not r.remove_project("p1"), "remove already removed")

# Priority sorting
r2 = Room(name="Office")
pa = Project(id="a", name="A")
pb = Project(id="b", name="B")
pc = Project(id="c", name="C")
pa.set_vote("X", 2)
pb.set_vote("X", 5)
pc.set_vote("X", 3)
r2.add_project(pa)
r2.add_project(pb)
r2.add_project(pc)
sorted_p = r2.projects_by_priority()
assert_eq(sorted_p[0].name, "B", "highest priority first")
assert_eq(sorted_p[2].name, "A", "lowest priority last")

# Room roundtrip
rd = r2.to_dict()
r3 = Room.from_dict(rd)
assert_eq(r3.name, "Office", "room roundtrip name")
assert_eq(r3.project_count, 3, "room roundtrip projects")

# --- Partner ---
print("\n--- Partner ---")
partner = Partner(name="Alice")
assert_eq(partner.to_dict(), {"name": "Alice"}, "partner to_dict")
p_back = Partner.from_dict({"name": "Bob"})
assert_eq(p_back.name, "Bob", "partner from_dict")

# --- Plan ---
print("\n--- Plan ---")
plan = Plan(name="Dream Home")
plan.partners = [Partner("Alice"), Partner("Bob")]

kitchen = Room(id="r1", name="Kitchen")
kitchen.add_project(Project(id="k1", name="Cabinets", budget=3000, assigned_to="Alice", status=ProjectStatus.DONE))
kitchen.add_project(Project(id="k2", name="Flooring", budget=1500, assigned_to="Bob"))

bedroom = Room(id="r2", name="Bedroom")
bedroom.add_project(Project(id="b1", name="Paint", budget=200, assigned_to="Alice"))

plan.add_room(kitchen)
plan.add_room(bedroom)

assert_eq(plan.total_budget, 4700.0, "plan total budget")
assert_eq(plan.total_projects, 3, "plan total projects")
assert_eq(plan.completed_projects, 1, "plan completed projects")
assert_true(abs(plan.completion_pct - 33.33) < 1, f"plan completion pct ~33% (got {plan.completion_pct})")

assert_eq(len(plan.all_projects()), 3, "plan all_projects")

budget_by = plan.budget_by_partner()
assert_eq(budget_by["Alice"], 3200.0, "Alice budget")
assert_eq(budget_by["Bob"], 1500.0, "Bob budget")

assert_true(plan.get_room("r1") is not None, "get room by id")
assert_true(plan.remove_room("r1"), "remove room")
assert_eq(len(plan.rooms), 1, "rooms after remove")

# Plan roundtrip
plan2 = Plan(name="Test Plan", partners=[Partner("A"), Partner("B")])
plan2.add_room(Room(name="Living Room"))
plan2.rooms[0].add_project(Project(name="Couch", budget=800))

d = plan2.to_dict()
json_str = json.dumps(d)
plan3 = Plan.from_dict(json.loads(json_str))
assert_eq(plan3.name, "Test Plan", "plan roundtrip name")
assert_eq(len(plan3.partners), 2, "plan roundtrip partners")
assert_eq(len(plan3.rooms), 1, "plan roundtrip rooms")
assert_eq(plan3.rooms[0].projects[0].name, "Couch", "plan roundtrip deep project")

# Empty plan
empty = Plan()
assert_eq(empty.completion_pct, 0.0, "empty plan completion 0%")
assert_eq(empty.total_budget, 0.0, "empty plan budget 0")

# --- Room Icons ---
print("\n--- Room Icons ---")
assert_true(len(ROOM_ICONS) >= 10, f"at least 10 room icons ({len(ROOM_ICONS)})")
assert_eq(get_room_icon("unknown"), "\U0001f3e0", "unknown room gets default icon")
assert_true(get_room_icon("kitchen") != get_room_icon("bedroom"), "different rooms different icons")

print(f"\n{passed} passed, {failed} failed")
exit(1 if failed > 0 else 0)
