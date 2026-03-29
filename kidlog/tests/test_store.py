"""Tests for KidLog store module."""
import sys
import os
import json
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from store import (
    load_data, save_data, add_entry, add_reaction, delete_entry,
    get_stats, get_entries_by_date, search_entries, get_category,
    CATEGORIES, REACTIONS,
)

passed = 0
failed = 0
total = 0


def describe(name):
    print(f"\n  \033[1m{name}\033[0m")


def it(name, condition):
    global total, passed, failed
    total += 1
    if condition:
        passed += 1
        print(f"    \033[32m✓\033[0m {name}")
    else:
        failed += 1
        print(f"    \033[31m✗\033[0m {name}")


print("\n\033[1m👶 KidLog Test Suite\033[0m")

# ===== Categories =====
describe("Categories")
it("should have at least 8 categories", len(CATEGORIES) >= 8)
it("should have unique ids", len(set(c["id"] for c in CATEGORIES)) == len(CATEGORIES))
it("should have Japanese names", all(c["name"] for c in CATEGORIES))
it("should have emojis", all(c["emoji"] for c in CATEGORIES))

describe("get_category")
it("should find motor", get_category("motor")["name"] == "運動")
it("should find food", get_category("food")["emoji"] == "🍽️")
it("should return fallback for unknown", get_category("xxx")["id"] == "xxx")

# ===== Reactions =====
describe("Reactions")
it("should have at least 5 reactions", len(REACTIONS) >= 5)
it("should all be strings", all(isinstance(r, str) for r in REACTIONS))

# ===== Data Loading =====
describe("Data Loading")
data = load_data("/nonexistent/path.json")
it("should return default for missing file", data["entries"] == [])
it("should have streak fields", "streak_count" in data and "longest_streak" in data)

# With temp file
tmpf = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
json.dump({"entries": [{"id": "test1", "text": "hello"}], "streak_count": 3, "streak_last_date": None, "longest_streak": 5}, tmpf)
tmpf.close()
loaded = load_data(tmpf.name)
it("should load from file", len(loaded["entries"]) == 1)
it("should preserve streak", loaded["streak_count"] == 3)
os.unlink(tmpf.name)

# ===== Save & Load roundtrip =====
describe("Save & Load")
tmpf2 = tempfile.NamedTemporaryFile(suffix=".json", delete=False)
tmpf2.close()
test_data = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
add_entry(test_data, "テスト記録", "motor", "太郎")
save_data(test_data, tmpf2.name)
reloaded = load_data(tmpf2.name)
it("should save and reload entry", len(reloaded["entries"]) == 1)
it("should preserve text", reloaded["entries"][0]["text"] == "テスト記録")
it("should preserve category", reloaded["entries"][0]["category"] == "motor")
it("should preserve child name", reloaded["entries"][0]["child_name"] == "太郎")
os.unlink(tmpf2.name)

# ===== Add Entry =====
describe("Add Entry")
data = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
e1 = add_entry(data, "初めて歩いた！", "motor", "花子")
it("should return entry with id", "id" in e1)
it("should have text", e1["text"] == "初めて歩いた！")
it("should have category", e1["category"] == "motor")
it("should have child_name", e1["child_name"] == "花子")
it("should have date", "date" in e1)
it("should have created_at", "created_at" in e1)
it("should have empty reactions", e1["reactions"] == [])
it("should be in data", len(data["entries"]) == 1)

e2 = add_entry(data, "「ママ」と言った", "language")
it("should add second entry", len(data["entries"]) == 2)
it("should be newest first", data["entries"][0]["text"] == "「ママ」と言った")

# ===== Add Reaction =====
describe("Add Reaction")
result = add_reaction(data, e1["id"], "❤️")
it("should add reaction successfully", result is True)
it("should store reaction", "❤️" in data["entries"][1]["reactions"])

result2 = add_reaction(data, e1["id"], "❤️")
it("should not add duplicate reaction", data["entries"][1]["reactions"].count("❤️") == 1)

result3 = add_reaction(data, "nonexistent", "😂")
it("should return False for missing entry", result3 is False)

# ===== Delete Entry =====
describe("Delete Entry")
data3 = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
e_del = add_entry(data3, "削除テスト", "other")
add_entry(data3, "残す記録", "play")
it("should have 2 entries before delete", len(data3["entries"]) == 2)
delete_entry(data3, e_del["id"])
it("should have 1 entry after delete", len(data3["entries"]) == 1)
it("should keep the right entry", data3["entries"][0]["text"] == "残す記録")

# ===== Streak =====
describe("Streak Tracking")
data4 = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
add_entry(data4, "今日の記録", "other")
it("should start streak at 1", data4["streak_count"] == 1)
it("should update last date", data4["streak_last_date"] is not None)
it("should track longest streak", data4["longest_streak"] >= 1)

# Adding another entry same day shouldn't increase streak
prev_streak = data4["streak_count"]
add_entry(data4, "同じ日の2つ目", "other")
it("should not increase streak for same day", data4["streak_count"] == prev_streak)

# ===== Stats =====
describe("Statistics")
data5 = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
add_entry(data5, "運動1", "motor")
add_entry(data5, "運動2", "motor")
add_entry(data5, "食事1", "food")
add_reaction(data5, data5["entries"][0]["id"], "❤️")
add_reaction(data5, data5["entries"][0]["id"], "🎉")

stats = get_stats(data5)
it("should count total entries", stats["total"] == 3)
it("should count days active", stats["days_active"] >= 1)
it("should count streak", stats["streak"] >= 1)
it("should count motor category", stats["category_counts"].get("motor") == 2)
it("should count food category", stats["category_counts"].get("food") == 1)
it("should count reactions", stats["reaction_counts"].get("❤️") == 1)
it("should count month entries", len(stats["month_counts"]) >= 1)

# Empty stats
empty_stats = get_stats({"entries": [], "streak_count": 0, "longest_streak": 0})
it("should handle empty data", empty_stats["total"] == 0)
it("should have zero days for empty", empty_stats["days_active"] == 0)

# ===== Search =====
describe("Search")
data6 = {"entries": [], "streak_count": 0, "streak_last_date": None, "longest_streak": 0}
add_entry(data6, "初めて歩いた日", "motor")
add_entry(data6, "カレーを食べた", "food")
add_entry(data6, "初めての寝返り", "motor")

results = search_entries(data6, "初めて")
it("should find matching entries", len(results) == 2)

results2 = search_entries(data6, "カレー")
it("should find food entry", len(results2) == 1)

results3 = search_entries(data6, "存在しない")
it("should return empty for no match", len(results3) == 0)

# Case insensitive
results4 = search_entries(data6, "初めて")
it("should work with Japanese text", len(results4) == 2)

# ===== Get Entries By Date =====
describe("Get Entries By Date")
from datetime import date
today = date.today().isoformat()
today_entries = get_entries_by_date(data6, today)
it("should find today's entries", len(today_entries) == 3)

old_entries = get_entries_by_date(data6, "2020-01-01")
it("should return empty for old date", len(old_entries) == 0)

# ===== Summary =====
print("\n" + "─" * 50)
print(f"\033[1m  Results: {passed}/{total} passed\033[0m")
if failed > 0:
    print(f"  \033[31m{failed} failed\033[0m")
    sys.exit(1)
else:
    print("  \033[32mAll tests passed! 👶\033[0m")
print()
