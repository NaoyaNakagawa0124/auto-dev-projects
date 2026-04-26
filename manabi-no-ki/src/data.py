"""学びの木 — Data Layer (JSON file storage)"""

import json
import os
from datetime import datetime, date
from pathlib import Path
from typing import Optional


DATA_DIR = Path.home() / ".manabi-no-ki"
DATA_FILE = DATA_DIR / "data.json"


def _ensure_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_data() -> dict:
    """Load all data from JSON file."""
    _ensure_dir()
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"sessions": [], "child_name": ""}


def save_data(data: dict):
    """Save all data to JSON file."""
    _ensure_dir()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_session(subject: str, minutes: int, note: str = "") -> dict:
    """Add a learning session."""
    data = load_data()
    session = {
        "subject": subject,
        "minutes": minutes,
        "note": note,
        "date": date.today().isoformat(),
        "timestamp": datetime.now().isoformat(),
    }
    data["sessions"].append(session)
    save_data(data)
    return session


def get_total_minutes() -> int:
    """Get total learning minutes across all sessions."""
    data = load_data()
    return sum(s["minutes"] for s in data["sessions"])


def get_minutes_by_subject() -> dict[str, int]:
    """Get total minutes per subject."""
    data = load_data()
    result: dict[str, int] = {}
    for s in data["sessions"]:
        result[s["subject"]] = result.get(s["subject"], 0) + s["minutes"]
    return dict(sorted(result.items(), key=lambda x: x[1], reverse=True))


def get_today_minutes() -> int:
    """Get today's total learning minutes."""
    data = load_data()
    today = date.today().isoformat()
    return sum(s["minutes"] for s in data["sessions"] if s["date"] == today)


def get_today_sessions() -> list[dict]:
    """Get today's sessions."""
    data = load_data()
    today = date.today().isoformat()
    return [s for s in data["sessions"] if s["date"] == today]


def get_weekly_minutes() -> dict[str, int]:
    """Get minutes per day for the last 7 days."""
    data = load_data()
    result: dict[str, int] = {}
    today = date.today()
    for i in range(7):
        d = date.fromordinal(today.toordinal() - i)
        key = d.isoformat()
        result[key] = sum(s["minutes"] for s in data["sessions"] if s["date"] == key)
    return result


def get_streak() -> int:
    """Get consecutive days with learning sessions."""
    data = load_data()
    if not data["sessions"]:
        return 0

    dates_with_sessions = set(s["date"] for s in data["sessions"])
    today = date.today()
    streak = 0
    for i in range(365):
        d = date.fromordinal(today.toordinal() - i)
        if d.isoformat() in dates_with_sessions:
            streak += 1
        elif i > 0:
            break
    return streak


def get_session_count() -> int:
    """Get total number of sessions."""
    return len(load_data()["sessions"])


def get_child_name() -> str:
    """Get the child's name."""
    return load_data().get("child_name", "")


def set_child_name(name: str):
    """Set the child's name."""
    data = load_data()
    data["child_name"] = name
    save_data(data)


def clear_data():
    """Clear all data (for testing)."""
    save_data({"sessions": [], "child_name": ""})
