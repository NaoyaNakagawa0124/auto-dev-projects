"""Domain models for meme-fuda."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Optional


def _now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


@dataclass
class Card:
    template_id: str
    top: str = ""
    bottom: str = ""
    speaker: str = ""
    writer: str = ""
    tags: list[str] = field(default_factory=list)
    created_at: str = field(default_factory=_now_iso)
    id: str = field(default_factory=_new_id)

    def __post_init__(self):
        self.top = (self.top or "").strip()[:40]
        self.bottom = (self.bottom or "").strip()[:40]
        self.speaker = (self.speaker or "").strip()[:24]
        self.writer = (self.writer or "").strip()[:24]
        self.tags = [t.strip()[:20] for t in (self.tags or []) if t and t.strip()]

    @property
    def empty(self) -> bool:
        return not self.top and not self.bottom

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "Card":
        return cls(
            template_id=d["template_id"],
            top=d.get("top", ""),
            bottom=d.get("bottom", ""),
            speaker=d.get("speaker", ""),
            writer=d.get("writer", ""),
            tags=list(d.get("tags") or []),
            created_at=d.get("created_at") or _now_iso(),
            id=d.get("id") or _new_id(),
        )


@dataclass
class Deck:
    version: int = 1
    cards: list[Card] = field(default_factory=list)

    def add(self, card: Card) -> None:
        self.cards.append(card)

    def remove(self, card_id: str) -> bool:
        before = len(self.cards)
        self.cards = [c for c in self.cards if c.id != card_id]
        return len(self.cards) != before

    def replace(self, card: Card) -> bool:
        for i, c in enumerate(self.cards):
            if c.id == card.id:
                self.cards[i] = card
                return True
        return False

    def find(self, card_id: str) -> Optional[Card]:
        for c in self.cards:
            if c.id == card_id:
                return c
        return None

    def to_dict(self) -> dict:
        return {
            "version": self.version,
            "cards": [c.to_dict() for c in self.cards],
        }

    @classmethod
    def from_dict(cls, d: dict | None) -> "Deck":
        if not d:
            return cls()
        return cls(
            version=int(d.get("version", 1)),
            cards=[Card.from_dict(x) for x in d.get("cards", [])],
        )
