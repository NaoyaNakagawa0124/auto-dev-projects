# sodachi-graph — Summary

## What was built

ネイティブの Raylib (C) ビジュアルノベル＋データダッシュボード。
親が子育て中の選択を10回行い、章ごとに4スタッツ（智・徳・体・情）の成長グラフを見ながら、
最終的に12種類のエンディングのいずれかへ到達するゲーム。

## Tech decisions

- **Raylib over SDL2** — Discovery roll allowed either; raylib's higher-level API kept the code compact (~700 LOC for the entire game).
- **Pure C, single binary** — No build system beyond a Makefile. Two `.c` files, one font asset.
- **Dynamic codepoint loading** — All Japanese strings are concatenated at boot, deduped, and passed to `LoadFontEx`. Avoids shipping the entire CJK glyph table while still rendering every character used in the story.
- **Primitive-based backgrounds** — No image assets required; each chapter has a unique mood via gradients + simple shapes (sun, mountain silhouettes, stars, etc.).
- **Selection logic** — `select_ending()` first checks balanced-everything, then unique top stat, then top-2 combinations, then a graceful fallback. Uses a 4-point window (`top - 4`) to detect "tied" stats.
- **Animation easing** — Dashboard bars use a custom ease-in-out: `t < 0.5 ? 2t² : 1 - (-2t+2)²/2`. Feels organic without a tweening library.

## Tests / verification

- `make` clean compile under `-Wall -Wextra` with zero warnings.
- Smoke-test launch: window opens, font atlas loads (533 glyphs), no errors in stderr.
- Code paths exercised on paper (manual trace through scene state machine).

## Stats

- **Files**: 7 (3 source, 1 makefile, 1 font, 3 markdown docs)
- **LOC**: ~600 of C (main.c) + ~190 of C (story.c) + ~50 (story.h)
- **Endings**: 12
- **Decisions per playthrough**: 10
- **Replayability**: 2^10 = 1024 unique decision paths, mapped to 12 ending classes

## Potential next steps

1. **音楽** — Raylib has audio support;章ごとに小さな BGM ループを追加すると感情体験が増す。
2. **セーブ/ロード** — 途中保存して翌日再開できるように。
3. **レーダーチャート** — エンディング画面に4軸レーダーを追加すると数値の偏りが直感的になる。
4. **追加章** — 16〜18歳の章を追加して大学・就職の選択を入れると更に深まる。
5. **iOS / Web 移植** — Raylib は WebAssembly に対応しているので emscripten でブラウザ版が出せる。

## Discovery roll

- Source: 40 (データ分析・ダッシュボード系)
- Persona: 39 (子育て中のパパ/ママ)
- Platform: 20 (Raylib / SDL game)
- Wildcard: 43 (選択肢で分岐するマルチエンディング VN)

「データ分析」と「VN」を**章間ダッシュボード**としてマッシュアップしたのが核アイデア。
親が「数字を見て育てる」体験を、選択の重みとして翻訳した。
