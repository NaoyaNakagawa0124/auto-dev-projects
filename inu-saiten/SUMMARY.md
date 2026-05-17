# 犬採点 (inu-saiten) — Summary

## What was built
レシピ サイト (cookpad / クラシル / DELISH KITCHEN / NYT Cooking / AllRecipes / 楽天レシピ / オレンジページ) を 開く と、 ページ 上部 に 「もし あなた の 犬 が この レシピ を 採点 したら」 と いう glassmorphism オーバーレイ が 自動 で 出る Chrome 拡張 (Manifest V3)。 材料 を 解析 し、 100+ 種類 の 食材 辞書 から 犬 視点 の スコア を 計算、 4 種 の 犬 キャラ (お利口 ポチ / シニア マロ / ヤンチャ タロウ / 哲学者 ジョン) が それぞれ 違う 文体 で 1 段落 の レビュー を 書く。 「鶏胸肉 の 香り だけ で 私 は 1 日 を 過ごせ ます。 玉ねぎ が 入って いる の が 残念 で 部屋 の 隅 に 退避 し ました。 — お利口 ポチ」。

## Discovery Roll
- **Source 9**: Trending food / recipe / restaurant culture
- **Persona 10**: 犬に夢中すぎる飼い主
- **Platform 5**: Browser extension (Chrome MV3)
- **Intent 3**: 「こんなのアリ?」 と 笑わせる — コンセプチュアル / 一発ネタ

Source 9 (recipe) × Persona 10 (dog-obsessed owner) は 「料理 = 犬 の 目線」 と いう 飛躍 で 既存 アプリ に は ない 切り口 に なる。 Platform 5 (browser extension) は アプリ を 開か ず ふだん 通り レシピ を 見て いる だけ で 犬 が しゃべり 出す、 その 受動 性 が 笑い に 効く。 Intent 3 は コメディ — 飼育 助言 では な い こと を 明記 し て、 100% コミック な 「過剰 投影」 を 楽しむ 道具 に。

## Tech Stack
- Chrome Extension **Manifest V3** (`background.service_worker` is module type)
- 純ロジック は ES module で `src/` に、 Vitest で カバー
- `extension/content.js` は MV3 制約 で classic script として 同 ロジック を 自己 完結 で 持つ (テスト 済み 純関数 を コピー)
- 依存 ゼロ (vitest 以外)
- chrome.storage.local で 設定 / 履歴 永続化
- アイコン (16/48/128) は Python PIL で 生成
- CSS は all:initial + glassmorphism で ホスト ページ の スタイル と 干渉 し ない

## Features
- **自動 採点 オーバーレイ**: レシピ ページ の 材料 を 検出 し、 4 つ の 「行」 で 視覚 化:
  - 🐕 命 を 賭ける (love 上位 4)
  - ⚠️ 部屋 の 隅 に 退避 (danger)
  - 😴 正直 どう でも (meh 上位 4)
  - 引用 ブロック の 1 段落 レビュー
- **4 つ の 犬 キャラ** — 採点 バイアス と 文体 が 違う
  - お利口 ポチ (-3 厳しい / polite 文体)
  - シニア マロ (0 中庸 / wise 文体 「〜 の じゃ」)
  - ヤンチャ タロウ (+10 甘い / excited 文体 「!!!」)
  - 哲学者 ジョン (-1 内省 / philosophical 文体 「存在 と は」)
- **危険 食材 警告**: ネギ 属 / チョコ / ぶどう / アボカド / キシリトール 等 16 種、 「⚠️ 飼育 助言 で は ない」 と 明記 し た 上で 「犬 視点」 で 表現
- **deterministic レビュー**: 同 URL × 同 キャラ で 同 文 (xorshift32 + URL seed)
- **5 段階 星 + 0-100 点 表示**
- **直近 20 件 の 履歴**: popup で URL / タイトル / 採点 / 日付 を 一覧
- **閉じる ボタン** + sessionStorage で 同 ページ 再 表示 抑止
- **ON/OFF トグル** in popup
- **モバイル 幅 対応** (640px 以下 で レイアウト 切替)
- **アクセシビリティ**: role="dialog"、 aria-label、 close ボタン aria-label

