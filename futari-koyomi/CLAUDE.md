# futari-koyomi — Conventions

## トーン
- 2 人 が お互い 疲れて 帰って くる 前提、 ハイ テンション / 押し付け を 排除
- 「やる べき」 「絶対」 「最高」 「神」 等 の 強い 言葉 は 出さ ない
- 「5 分」 「ちょっと」 「一緒 に」 が 中心 語彙、 「達成」 「効率」 「streak」 は 出さ ない
- 「やった ね」 「お疲れ」 程度 の ねぎらい まで、 「すごい!」 「最高!」 は 過剰
- BANNED_WORDS: 「streak」 「連勝」 「達成 度」 「効率」 「義務」 「サボり」 「お前」 「クソ」 「無能」 「ふたり 度」 「夫婦 力」

## 365 件 の 暦 設計
- 1/1 〜 12/31 の 全 日付 で 「micro-holiday」 を 1 つ、 重複 なし
- 国際 / 日本 / 業界 / 自治体 / 完全 創作 の バランス — 1/3 ずつ 程度
- 日付 → ID は MM-DD 形式 で 固定 (うるう年 2/29 は 2/28 の バリアント)
- 各 holiday は: name (例: 「アイス クリーム の 日」)、 source (例: 「国際 デー」 「日本 記念 日」)、 tag (food / nature / culture 等)、 3 つ の ritual テンプレート

## ritual テンプレート
- 各 holiday に 3 つ の ritual、 すべて 「5 分」 で 終わる ように
- 物 を 買う 必要 が ある もの は NG (在宅 で できる もの 限定)
- 共通 動作 動詞: 「並んで 〇〇 する」 「5 分 話す」 「1 つ ずつ 共有」 「写真 を 1 枚 撮る」
- カテゴリ: 会話 / 視聴 / 手 を 使う / 記録 / 散歩 (ベランダ)

## ステート 機械
- 日付 が 変わる と `tonight_promise` は 自動 リセット (新 日 を 開いた 時)
- promise の status: `none` (未 設定) → `set` (約束 確定) → `done` (やった) → 翌日 timeline へ 移動
- promise を リセット する `clear_promise` も ある

## サーバー
- FastAPI 0.115+ で TemplateResponse 新 シグネチャ (`(request, "name", ctx)`)
- 同期 は ポーリング (フロント で 10 秒 ごと に `/api/state`)、 WebSocket は 入れ ない
- パス: `/` (HTML)、 `/api/state` (GET 全 状態)、 `/api/set-promise` (POST holiday_id+ritual_index)、 `/api/mark-done` (POST note?)、 `/api/clear-promise` (POST)、 `/api/timeline` (GET 直近 N 日)
- データ は `data/state.json` で 永続 化、 起動 時 に 読み込み

## デザイン
- 暖色 系 (クリーム + 茶 + 落ち着いた 朱)、 紙 風 背景、 明朝 と sans を 使い 分け
- カード は 角丸 + 軽い 影、 タップ で アニメ
- フォント: Hiragino Mincho (見出し) + Noto Sans JP (本文)
- モバイル 幅 (375px) で 1 列、 PC 幅 で 2 列 (今夜 の カード + 暦 サイド バー)

## テスト
- `tests/test_holidays.py` — 366 entries、 各 entry に 3 ritual、 ritual 文 の 長さ
- `tests/test_store.py` — promise の lifecycle、 timeline 永続 化、 reset
- `tests/test_routes.py` — GET / POST の 200 OK、 状態 遷移
- `tests/test_banned.py` — 全 文字列 (holidays + rituals + UI) を 監査

## やら ない こと
- アカウント / ログイン / マルチ ペア
- 通知 / リマインド (cron で 毎晩 21 時 に 「やった?」 push 等 — NG)
- streak / 連続 達成 (Intent 7 は 「2 人 で やる」 で あって 「煽る」 で は ない)
- 数値 採点 / グラフ (時間 軸 の 並び だけ)
