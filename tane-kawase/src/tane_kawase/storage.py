"""Atomic JSON I/O for field and packets."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .models import Field, Packet


def default_field_path() -> Path:
    return Path.home() / ".tane-kawase" / "field.json"


def load_field(path: Path | None = None) -> Field:
    p = path or default_field_path()
    if not p.exists():
        return Field()
    try:
        raw = json.loads(p.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return Field()
    return Field.from_dict(raw)


def save_field(field: Field, path: Path | None = None) -> Path:
    p = path or default_field_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(field.to_dict(), ensure_ascii=False, indent=2)
    fd, tmp = tempfile.mkstemp(prefix=".tane-kawase.", suffix=".tmp", dir=str(p.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
        os.replace(tmp, p)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
    return p


def read_packet(path: Path) -> Packet:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    return Packet.from_dict(raw)


def write_packet(packet: Packet, path: Path) -> Path:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(
        json.dumps(packet.to_dict(), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return p
