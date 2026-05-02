# sodachi-graph — Project Conventions

## Language
- All UI strings, story text, and end-user messages are Japanese.
- Code identifiers and comments are English (or Romaji).

## Code style
- C11, plain C — no C++ features.
- 4-space indentation, K&R braces.
- One translation unit per logical concern (`main.c` for game loop/render, `story.{h,c}` for data).

## Adding chapters
- Append to `STORY[]` in `story.c`. Update `CHAPTER_COUNT` in `story.h` if needed.
- Each chapter requires: title, age_range, intro_1, intro_2, and 2 ChoicePoints.
- Each ChoicePoint needs: prompt, opt_a/opt_b, response_a/response_b, delta_a/delta_b.

## Adding endings
- Append to `ALL_ENDINGS[]`. Update `select_ending()` if new selection logic is needed.
- Always keep a "fallback" ending (currently "自分の道を歩む人") last.

## Font / Codepoints
- All displayed text must be reachable from `gather_text_buffer()` so its glyphs end up in the font atlas.
- New UI strings → add to `ui_strings[]` array in that function.

## Build
- `make` to build, `make run` to launch, `make clean` to wipe.
- Raylib 5.5 via Homebrew expected at `/opt/homebrew/Cellar/raylib/5.5`. Falls back to pkg-config.
