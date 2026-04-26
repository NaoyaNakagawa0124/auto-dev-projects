#!/usr/bin/env python3
"""学びの木 — CLI インターフェース"""

import sys
import os

# Add parent to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from src.tree import (
    get_tree_art, get_tree_stage, get_tree_name, get_next_milestone,
    get_progress_bar, get_subject_emoji, get_all_subjects, SUBJECTS
)
from src.data import (
    add_session, get_total_minutes, get_minutes_by_subject,
    get_today_minutes, get_today_sessions, get_weekly_minutes,
    get_streak, get_session_count, get_child_name, set_child_name, clear_data
)

# ANSI colors
R = "\033[0m"
B = "\033[1m"
D = "\033[2m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
CYAN = "\033[36m"
MAGENTA = "\033[35m"
RED = "\033[31m"
GRAY = "\033[90m"


def banner():
    print()
    print(f"{GREEN}  ┌──────────────────────────┐{R}")
    print(f"{GREEN}  │{R} {B}🌳 学びの木{R}              {GREEN}│{R}")
    print(f"{GREEN}  │{R} {D}子どもの学習で育つ木{R}     {GREEN}│{R}")
    print(f"{GREEN}  └──────────────────────────┘{R}")
    print()


def cmd_status():
    """Show tree and status."""
    banner()
    total = get_total_minutes()
    stage = get_tree_stage(total)
    name = get_tree_name(stage)
    streak = get_streak()
    today = get_today_minutes()
    sessions = get_session_count()
    child = get_child_name()

    # Tree art
    art = get_tree_art(total)
    for line in art:
        print(f"  {line}")
    print()

    # Status
    if child:
        print(f"  {B}{child}の木{R} — {YELLOW}{name}{R}")
    else:
        print(f"  {YELLOW}{name}{R}")
    print(f"  {D}総学習時間: {GREEN}{total}分{R}{D} ・ セッション: {sessions}回 ・ 連続: {streak}日{R}")
    print(f"  {D}今日: {CYAN}{today}分{R}")

    # Next milestone
    next_mins, next_desc = get_next_milestone(total)
    if next_mins > 0:
        progress = get_progress_bar(total, next_mins, 20)
        print(f"\n  {D}次のマイルストーン: {next_desc}{R}")
        print(f"  {GREEN}{progress}{R} {total}/{next_mins}分")

    # Subject breakdown
    by_subject = get_minutes_by_subject()
    if by_subject:
        print(f"\n  {B}科目別{R}")
        max_mins = max(by_subject.values()) if by_subject else 1
        for subj, mins in list(by_subject.items())[:8]:
            emoji = get_subject_emoji(subj)
            bar = get_progress_bar(mins, max_mins, 15)
            print(f"  {emoji} {subj:<6} {GREEN}{bar}{R} {mins}分")
    print()


def cmd_log(subject, minutes, note=""):
    """Log a learning session."""
    if subject not in get_all_subjects():
        print(f"  {RED}不明な科目: {subject}{R}")
        print(f"  {D}利用可能: {', '.join(get_all_subjects())}{R}")
        return

    if minutes <= 0:
        print(f"  {RED}時間は1分以上を指定してください{R}")
        return

    before = get_total_minutes()
    session = add_session(subject, minutes, note)
    after = get_total_minutes()

    emoji = get_subject_emoji(subject)
    banner()
    print(f"  {GREEN}✓ 学習を記録しました！{R}")
    print(f"  {emoji} {B}{subject}{R} — {CYAN}{minutes}分{R}")
    if note:
        print(f"  {D}メモ: {note}{R}")

    # Check milestone
    before_stage = get_tree_stage(before)
    after_stage = get_tree_stage(after)
    if after_stage > before_stage:
        name = get_tree_name(after_stage)
        print(f"\n  {YELLOW}🎉 おめでとう！木が成長して「{name}」になりました！{R}")
        art = get_tree_art(after)
        print()
        for line in art:
            print(f"  {line}")

    print()


def cmd_stats():
    """Show weekly stats."""
    banner()
    weekly = get_weekly_minutes()
    print(f"  {B}📊 週間レポート{R}")
    print()

    max_day = max(weekly.values()) if weekly and max(weekly.values()) > 0 else 1
    for date_str, mins in sorted(weekly.items()):
        parts = date_str.split("-")
        label = f"{parts[1]}/{parts[2]}"
        bar = get_progress_bar(mins, max_day, 15)
        marker = " ← 今日" if date_str == sorted(weekly.keys())[-1] else ""
        print(f"  {label} {GREEN}{bar}{R} {mins}分{D}{marker}{R}")

    total = sum(weekly.values())
    days = sum(1 for v in weekly.values() if v > 0)
    avg = total / days if days > 0 else 0
    print(f"\n  {D}今週の合計: {CYAN}{total}分{R}{D} ・ 平均: {avg:.0f}分/日 ・ 学習日: {days}日{R}")
    print()


def cmd_subjects():
    """List available subjects."""
    banner()
    print(f"  {B}📚 利用可能な科目{R}")
    print()
    for subj, info in SUBJECTS.items():
        print(f"  {info['emoji']} {subj}")
    print()
    print(f"  {D}使い方: python3 src/cli.py log <科目> <分>{R}")
    print()


def cmd_name(name):
    """Set child's name."""
    set_child_name(name)
    banner()
    print(f"  {GREEN}✓ 名前を「{name}」に設定しました！{R}")
    print()


def cmd_help():
    """Show help."""
    banner()
    print(f"  {B}コマンド{R}")
    print()
    print(f"  {CYAN}status{R}              木の状態を表示")
    print(f"  {CYAN}log{R} <科目> <分>     学習を記録")
    print(f"  {CYAN}stats{R}               週間レポート")
    print(f"  {CYAN}subjects{R}            科目一覧")
    print(f"  {CYAN}name{R} <名前>         子どもの名前を設定")
    print(f"  {CYAN}help{R}                このヘルプ")
    print()
    print(f"  {D}例: python3 src/cli.py log 算数 30{R}")
    print(f"  {D}例: python3 src/cli.py log 国語 20 漢字ドリル{R}")
    print()


def main():
    args = sys.argv[1:]
    if not args:
        cmd_status()
        return

    cmd = args[0]
    if cmd == "status":
        cmd_status()
    elif cmd == "log":
        if len(args) < 3:
            print(f"  {RED}使い方: cli.py log <科目> <分> [メモ]{R}")
            return
        subject = args[1]
        try:
            minutes = int(args[2])
        except ValueError:
            print(f"  {RED}分数は数字で指定してください{R}")
            return
        note = " ".join(args[3:]) if len(args) > 3 else ""
        cmd_log(subject, minutes, note)
    elif cmd == "stats":
        cmd_stats()
    elif cmd == "subjects":
        cmd_subjects()
    elif cmd == "name":
        if len(args) < 2:
            print(f"  {RED}名前を指定してください{R}")
            return
        cmd_name(args[1])
    elif cmd in ("help", "--help", "-h"):
        cmd_help()
    else:
        print(f"  {RED}不明なコマンド: {cmd}{R}")
        cmd_help()


if __name__ == "__main__":
    main()
