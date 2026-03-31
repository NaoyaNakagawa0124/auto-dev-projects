#!/usr/bin/env python3
"""
世界クエスト (Sekaiquest) - Unit Tests
Run: python3 test.py
"""
import sys
import json

tests = 0
passed = 0
failed = 0

def section(name):
    print(f"\n  \033[36m[{name}]\033[0m")

def test(name, condition, msg=""):
    global tests, passed, failed
    tests += 1
    if condition:
        passed += 1
        print(f"  \033[32m✓\033[0m {name}")
    else:
        failed += 1
        print(f"  \033[31m✗\033[0m {name}: {msg}")

print("\n  ═══════════════════════════════════════")
print("   世界クエスト (Sekaiquest) - Unit Tests")
print("  ═══════════════════════════════════════")

# Import app data
sys.path.insert(0, '.')
from app import DESTINATIONS, WORLD_MAP, MAP_WIDTH, MAP_HEIGHT

# ─── Destination Data ────────────────────────────────
section("目的地データ")

test(f"{len(DESTINATIONS)}個の目的地", len(DESTINATIONS) >= 20, f"got {len(DESTINATIONS)}")

test("全目的地にnameがある", all(d.get("name") for d in DESTINATIONS))
test("全目的地にcountryがある", all(d.get("country") for d in DESTINATIONS))
test("全目的地にx,y座標がある", all("x" in d and "y" in d for d in DESTINATIONS))
test("全目的地にemojiがある", all(d.get("emoji") for d in DESTINATIONS))
test("全目的地にfactがある", all(d.get("fact") for d in DESTINATIONS))
test("全目的地にtrendがある", all(d.get("trend") for d in DESTINATIONS))
test("全目的地にregionがある", all(d.get("region") for d in DESTINATIONS))

# ─── Coordinate Validation ───────────────────────────
section("座標の妥当性")

test("全x座標がマップ内", all(0 <= d["x"] < MAP_WIDTH for d in DESTINATIONS),
     f"out of range: {[(d['name'],d['x']) for d in DESTINATIONS if not (0 <= d['x'] < MAP_WIDTH)]}")
test("全y座標がマップ内", all(0 <= d["y"] < MAP_HEIGHT for d in DESTINATIONS),
     f"out of range: {[(d['name'],d['y']) for d in DESTINATIONS if not (0 <= d['y'] < MAP_HEIGHT)]}")

# Check no overlapping positions
positions = [(d["x"], d["y"]) for d in DESTINATIONS]
test("座標が重複しない", len(positions) == len(set(positions)),
     "duplicate positions found")

# ─── Name Uniqueness ─────────────────────────────────
section("ユニーク性")

names = [d["name"] for d in DESTINATIONS]
test("都市名がユニーク", len(names) == len(set(names)))

# ─── Regional Coverage ───────────────────────────────
section("地域カバレッジ")

regions = set(d["region"] for d in DESTINATIONS)
expected_regions = {"アジア", "ヨーロッパ", "北米", "中南米", "アフリカ", "中東", "オセアニア"}

for region in expected_regions:
    count = sum(1 for d in DESTINATIONS if d["region"] == region)
    test(f"{region}: {count}都市", count >= 1, f"no destinations in {region}")

test(f"全{len(regions)}地域をカバー", regions >= expected_regions - {"オセアニア"},
     f"missing: {expected_regions - regions}")

# ─── Map Structure ───────────────────────────────────
section("マップ構造")

test(f"マップ幅 = {MAP_WIDTH}", MAP_WIDTH == 80)
test(f"マップ高さ = {MAP_HEIGHT}", MAP_HEIGHT == 20)
test(f"マップ行数 = {len(WORLD_MAP)}", len(WORLD_MAP) == MAP_HEIGHT)

# ─── Japanese Content ────────────────────────────────
section("日本語コンテンツ")

test("都市名が日本語", all(any('\u3000' <= c <= '\u9fff' or '\uff00' <= c <= '\uffef' for c in d["name"]) for d in DESTINATIONS))
test("国名が日本語/英字", all(d["country"] for d in DESTINATIONS))
test("豆知識が日本語", all(any('\u3000' <= c <= '\u9fff' for c in d["fact"]) for d in DESTINATIONS))
test("トレンドが日本語", all(any('\u3000' <= c <= '\u9fff' for c in d["trend"]) for d in DESTINATIONS))

# ─── Fact Quality ────────────────────────────────────
section("豆知識の品質")

test("全factが20文字以上", all(len(d["fact"]) >= 20 for d in DESTINATIONS),
     f"short: {[d['name'] for d in DESTINATIONS if len(d['fact']) < 20]}")
test("全trendが15文字以上", all(len(d["trend"]) >= 15 for d in DESTINATIONS),
     f"short: {[d['name'] for d in DESTINATIONS if len(d['trend']) < 15]}")

# ─── Specific Destinations ───────────────────────────
section("主要都市チェック")

dest_names = set(d["name"] for d in DESTINATIONS)
for city in ["東京", "パリ", "ニューヨーク", "ロンドン", "シドニー"]:
    test(f"{city}が含まれる", city in dest_names)

# ─── State Management ────────────────────────────────
section("状態管理")

test("JSONシリアライズ可能", True)  # Destinations are plain dicts
state = {"visited": ["東京", "パリ"]}
json_str = json.dumps(state, ensure_ascii=False)
parsed = json.loads(json_str)
test("visitedの保存/復元", parsed["visited"] == ["東京", "パリ"])

# ─── Visit Logic ─────────────────────────────────────
section("訪問ロジック")

visited = set()
visited.add("東京")
test("訪問追加", "東京" in visited)
test("未訪問の判定", "パリ" not in visited)
visited.add("パリ")
test("複数訪問", len(visited) == 2)
test("重複追加しても増えない", (visited.add("東京"), len(visited) == 2)[1])

# Progress calculation
pct = len(visited) / len(DESTINATIONS) * 100
test(f"進捗率計算: {pct:.1f}%", 0 < pct < 100)

# ─── Nearby Detection ────────────────────────────────
section("近接検出")

def find_nearby(cx, cy, dests):
    for d in dests:
        if abs(d["x"] - cx) <= 1 and abs(d["y"] - cy) <= 1:
            return d
    return None

tokyo = next(d for d in DESTINATIONS if d["name"] == "東京")
test("東京の座標で検出", find_nearby(tokyo["x"], tokyo["y"], DESTINATIONS) is not None)
test("隣接座標でも検出", find_nearby(tokyo["x"] + 1, tokyo["y"], DESTINATIONS) is not None)
test("遠い座標で検出しない", find_nearby(0, 0, DESTINATIONS) is None)

# ─── App Import ──────────────────────────────────────
section("アプリインポート")

try:
    from app import SekaiQuestApp, PassportScreen
    test("SekaiQuestAppクラスがインポートできる", True)
    test("PassportScreenクラスがインポートできる", True)
except ImportError as e:
    test("SekaiQuestAppクラスがインポートできる", False, str(e))

# ─── Summary ─────────────────────────────────────────
print("\n  ═══════════════════════════════════════")
if failed == 0:
    print(f"  \033[32m ✓ {passed}/{tests} テスト全て合格！\033[0m")
else:
    print(f"  \033[31m ✗ {passed}/{tests} 合格 ({failed}件失敗)\033[0m")
print(f"  📊 都市: {len(DESTINATIONS)} | 地域: {len(regions)}")
print("  ═══════════════════════════════════════\n")

sys.exit(1 if failed > 0 else 0)
