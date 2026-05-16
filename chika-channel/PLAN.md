# 地下チャンネル — Plan

## Phase 1 — Scaffold
- package.json (Bun)、 tsconfig、 .gitignore
- src/game/ (pure logic) / src/server (Bun) / public (client)

## Phase 2 — Game logic (pure TS)
- `topics.ts`: 6 topic enum + パレット (cooking, gaming, vlog, edu, comedy, shorts)
- `network.ts`: Station / Line / Network 型と CRUD
- `traffic.ts`: simulateDay(network, weather, rng) → DayResult
- `weather.ts`: 7 algorithm event 型、 next_weather(week, rng)
- `save.ts`: serialize/deserialize、 localStorage で client が使う形に
- すべてピュア、 副作用無し

## Phase 3 — Bun HTTP server
- `src/server/index.ts`: Bun.serve、 静的ファイル + /api/leaderboard (in-memory)
- `bun run dev` で TS をホット再ロード可能に

## Phase 4 — Client (vanilla TS + SVG)
- `public/index.html` (シングルファイル) + `public/app.ts` + `public/style.css`
- SVG 路線図、 駅クリックで詳細、 ドラッグで線接続
- HUD: 登録者数 / 日数 / 今週の天候 / アクションポイント
- 昼 40 秒のアニメーション (passenger dots を線に沿って流す)、 夜のアクションパネル

## Phase 5 — Tests (bun:test)
- `tests/topics.test.ts`
- `tests/network.test.ts`
- `tests/traffic.test.ts`
- `tests/weather.test.ts`
- `tests/save.test.ts`
- `tests/server.test.ts` (Bun.fetch でルートを叩く)

## Phase 6 — Polish + ship
- 駅のアイコンを topic ごとに揃える (○ □ △ ✕ ◇ ▽)
- 線の色を topic 系列で淡く分ける
- SUMMARY、 dashboard、 commit
