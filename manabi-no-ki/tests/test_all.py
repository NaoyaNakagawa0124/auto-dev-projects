#!/usr/bin/env python3
"""学びの木 テストスイート"""

import sys
import os
import json
import tempfile
from datetime import date, datetime

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

passed = 0
failed = 0


def suite(name):
    print(f"\n\033[33m  {name}\033[0m")


def check(name, condition):
    global passed, failed
    if condition:
        print(f"    \033[32m✓\033[0m {name}")
        passed += 1
    else:
        print(f"    \033[31m✗\033[0m {name}")
        failed += 1


print("\033[1m🌳 学びの木 テストスイート\033[0m")

# ===== Tree Tests =====
from src.tree import (
    get_tree_stage, get_tree_art, get_tree_name, get_next_milestone,
    get_progress_bar, get_subject_emoji, get_all_subjects, SUBJECTS, STAGES
)

suite("木の成長ステージ")

check("0分 → ステージ0", get_tree_stage(0) == 0)
check("1分 → ステージ1", get_tree_stage(1) == 1)
check("30分 → ステージ1", get_tree_stage(30) == 1)
check("31分 → ステージ2", get_tree_stage(31) == 2)
check("120分 → ステージ2", get_tree_stage(120) == 2)
check("121分 → ステージ3", get_tree_stage(121) == 3)
check("300分 → ステージ3", get_tree_stage(300) == 3)
check("301分 → ステージ4", get_tree_stage(301) == 4)
check("600分 → ステージ4", get_tree_stage(600) == 4)
check("601分 → ステージ5", get_tree_stage(601) == 5)
check("1200分 → ステージ5", get_tree_stage(1200) == 5)
check("1201分 → ステージ6", get_tree_stage(1201) == 6)
check("10000分 → ステージ6", get_tree_stage(10000) == 6)
check("負の値 → ステージ0", get_tree_stage(-10) == 0)

suite("木のASCIIアート")

check("全ステージにアートあり", len(STAGES) == 7)
for i in range(7):
    art = get_tree_art(i * 200)
    check(f"ステージ{i}: 行数 > 0", len(art) > 0)
    check(f"ステージ{i}: 各行は文字列", all(isinstance(line, str) for line in art))

check("高ステージほど行数が多い", len(STAGES[6]) > len(STAGES[0]))

suite("木の名前")

check("ステージ0: 種", get_tree_name(0) == "種")
check("ステージ1: 芽", get_tree_name(1) == "芽")
check("ステージ2: 苗木", get_tree_name(2) == "苗木")
check("ステージ3: 若木", get_tree_name(3) == "若木")
check("ステージ6: 巨木", get_tree_name(6) == "巨木")

suite("マイルストーン")

mins, desc = get_next_milestone(0)
check("0分: 次は30分", mins == 30)
check("0分: 芽が出る", "芽" in desc)

mins, desc = get_next_milestone(25)
check("25分: 次は30分", mins == 30)

mins, desc = get_next_milestone(50)
check("50分: 次は120分", mins == 120)

mins, desc = get_next_milestone(5000)
check("5000分: 達成メッセージ", mins == 0)

suite("プログレスバー")

check("0/100: 空", get_progress_bar(0, 100, 10) == "░" * 10)
check("100/100: 満", get_progress_bar(100, 100, 10) == "█" * 10)
check("50/100: 半分", get_progress_bar(50, 100, 10) == "█" * 5 + "░" * 5)
check("超過: 満", get_progress_bar(200, 100, 10) == "█" * 10)
check("0ターゲット: 満", get_progress_bar(0, 0, 10) == "█" * 10)

suite("科目データ")

subjects = get_all_subjects()
check("科目が9個以上", len(subjects) >= 9)
check("国語あり", "国語" in subjects)
check("算数あり", "算数" in subjects)
check("理科あり", "理科" in subjects)
check("社会あり", "社会" in subjects)
check("英語あり", "英語" in subjects)

for subj in subjects:
    emoji = get_subject_emoji(subj)
    check(f"{subj}: 絵文字あり", len(emoji) > 0)

check("不明科目: デフォルト絵文字", get_subject_emoji("プログラミング") == "📝")

