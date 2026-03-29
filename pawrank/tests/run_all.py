import subprocess, sys, os

tests = ["test_dogs.py"]
all_passed = True
results = []

print("PawRank Test Suite\n")

for test in tests:
    filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), test)
    try:
        r = subprocess.run([sys.executable, filepath], capture_output=True, text=True, timeout=30)
        print(r.stdout, end="")
        if r.stderr: print(r.stderr, end="")
        results.append((test, "PASS" if r.returncode == 0 else "FAIL"))
        if r.returncode != 0: all_passed = False
    except Exception as e:
        print(f"  ERROR: {test}: {e}")
        results.append((test, "ERROR"))
        all_passed = False

print("\n=== Summary ===")
for name, status in results:
    icon = "\u2705" if status == "PASS" else "\u274c"
    print(f"  {icon} {name}")

p = sum(1 for _, s in results if s == "PASS")
print(f"\n{p}/{len(results)} test suites passed")
sys.exit(0 if all_passed else 1)
