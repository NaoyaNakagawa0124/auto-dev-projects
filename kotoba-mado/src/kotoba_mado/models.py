"""Domain models for kotoba-mado."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import date
from typing import Iterable

from .categories import CATEGORY_KEYS


@dataclass(frozen=True)
class Session:
    """One learning session."""
    date: str        # ISO date "YYYY-MM-DD"
    language: str    # 2-letter code, lowercase
    category: str    # one of CATEGORY_KEYS
    minutes: int     # >= 0
    note: str = ""

    def __post_init__(self):
        # frozen dataclass — use object.__setattr__ for normalization
        if not isinstance(self.minutes, int):
            object.__setattr__(self, "minutes", int(self.minutes))
        if self.minutes < 0:
            object.__setattr__(self, "minutes", 0)
        if self.category not in CATEGORY_KEYS:
            raise ValueError(f"unknown category: {self.category!r}")
        # validate date
        date.fromisoformat(self.date)
        object.__setattr__(self, "language", (self.language or "").lower()[:8])
        object.__setattr__(self, "note", (self.note or "").strip()[:200])

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "Session":
        return cls(
            date=d["date"],
            language=d.get("language", ""),
            category=d["category"],
            minutes=int(d.get("minutes", 0)),
            note=d.get("note", ""),
        )


@dataclass
class Log:
    version: int = 1
    sessions: list[Session] = field(default_factory=list)

    def add(self, s: Session) -> None:
        self.sessions.append(s)

    def extend(self, sessions: Iterable[Session]) -> None:
        for s in sessions:
            self.add(s)

    def to_dict(self) -> dict:
        return {
            "version": self.version,
            "sessions": [s.to_dict() for s in self.sessions],
        }

    @classmethod
    def from_dict(cls, d: dict | None) -> "Log":
        if not d:
            return cls()
        return cls(
            version=int(d.get("version", 1)),
            sessions=[Session.from_dict(x) for x in d.get("sessions", [])],
        )
