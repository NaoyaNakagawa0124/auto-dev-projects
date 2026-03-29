"""NestPlan CLI entry point."""

from __future__ import annotations

import argparse
import sys


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="nestplan",
        description="Plan your future home together \u2014 a beautiful terminal app for couples.",
    )
    parser.add_argument(
        "--load",
        type=str,
        default=None,
        help="Load an existing plan from a JSON file",
    )
    args = parser.parse_args()

    from .app import NestPlanApp

    app = NestPlanApp(plan_file=args.load)
    app.run()


if __name__ == "__main__":
    main()
