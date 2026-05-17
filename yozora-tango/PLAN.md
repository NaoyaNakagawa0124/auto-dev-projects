# PLAN — 夜空単語

## Phase 1: 純ロジック (10 min)
- `src/rand.js` — xorshift32 + golden-ratio warmup (aisaji の実装を再利用)
- `src/cards.js` — 30 件の英単語カード (中学・高校レベル)、 {id, en, jp, hint}
- `src/constellations.js` — 5 つの星座、 各 4-7 個の星座点 (相対座標)
- `src/game.js` — GameSession class:
  - new GameSession(seed): カードをシャッフルし、 星座を順に進めるための状態を初期化
  - currentCard(): 今提示中のカード
  - hit(): 思い出せた、 次の星を点灯 + 線を引く
  - miss(): 忘れた、 次のカードへ (星は埋まらない)
  - completedConstellations(): 完成した星座のリスト
  - summary(): セッション終了時の集計

## Phase 2: vitest (5 min)
- `tests/cards.test.js` — 30 件、 id 重複なし、 en/jp 重複なし、 文字数の上下限
- `tests/constellations.test.js` — 5 件、 名前重複なし、 各星座 4-7 点、 全点の合計 = カードと整合
- `tests/game.test.js` — 初期化、 hit/miss 動作、 5 星座完成のロジック、 deterministic
- `tests/rand.test.js` — seed 一致

## Phase 3: p5.js sketch (10 min)
- `web/index.html` — p5.js CDN、 canvas、 UI overlay (現在カード / 思い出せた / 忘れた / 残り時間)
- `web/sketch.js` — p5.js instance mode で:
  - 紺色の星空 (背景にゆっくり動く小さな星)
  - 星座の点を相対座標で配置、 点灯済みは灯火色、 未点灯は薄い
  - 隣り合う点同士に線を引く (constellation graph)
  - カードオーバーレイ (中央上、 半透明)
- `web/style.css` — 紙色 backdrop + 紺夜空

## Phase 4: 永続化 + 完成画面 (3 min)
- localStorage に「これまで完成した星座 + 完成日時」 を保存
- セッション完了後、 「コレクション」 を見せるシンプルな grid

## Phase 5: dashboard + commit (3 min)
