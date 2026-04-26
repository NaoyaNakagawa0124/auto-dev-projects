"""学びの木 — ASCII Tree Generator"""

STAGES = [
    # Stage 0: Seed (0 minutes total)
    [
        "      ",
        "  🌱  ",
        " ───── ",
    ],
    # Stage 1: Sprout (1-30 min)
    [
        "   |   ",
        "  \\|/  ",
        "   |   ",
        " ───── ",
    ],
    # Stage 2: Sapling (31-120 min)
    [
        "   🌿  ",
        "  \\|/  ",
        "  \\|/  ",
        "   |   ",
        "   |   ",
        " ───── ",
    ],
    # Stage 3: Young tree (121-300 min)
    [
        "   🌿🌿  ",
        "  \\🌿/  ",
        " \\ | /  ",
        "  \\|/   ",
        "   |    ",
        "   |    ",
        " ────── ",
    ],
    # Stage 4: Growing tree (301-600 min)
    [
        "    🌸    ",
        "  🌿🌿🌿  ",
        " 🌿\\|/🌿 ",
        "  \\ | /  ",
        "   \\|/   ",
        "    |    ",
        "    |    ",
        "   /|\\   ",
        " ──────── ",
    ],
    # Stage 5: Full tree (601-1200 min)
    [
        "     🌸🌸     ",
        "   🌿🌸🌿🌸   ",
        "  🌿🌿🌿🌿🌿  ",
        "  🌿\\🌿/🌿  ",
        "   \\ | /   ",
        "    \\|/    ",
        "     |     ",
        "     |     ",
        "    /|\\    ",
        "   / | \\   ",
        " ────────── ",
    ],
    # Stage 6: Magnificent tree (1200+ min)
    [
        "      🌸🌸🌸      ",
        "    🌸🌿🌸🌿🌸    ",
        "   🌿🌸🌿🌸🌿🌸   ",
        "  🌿🌿🌿🌿🌿🌿🌿  ",
        "  🌿🌿\\🌿/🌿🌿  ",
        "   🌿\\ | /🌿   ",
        "     \\|/     ",
        "      |      ",
        "      |      ",
        "     /|\\     ",
        "    / | \\    ",
        "   /  |  \\   ",
        " ──────────── ",
    ],
]


def get_tree_stage(total_minutes: int) -> int:
    """Get tree stage (0-6) based on total learning minutes."""
    if total_minutes <= 0:
        return 0
    if total_minutes <= 30:
        return 1
    if total_minutes <= 120:
        return 2
    if total_minutes <= 300:
        return 3
    if total_minutes <= 600:
        return 4
    if total_minutes <= 1200:
        return 5
    return 6


def get_tree_art(total_minutes: int) -> list[str]:
    """Get ASCII art lines for the current tree stage."""
    stage = get_tree_stage(total_minutes)
    return STAGES[stage]


def get_tree_name(stage: int) -> str:
    """Get the name of the tree at each stage."""
    names = ["種", "芽", "苗木", "若木", "成長中", "大木", "巨木"]
    return names[min(stage, len(names) - 1)]


def get_next_milestone(total_minutes: int) -> tuple[int, str]:
    """Get the next milestone (minutes, description)."""
    milestones = [
        (30, "🌱 芽が出る"),
        (120, "🌿 苗木になる"),
        (300, "🌳 若木になる"),
        (600, "🌸 花が咲く"),
        (1200, "🌳 大木になる"),
        (2400, "🏆 巨木の完成"),
    ]
    for mins, desc in milestones:
        if total_minutes < mins:
            return mins, desc
    return 0, "🏆 最大成長達成！"


def get_progress_bar(current: int, target: int, width: int = 20) -> str:
    """Generate a progress bar string."""
    if target <= 0:
        return "█" * width
    ratio = min(current / target, 1.0)
    filled = int(ratio * width)
    return "█" * filled + "░" * (width - filled)


# Subject colors and emojis
SUBJECTS = {
    "国語": {"emoji": "📖", "color": "red"},
    "算数": {"emoji": "🔢", "color": "blue"},
    "理科": {"emoji": "🔬", "color": "green"},
    "社会": {"emoji": "🌍", "color": "yellow"},
    "英語": {"emoji": "🇬🇧", "color": "purple"},
    "音楽": {"emoji": "🎵", "color": "cyan"},
    "体育": {"emoji": "⚽", "color": "orange"},
    "図工": {"emoji": "🎨", "color": "magenta"},
    "その他": {"emoji": "📝", "color": "white"},
}


def get_subject_emoji(subject: str) -> str:
    """Get emoji for a subject."""
    return SUBJECTS.get(subject, SUBJECTS["その他"])["emoji"]


def get_all_subjects() -> list[str]:
    """Get list of all available subjects."""
    return list(SUBJECTS.keys())
