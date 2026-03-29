#!/usr/bin/env python3
"""CommuteStory Test Suite"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))
from data_engine import *

passed = failed = 0
failures = []
def assert_eq(e,a,n):
    global passed,failed
    if e==a:passed+=1
    else:failed+=1;failures.append(f"{n}(e={e},g={a})");print(f"  FAIL: {n}(e={e},g={a})")
def assert_true(c,n):
    global passed,failed
    if c:passed+=1
    else:failed+=1;failures.append(n);print(f"  FAIL: {n}")
def assert_gt(a,b,n):assert_true(a>b,f"{n}({a}>{b})")
def assert_gte(a,b,n):assert_true(a>=b,f"{n}({a}>={b})")
def assert_between(v,lo,hi,n):assert_true(lo<=v<=hi,f"{n}({lo}<={v}<={hi})")

print("=== CommuteStory Test Suite ===\n")

# ---- Station Data ----
print("[Station Data Tests]")
assert_eq(8, len(STATIONS), "8 stations")

for s in STATIONS:
    assert_eq(STATIONS.index(s), s.id, f"Station {s.name} id matches index")
    assert_true(len(s.name) > 0, f"Station {s.id} has name")
    assert_true(len(s.chapter_title) > 0, f"Station {s.id} has chapter")
    assert_gt(len(s.narrative), 3, f"Station {s.id} has 3+ narrative lines")
    assert_true(len(s.engineering_type) > 0, f"Station {s.id} has eng type")
    assert_true(len(s.icon) > 0, f"Station {s.id} has icon")
    assert_gte(s.distance_km, 0, f"Station {s.id} distance >= 0")
    assert_gt(s.year_built, 2000, f"Station {s.id} year > 2000")
    assert_true(len(s.fun_fact) > 0, f"Station {s.id} has fun fact")
    assert_true(isinstance(s.engineering_data, dict), f"Station {s.id} has eng data")
    assert_gt(len(s.engineering_data), 0, f"Station {s.id} eng data not empty")

# Station names unique
names = [s.name for s in STATIONS]
assert_eq(len(names), len(set(names)), "Station names unique")

# Distances increase
for i in range(1, len(STATIONS)):
    assert_gt(STATIONS[i].distance_km, STATIONS[i-1].distance_km, f"Station {i} farther than {i-1}")

# First station at 0
assert_eq(0.0, STATIONS[0].distance_km, "First station at 0 km")

# Engineering types
valid_types = {"tunnel", "bridge", "brt", "elevated", "underground", "station", "viaduct", "depot"}
for s in STATIONS:
    assert_true(s.engineering_type in valid_types, f"Station {s.name} valid type: {s.engineering_type}")

# Chapter titles contain "Chapter"
for s in STATIONS:
    assert_true("Chapter" in s.chapter_title, f"Station {s.name} chapter has 'Chapter'")

print("  Station data tests complete.\n")

# ---- Utility Functions ----
print("[Utility Function Tests]")

# Total distance
dist = get_total_distance()
assert_eq(19.8, dist, "Total distance 19.8 km")

# Elevation profile
profile = get_elevation_profile()
assert_eq(8, len(profile), "8 elevation points")
for p in profile:
    assert_true("station" in p, "Profile has station")
    assert_true("distance_km" in p, "Profile has distance")
    assert_true("elevation_m" in p, "Profile has elevation")
    assert_true("type" in p, "Profile has type")

# Check tunnel is underground (negative)
tunnel = next(p for p in profile if "Tunnel" in p["station"])
assert_true(tunnel["elevation_m"] < 0, "Tunnel is underground")

# Check bridge is elevated (positive)
bridge = next(p for p in profile if "Bridge" in p["station"])
assert_gt(bridge["elevation_m"], 0, "Bridge is elevated")

# Construction timeline
timeline = get_construction_timeline()
assert_eq(8, len(timeline), "8 timeline entries")
# Should be sorted by year
for i in range(1, len(timeline)):
    assert_gte(timeline[i]["year"], timeline[i-1]["year"], f"Timeline sorted {i}")

# Engineering summary
summary = get_engineering_summary()
assert_gt(len(summary), 0, "Has engineering types")
assert_true("station" in summary, "Summary has stations")
assert_true("tunnel" in summary, "Summary has tunnel")
assert_true("bridge" in summary, "Summary has bridge")

# Cost comparison
costs = get_cost_comparison()
assert_gt(costs["rail_equivalent_million"], costs["brt_cost_million"], "Rail costs more than BRT")
assert_gt(costs["savings_million"], 0, "Savings positive")
assert_eq(45, costs["brt_cost_million"], "BRT cost $45M")
assert_eq(400, costs["rail_equivalent_million"], "Rail equiv $400M")

# Passenger data
passengers = get_passenger_data()
assert_gt(len(passengers), 0, "Has passenger data")
for p in passengers:
    assert_gt(p["passengers"], 0, f"{p['station']} has passengers")

# Summit Central is the busiest
summit = next(p for p in passengers if "Summit" in p["station"])
assert_eq(85000, summit["passengers"], "Summit has 85K passengers")

# Sustainability data
sustainability = get_sustainability_data()
assert_gt(len(sustainability), 3, "Has sustainability data")
for d in sustainability:
    assert_true(len(d["station"]) > 0, "Sustainability has station")
    assert_true(len(d["metric"]) > 0, "Sustainability has metric")
    assert_gt(d["value"], 0, f"Sustainability {d['metric']} > 0")

# Bridge data
bridge_data = get_bridge_data()
assert_eq(340, bridge_data["main_span_m"], "Bridge span 340m")
assert_eq(120, bridge_data["tower_height_m"], "Tower height 120m")
assert_eq(72, bridge_data["cables"], "72 cables")

# Tunnel data
tunnel_data = get_tunnel_data()
assert_eq(1800, tunnel_data["length_m"], "Tunnel length 1800m")
assert_eq(200, tunnel_data["tbm_weight_tons"], "TBM 200 tons")

# Commute time
time = calculate_commute_time(30)
assert_between(time, 30, 50, "Commute time 30-50 min at 30km/h")

time_fast = calculate_commute_time(60)
assert_true(time_fast < time, "Faster speed = less time")

# Get chapter
ch = get_chapter(0)
assert_true(ch is not None, "Chapter 0 exists")
assert_eq("Riverside Terminal", ch.name, "Chapter 0 is Riverside")

ch_last = get_chapter(7)
assert_eq("Summit Central", ch_last.name, "Chapter 7 is Summit")

ch_bad = get_chapter(99)
assert_true(ch_bad is None, "Chapter 99 returns None")
ch_neg = get_chapter(-1)
assert_true(ch_neg is None, "Chapter -1 returns None")

# Fun facts
facts = get_all_fun_facts()
assert_eq(8, len(facts), "8 fun facts")
for f in facts:
    assert_gt(len(f["fact"]), 10, f"{f['station']} fact is substantial")

print("  Utility function tests complete.\n")

# ---- Engineering Data Integrity ----
print("[Engineering Data Integrity Tests]")

# Tunnel: TBM should complete in stated months
tunnel_s = STATIONS[1]
td = tunnel_s.engineering_data
expected_length = td["daily_advance_m"] * td["construction_months"] * 30  # approximate
assert_gte(expected_length, td["length_m"] * 0.8, "TBM could complete tunnel in stated time")

# Bridge: cable count should be reasonable for span
bd = STATIONS[2].engineering_data
assert_between(bd["cables"], 20, 200, "Reasonable cable count")
assert_gt(bd["cable_capacity_tons"], 100, "Cables strong enough")
assert_gt(bd["tower_height_m"], bd["clearance_m"], "Tower taller than clearance")

# BRT: cost per km should be reasonable
brt_d = STATIONS[4].engineering_data
cost_per_km = brt_d["cost_million"] / brt_d["length_km"]
assert_between(cost_per_km, 3, 15, "BRT cost/km reasonable ($3-15M)")

# Viaduct: segment count should match length
via_d = STATIONS[5].engineering_data
expected_segments = via_d["length_m"] / via_d["segment_length_m"]
assert_between(expected_segments, 20, 30, "Reasonable segment count")

# Green station: plants per species
green_d = STATIONS[6].engineering_data
plants_per_species = green_d["plants"] / green_d["species"]
assert_between(plants_per_species, 100, 500, "Reasonable plants per species")

# Summit: passengers per mode
summit_d = STATIONS[7].engineering_data
pax_per_mode = summit_d["daily_passengers"] / summit_d["transit_modes"]
assert_gt(pax_per_mode, 10000, "Reasonable passengers per mode")

print("  Engineering data integrity tests complete.\n")

# ---- Narrative Quality ----
print("[Narrative Quality Tests]")

for s in STATIONS:
    # Each narrative line should be substantial
    for i, line in enumerate(s.narrative):
        assert_gt(len(line), 10, f"Station {s.name} line {i} substantial")

    # First and last chapters should be special
    if s.id == 0:
        assert_true(any("begin" in l.lower() for l in s.narrative), "First chapter mentions beginning")
    if s.id == 7:
        assert_true(any("end" in l.lower() or "stop" in l.lower() for l in s.narrative), "Last chapter mentions ending")

# Chapter progression makes sense
for i in range(1, len(STATIONS)):
    assert_gt(STATIONS[i].id, STATIONS[i-1].id, f"Chapter {i} id increases")

print("  Narrative quality tests complete.\n")

# ---- Integration ----
print("[Integration Tests]")

# Full data pipeline
all_elev = get_elevation_profile()
all_timeline = get_construction_timeline()
all_passengers = get_passenger_data()
all_sustainability = get_sustainability_data()
all_facts = get_all_fun_facts()
eng_summary = get_engineering_summary()
costs = get_cost_comparison()

assert_eq(8, len(all_elev), "Integration: elevation")
assert_eq(8, len(all_timeline), "Integration: timeline")
assert_gt(len(all_passengers), 0, "Integration: passengers")
assert_gt(len(all_sustainability), 0, "Integration: sustainability")
assert_eq(8, len(all_facts), "Integration: facts")
assert_gt(len(eng_summary), 2, "Integration: summary types")

# All stations accessible as chapters
for i in range(8):
    ch = get_chapter(i)
    assert_true(ch is not None, f"Integration: chapter {i} accessible")
    assert_eq(STATIONS[i].name, ch.name, f"Integration: chapter {i} correct")

# Total passengers across network
total_pax = sum(p["passengers"] for p in all_passengers)
assert_gt(total_pax, 50000, "Integration: significant total passengers")

print("  Integration tests complete.\n")

print("================================")
print(f"  Results: {passed} passed, {failed} failed")
print("================================")
if failures:
    print("\nFailures:")
    for f in failures: print(f"  - {f}")
sys.exit(1 if failed > 0 else 0)
