"""Run all NestPlan tests."""

import subprocess
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
tests = [
    "test_models.py",
    "test_storage.py",
    "test_budget.py",
]

all_passed = True
results = []

print("NestPlan Test Suite\n")

for test in tests:
    filepath = os.path.join(test_dir, test)
    try:
        result = subprocess.run(
            [sys.executable, filepath],
            capture_output=True, text=True, timeout=30,
        )
        print(result.stdout, end="")
        if result.stderr:
            print(result.stderr, end="")
        if result.returncode == 0:
            results.append((test, "PASS"))
        else:
            results.append((test, "FAIL"))
            all_passed = False
    except Exception as e:
        print(f"  ERROR running {test}: {e}")
        results.append((test, "ERROR"))
        all_passed = False

print("\n=== Summary ===")
for name, status in results:
    icon = "\u2705" if status == "PASS" else "\u274c"
    print(f"  {icon} {name}")

total = len(results)
passing = sum(1 for _, s in results if s == "PASS")
print(f"\n{passing}/{total} test suites passed")

sys.exit(0 if all_passed else 1)
