"""テスト — レコメンドエンジン"""

import sys
import os
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from recommender import (
    recommend,
    FOOD_CATEGORIES,
    REQUIRED_FIELDS,
    get_all_categories,
    get_category_by_key,
)


class TestRecommendTemperature(unittest.TestCase):
    """気温ベースのレコメンドテスト"""

    def test_hot_weather_returns_cold_noodle(self):
        result = recommend(35.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "冷たい麺")

    def test_exactly_30_returns_cold_noodle(self):
        result = recommend(30.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "冷たい麺")

    def test_very_hot_returns_cold_noodle(self):
        result = recommend(40.0, 1, 3.0, 60)
        self.assertEqual(result["name"], "冷たい麺")

    def test_cold_weather_returns_nabe(self):
        result = recommend(3.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "鍋物")

    def test_exactly_5_returns_nabe(self):
        result = recommend(5.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "鍋物")

    def test_freezing_returns_nabe(self):
        result = recommend(-5.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "鍋物")

    def test_cool_weather_returns_yoshoku(self):
        result = recommend(12.0, 1, 5.0, 50)
        self.assertEqual(result["name"], "洋食")

    def test_mild_clear_returns_sushi(self):
        result = recommend(15.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "寿司・海鮮")


class TestRecommendWeatherCode(unittest.TestCase):
    """天気コードベースのレコメンドテスト"""

    def test_rain_returns_ramen(self):
        result = recommend(20.0, 63, 5.0, 50)
        self.assertEqual(result["name"], "ラーメン")

    def test_heavy_rain_returns_ramen(self):
        result = recommend(20.0, 65, 5.0, 50)
        self.assertEqual(result["name"], "ラーメン")

    def test_snow_returns_ramen(self):
        result = recommend(20.0, 73, 5.0, 50)
        self.assertEqual(result["name"], "ラーメン")

    def test_thunderstorm_returns_ramen(self):
        result = recommend(20.0, 95, 5.0, 50)
        self.assertEqual(result["name"], "ラーメン")

    def test_fog_humid_returns_curry(self):
        result = recommend(20.0, 45, 5.0, 85)
        self.assertEqual(result["name"], "カレー")

    def test_fog_low_humidity_not_curry(self):
        result = recommend(20.0, 45, 5.0, 50)
        self.assertNotEqual(result["name"], "カレー")

    def test_clear_warm_returns_bbq(self):
        result = recommend(25.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "焼肉・BBQ")

    def test_clear_mild_returns_sushi(self):
        result = recommend(15.0, 0, 5.0, 50)
        self.assertEqual(result["name"], "寿司・海鮮")

    def test_windy_returns_izakaya(self):
        result = recommend(20.0, 1, 25.0, 50)
        self.assertEqual(result["name"], "居酒屋")

    def test_overcast_returns_chinese(self):
        result = recommend(20.0, 3, 5.0, 50)
        self.assertEqual(result["name"], "中華料理")

    def test_default_returns_cafe(self):
        result = recommend(20.0, 1, 5.0, 50)
        self.assertEqual(result["name"], "カフェ・軽食")


class TestFoodCategories(unittest.TestCase):
    """食べ物カテゴリのデータ整合性テスト"""

    def test_all_categories_have_required_fields(self):
        for key, cat in FOOD_CATEGORIES.items():
            for field in REQUIRED_FIELDS:
                self.assertIn(field, cat, f"{key} に {field} がありません")

    def test_all_categories_have_nonempty_examples(self):
        for key, cat in FOOD_CATEGORIES.items():
            self.assertTrue(len(cat["examples"]) > 0, f"{key} の examples が空です")

    def test_all_categories_have_name(self):
        for key, cat in FOOD_CATEGORIES.items():
            self.assertTrue(len(cat["name"]) > 0, f"{key} の name が空です")

    def test_all_categories_have_emoji(self):
        for key, cat in FOOD_CATEGORIES.items():
            self.assertTrue(len(cat["emoji"]) > 0, f"{key} の emoji が空です")

    def test_all_categories_have_description(self):
        for key, cat in FOOD_CATEGORIES.items():
            self.assertTrue(len(cat["description"]) > 0, f"{key} の description が空です")

    def test_category_count(self):
        self.assertEqual(len(FOOD_CATEGORIES), 10)

    def test_get_all_categories(self):
        cats = get_all_categories()
        self.assertEqual(len(cats), 10)

    def test_get_category_by_key_valid(self):
        cat = get_category_by_key("ramen")
        self.assertIsNotNone(cat)
        self.assertEqual(cat["name"], "ラーメン")

    def test_get_category_by_key_invalid(self):
        cat = get_category_by_key("nonexistent")
        self.assertIsNone(cat)


class TestRecommendReturnType(unittest.TestCase):
    """レコメンド結果の型テスト"""

    def test_recommend_returns_dict(self):
        result = recommend(20.0, 0, 5.0, 50)
        self.assertIsInstance(result, dict)

    def test_recommend_result_has_name(self):
        result = recommend(20.0, 0, 5.0, 50)
        self.assertIn("name", result)

    def test_recommend_result_has_emoji(self):
        result = recommend(20.0, 0, 5.0, 50)
        self.assertIn("emoji", result)

    def test_recommend_result_has_examples(self):
        result = recommend(20.0, 0, 5.0, 50)
        self.assertIn("examples", result)


if __name__ == "__main__":
    unittest.main()
