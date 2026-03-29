"""KuizuNote puzzle logic tests."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from puzzles import *

passed = failed = total = 0

def describe(name):
    print(f"\n  \033[1m{name}\033[0m")

def it(name, cond):
    global total, passed, failed
    total += 1
    if cond:
        passed += 1
        print(f"    \033[32m✓\033[0m {name}")
    else:
        failed += 1
        print(f"    \033[31m✗\033[0m {name}")

print("\n\033[1m🧠 KuizuNote Test Suite\033[0m")

describe("Puzzles Data")
it("should have 10 puzzles", len(PUZZLES) == 10)
it("should have unique ids", len(set(p["id"] for p in PUZZLES)) == 10)
it("should have sequential ids 1-10", all(PUZZLES[i]["id"] == i + 1 for i in range(10)))
it("should all have titles", all(p.get("title") for p in PUZZLES))
it("should all have questions", all(p.get("question") for p in PUZZLES))
it("should all have answers", all("answer" in p for p in PUZZLES))
it("should all have hints", all(p.get("hint") for p in PUZZLES))
it("should all have explanations", all(p.get("explanation") for p in PUZZLES))
it("should all have types", all(p.get("type") in ("pattern", "sequence", "logic", "chart") for p in PUZZLES))
it("answers should be integers", all(isinstance(p["answer"], int) for p in PUZZLES))

describe("get_puzzle")
it("should find puzzle 1", get_puzzle(1) is not None)
it("should find puzzle 10", get_puzzle(10) is not None)
it("should return None for 0", get_puzzle(0) is None)
it("should return None for 11", get_puzzle(11) is None)
it("puzzle 1 title should be パターン認識", get_puzzle(1)["title"] == "パターン認識")

describe("check_answer")
it("puzzle 1: 32 is correct", check_answer(1, 32))
it("puzzle 1: 33 is wrong", not check_answer(1, 33))
it("puzzle 2: 13 is correct (fibonacci)", check_answer(2, 13))
it("puzzle 3: 2 is correct (B shortest)", check_answer(3, 2))
it("puzzle 4: 1 is correct (red)", check_answer(4, 1))
it("puzzle 5: 5 is correct (travel)", check_answer(5, 5))
it("puzzle 6: 15 is correct", check_answer(6, 15))
it("puzzle 7: 1 is correct (monday)", check_answer(7, 1))
it("puzzle 8: 3 is correct (autumn)", check_answer(8, 3))
it("puzzle 9: 1 is correct (mirror)", check_answer(9, 1))
it("puzzle 10: 60 is correct", check_answer(10, 60))
it("handles string input", check_answer(1, "32"))
it("handles invalid input", not check_answer(1, "abc"))
it("handles None", not check_answer(1, None))
it("handles invalid puzzle id", not check_answer(99, 1))

describe("calculate_score")
it("10/10 = 100", calculate_score(10) == 100)
it("0/10 = 0", calculate_score(0) == 0)
it("5/10 = 50", calculate_score(5) == 50)
it("7/10 = 70", calculate_score(7) == 70)
it("3/10 = 30", calculate_score(3) == 30)

describe("Brain Types")
it("should have 5 brain types", len(BRAIN_TYPES) == 5)
it("should cover score 0-100", BRAIN_TYPES[-1]["min_score"] == 0)
it("highest should be 90+", BRAIN_TYPES[0]["min_score"] == 90)
it("all should have type name", all(bt.get("type") for bt in BRAIN_TYPES))
it("all should have description", all(bt.get("desc") for bt in BRAIN_TYPES))
it("all types should be Japanese", all(len(bt["type"]) > 0 for bt in BRAIN_TYPES))

describe("get_brain_type")
it("100 → 天才脳", "天才" in get_brain_type(100)["type"])
it("90 → 天才脳", "天才" in get_brain_type(90)["type"])
it("70 → 分析脳", "分析" in get_brain_type(70)["type"])
it("50 → 直感脳", "直感" in get_brain_type(50)["type"])
it("30 → のんびり脳", "のんびり" in get_brain_type(30)["type"])
it("0 → 冒険脳", "冒険" in get_brain_type(0)["type"])

describe("Chart Data")
it("puzzle 5 has bar chart data", get_chart_data(5)["type"] == "bar")
it("puzzle 5 has 5 labels", len(get_chart_data(5)["labels"]) == 5)
it("puzzle 8 has pie chart data", get_chart_data(8)["type"] == "pie")
it("puzzle 8 has 4 seasons", len(get_chart_data(8)["labels"]) == 4)
it("puzzle 4 has color pattern", get_chart_data(4)["type"] == "color_pattern")
it("unknown puzzle returns None", get_chart_data(99) is None)
it("chart data has titles", all(get_chart_data(i).get("title") for i in [4, 5, 8]))
it("chart data has colors", all(get_chart_data(i).get("colors") for i in [4, 5, 8]))

describe("puzzle_count")
it("should return 10", puzzle_count() == 10)

describe("Notebook File")
it("kuizunote.ipynb exists", os.path.exists(os.path.join(os.path.dirname(__file__), '..', 'kuizunote.ipynb')))

# Summary
print("\n" + "─" * 50)
print(f"\033[1m  Results: {passed}/{total} passed\033[0m")
if failed > 0:
    print(f"  \033[31m{failed} failed\033[0m")
    sys.exit(1)
else:
    print("  \033[32mAll tests passed! 🧠\033[0m")
print()
