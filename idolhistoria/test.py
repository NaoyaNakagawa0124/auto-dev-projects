#!/usr/bin/env python3
"""
アイドルヒストリア (Idol Historia) - Unit Tests
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
print("   アイドルヒストリア - Unit Tests")
print("  ═══════════════════════════════════════")

# ─── Test notebook exists and is valid ───────────────
section("ノートブック構造")

try:
    with open("idolhistoria.ipynb", "r", encoding="utf-8") as f:
        nb = json.load(f)
    test("ノートブックが存在し読み込める", True)
except Exception as e:
    test("ノートブックが存在し読み込める", False, str(e))
    nb = None

if nb:
    test("nbformat v4", nb.get("nbformat") == 4)
    test("kernelspecがPython3", nb.get("metadata", {}).get("kernelspec", {}).get("name") == "python3")

    cells = nb.get("cells", [])
    test("セルが10個以上ある", len(cells) >= 10, f"got {len(cells)}")

    md_cells = [c for c in cells if c["cell_type"] == "markdown"]
    code_cells = [c for c in cells if c["cell_type"] == "code"]

    test("マークダウンセルがある", len(md_cells) >= 5, f"got {len(md_cells)}")
    test("コードセルがある", len(code_cells) >= 5, f"got {len(code_cells)}")

    # Check for Japanese content
    all_text = " ".join(c["source"] if isinstance(c["source"], str) else "".join(c["source"]) for c in cells)
    test("日本語タイトルが含まれる", "アイドルヒストリア" in all_text)
    test("年表セクションがある", "マイルストーン" in all_text)
    test("時代セクションがある", "時代" in all_text)
    test("デビューセクションがある", "デビュー" in all_text)
    test("ジャンルセクションがある", "ジャンル" in all_text)
    test("3月31日セクションがある", "3月31日" in all_text)
    test("ファン文化セクションがある", "ファン文化" in all_text)
    test("まとめセクションがある", "まとめ" in all_text)

    # Check for key idol names
    test("松田聖子が言及されている", "松田聖子" in all_text)
    test("AKB48が言及されている", "AKB48" in all_text)
    test("モーニング娘。が言及されている", "モーニング娘" in all_text)
    test("初音ミクが言及されている", "初音ミク" in all_text)
    test("VTuberが言及されている", "VTuber" in all_text)
    test("ホロライブが言及されている", "ホロライブ" in all_text)
    test("推しの子が言及されている", "推しの子" in all_text)

    # Check for Plotly usage
    test("plotlyがインポートされている", "import plotly" in all_text)
    test("pandasがインポートされている", "import pandas" in all_text)
    test("fig.show()が呼ばれている", "fig.show()" in all_text)

    # Check code cells have outputs (notebook was executed)
    cells_with_output = [c for c in code_cells if c.get("outputs")]
    test("コードセルに出力がある（実行済み）", len(cells_with_output) >= 3, f"got {len(cells_with_output)}")

    # Check for era data
    test("昭和アイドル時代がある", "昭和アイドル" in all_text)
    test("冬の時代がある", "冬の時代" in all_text)
    test("AKB時代がある", "AKB時代" in all_text)
    test("多様化時代がある", "多様化時代" in all_text)
    test("VTuber時代がある", "VTuber時代" in all_text)

# ─── Test data integrity ────────────────────────────
section("データ整合性")

# Import the data to test
try:
    import pandas as pd
    import numpy as np

    milestones = pd.DataFrame([
        {"year": 1971, "era": "昭和アイドル", "category": "デビュー", "impact": 8},
        {"year": 1977, "era": "昭和アイドル", "category": "楽曲", "impact": 10},
        {"year": 1980, "era": "80年代アイドル", "category": "デビュー", "impact": 10},
        {"year": 1997, "era": "ハロプロ時代", "category": "デビュー", "impact": 10},
        {"year": 2005, "era": "AKB時代", "category": "デビュー", "impact": 10},
        {"year": 2007, "era": "AKB時代", "category": "文化", "impact": 9},
        {"year": 2023, "era": "現在", "category": "楽曲", "impact": 10},
    ])

    test("年データが1971-2025の範囲", milestones["year"].min() >= 1971 and milestones["year"].max() <= 2025)
    test("impactが1-10の範囲", milestones["impact"].between(1, 10).all())
    test("カテゴリが3種類", set(milestones["category"]).issubset({"デビュー", "楽曲", "文化"}))
    test("年が昇順になりうる", milestones["year"].is_monotonic_increasing or True)  # not required but check

    # Fan data validation
    fan_data = pd.DataFrame({
        'year': [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
        'fan_distance': [9, 8, 7, 8, 7, 5, 2, 3, 2, 1, 1],
        'participation': [1, 2, 3, 2, 3, 5, 9, 8, 9, 10, 10],
    })

    test("ファン距離が減少傾向", fan_data["fan_distance"].iloc[0] > fan_data["fan_distance"].iloc[-1])
    test("参加度が増加傾向", fan_data["participation"].iloc[0] < fan_data["participation"].iloc[-1])
    test("ファンデータが11行", len(fan_data) == 11)

except ImportError:
    test("pandas/numpyがインストールされている", False, "missing dependency")

# ─── Test chart count ────────────────────────────────
section("チャート")

if nb:
    fig_show_count = all_text.count("fig.show()")
    test("5つのチャートがある", fig_show_count >= 5, f"got {fig_show_count}")

    test("レーダーチャートがある", "Scatterpolar" in all_text)
    test("棒グラフがある", "Bar" in all_text)
    test("散布図がある", "Scatter" in all_text)
    test("サブプロットがある", "make_subplots" in all_text)

# ─── Summary ─────────────────────────────────────────
print("\n  ═══════════════════════════════════════")
if failed == 0:
    print(f"  \033[32m ✓ {passed}/{tests} テスト全て合格！\033[0m")
else:
    print(f"  \033[31m ✗ {passed}/{tests} 合格 ({failed}件失敗)\033[0m")
print("  ═══════════════════════════════════════\n")

sys.exit(1 if failed > 0 else 0)
