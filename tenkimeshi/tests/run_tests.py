#!/usr/bin/env python3
"""テンキメシ — テストランナー"""

import sys
import os
import unittest

# テストディレクトリをパスに追加
test_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(test_dir, "..", "src"))

if __name__ == "__main__":
    loader = unittest.TestLoader()
    suite = loader.discover(test_dir, pattern="test_*.py")

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    # テスト数を表示
    total = result.testsRun
    failures = len(result.failures)
    errors = len(result.errors)
    print(f"\n{'=' * 50}")
    print(f"合計: {total} テスト | 成功: {total - failures - errors} | 失敗: {failures} | エラー: {errors}")
    print(f"{'=' * 50}")

    sys.exit(0 if result.wasSuccessful() else 1)
