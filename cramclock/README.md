# CramClock ⏰

> A Deno CLI for late-night study sessions. Because it's 2am and the exam is tomorrow.

## Commands

```bash
deno run src/cli.ts start         # Start a 25-min pomodoro
deno run src/cli.ts start 45      # Custom minutes
deno run src/cli.ts exam "Math" "2026-04-01 09:00"  # Set exam countdown
deno run src/cli.ts status        # Current session + exam countdown
deno run src/cli.ts history       # Past sessions
deno run src/cli.ts stats         # Study statistics
deno run src/cli.ts break         # Start a 5-min break
deno run src/cli.ts help          # Show help
```

## Install

```bash
# Requires Deno 2.0+
deno task test    # Run tests
deno task start   # Start studying
```

## License

MIT — Written at 2am