## Tests (69 passing)
- `tests/ingredients.test.js` (10) — 100+ entries、 unique names、 danger has warning、 danger score=0、 findEntry、 indexAliases sort、 love/danger 数 下限
- `tests/detector.test.js` (12) — detectSite (known/unknown)、 5+ サイト、 detectIngredientsFromText (JP/EN/danger/dedupe/empty/longer alias prio)、 detectAndSort (category 順 / score 順)
- `tests/scorer.test.js` (12) — 8 採点 ケース (empty / all love / 1〜3 danger cap / meh only / danger only / love avg bonus / 範囲) + starsFromScore 5 段階 + starsToText
- `tests/reviewer.test.js` (14) — characters 健全 性、 buildReview 9 ケース (empty / love picks / danger / love mention / danger mention / sign-off / determinism / variance / bias / counts)
- `tests/banned.test.js` (7) — findBanned hit/miss、 全 phrase 走査、 dog 名 / 説明、 danger warning、 ingredient 名 走査
- `tests/formatter.test.js` (7) — overlay HTML 生成、 escape、 disclaimer 含む、 close ボタン、 meh chips
- `tests/rand.test.js` (7) — seedFromString deterministic / 差分、 makeRng deterministic / float 範囲 / pick / empty

## Files (8 source / 7 test / 7 extension, ~1,400 LOC)
```
inu-saiten/
├── package.json / .gitignore
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── src/                        # ES module pure logic (Vitest target)
│   ├── ingredients.js          # 100+ 食材 辞書 (love / meh / danger)
│   ├── characters.js           # 4 犬 + 4 voice phrase pool
│   ├── detector.js             # サイト 判定 + 材料 抽出
│   ├── scorer.js               # 採点 + 星
│   ├── reviewer.js             # 1 段落 レビュー 組み立て
│   ├── formatter.js            # overlay HTML 生成 (DOM-free)
│   ├── rand.js                 # xorshift32 + golden warmup
│   └── banned.js               # 監査
├── tests/                      # 7 files / 69 tests
└── extension/                  # Chrome MV3 拡張
    ├── manifest.json
    ├── content.js              # 同 ロジック を classic script で 同梱
    ├── content.css             # glassmorphism overlay
    ├── popup.html / popup.css / popup.js
    ├── background.js
    └── icons/                  # 16/48/128 PNG (PIL 生成)
```

## How to Run
```bash
cd inu-saiten
npm install
npm test                                          # 69 tests
# Chrome で chrome://extensions/ → デベロッパー モード → 「パッケージ 化 されて いない 拡張 機能 を 読み込む」
# inu-saiten/extension/ を 選択
# レシピ ページ を 開く と 上部 に カード が 出る
```

## Challenges & Fixes
- **alias の 短すぎ で 偽陽性**: `油` が `ごま油` `オリーブ油` の 中 に 含まれて 全 油 系 が "サラダ油" と 判定。 `ねぎ` が `玉ねぎ` の 中 に も 含まれて 1 つ の 材料 が 2 つ に 倍々。 全 alias を 監査 し て、 部分 文字列 衝突 する 短 alias (`油`、 `ねぎ`、 `酒`、 `卵黄`、 `卵白`、 `米`、 `鶏がら`) を 削除 か 具体 化。 結果、 同 テスト 文 で score 47 (誤 cap) → 57 (正しい cap) に 修正
- **MV3 で ES module を content script に 使え ない**: 純ロジック を `src/` に ES module で 書き、 同じ ロジック を `extension/content.js` で 自己 完結 の classic script として 再 実装 (テスト は src/ 側 で カバー)。 関数 シグネチャ は 完全 一致 で、 ingredients / phrases も 同 構造
- **all:initial で ホスト CSS と 隔離**: レシピ サイト の グローバル CSS が overlay に 漏れる 問題。 .inu-saiten-* class を 全部 `all:initial` で リセット し てから 必要 な プロパティ だけ 再 設定 (block / display / font-family 等)、 hostpage CSS と 干渉 しない
- **disclaimer 配置**: 「コメディ 拡張 / 飼育 助言 で は ない」 を 各 オーバーレイ の foot に 必ず 載せる、 README と manifest description にも 明記

## Potential Next Steps
- **custom 食材 辞書**: popup で 「うち の 犬 は アレルギー が ある」 を JSON で 追加 (love/meh/danger を override)
- **DOM-based 抽出**: 現状 は textual な substring 一致、 より 精密 な material リスト 抽出 (heuristic で `g/ml/個` の 直前 を 取る)
- **「犬 の 1 日 サマリー」**: 1 日 に 採点 した レシピ を 集計、 「今日 の 犬 の 機嫌」 を popup で 一望
- **共有 カード**: SNS シェア 用 の PNG export (Canvas で render)
- **アプリ 専用 ページ**: extension 内 から 開く 「過去 採点 一覧」 (popup より 広い)
- **多 言語 拡張**: 中国 / 韓国 の レシピ サイト 対応、 各国 の 食材 辞書 を 増やす
- **音声**: 犬 の 「ワン!」 SFX を love brag の とき に 鳴らす (audio API)
