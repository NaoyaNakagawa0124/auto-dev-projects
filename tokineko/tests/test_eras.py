"""Tests for era database."""
from tokineko.eras import (
    build_eras, build_achievements, get_era_by_id,
    get_next_era_id, get_era_index, ERA_ORDER,
)


class TestEraDatabase:
    def test_era_count(self):
        eras = build_eras()
        assert len(eras) == 9

    def test_all_eras_in_order(self):
        eras = build_eras()
        era_ids = [e.id for e in eras]
        assert era_ids == ERA_ORDER

    def test_era_has_required_fields(self):
        eras = build_eras()
        for era in eras:
            assert era.id
            assert era.name
            assert era.year_label
            assert era.description
            assert era.color
            assert len(era.cat_art) > 0
            assert era.ambient_text

    def test_each_era_has_3_items(self):
        eras = build_eras()
        for era in eras:
            assert len(era.items) == 3, f"{era.name} has {len(era.items)} items"

    def test_item_rarities(self):
        eras = build_eras()
        for era in eras:
            rarities = [item.rarity for item in era.items]
            assert "common" in rarities, f"{era.name} missing common item"
            assert "rare" in rarities, f"{era.name} missing rare item"
            assert "legendary" in rarities, f"{era.name} missing legendary item"

    def test_item_ids_unique(self):
        eras = build_eras()
        all_ids = []
        for era in eras:
            for item in era.items:
                assert item.id not in all_ids, f"Duplicate item id: {item.id}"
                all_ids.append(item.id)

    def test_total_items(self):
        eras = build_eras()
        total = sum(len(era.items) for era in eras)
        assert total == 27  # 9 eras * 3 items

    def test_item_era_matches(self):
        eras = build_eras()
        for era in eras:
            for item in era.items:
                assert item.era_id == era.id


class TestEraNavigation:
    def test_get_era_by_id(self):
        eras = build_eras()
        era = get_era_by_id(eras, "egypt")
        assert era is not None
        assert era.name == "古代エジプト"

    def test_get_era_by_id_not_found(self):
        eras = build_eras()
        era = get_era_by_id(eras, "nonexistent")
        assert era is None

    def test_get_next_era(self):
        assert get_next_era_id("prehistoric") == "egypt"
        assert get_next_era_id("egypt") == "medieval"
        assert get_next_era_id("showa") == "modern"
        assert get_next_era_id("modern") == "future"

    def test_get_next_era_last(self):
        assert get_next_era_id("future") is None

    def test_get_next_era_invalid(self):
        assert get_next_era_id("nonexistent") is None

    def test_get_era_index(self):
        assert get_era_index("prehistoric") == 0
        assert get_era_index("egypt") == 1
        assert get_era_index("future") == 8

    def test_get_era_index_invalid(self):
        assert get_era_index("nonexistent") == 0

    def test_era_order_count(self):
        assert len(ERA_ORDER) == 9


class TestAchievements:
    def test_achievement_count(self):
        achievements = build_achievements()
        assert len(achievements) == 10

    def test_achievement_fields(self):
        achievements = build_achievements()
        for ach in achievements:
            assert "id" in ach
            assert "name" in ach
            assert "description" in ach
            assert "condition" in ach

    def test_achievement_ids_unique(self):
        achievements = build_achievements()
        ids = [a["id"] for a in achievements]
        assert len(ids) == len(set(ids))
