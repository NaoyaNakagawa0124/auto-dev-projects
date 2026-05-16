"""Domain models for futari-yoho."""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import date
from typing import Optional


PARTNER_IDS = ("a", "b")


def clamp_scale(v: int) -> int:
    """Clamp a 1-5 scale value, with 0 meaning "not answered"."""
    try:
        n = int(v)
    except (TypeError, ValueError):
        return 0
    if n < 0:
        return 0
    if n > 5:
        return 5
    return n


@dataclass
class Partner:
    id: str
    name: str = ""
    accent: str = "moon"  # palette key

    def __post_init__(self):
        if self.id not in PARTNER_IDS:
            raise ValueError(f"partner id must be one of {PARTNER_IDS}")


@dataclass
class CheckIn:
    """One partner's daily check-in. Scales are 1-5; 0 means unanswered."""
    mood: int = 0       # 1 (重い) 〜 5 (晴れ)
    energy: int = 0     # 1 (空っぽ) 〜 5 (満ちている)
    solo_want: int = 0  # 1 (一緒にいたい) 〜 5 (一人になりたい)
    note: str = ""

    def __post_init__(self):
        self.mood = clamp_scale(self.mood)
        self.energy = clamp_scale(self.energy)
        self.solo_want = clamp_scale(self.solo_want)
        self.note = (self.note or "").strip()[:140]

    @property
    def answered(self) -> bool:
        return self.mood > 0 and self.energy > 0 and self.solo_want > 0

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict | None) -> Optional["CheckIn"]:
        if d is None:
            return None
        return cls(
            mood=d.get("mood", 0),
            energy=d.get("energy", 0),
            solo_want=d.get("solo_want", 0),
            note=d.get("note", ""),
        )


@dataclass
class Day:
    """A single date's check-ins for both partners."""
    date_iso: str
    a: Optional[CheckIn] = None
    b: Optional[CheckIn] = None

    def get(self, partner_id: str) -> Optional[CheckIn]:
        return self.a if partner_id == "a" else self.b

    def set(self, partner_id: str, c: CheckIn) -> None:
        if partner_id == "a":
            self.a = c
        elif partner_id == "b":
            self.b = c
        else:
            raise ValueError(partner_id)

    def to_dict(self) -> dict:
        out: dict = {}
        if self.a:
            out["a"] = self.a.to_dict()
        if self.b:
            out["b"] = self.b.to_dict()
        return out

    @classmethod
    def from_dict(cls, date_iso: str, d: dict) -> "Day":
        return cls(
            date_iso=date_iso,
            a=CheckIn.from_dict(d.get("a")),
            b=CheckIn.from_dict(d.get("b")),
        )


@dataclass
class State:
    version: int = 1
    partners: dict[str, Partner] = field(default_factory=lambda: {
        "a": Partner(id="a", name="あ", accent="amber"),
        "b": Partner(id="b", name="い", accent="moon"),
    })
    days: dict[str, Day] = field(default_factory=dict)

    def day(self, d: date | str) -> Day:
        key = d if isinstance(d, str) else d.isoformat()
        if key not in self.days:
            self.days[key] = Day(date_iso=key)
        return self.days[key]

    def record(self, partner_id: str, d: date | str, check: CheckIn) -> None:
        self.day(d).set(partner_id, check)

    def to_dict(self) -> dict:
        return {
            "version": self.version,
            "partners": {pid: asdict(p) for pid, p in self.partners.items()},
            "days": {k: v.to_dict() for k, v in self.days.items()},
        }

    @classmethod
    def from_dict(cls, d: dict) -> "State":
        partners = {
            pid: Partner(**pdict)
            for pid, pdict in (d.get("partners") or {}).items()
            if pid in PARTNER_IDS
        }
        days = {k: Day.from_dict(k, v) for k, v in (d.get("days") or {}).items()}
        s = cls(version=int(d.get("version", 1)))
        if partners:
            s.partners.update(partners)
        s.days = days
        return s