for subj, info in SUBJECTS.items():
    check(f"{subj}: colorあり", "color" in info)
    check(f"{subj}: emojiあり", "emoji" in info)

# ===== Data Tests =====
from src import data as data_module

suite("データ層")

# Use temp dir for tests
_orig_dir = data_module.DATA_DIR
_orig_file = data_module.DATA_FILE
_tmp = tempfile.mkdtemp()
data_module.DATA_DIR = type(data_module.DATA_DIR)(_tmp)
data_module.DATA_FILE = data_module.DATA_DIR / "test-data.json"

try:
    # Clear
    data_module.clear_data()

    check("初期: 総分数0", data_module.get_total_minutes() == 0)
    check("初期: セッション数0", data_module.get_session_count() == 0)
    check("初期: 今日0分", data_module.get_today_minutes() == 0)
    check("初期: ストリーク0", data_module.get_streak() == 0)
    check("初期: 名前なし", data_module.get_child_name() == "")

    # Add session
    s = data_module.add_session("算数", 30, "足し算")
    check("セッション追加: subject", s["subject"] == "算数")
    check("セッション追加: minutes", s["minutes"] == 30)
    check("セッション追加: note", s["note"] == "足し算")
    check("セッション追加: date", s["date"] == date.today().isoformat())

    check("1件後: 総分数30", data_module.get_total_minutes() == 30)
    check("1件後: セッション数1", data_module.get_session_count() == 1)
    check("1件後: 今日30分", data_module.get_today_minutes() == 30)

    # Add more
    data_module.add_session("国語", 20)
    data_module.add_session("算数", 15)

    check("3件後: 総分数65", data_module.get_total_minutes() == 65)
    check("3件後: セッション数3", data_module.get_session_count() == 3)

    # By subject
    by_subj = data_module.get_minutes_by_subject()
    check("科目別: 算数45分", by_subj.get("算数") == 45)
    check("科目別: 国語20分", by_subj.get("国語") == 20)
    check("科目別: ソート(算数が先)", list(by_subj.keys())[0] == "算数")

    # Today sessions
    today = data_module.get_today_sessions()
    check("今日のセッション: 3件", len(today) == 3)

    # Weekly
    weekly = data_module.get_weekly_minutes()
    check("週間: 7日分", len(weekly) == 7)
    today_key = date.today().isoformat()
    check("週間: 今日65分", weekly.get(today_key) == 65)

    # Streak
    check("ストリーク: 1日", data_module.get_streak() == 1)

    # Child name
    data_module.set_child_name("たろう")
    check("名前設定", data_module.get_child_name() == "たろう")

    # Persistence
    loaded = data_module.load_data()
    check("永続化: sessions", len(loaded["sessions"]) == 3)
    check("永続化: child_name", loaded["child_name"] == "たろう")

    # Clear
    data_module.clear_data()
    check("クリア後: 0", data_module.get_total_minutes() == 0)

finally:
    # Restore
    data_module.DATA_DIR = _orig_dir
    data_module.DATA_FILE = _orig_file
    import shutil
    shutil.rmtree(_tmp, ignore_errors=True)

# ===== Integration Tests =====
suite("統合テスト")

# Tree stage changes with learning
check("0分: 種ステージ", get_tree_stage(0) == 0 and get_tree_name(0) == "種")
check("30分学習後: 芽", get_tree_stage(30) == 1 and get_tree_name(1) == "芽")
check("300分学習後: 若木", get_tree_stage(300) == 3 and get_tree_name(3) == "若木")

# Milestone tracking works with tree
total = 25
next_m, _ = get_next_milestone(total)
check("マイルストーン到達前", total < next_m)
stage_before = get_tree_stage(total)
# Milestone is at 30 (boundary of stage 1), stage 2 starts at 31
stage_after = get_tree_stage(next_m + 1)
check("マイルストーン超過でステージUP", stage_after > stage_before)

# ===== Summary =====
total_tests = passed + failed
print(f"\n{'─' * 40}")
if failed == 0:
    print(f"\033[32m✓ {passed}/{total_tests} テスト全て通過\033[0m")
else:
    print(f"\033[31m✗ {failed}/{total_tests} テスト失敗\033[0m")

sys.exit(1 if failed > 0 else 0)
