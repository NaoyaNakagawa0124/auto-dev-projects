"""KidLog data store with JSON file persistence."""
import json
import os
from datetime import datetime, date, timedelta
from pathlib import Path

DATA_FILE = Path.home() / ".kidlog_data.json"

CATEGORIES = [
    {"id": "motor", "name": "運動", "emoji": "🏃"},
    {"id": "language", "name": "ことば", "emoji": "💬"},
    {"id": "food", "name": "食事", "emoji": "🍽️"},
    {"id": "sleep", "name": "睡眠", "emoji": "😴"},
    {"id": "play", "name": "遊び", "emoji": "🎮"},
    {"id": "first", "name": "初めて", "emoji": "⭐"},
    {"id": "health", "name": "健康", "emoji": "💊"},
    {"id": "social", "name": "社会性", "emoji": "👫"},
    {"id": "other", "name": "その他", "emoji": "📝"},
]

REACTIONS = ["❤️", "😂", "😢", "🎉", "💪", "🌟"]

def get_category(cat_id):
    """Get category by ID."""
    for c in CATEGORIES:
        if c["id"] == cat_id:
            return c
    return {"id": cat_id, "name": cat_id, "emoji": "📝"}


def load_data(filepath=None):
    """Load data from JSON file."""
    path = filepath or DATA_FILE
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"entries": [], "streak_last_date": None, "streak_count": 0, "longest_streak": 0}


def save_data(data, filepath=None):
    """Save data to JSON file."""
    path = filepath or DATA_FILE
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_entry(data, text, category="other", child_name=""):
    """Add a new entry to the data store."""
    entry = {
        "id": datetime.now().strftime("%Y%m%d%H%M%S") + str(len(data["entries"])),
        "text": text,
        "category": category,
        "child_name": child_name,
        "reactions": [],
        "created_at": datetime.now().isoformat(),
        "date": date.today().isoformat(),
    }
    data["entries"].insert(0, entry)  # newest first
    _update_streak(data)
    return entry


def add_reaction(data, entry_id, reaction):
    """Add a reaction emoji to an entry."""
    for entry in data["entries"]:
        if entry["id"] == entry_id:
            if reaction not in entry["reactions"]:
                entry["reactions"].append(reaction)
            return True
    return False


def delete_entry(data, entry_id):
    """Delete an entry by ID."""
    data["entries"] = [e for e in data["entries"] if e["id"] != entry_id]


def _update_streak(data):
    """Update the streak counter."""
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    if data["streak_last_date"] == today:
        return  # already logged today
    elif data["streak_last_date"] == yesterday or data["streak_last_date"] is None:
        data["streak_count"] = data.get("streak_count", 0) + 1
    else:
        data["streak_count"] = 1

    data["streak_last_date"] = today
    data["longest_streak"] = max(data.get("longest_streak", 0), data["streak_count"])


def get_stats(data):
    """Compute statistics from entries."""
    entries = data["entries"]
    total = len(entries)

    # Category counts
    cat_counts = {}
    for e in entries:
        cat = e.get("category", "other")
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    # Monthly counts
    month_counts = {}
    for e in entries:
        month = e.get("date", "")[:7]  # YYYY-MM
        if month:
            month_counts[month] = month_counts.get(month, 0) + 1

    # Reaction counts
    reaction_counts = {}
    for e in entries:
        for r in e.get("reactions", []):
            reaction_counts[r] = reaction_counts.get(r, 0) + 1

    # Days with entries
    days = set(e.get("date", "") for e in entries if e.get("date"))

    return {
        "total": total,
        "days_active": len(days),
        "streak": data.get("streak_count", 0),
        "longest_streak": data.get("longest_streak", 0),
        "category_counts": cat_counts,
        "month_counts": month_counts,
        "reaction_counts": reaction_counts,
    }


def get_entries_by_date(data, date_str):
    """Get entries for a specific date."""
    return [e for e in data["entries"] if e.get("date") == date_str]


def search_entries(data, query):
    """Search entries by text."""
    q = query.lower()
    return [e for e in data["entries"] if q in e.get("text", "").lower()]
