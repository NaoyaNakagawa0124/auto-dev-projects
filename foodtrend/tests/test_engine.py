#!/usr/bin/env python3
"""FoodTrend Test Suite"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from data_engine import *

passed = failed = 0
failures = []

def assert_eq(e, a, n):
    global passed, failed
    if e == a: passed += 1
    else: failed += 1; failures.append(f"{n} (e={e}, g={a})"); print(f"  FAIL: {n} (e={e}, g={a})")
def assert_true(c, n):
    global passed, failed
    if c: passed += 1
    else: failed += 1; failures.append(n); print(f"  FAIL: {n}")
def assert_gt(a, b, n): assert_true(a > b, f"{n} ({a}>{b})")
def assert_gte(a, b, n): assert_true(a >= b, f"{n} ({a}>={b})")
def assert_between(v, lo, hi, n): assert_true(lo <= v <= hi, f"{n} ({lo}<={v}<={hi})")

print("=== FoodTrend Test Suite ===\n")

# ---- Constants ----
print("[Constants Tests]")
assert_eq(10, len(FOOD_CATEGORIES), "10 food categories")
assert_eq(10, len(CONTENT_FORMATS), "10 content formats")
assert_eq(15, len(TRENDING_RECIPES), "15 trending recipes")
assert_eq(7, len(DAYS), "7 days")
assert_eq(24, len(HOURS), "24 hours")

for c in FOOD_CATEGORIES:
    assert_true(len(c["id"]) > 0, f"Category {c['id']} has id")
    assert_true(len(c["name"]) > 0, f"Category {c['id']} has name")
    assert_true(len(c["icon"]) > 0, f"Category {c['id']} has icon")
    assert_gt(c["growth"], 0, f"Category {c['id']} has growth")

cat_ids = [c["id"] for c in FOOD_CATEGORIES]
assert_eq(len(cat_ids), len(set(cat_ids)), "Category IDs unique")

for f in CONTENT_FORMATS:
    assert_true(len(f["id"]) > 0, f"Format {f['id']} has id")
    assert_gt(f["avg_views"], 0, f"Format {f['id']} has views")
    assert_between(f["difficulty"], 1, 3, f"Format {f['id']} difficulty 1-3")

fmt_ids = [f["id"] for f in CONTENT_FORMATS]
assert_eq(len(fmt_ids), len(set(fmt_ids)), "Format IDs unique")

for r in TRENDING_RECIPES:
    assert_true(len(r["name"]) > 0, f"Recipe has name")
    assert_true(r["category"] in cat_ids, f"Recipe category valid")
    assert_between(r["virality"], 0, 100, f"Recipe virality in range")

print("  Constants tests complete.\n")

# ---- Heatmap Tests ----
print("[Heatmap Tests]")
heatmap = generate_posting_heatmap(seed=42)
assert_eq(7, len(heatmap), "7 days in heatmap")
for day_idx, row in enumerate(heatmap):
    assert_eq(24, len(row), f"Day {day_idx} has 24 hours")
    for h, val in enumerate(row):
        assert_between(val, 0, 1.0, f"Day {day_idx} hour {h} in [0,1]")

# Evening should be higher than early morning
for day_idx in range(5):  # weekdays
    evening_avg = sum(heatmap[day_idx][18:21]) / 3
    morning_avg = sum(heatmap[day_idx][3:6]) / 3
    assert_gt(evening_avg, morning_avg, f"Day {day_idx} evening > morning")

# Weekend should have higher engagement
weekday_avg = sum(sum(row) for row in heatmap[:5]) / (5 * 24)
weekend_avg = sum(sum(row) for row in heatmap[5:]) / (2 * 24)
assert_gt(weekend_avg, weekday_avg, "Weekend avg > weekday avg")

# Deterministic
h2 = generate_posting_heatmap(seed=42)
assert_eq(heatmap, h2, "Same seed = same heatmap")

h3 = generate_posting_heatmap(seed=99)
assert_true(heatmap != h3, "Different seed = different heatmap")

print("  Heatmap tests complete.\n")

# ---- Best Times Tests ----
print("[Best Times Tests]")
best = find_best_posting_times(heatmap, top_n=5)
assert_eq(5, len(best), "5 best times")

for t in best:
    assert_true(t["day"] in DAYS, f"Day {t['day']} is valid")
    assert_between(t["hour"], 0, 23, f"Hour in range")
    assert_between(t["score"], 0, 1.0, f"Score in range")

# Best times should be sorted by score descending
for i in range(len(best) - 1):
    assert_gte(best[i]["score"], best[i+1]["score"], f"Best times sorted ({i})")

# Top time should be evening or weekend
top = best[0]
assert_true(top["hour"] >= 10 or top["day_idx"] >= 5, "Top time is peak hour")

# Different top_n
best3 = find_best_posting_times(heatmap, top_n=3)
assert_eq(3, len(best3), "3 best times")

best10 = find_best_posting_times(heatmap, top_n=10)
assert_eq(10, len(best10), "10 best times")

print("  Best times tests complete.\n")

# ---- Competitor Tests ----
print("[Competitor Tests]")
competitors = generate_competitor_data(seed=42)
assert_eq(8, len(competitors), "8 competitors")

for c in competitors:
    assert_true(len(c["name"]) > 0, f"Competitor has name")
    assert_true(c["name"].startswith("@"), f"Name starts with @")
    assert_gt(c["followers"], 0, "Has followers")
    assert_gt(c["avg_views"], 0, "Has avg views")
    assert_between(c["posts_per_week"], 3, 7, "Posts per week in range")
    assert_between(c["engagement_rate"], 2.0, 9.0, "Engagement rate in range")
    assert_gt(c["growth_30d"], 0, "Has growth")
    assert_true(c["niche"] in cat_ids, "Valid niche")
    assert_true(c["top_format"] in fmt_ids, "Valid format")

# Avg views should be fraction of followers
for c in competitors:
    assert_true(c["avg_views"] < c["followers"], f"{c['name']} views < followers")

# Deterministic
c2 = generate_competitor_data(seed=42)
assert_eq(competitors[0]["followers"], c2[0]["followers"], "Same seed = same data")

print("  Competitor tests complete.\n")

# ---- Growth Projection Tests ----
print("[Growth Projection Tests]")
growth = generate_growth_projection(start_followers=500, months=12, seed=42)
assert_eq(12, len(growth), "12 months of projection")

for g in growth:
    assert_gt(g["month"], 0, "Month > 0")
    assert_gt(g["followers"], 0, "Followers > 0")
    assert_gt(g["growth"], 0, "Growth > 0")
    assert_true(isinstance(g["viral_month"], bool), "Has viral flag")
    assert_gt(g["posts"], 0, "Has posts")

# Followers should generally increase
for i in range(1, len(growth)):
    assert_gt(growth[i]["followers"], growth[i-1]["followers"], f"Month {i} followers increase")

# End followers should be much more than start
assert_gt(growth[-1]["followers"], 500 * 2, "Significant growth over 12 months")

# More posts = faster growth
fast = generate_growth_projection(500, 12, posts_per_week=7, seed=42)
slow = generate_growth_projection(500, 12, posts_per_week=3, seed=42)
assert_gt(fast[-1]["followers"], slow[-1]["followers"], "More posts = more growth")

# Viral months exist
viral_months = [g for g in growth if g["viral_month"]]
# May or may not have viral months depending on seed, just check structure
for v in viral_months:
    assert_true(v["viral_month"], "Viral flag set")

print("  Growth projection tests complete.\n")

# ---- Content Gap Tests ----
print("[Content Gap Tests]")
gaps = find_content_gaps(competitors)
assert_gt(len(gaps), 0, "Found some gaps")

for g in gaps:
    assert_true(g["id"] in cat_ids, f"Gap {g['id']} is valid category")
    assert_true(g["opportunity"] in ["high", "medium"], "Valid opportunity level")
    assert_gt(g["growth"], 0, "Gap has growth rate")

# Gaps should be sorted by growth
for i in range(len(gaps) - 1):
    assert_gte(gaps[i]["growth"], gaps[i+1]["growth"], f"Gaps sorted by growth ({i})")

# High opportunity = category not served by any competitor
high_gaps = [g for g in gaps if g["opportunity"] == "high"]
comp_niches = set(c["niche"] for c in competitors)
for g in high_gaps:
    assert_true(g["id"] not in comp_niches, f"High gap {g['id']} not in competitor niches")

print("  Content gap tests complete.\n")

# ---- Hashtag Tests ----
print("[Hashtag Tests]")
hashtags = generate_hashtag_data(seed=42)
assert_eq(20, len(hashtags), "20 hashtags")

for h in hashtags:
    assert_true(h["hashtag"].startswith("#"), f"Hashtag starts with #")
    assert_gt(h["total_views"], 0, "Has views")
    assert_true(h["competition"] in ["high", "medium", "low"], "Valid competition")

# Sorted by growth descending
for i in range(len(hashtags) - 1):
    assert_gte(hashtags[i]["growth_7d"], hashtags[i+1]["growth_7d"], f"Hashtags sorted ({i})")

# High competition = high views
for h in hashtags:
    if h["competition"] == "high":
        assert_gt(h["total_views"], 400_000_000, "High comp = high views")
    elif h["competition"] == "low":
        assert_true(h["total_views"] <= 200_000_000, "Low comp = low views")

print("  Hashtag tests complete.\n")

# ---- Strategy Summary Tests ----
print("[Strategy Summary Tests]")
summary = get_strategy_summary(competitors, gaps, find_best_posting_times(heatmap))
assert_true(len(summary) > 0, "Summary not empty")
assert_true("STRATEGY" in summary, "Has strategy header")
assert_true("Niche" in summary, "Mentions niche")
assert_true("Posting Time" in summary, "Mentions posting time")
assert_true("Formats" in summary, "Mentions formats")
assert_true("Tips" in summary, "Has tips")

print("  Strategy summary tests complete.\n")

# ---- Integration ----
print("[Integration Tests]")

# Full pipeline
hm = generate_posting_heatmap(seed=123)
bt = find_best_posting_times(hm, top_n=5)
comp = generate_competitor_data(seed=123)
gr = generate_growth_projection(1000, 6, 5, seed=123)
gaps = find_content_gaps(comp)
ht = generate_hashtag_data(seed=123)
strat = get_strategy_summary(comp, gaps, bt)

assert_eq(7, len(hm), "Pipeline: heatmap")
assert_eq(5, len(bt), "Pipeline: best times")
assert_eq(8, len(comp), "Pipeline: competitors")
assert_eq(6, len(gr), "Pipeline: growth")
assert_gt(len(gaps), 0, "Pipeline: gaps")
assert_eq(20, len(ht), "Pipeline: hashtags")
assert_gt(len(strat), 100, "Pipeline: strategy")

print("  Integration tests complete.\n")

print("================================")
print(f"  Results: {passed} passed, {failed} failed")
print("================================")
if failures:
    print("\nFailures:")
    for f in failures: print(f"  - {f}")
sys.exit(1 if failed > 0 else 0)
