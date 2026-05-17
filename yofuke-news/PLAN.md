# PLAN — 夜更けニュース

## Phase 1: 純ロジック (10 min)
- `src/news.js` — 12 件 の indie ゲーム ニュース (2026-05 想定):
  - `{ id, title, jp, genre, price_jpy, hours_to_clear, release_kind ("released" | "demo" | "early-access"), short_blurb }`
  - title は 創作 (実在 indie 風)、 ジャンル は メトロイドヴァニア / ロギライク / シミュレーション / etc
  - 12 件 から 日付 seed で 5 件 を deterministic に 引く
- `src/jokes.js` — 計算 ヘルパー:
  - `sleepHoursTraded(hoursToPlay, hour)` — 夜型 だ と 引き換える 睡眠 は 短い (2 AM → 1.0 倍、 4 AM → 0.4 倍)
  - `breakfastsLost(hoursToPlay)` — 1 朝食 = 1 時間 として、 hoursToPlay / 1 を整数化
  - `commentsToTell(news)` — 「これ を 朝 同僚 に 話す」 系 の 1 行 (ストーリーテリング 助け)
- `src/clock.js`:
  - `tierFor(hour)` — 22-23 (evening) / 0-2 (deep) / 3-5 (predawn) / 6-21 (day) — kyuufu と 同じ パターン
  - `pickNewsForNow(date, n=5)` — 時間帯 + 日付 から deterministic に N 件 を 引く
- `src/rand.js` — xorshift32 + warmup (cycle 18 以降 標準パターン)

## Phase 2: vitest (5 min)
- `tests/news.test.js` — 12 件、 id 重複なし、 BANNED_WORDS フリー、 price/hours 範囲、 short_blurb 長さ
- `tests/jokes.test.js` — sleepHoursTraded の境界、 breakfastsLost、 commentsToTell の出力
- `tests/clock.test.js` — tierFor 4 phase、 pickNewsForNow が 5 件 + deterministic + 違う日違う
- `tests/rand.test.js` — 既知パターン

## Phase 3: Renderer + CLI (10 min)
- `src/render.js`:
  - `formatCard(news, idx, hour)` — ASCII box + chalk で色付け、 multi-line
  - `formatHeader(date, hour)` — `─────…\n ✦ INDIE  RELEASES  (YYYY-MM-DD, HH:MM JST)\n─────…`
  - 配色:
    - ヘッダー: cyan / dim cyan
    - 数字: yellow
    - genre タグ: magenta
    - 罫線: dim
- `src/cli.js`:
  - shebang + executable bit
  - 引数: `--all` (12 件全部) / `--no-color` / `--help` / `--version`
  - 標準出力 に カード を 1 つずつ 印字、 各カード の 間 に 空行
- chalk 5 は ESM 必須 → package.json の type: "module" で OK

## Phase 4: smoke + dashboard + commit (5 min)
- `chmod +x src/cli.js`
- `node src/cli.js` を 実行 して 出力 を 確認
- `node src/cli.js --no-color | head -30` で plain text 確認
- SUMMARY、 dashboard、 commit、 push
