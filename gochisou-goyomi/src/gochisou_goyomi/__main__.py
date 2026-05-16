"""Entry point: ``python -m gochisou_goyomi`` or installed console script."""

from __future__ import annotations


def main() -> None:
    from .app import run
    run()


if __name__ == "__main__":
    main()
