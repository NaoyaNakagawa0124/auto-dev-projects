"""PawRank — Dog database with stats across 8 competitive categories."""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional
import pandas as pd


CATEGORIES = [
    "activity", "tricks", "obedience", "cuteness",
    "friendliness", "bravery", "intelligence", "fluffiness"
]

CATEGORY_EMOJI = {
    "activity": "\U0001f3c3",
    "tricks": "\U0001f3aa",
    "obedience": "\U0001f396\ufe0f",
    "cuteness": "\U0001f970",
    "friendliness": "\U0001f91d",
    "bravery": "\U0001f981",
    "intelligence": "\U0001f9e0",
    "fluffiness": "\u2601\ufe0f",
}


@dataclass
class Dog:
    name: str
    breed: str
    age: float
    weight_kg: float
    stats: dict[str, int] = field(default_factory=dict)  # category -> 1-100
    owner: str = ""
    photo_emoji: str = "\U0001f436"

    @property
    def overall_score(self) -> float:
        if not self.stats:
            return 0.0
        return sum(self.stats.values()) / len(self.stats)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "breed": self.breed,
            "age": self.age,
            "weight_kg": self.weight_kg,
            "owner": self.owner,
            "photo_emoji": self.photo_emoji,
            **self.stats,
        }


# 24 sample dogs with realistic stats
SAMPLE_DOGS = [
    Dog("Biscuit", "Golden Retriever", 3, 30, {"activity": 92, "tricks": 78, "obedience": 85, "cuteness": 95, "friendliness": 98, "bravery": 60, "intelligence": 82, "fluffiness": 90}, "Emma", "\U0001f415"),
    Dog("Shadow", "German Shepherd", 5, 35, {"activity": 88, "tricks": 85, "obedience": 95, "cuteness": 80, "friendliness": 65, "bravery": 95, "intelligence": 92, "fluffiness": 70}, "Alex", "\U0001f43a"),
    Dog("Mochi", "Shiba Inu", 2, 10, {"activity": 75, "tricks": 40, "obedience": 30, "cuteness": 99, "friendliness": 45, "bravery": 70, "intelligence": 85, "fluffiness": 80}, "Yuki", "\U0001f436"),
    Dog("Tank", "Bulldog", 6, 25, {"activity": 35, "tricks": 50, "obedience": 60, "cuteness": 88, "friendliness": 90, "bravery": 45, "intelligence": 55, "fluffiness": 40}, "Mike", "\U0001f436"),
    Dog("Luna", "Husky", 4, 22, {"activity": 98, "tricks": 65, "obedience": 40, "cuteness": 92, "friendliness": 80, "bravery": 75, "intelligence": 78, "fluffiness": 99}, "Sara", "\U0001f43a"),
    Dog("Peanut", "Chihuahua", 8, 2.5, {"activity": 70, "tricks": 55, "obedience": 45, "cuteness": 85, "friendliness": 40, "bravery": 95, "intelligence": 72, "fluffiness": 30}, "Rosa", "\U0001f436"),
    Dog("Bear", "Bernese Mountain Dog", 3, 45, {"activity": 65, "tricks": 70, "obedience": 80, "cuteness": 97, "friendliness": 95, "bravery": 55, "intelligence": 75, "fluffiness": 98}, "Tom", "\U0001f43b"),
    Dog("Ziggy", "Border Collie", 2, 18, {"activity": 95, "tricks": 99, "obedience": 90, "cuteness": 82, "friendliness": 75, "bravery": 65, "intelligence": 99, "fluffiness": 65}, "Jen", "\U0001f415"),
    Dog("Noodle", "Dachshund", 5, 5, {"activity": 60, "tricks": 45, "obedience": 50, "cuteness": 94, "friendliness": 85, "bravery": 80, "intelligence": 68, "fluffiness": 35}, "Chris", "\U0001f436"),
    Dog("Thor", "Rottweiler", 4, 50, {"activity": 80, "tricks": 60, "obedience": 85, "cuteness": 70, "friendliness": 55, "bravery": 99, "intelligence": 80, "fluffiness": 45}, "Dan", "\U0001f43a"),
    Dog("Daisy", "Labrador", 3, 28, {"activity": 90, "tricks": 82, "obedience": 88, "cuteness": 90, "friendliness": 95, "bravery": 50, "intelligence": 80, "fluffiness": 75}, "Lily", "\U0001f415"),
    Dog("Tofu", "Pomeranian", 4, 3, {"activity": 72, "tricks": 60, "obedience": 35, "cuteness": 98, "friendliness": 65, "bravery": 90, "intelligence": 70, "fluffiness": 95}, "Ken", "\U0001f436"),
    Dog("Rex", "Belgian Malinois", 3, 30, {"activity": 99, "tricks": 92, "obedience": 96, "cuteness": 72, "friendliness": 60, "bravery": 98, "intelligence": 95, "fluffiness": 50}, "Sgt. Lee", "\U0001f43a"),
    Dog("Maple", "Corgi", 2, 12, {"activity": 82, "tricks": 75, "obedience": 70, "cuteness": 100, "friendliness": 88, "bravery": 55, "intelligence": 78, "fluffiness": 80}, "Amy", "\U0001f436"),
    Dog("Ghost", "White Swiss Shepherd", 5, 35, {"activity": 85, "tricks": 72, "obedience": 88, "cuteness": 88, "friendliness": 70, "bravery": 80, "intelligence": 82, "fluffiness": 92}, "Jon", "\U0001f43a"),
    Dog("Churro", "French Bulldog", 3, 12, {"activity": 55, "tricks": 58, "obedience": 55, "cuteness": 96, "friendliness": 92, "bravery": 40, "intelligence": 60, "fluffiness": 50}, "Maria", "\U0001f436"),
    Dog("Athena", "Doberman", 4, 32, {"activity": 90, "tricks": 80, "obedience": 92, "cuteness": 78, "friendliness": 60, "bravery": 96, "intelligence": 90, "fluffiness": 35}, "Kate", "\U0001f43a"),
    Dog("Pudding", "Cavalier King Charles", 6, 7, {"activity": 50, "tricks": 55, "obedience": 75, "cuteness": 99, "friendliness": 98, "bravery": 25, "intelligence": 62, "fluffiness": 88}, "Gran", "\U0001f436"),
    Dog("Bolt", "Whippet", 2, 13, {"activity": 97, "tricks": 50, "obedience": 65, "cuteness": 78, "friendliness": 72, "bravery": 35, "intelligence": 70, "fluffiness": 25}, "Usain", "\U0001f415"),
    Dog("Muffin", "Bichon Frise", 7, 6, {"activity": 55, "tricks": 68, "obedience": 72, "cuteness": 97, "friendliness": 90, "bravery": 30, "intelligence": 65, "fluffiness": 100}, "Grace", "\U0001f429"),
    Dog("Diesel", "Pitbull", 3, 28, {"activity": 88, "tricks": 70, "obedience": 75, "cuteness": 82, "friendliness": 85, "bravery": 92, "intelligence": 76, "fluffiness": 40}, "Jake", "\U0001f415"),
    Dog("Cleo", "Greyhound", 5, 28, {"activity": 85, "tricks": 42, "obedience": 60, "cuteness": 80, "friendliness": 75, "bravery": 40, "intelligence": 72, "fluffiness": 20}, "Fiona", "\U0001f415"),
    Dog("Waffle", "Samoyed", 2, 22, {"activity": 80, "tricks": 65, "obedience": 55, "cuteness": 100, "friendliness": 92, "bravery": 50, "intelligence": 72, "fluffiness": 100}, "Snow", "\U0001f43b\u200d\u2744\ufe0f"),
    Dog("Sarge", "Australian Shepherd", 3, 20, {"activity": 95, "tricks": 95, "obedience": 85, "cuteness": 88, "friendliness": 78, "bravery": 72, "intelligence": 96, "fluffiness": 78}, "Drew", "\U0001f415"),
]


def get_dogs() -> list[Dog]:
    return list(SAMPLE_DOGS)


def dogs_to_dataframe(dogs: list[Dog]) -> pd.DataFrame:
    return pd.DataFrame([d.to_dict() for d in dogs])


def add_dog(dogs: list[Dog], dog: Dog) -> list[Dog]:
    dogs.append(dog)
    return dogs
