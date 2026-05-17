# inu-saiten — 実装 計画

## Phase 1: Scaffold
- package.json (vitest)
- README / CLAUDE / PLAN / .gitignore

## Phase 2: 純ロジック (src/)
- `ingredients.js` — 材料 辞書 (love / meh / danger カテゴリ、 100+ エントリ)
- `characters.js` — 4 犬 キャラ + レビュー テンプレート
- `detector.js` — テキスト から 材料 を 抽出 + サイト 判定
- `scorer.js` — 採点 ロジック + 星 計算
- `reviewer.js` — レビュー 文 組み立て (seeded RNG)
- `banned.js` — BANNED_WORDS 監査
- `rand.js` — xorshift32 (URL seed)
- `formatter.js` — オーバーレイ HTML を 文字列 で 生成 (DOM 非依存)

## Phase 3: 拡張 (extension/)
- `manifest.json` (MV3, host_permissions for major recipe sites)
- `content.js` — material 抽出 → scorer → reviewer → DOM 注入
- `content.css` — overlay スタイル
- `popup.html` / `popup.css` / `popup.js` — キャラ 切替、 履歴、 ON/OFF
- `background.js` — storage 初期化
- `icons/` — 16/48/128 PNG (PIL で 生成)

## Phase 4: Tests
- `ingredients.test.js` — 辞書 の 健全 性、 重複 なし
- `detector.test.js` — テキスト 抽出、 サイト 判定
- `scorer.test.js` — 採点 6 ケース (love only / meh only / 1 danger / multi danger / mix / empty)
- `reviewer.test.js` — 4 キャラ × 3 採点 帯、 deterministic
- `banned.test.js` — 全 文字列 リソース を 走査
- `formatter.test.js` — overlay HTML 生成

## Phase 5: Verify
- `npm test` で 全 PASS
- 拡張 を Chrome に 読み込ま せた smoke (テスト 用 HTML で 確認)

## Phase 6: Polish
- BANNED_WORDS 走査
- アイコン 生成 (PIL or canvas)
- popup の 履歴 表示
- README / SUMMARY 更新
- dashboard + commit
