"""テスト — フロアプラン生成"""

import sys
import os
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from floorplan import generate_floorplan, get_available_layouts, FLOORPLANS, DEFAULT_FLOORPLAN


class TestFloorplanGeneration(unittest.TestCase):
    """フロアプラン生成の基本テスト"""

    def test_returns_nonempty_string(self):
        result = generate_floorplan("ラーメン")
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_contains_box_drawing_chars(self):
        result = generate_floorplan("ラーメン")
        box_chars = set("┌┐└┘─│├┤┬┴┼═║╔╗╚╝╠╣╦╩╬▓")
        found = any(ch in box_chars for ch in result)
        self.assertTrue(found, "フロアプランにボックス描画文字がありません")

    def test_different_foods_different_plans(self):
        ramen = generate_floorplan("ラーメン")
        sushi = generate_floorplan("寿司・海鮮")
        self.assertNotEqual(ramen, sushi)

    def test_unknown_food_returns_default(self):
        result = generate_floorplan("存在しない料理")
        self.assertEqual(result, DEFAULT_FLOORPLAN)

    def test_default_floorplan_nonempty(self):
        self.assertTrue(len(DEFAULT_FLOORPLAN) > 0)

    def test_default_floorplan_has_box_chars(self):
        box_chars = set("┌┐└┘─│├┤┬┴")
        found = any(ch in box_chars for ch in DEFAULT_FLOORPLAN)
        self.assertTrue(found)


class TestAllFloorplans(unittest.TestCase):
    """全フロアプランテンプレートのテスト"""

    def test_all_layouts_nonempty(self):
        for name, plan in FLOORPLANS.items():
            self.assertTrue(len(plan) > 0, f"{name} のフロアプランが空です")

    def test_all_layouts_have_box_chars(self):
        box_chars = set("┌┐└┘─│├┤┬┴")
        for name, plan in FLOORPLANS.items():
            found = any(ch in box_chars for ch in plan)
            self.assertTrue(found, f"{name} にボックス描画文字がありません")

    def test_all_layouts_have_seats(self):
        for name, plan in FLOORPLANS.items():
            self.assertIn("○", plan, f"{name} に座席マークがありません")

    def test_all_layouts_multiline(self):
        for name, plan in FLOORPLANS.items():
            lines = plan.split("\n")
            self.assertTrue(len(lines) > 5, f"{name} の行数が少なすぎます")

    def test_all_layouts_have_entrance(self):
        for name, plan in FLOORPLANS.items():
            self.assertIn("入口", plan, f"{name} に入口マークがありません")

    def test_all_layouts_have_kitchen(self):
        for name, plan in FLOORPLANS.items():
            self.assertIn("厨房", plan, f"{name} に厨房がありません")

    def test_layout_count(self):
        self.assertEqual(len(FLOORPLANS), 10)


class TestGetAvailableLayouts(unittest.TestCase):
    """利用可能レイアウト一覧テスト"""

    def test_returns_list(self):
        layouts = get_available_layouts()
        self.assertIsInstance(layouts, list)

    def test_list_nonempty(self):
        layouts = get_available_layouts()
        self.assertTrue(len(layouts) > 0)

    def test_contains_ramen(self):
        layouts = get_available_layouts()
        self.assertIn("ラーメン", layouts)

    def test_contains_sushi(self):
        layouts = get_available_layouts()
        self.assertIn("寿司・海鮮", layouts)


class TestFloorplanDimensions(unittest.TestCase):
    """フロアプランのサイズテスト"""

    def test_line_count_within_bounds(self):
        for name, plan in FLOORPLANS.items():
            lines = plan.strip().split("\n")
            self.assertLessEqual(len(lines), 25, f"{name} の行数が多すぎます")
            self.assertGreaterEqual(len(lines), 10, f"{name} の行数が少なすぎます")


if __name__ == "__main__":
    unittest.main()
