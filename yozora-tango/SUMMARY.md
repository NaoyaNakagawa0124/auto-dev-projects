# 夜空単語 (yozora-tango) — Summary

## What was built
深夜 2 時に詰め込み暗記している学生のための、 暗記行為そのものを星座完成ゲームに変える p5.js + Vanilla JS の web アプリ。 5 分のセッション中、 30 件の英単語カードが順に登場し、 「思い出せた」 を 1 タップ するごとに、 現在埋めている星座 (オリオン / はくちょう / カシオペア / こぐま / ペガサス) の次の星が点灯し、 グラフのエッジに沿って光が広がる。 5 つの星座 (合計 28 個の星) を 30 カードで埋める設計。 完成した星座は「夜空コレクション」 に永続化、 streak も連勝も無い。

## Discovery Roll
- **Source 12**: Science breakthroughs / space news
- **Persona 8**: 深夜 2 時に詰め込み勉強する学生
- **Platform 19**: p5.js / Three.js creative coding
- **Intent 5**: 夢中にさせる — 時間を忘れるか

Intent 5 は、 「勉強から学生を引きはがして時間を忘れさせる」 という形で使うと害悪になる。 そこで本作では、 Intent 5 を **暗記行為そのものに適用する** という決断をした。 暗記を「星座を完成させる」 という小さな中毒に置き換えることで、 詰め込みの単調さを和らげる。

## Tech Stack
- Vanilla HTML + CSS + ES Module + p5.js 1.10 (CDN)
- 純ロジック (cards / constellations / game / rand) は src/ に分離、 p5.js / DOM 非依存
- xorshift32 + golden-ratio warmup (aisaji で学んだパターンの再利用)
- p5.js は instance mode で sketch を起動・停止、 DOM ライフサイクルと連動
- localStorage で「夜空コレクション」 永続化、 streak は記録しない (完成回数のみ)
- Vitest で 36 ユニットテスト

## Features
- 30 件の英単語カード (中・高校レベル、 abandon / acquire / candid / diminish / meticulous / scrutinize など)、 各カードに hint (品詞) 付き
- 5 つの星座 (オリオン 7 / はくちょう 5 / カシオペア 5 / こぐま 7 / ペガサスの大四辺形 4 = 合計 28 点)、 各星座は graph として points + edges で定義
- 5 分のセッションタイマー、 残り時間 + 完成星座数を HUD に表示
- p5.js canvas: 動く小さな星 60 個の twinkling 背景、 現在の星座を unit-square 0..1 で配置、 点灯済み星は灯火色 + glow halo、 完成エッジは灯火色の線で結ばれる
- 「思い出せた」 (Space / →) と「忘れた」 (←) のキーボード対応
- セッション完了後 → コレクション保存 → ねぎらい文 (CLOSERS 4 種、 banned-word audit 済み) で締め
- 禁止語監査 (「連勝」 「達成」 「完璧」 「神レベル」 「最強」 「革命的」) を全 UI テキスト + 暗記 jp 訳に対して Vitest で audit
- 「夜空コレクション」 が intro 画面の details で見られる、 各星座の完成回数を表示

## Tests (36 passing)
- `tests/cards.test.js` (9) — 30 件、 id / en / jp 重複なし、 en 3 字以上、 jp 20 字以内、 hint 必須、 BANNED_WORDS フリー、 cardById 動作
- `tests/constellations.test.js` (10) — 5 件、 id / jp 重複なし、 各 4-7 点、 全点が unit square 内、 edge が有効な index、 各 constellation が連結グラフ、 全点合計 28、 deck サイズ以下、 constellationById 動作
- `tests/game.test.js` (13) — 初期化、 seed 一致 / 違い、 hit で点灯 + card 進む、 miss で星埋まらない、 星座完成で次へ進む、 5 星座完成でセッション終了、 summary シェイプ、 card 切れでセッション終了、 終了後の hit/miss は finished、 CLOSERS が BANNED_WORDS フリー、 closerFor deterministic
- `tests/rand.test.js` (4) — 同 seed 一致、 違う seed 違う、 shuffleInPlace 要素保存、 出力 [0, 1)

## Files (10 source files, ~700 LOC + 365 test LOC)
```
yozora-tango/
├── package.json           # vitest dev dep
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── src/
│   ├── rand.js            # xorshift32 + warmup
│   ├── cards.js           # 30 vocab cards + BANNED_WORDS
│   ├── constellations.js  # 5 constellations as graphs (28 stars)
│   └── game.js            # GameSession class + CLOSERS
├── tests/                 # 4 files / 36 tests
└── web/
    ├── index.html         # intro / round / result 3-screen layout
    ├── style.css          # 紙 backdrop + 紺夜空
    └── app.js             # session orchestration + p5.js sketch
```

## How to Run
```bash
cd yozora-tango
npm install
npm test                          # 36 tests

# 配信 — プロジェクトルートから (web/app.js が ../src を import するため)
python3 -m http.server 8080
# http://localhost:8080/web/
```

## Challenges & Fixes
- **Intent 5 の使い方**: 詰め込み勉強生に「時間を忘れる」 ものを与えると勉強が止まる害悪。 「暗記行為そのものを addictive にする」 という方向にひねって、 5 分のセッションに区切ることで「沼にハマらない夢中」 を作った
- **p5.js とテストの分離**: p5.js は CDN + window.p5 でロードされる前提なので、 unit test できない。 純ロジック (cards / constellations / game) は src/ に完全分離し、 Vitest はそこだけ叩く。 web/app.js が DOM + p5 とつながる薄いラッパー
- **xorshift32 の小さい seed バイアス**: aisaji で踏んだので予防適用。 golden-ratio (0x9e3779b1) と XOR + 3 ラウンドの warmup を入れて、 seed=1, 2, 3 でも分散する
- **星座データを「連結グラフ」 として検証**: constellation の edges が全 points を連結する保証が必要 (孤立した点があると視覚的に意味不明)。 BFS 風の reachability テストを書いた

## Potential Next Steps
- 暗記カードのデータパック切替 (歴史用語 30、 数式記号 30、 古文単語 30 など)
- 星座の数を 5 → 12 に増やし、 12 月分の月別星座コレクション (例: 5 月 = ヘラクレス、 6 月 = からす)
- 「今夜のお題」 を時刻別 (22 時 = 短文 / 2 時 = 単語のみ / 4 時 = 復習) に切り替え
- 完成した星座を SVG エクスポート (Tumblr / X に貼れる)
- 「友達と同じ星座」 を 2 人で完成させる協力モード (Intent 7 へスライド)
- 学習履歴の週ビュー (streak ではなく、 単純な完成カウントの棒グラフ)
- 暗記カードに音声合成発音をつける (Web Speech API)
