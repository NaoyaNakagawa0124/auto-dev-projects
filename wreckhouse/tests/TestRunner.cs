using System;
using System.Collections.Generic;

namespace WreckHouse.Tests
{
    public class TestRunner
    {
        private int passed = 0;
        private int failed = 0;
        private List<string> failures = new List<string>();

        public void Assert(bool condition, string name)
        {
            if (condition)
            {
                passed++;
            }
            else
            {
                failed++;
                failures.Add(name);
                Console.WriteLine("  FAIL: " + name);
            }
        }

        public void AssertEqual(object expected, object actual, string name)
        {
            if (expected == null && actual == null)
            {
                passed++;
                return;
            }
            if (expected != null && expected.Equals(actual))
            {
                passed++;
            }
            else
            {
                failed++;
                failures.Add(name + " (expected: " + expected + ", got: " + actual + ")");
                Console.WriteLine("  FAIL: " + name + " (expected: " + expected + ", got: " + actual + ")");
            }
        }

        public void AssertGreater(int actual, int threshold, string name)
        {
            Assert(actual > threshold, name + " (" + actual + " > " + threshold + ")");
        }

        public void AssertGreaterOrEqual(int actual, int threshold, string name)
        {
            Assert(actual >= threshold, name + " (" + actual + " >= " + threshold + ")");
        }

        public void AssertLess(int actual, int threshold, string name)
        {
            Assert(actual < threshold, name + " (" + actual + " < " + threshold + ")");
        }

        public void AssertNotNull(object obj, string name)
        {
            Assert(obj != null, name);
        }

        public void AssertNull(object obj, string name)
        {
            Assert(obj == null, name);
        }

        public void AssertTrue(bool condition, string name)
        {
            Assert(condition, name);
        }

        public void AssertFalse(bool condition, string name)
        {
            Assert(!condition, name);
        }

        public void PrintResults()
        {
            Console.WriteLine();
            Console.WriteLine("================================");
            Console.WriteLine("  Results: " + passed + " passed, " + failed + " failed");
            Console.WriteLine("================================");
            if (failures.Count > 0)
            {
                Console.WriteLine("\nFailures:");
                foreach (var f in failures) Console.WriteLine("  - " + f);
            }

            Environment.ExitCode = failed > 0 ? 1 : 0;
        }

        public int TotalPassed { get { return passed; } }
        public int TotalFailed { get { return failed; } }
    }
}
