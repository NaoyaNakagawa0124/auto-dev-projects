"""NestPlan JSON file I/O."""

from __future__ import annotations

import json
from pathlib import Path

from .models import Plan


DEFAULT_FILENAME = "nestplan.json"


def save_plan(plan: Plan, filepath: str | Path | None = None) -> Path:
    path = Path(filepath) if filepath else Path(DEFAULT_FILENAME)
    data = plan.to_dict()
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def load_plan(filepath: str | Path) -> Plan:
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"Plan file not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return Plan.from_dict(data)


def plan_exists(filepath: str | Path | None = None) -> bool:
    path = Path(filepath) if filepath else Path(DEFAULT_FILENAME)
    return path.exists()
