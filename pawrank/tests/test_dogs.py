"""Tests for PawRank dog data and rankings."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from pawrank.dogs import Dog, get_dogs, dogs_to_dataframe, CATEGORIES, SAMPLE_DOGS, add_dog
from pawrank.rankings import (
    rank_by_category, overall_ranking, category_winners,
    trophy_room, dog_percentile, head_to_head
)

passed = 0
failed = 0

def assert_true(c, m):
    global passed, failed
    if c: passed += 1
    else: failed += 1; print(f"  FAIL: {m}")

def assert_eq(a, b, m):
    global passed, failed
    if a == b: passed += 1
    else: failed += 1; print(f"  FAIL: {m} (got {a!r}, expected {b!r})")

print("Dog Data Tests\n==============")

# --- Data Integrity ---
print("\n--- Data Integrity ---")
dogs = get_dogs()
assert_true(len(dogs) >= 20, f"At least 20 dogs (got {len(dogs)})")

names = set()
for d in dogs:
    assert_true(d.name and len(d.name) > 0, f"Dog has name")
    assert_true(d.breed and len(d.breed) > 0, f"{d.name} has breed")
    assert_true(d.age > 0, f"{d.name} has positive age")
    assert_true(d.weight_kg > 0, f"{d.name} has positive weight")
    assert_true(len(d.stats) == 8, f"{d.name} has 8 stats")
    for cat in CATEGORIES:
        assert_true(cat in d.stats, f"{d.name} has {cat}")
        assert_true(1 <= d.stats[cat] <= 100, f"{d.name}.{cat} in [1,100]")
    assert_true(d.name not in names, f"{d.name} is unique")
    names.add(d.name)

# --- Dog Model ---
print("\n--- Dog Model ---")
d = Dog("Test", "Mutt", 3, 10, {c: 50 for c in CATEGORIES})
assert_eq(d.overall_score, 50.0, "overall score average")
d2 = Dog("Empty", "?", 1, 5)
assert_eq(d2.overall_score, 0.0, "empty stats = 0 overall")

# --- DataFrame ---
print("\n--- DataFrame ---")
df = dogs_to_dataframe(dogs)
assert_eq(len(df), len(dogs), "df length matches dogs")
assert_true("name" in df.columns, "df has name column")
for cat in CATEGORIES:
    assert_true(cat in df.columns, f"df has {cat} column")

# --- Rankings ---
print("\n--- Rankings ---")
for cat in CATEGORIES:
    ranked = rank_by_category(dogs, cat)
    assert_eq(len(ranked), len(dogs), f"ranked by {cat} has all dogs")
    assert_true(ranked.iloc[0][cat] >= ranked.iloc[-1][cat], f"{cat} sorted desc")
    assert_true("rank" in ranked.columns, f"{cat} has rank column")

overall = overall_ranking(dogs)
assert_true("overall" in overall.columns, "overall column exists")
assert_true("rank" in overall.columns, "rank column exists")
assert_true(overall.iloc[0]["overall"] >= overall.iloc[-1]["overall"], "overall sorted desc")

# --- Category Winners ---
print("\n--- Category Winners ---")
winners = category_winners(dogs)
assert_eq(len(winners), 8, "8 category winners")
for cat, info in winners.items():
    assert_true(info["name"] and len(info["name"]) > 0, f"{cat} winner has name")
    assert_true(info["score"] > 0, f"{cat} winner has score")

# --- Trophy Room ---
print("\n--- Trophy Room ---")
tr = trophy_room(dogs)
assert_eq(len(tr), 8, "trophy room has 8 rows")
assert_true("winner" in tr.columns, "trophy room has winner")

# --- Percentile ---
print("\n--- Percentile ---")
pct = dog_percentile(dogs, "Ziggy")
assert_eq(len(pct), 8, "8 percentiles for Ziggy")
for cat, val in pct.items():
    assert_true(0 <= val <= 100, f"Ziggy {cat} percentile in [0,100]")

empty_pct = dog_percentile(dogs, "NonexistentDog")
assert_eq(len(empty_pct), 0, "nonexistent dog = empty percentile")

# --- Head to Head ---
print("\n--- Head to Head ---")
h2h = head_to_head(dogs, "Ziggy", "Shadow")
assert_eq(h2h["dog1"], "Ziggy", "h2h dog1")
assert_eq(h2h["dog2"], "Shadow", "h2h dog2")
assert_eq(len(h2h["categories"]), 8, "h2h 8 categories")
assert_true(h2h["wins1"] + h2h["wins2"] <= 8, "wins sum <= 8")
assert_true(h2h["overall_winner"] in ["Ziggy", "Shadow", "Tie"], "valid winner")

h2h_err = head_to_head(dogs, "Ziggy", "NonexistentDog")
assert_true("error" in h2h_err, "h2h error for missing dog")

# --- Add Dog ---
print("\n--- Add Dog ---")
my_dogs = get_dogs()
new_dog = Dog("TestDog", "Test", 1, 5, {c: 75 for c in CATEGORIES})
add_dog(my_dogs, new_dog)
assert_eq(len(my_dogs), len(SAMPLE_DOGS) + 1, "add_dog increases count")
new_overall = overall_ranking(my_dogs)
assert_true(any(new_overall["name"] == "TestDog"), "TestDog in rankings")

print(f"\n{passed} passed, {failed} failed")
exit(1 if failed > 0 else 0)
