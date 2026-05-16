"""Domain models for tane-kawase."""

from __future__ import annotations

import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Iterable, Optional

from .topics import BY_KEY


def _now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _new_id() -> str:
    return uuid.uuid4().hex[:12]


@dataclass
class Seed:
    """One word/phrase. `gloss` is the meaning in the receiver's language."""
    term: str                  # the foreign-language word/phrase
    gloss: str = ""            # meaning / translation
    reading: str = ""          # ruby / pronunciation
    example: str = ""          # one example sentence
    note: str = ""             # optional sender note
    id: str = field(default_factory=_new_id)

    def __post_init__(self):
        self.term = (self.term or "").strip()[:80]
        self.gloss = (self.gloss or "").strip()[:120]
        self.reading = (self.reading or "").strip()[:80]
        self.example = (self.example or "").strip()[:240]
        self.note = (self.note or "").strip()[:240]
        if not self.term:
            raise ValueError("Seed.term must not be empty")

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "Seed":
        return cls(
            term=d["term"],
            gloss=d.get("gloss", ""),
            reading=d.get("reading", ""),
            example=d.get("example", ""),
            note=d.get("note", ""),
            id=d.get("id") or _new_id(),
        )


@dataclass
class Packet:
    """One bundle of seeds, sender → receiver."""
    name: str                  # the packet's title (e.g. "秋の慣用句")
    topic: str                 # one of topics.BY_KEY
    sender: str = ""           # sender's display name
    receiver: str = ""         # receiver's display name (optional)
    language: str = ""         # target language code (en, fr, ja, ...)
    seeds: list[Seed] = field(default_factory=list)
    letter: str = ""           # optional 1-2 line letter
    created_at: str = field(default_factory=_now_iso)
    id: str = field(default_factory=_new_id)

    def __post_init__(self):
        self.name = (self.name or "").strip()[:60]
        if not self.name:
            raise ValueError("Packet.name must not be empty")
        if self.topic not in BY_KEY:
            raise ValueError(f"Packet.topic must be one of {sorted(BY_KEY)}; got {self.topic!r}")
        self.sender = (self.sender or "").strip()[:30]
        self.receiver = (self.receiver or "").strip()[:30]
        self.language = (self.language or "").strip().lower()[:8]
        self.letter = (self.letter or "").strip()[:400]
        # Drop empty seeds
        self.seeds = [s for s in self.seeds if s and s.term]

    @property
    def size(self) -> int:
        return len(self.seeds)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "topic": self.topic,
            "sender": self.sender,
            "receiver": self.receiver,
            "language": self.language,
            "seeds": [s.to_dict() for s in self.seeds],
            "letter": self.letter,
            "created_at": self.created_at,
            "id": self.id,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "Packet":
        return cls(
            name=d["name"],
            topic=d["topic"],
            sender=d.get("sender", ""),
            receiver=d.get("receiver", ""),
            language=d.get("language", ""),
            seeds=[Seed.from_dict(x) for x in (d.get("seeds") or [])],
            letter=d.get("letter", ""),
            created_at=d.get("created_at") or _now_iso(),
            id=d.get("id") or _new_id(),
        )


@dataclass
class Field:
    """One person's field: collection of packets planted + harvested seed ids."""
    version: int = 1
    my_name: str = ""
    packets: list[Packet] = field(default_factory=list)
    harvested: list[str] = field(default_factory=list)  # seed ids
    sent_log: list[dict] = field(default_factory=list)  # {to, name, when, seed_count}

    def plant(self, packet: Packet) -> None:
        self.packets.append(packet)

    def find_seed(self, seed_id: str) -> Optional[tuple[Packet, Seed]]:
        for p in self.packets:
            for s in p.seeds:
                if s.id == seed_id:
                    return p, s
        return None

    def harvest(self, seed_id: str) -> bool:
        if seed_id in self.harvested:
            return False
        if self.find_seed(seed_id) is None:
            return False
        self.harvested.append(seed_id)
        return True

    def record_sent(self, packet: Packet) -> None:
        self.sent_log.append({
            "to": packet.receiver or "(誰か)",
            "name": packet.name,
            "topic": packet.topic,
            "when": _now_iso(),
            "seed_count": packet.size,
        })

    def packets_by_topic(self, topic_key: str) -> list[Packet]:
        return [p for p in self.packets if p.topic == topic_key]

    def seeds_by_topic(self, topic_key: str) -> list[Seed]:
        out: list[Seed] = []
        for p in self.packets_by_topic(topic_key):
            out.extend(p.seeds)
        return out

    def senders_for_topic(self, topic_key: str) -> list[str]:
        seen: list[str] = []
        for p in self.packets_by_topic(topic_key):
            if p.sender and p.sender not in seen:
                seen.append(p.sender)
        return seen

    def total_seeds(self) -> int:
        return sum(p.size for p in self.packets)

    def total_packets(self) -> int:
        return len(self.packets)

    def latest_received(self) -> Optional[Packet]:
        if not self.packets:
            return None
        return sorted(self.packets, key=lambda p: p.created_at, reverse=True)[0]

    def latest_sent(self) -> Optional[dict]:
        if not self.sent_log:
            return None
        return sorted(self.sent_log, key=lambda x: x.get("when", ""), reverse=True)[0]

    def to_dict(self) -> dict:
        return {
            "version": self.version,
            "my_name": self.my_name,
            "packets": [p.to_dict() for p in self.packets],
            "harvested": list(self.harvested),
            "sent_log": list(self.sent_log),
        }

    @classmethod
    def from_dict(cls, d: dict | None) -> "Field":
        if not d:
            return cls()
        return cls(
            version=int(d.get("version", 1)),
            my_name=d.get("my_name", ""),
            packets=[Packet.from_dict(x) for x in (d.get("packets") or [])],
            harvested=list(d.get("harvested") or []),
            sent_log=list(d.get("sent_log") or []),
        )
