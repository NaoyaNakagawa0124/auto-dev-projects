"""NestPlan data models."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional


class ProjectStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    DONE = "done"


ROOM_ICONS = {
    "kitchen": "\U0001f373",
    "bedroom": "\U0001f6cf\ufe0f",
    "living room": "\U0001f6cb\ufe0f",
    "bathroom": "\U0001f6bf",
    "office": "\U0001f4bb",
    "garage": "\U0001f697",
    "garden": "\U0001f331",
    "dining room": "\U0001f37d\ufe0f",
    "laundry": "\U0001f9fa",
    "hallway": "\U0001f6aa",
    "basement": "\U0001f3da\ufe0f",
    "attic": "\U0001f3e0",
}


def get_room_icon(name: str) -> str:
    return ROOM_ICONS.get(name.lower(), "\U0001f3e0")


def _new_id() -> str:
    return uuid.uuid4().hex[:8]


@dataclass
class Vote:
    partner_name: str
    stars: int  # 1-5

    def to_dict(self) -> dict:
        return {"partner_name": self.partner_name, "stars": self.stars}

    @classmethod
    def from_dict(cls, data: dict) -> Vote:
        return cls(partner_name=data["partner_name"], stars=data["stars"])


@dataclass
class Project:
    id: str = field(default_factory=_new_id)
    name: str = ""
    description: str = ""
    budget: float = 0.0
    status: ProjectStatus = ProjectStatus.PLANNED
    assigned_to: Optional[str] = None
    votes: list[Vote] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    @property
    def priority_score(self) -> float:
        if not self.votes:
            return 0.0
        return sum(v.stars for v in self.votes) / len(self.votes)

    @property
    def total_votes(self) -> int:
        return len(self.votes)

    def get_vote(self, partner_name: str) -> Optional[Vote]:
        for v in self.votes:
            if v.partner_name == partner_name:
                return v
        return None

    def set_vote(self, partner_name: str, stars: int) -> None:
        stars = max(1, min(5, stars))
        for v in self.votes:
            if v.partner_name == partner_name:
                v.stars = stars
                return
        self.votes.append(Vote(partner_name=partner_name, stars=stars))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "budget": self.budget,
            "status": self.status.value,
            "assigned_to": self.assigned_to,
            "votes": [v.to_dict() for v in self.votes],
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> Project:
        return cls(
            id=data.get("id", _new_id()),
            name=data["name"],
            description=data.get("description", ""),
            budget=data.get("budget", 0.0),
            status=ProjectStatus(data.get("status", "planned")),
            assigned_to=data.get("assigned_to"),
            votes=[Vote.from_dict(v) for v in data.get("votes", [])],
            created_at=data.get("created_at", datetime.now().isoformat()),
        )


@dataclass
class Room:
    id: str = field(default_factory=_new_id)
    name: str = ""
    projects: list[Project] = field(default_factory=list)

    @property
    def icon(self) -> str:
        return get_room_icon(self.name)

    @property
    def total_budget(self) -> float:
        return sum(p.budget for p in self.projects)

    @property
    def completed_count(self) -> int:
        return sum(1 for p in self.projects if p.status == ProjectStatus.DONE)

    @property
    def project_count(self) -> int:
        return len(self.projects)

    def add_project(self, project: Project) -> None:
        self.projects.append(project)

    def remove_project(self, project_id: str) -> bool:
        for i, p in enumerate(self.projects):
            if p.id == project_id:
                self.projects.pop(i)
                return True
        return False

    def get_project(self, project_id: str) -> Optional[Project]:
        for p in self.projects:
            if p.id == project_id:
                return p
        return None

    def projects_by_priority(self) -> list[Project]:
        return sorted(self.projects, key=lambda p: p.priority_score, reverse=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "projects": [p.to_dict() for p in self.projects],
        }

    @classmethod
    def from_dict(cls, data: dict) -> Room:
        return cls(
            id=data.get("id", _new_id()),
            name=data["name"],
            projects=[Project.from_dict(p) for p in data.get("projects", [])],
        )


@dataclass
class Partner:
    name: str

    def to_dict(self) -> dict:
        return {"name": self.name}

    @classmethod
    def from_dict(cls, data: dict) -> Partner:
        return cls(name=data["name"])


@dataclass
class Plan:
    name: str = "Our Home"
    partners: list[Partner] = field(default_factory=list)
    rooms: list[Room] = field(default_factory=list)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())

    @property
    def total_budget(self) -> float:
        return sum(r.total_budget for r in self.rooms)

    @property
    def total_projects(self) -> int:
        return sum(r.project_count for r in self.rooms)

    @property
    def completed_projects(self) -> int:
        return sum(r.completed_count for r in self.rooms)

    @property
    def completion_pct(self) -> float:
        total = self.total_projects
        if total == 0:
            return 0.0
        return (self.completed_projects / total) * 100

    def add_room(self, room: Room) -> None:
        self.rooms.append(room)

    def remove_room(self, room_id: str) -> bool:
        for i, r in enumerate(self.rooms):
            if r.id == room_id:
                self.rooms.pop(i)
                return True
        return False

    def get_room(self, room_id: str) -> Optional[Room]:
        for r in self.rooms:
            if r.id == room_id:
                return r
        return None

    def all_projects(self) -> list[Project]:
        projects = []
        for room in self.rooms:
            projects.extend(room.projects)
        return projects

    def budget_by_partner(self) -> dict[str, float]:
        result: dict[str, float] = {}
        for partner in self.partners:
            result[partner.name] = 0.0
        result["Unassigned"] = 0.0
        for project in self.all_projects():
            key = project.assigned_to if project.assigned_to else "Unassigned"
            if key not in result:
                key = "Unassigned"
            result[key] += project.budget
        return result

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "partners": [p.to_dict() for p in self.partners],
            "rooms": [r.to_dict() for r in self.rooms],
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> Plan:
        return cls(
            name=data.get("name", "Our Home"),
            partners=[Partner.from_dict(p) for p in data.get("partners", [])],
            rooms=[Room.from_dict(r) for r in data.get("rooms", [])],
            created_at=data.get("created_at", datetime.now().isoformat()),
        )
