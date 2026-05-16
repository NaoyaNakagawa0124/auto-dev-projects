# aisaji (相匙) — Summary

## What was built
スマホ 1 台を 2 人で持って、 90 秒で「今夜の夕飯」 を 2 人の匙加減で決める Vanilla Web ゲーム。 帰宅後に「夕飯どうする?」 で 30 分会議するのを止めるためのアプリ。

タップで開始 → 6 秒ごとに料理カード (家庭料理 + 逃げ道) が切り替わる → 左半分が「あなた」、 右半分が「相手」 のタップゾーンで、 気が向くカードに各自スタンプ → 90 秒経過後、 両方が「OK」 したカードから 1 枚だけ「今夜の夕飯」 として大表示。

streak も連勝も総タップ数も出さず、 終わったら短いねぎらい文 (「今夜は ここまでで 十分です。」 など) で締める。

## Discovery Roll
- **Source 9**: トレンドの食 / レシピ / 外食文化
- **Persona 40**: ストレスを抱えた管理職
- **Platform 1**: Web app (Vanilla)
- **Intent 7**: 誰かと一緒にやる — 2 人で開けるか

オリジナルのプラットフォーム roll は 14 (Godot) だったが、 ローカル環境に Godot が無く Phase 4 quality gate を通せないため Platform のみ rerolled (Source / Persona / Intent はそのまま)。

## Tech Stack
- Vanilla HTML + CSS + ES Module (ビルドツール無し、 単一 HTML 配信)
- 純 JS ロジック (cards / rand / pickHand / judge / timer) は src/ に分離、 web/app.js だけが DOM を触る
- xorshift32 シードランダム + golden-ratio warmup (小さい seed の偏り対策)
- localStorage で 7 日分の履歴
- Vibration API (オプトイン: ブラウザが対応していれば触覚フィードバック)
- Vitest で 28 ユニットテスト (DOM 触らず純ロジックのみ)

## Features
- 1 タップで始まる 90 秒の round、 6 秒ごとに 15 枚のカードが順番に表示
- 各カードに 1-2 文字の glyph + 料理名 + tone (rice / meat / fish / veg / soup / sweet / escape) で色分け
- エスケープカード (4 件: 外食 / 冷凍餃子 / ピザ宅配 / 茶漬けでいい) は必ず 1 枚以上混じる、 斜線ハッチで視覚的に区別
- 左半分 / 右半分の split tap zone、 タップで「✓ 気が向く」 にトグル
- 終了時に judge() が結果を返し、 両方が OK したカードからランダム 1 枚を選ぶ (0 枚なら「外食でいい」 結果)
- ねぎらい文 6 種、 禁止語監査 (`頑張` `努力` `達成` `ナイス` `すごい` `天才` `クリア` `連勝` `完璧` `完了`) を Vitest で audit
- 履歴は「きょう N 回引きました / さっきは X」 だけを 1 行で footer に表示 (streak 表示なし、 連勝記録なし)

## Tests (28 passing)
- `tests/cards.test.js` (7) — 料理 40 件 / 逃げ道 4 件 / id 重複なし / glyph 1-2 字 / tone がパレットに含まれる / escape は tone=escape / cardById 動作
- `tests/rand.test.js` (4) — 同 seed で同じ列 / 違う seed で違う列 / shuffleInPlace は要素保存 / pickIndex 範囲内
- `tests/pickHand.test.js` (6) — サイズ通り / 決定的 / 違う seed で違う / 重複なし / escape 最低 1 枚 / 最小サイズ 2 にクランプ
- `tests/judge.test.js` (7) — 0 候補 / 1 候補 / 多候補で決定的 / 違う seed で picks 散る / CLOSERS 禁止語フリー / noone メッセージ禁止語フリー / decided メッセージが料理名を含む
- `tests/timer.test.js` (4) — onEnd 1 回 / onCardChange 単調増加 / index は handSize-1 で停止 / stop で tick 停止

## Files (10 source, ~2,955 LOC w/ tests)
```
aisaji/
├── package.json          # vitest dev dep
├── README.md
├── PLAN.md
├── CLAUDE.md
├── SUMMARY.md            # ← this file
├── .gitignore
├── src/
│   ├── rand.js           # xorshift32 + warmup
│   ├── cards.js          # 40 dishes + 4 escapes
│   ├── pickHand.js       # deterministic n-card hand
│   ├── judge.js          # both-ok matching + closers + banned words
│   └── timer.js          # createRound + fakeClock
├── tests/                # 5 files / 28 tests
└── web/
    ├── index.html
    ├── style.css         # 紙 / 灯火 / 朝 のパレット
    └── app.js            # DOM + screen transitions + history
```

## How to Run
```bash
cd aisaji
npm install
npm test                       # 28 tests

# 配信 — プロジェクトルート から起動 (web/app.js が ../src を import するため)
python3 -m http.server 8080
# http://localhost:8080/web/
```

スマホ で開く場合は、 macOS 側で `ifconfig | grep "inet "` で IP を見つけて、 同じネットワークのスマホで `http://<mac-IP>:8080/web/` にアクセス。

## Challenges & Fixes
- **xorshift32 の小さい seed バイアス**: seed=1, 2, 3... のような小さい値だと、 最初の rng() 呼び出しが常に 0 に近い値を返してしまい、 違う seed でも判定結果が同じになる現象。 `tests/judge.test.js` の「違う seed で異なる pick」 テストで顕在化。 修正は seed 初期化時に golden-ratio (0x9e3779b1) と XOR + 3 ラウンドの warmup を入れること。 これで 1 桁 seed でも完全に分散
- **`web/app.js` から `../src/` を import する配信パス問題**: ES module の relative import が成立するためには、 HTTP server のルートが プロジェクト直下である必要がある (`-d web` 起動だと src/ が見えない)。 README / SUMMARY で配信コマンドを明示
- **1 人プレイモードの誘惑**: Intent 7 が 「2 人で開けるか」 が判定基準なので、 1 人モードを実装しなかった。 左右の同時タップを促す UI 設計を選んだ
- **streak / 達成感の誘惑**: ストレス管理職向けゲームは「達成感を与えれば中毒する」 と思いがちだが、 Intent と矛盾する。 禁止語テストで自分のねぎらい文に「頑張」 「達成」 「連勝」 「完璧」 が入らないことを毎ビルドで保証

## Potential Next Steps
- Web Audio で 90 秒のタイマー音 (5 秒ごとの極小ピアノ音、 opt-in)
- 「外食でいい」 結果のときに付近のお店検索ボタン (Google Maps deep link)
- 履歴を週ビュー / 月ビューで可視化 (ただし streak / 連勝として演出しない、 単純な一覧のみ)
- 「先週の月曜は カレーでした」 のような中立的振り返り
- 子供向けカードを別パックで追加 (e.g.「カレー (中辛)」 「カレー (甘口)」)
- 60 秒 / 120 秒の長さ選択 (デフォルトは 90 秒のまま)
- PWA 化 (オフライン対応)
