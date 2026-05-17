# ふたり暦 (futari-koyomi) — Summary

## What was built
共働き 夫婦 が 朝 7 時 に 家 を 出て 夜 9 時 に 帰って くる、 ふと 顔 を 合わせる 30 分 の ため に 作った FastAPI ダッシュボード。 366 日 分 の 「今日 は 〇〇 の 日」 を 1 枚 の カード で 出し、 各 日 に 「5 分 で 終わる 一緒 の 何か」 を 3 つ 提案、 タップ で 「今夜 の 約束」 を 確定 する。 やった ら 「やった ね」 ボタン (任意 で 一 言 メモ)、 翌日 に なる と 自動 で ふたり の 暦 に 1 行 残る。 1 年 経つ と 365 件 (+うるう年 1) の 「ふたり の 軌跡」 が 並ぶ。 競争 / streak / 採点 数字 を 一切 出さない、 静か な 「並ぶ ため の 道具」。

同 LAN の 2 端末 で 同じ サーバー を 開けば 状態 が 共有 さ れる (10 秒 ポーリング)。 認証 / アカウント なし、 家 の Wi-Fi に いる 人 が ふたり。

## Discovery Roll
- **Source 27**: Random holiday or cultural event happening today somewhere
- **Persona 26**: 共働き 夫婦
- **Platform 13**: API service + dashboard (FastAPI / Jinja2)
- **Intent 7**: 誰かと一緒に やる — 関係 性 / 共有 / コミュニケーション

Source 27 (今日 は 何 の 日) を 「ふたり が 共通 で 共有 でき る 1 日 の 種」 と 解釈、 Persona 26 (共働き 夫婦) の 「時間 が 揃わ ない」 困難 を 「5 分 だけ なら 揃う」 に 翻案、 Platform 13 (API + ダッシュボード) で LAN 内 共有 を 軽量 に。 Intent 7 は 「煽る 2 人 用」 で は なく 「静か に 揃う 2 人 用」 — streak / 採点 / 通知 は 全 NG と CLAUDE.md に 明記。

## Tech Stack
- **FastAPI 0.115+** (TemplateResponse 新 シグネチャ `(request, "name", ctx)`)
- **Jinja2** for サーバー サイド レンダリング (初期 表示)、 vanilla JS が ポーリング で 更新
- **uvicorn** で 開発 / 起動
- **JSON 永続 化** (`data/state.json`)、 atomic write (.tmp → rename)、 threading.Lock
- **dataclass** で Promise / TimelineEntry / State を 型 安全 に
- **pytest** + **httpx** (TestClient) で route テスト
- 366 日 データ: 80 件 の 手書き curated + 月 × 曜日 modifier の 決定 的 生成 で 残り 286 日 を 埋める ハイブリッド
- ritual テンプレート: 8 タグ × 6 句 ずつ + generic 6 句 = 54 句、 deterministic な hash で 3 つ pick
- 同 LAN の 2 端末 想定、 ポーリング 10 秒、 WebSocket は 入れない

## Features
- 366 件 の micro-holiday — Jan 1 〜 Dec 31 + うるう年 2/29
- 80 件 の curated 実 記念 日 (七草 / 七夕 / こども の 日 / クリスマス / 大晦日 等) + 残り は 月 名 (睦月 / 如月 …) + 曜日 修飾 (整える / 試す / 並ぶ / 数える …) の 組み合わせ で 自動 生成
- 8 タグ (food / nature / culture / work / love / rest / play / memory) + milestone、 タグ ごと に 6 つ の ritual テンプレート
- 「今夜 の 約束」 = 1 日 1 つ、 上書き 可、 タップ で 確定、 「やった ね」 で 完了
- 任意 メモ (80 字 まで) を 「やった ね」 と 一緒 に
- 翌日 0:00 を 跨いだ アクセス で 自動 ロール オーバー (前 日 の 約束 → タイムライン)
- 直近 7 日 の タイム ライン 表示
- 10 秒 ポーリング で 2 端末 同期
- 同 LAN の 2 端末 を 想定、 認証 なし、 家 の Wi-Fi に いる 人 が ふたり
- BANNED_WORDS 監査 (streak / 連勝 / 達成 度 / 効率 / 義務 / ふたり 度 / 夫婦 力 等) を 全 holiday + ritual + UI 文字列 で 走査
- モバイル 幅 (375px) でも 崩れない レイアウト

## Tests (39 passing)
- `tests/test_holidays.py` (14) — 366 件、 ID unique、 元日 / 大晦日 / うるう年 / 七夕 / クリスマス 等 の 名前 確認、 各 holiday に 3 ritual、 ritual 長 さ 10-120 字、 ritual 三 つ が 同 日 内 で distinct、 deterministic、 curated 50+、 タグ 既知、 immutable
- `tests/test_store.py` (11) — load missing、 env override、 set_promise persist、 mark_done、 mark_done 無 promise、 clear_promise、 overwrite、 rollover done/skipped、 timeline 逆順、 corrupt file、 .tmp leftover なし
- `tests/test_routes.py` (9) — GET / レンダリング、 /api/state、 set+mark_done フロー、 無効 index 400、 missing index 400、 mark_done 無 promise 400、 clear、 timeline、 ritual 文字列 型
- `tests/test_banned.py` (4) — find hit/miss、 全 366 holiday + ritual 監査、 _RITUAL_TEMPLATES 内 部 監査、 UI 文字列 監査

## Files (5 source + 5 test + 3 frontend / template / static, ~1,500 LOC)
```
futari-koyomi/
├── pyproject.toml / .gitignore
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app, 6 routes
│   ├── holidays.py                  # 80 curated + filler generator + 54 ritual templates
│   ├── store.py                     # JSON store, Promise/TimelineEntry/State, rollover
│   ├── banned.py
│   ├── templates/index.html         # Jinja2 dashboard
│   └── static/
│       ├── style.css                # クリーム + 茶 系 紙 風 デザイン
│       └── app.js                   # ポーリング 10 秒
└── tests/                           # 4 test files / 39 tests
```

## How to Run
```bash
cd futari-koyomi
pip install -e ".[dev]"
pytest                                          # 39 tests
uvicorn app.main:app --reload --port 8765
# → http://localhost:8765
# 同 LAN の 別 端末 から: http://<your-ip>:8765
```

## Challenges & Fixes
- **366 日 全部 を 手書き する コスト**: 80 件 を 手書き curated 化 し、 残り 286 日 は 月 名 + 曜日 修飾 の 決定 的 生成 で 埋める ハイブリッド に。 ritual も タグ ベース の 54 句 プール から hash で 決定 的 pick、 同 日 で 同じ 3 つ が 出る
- **2 端末 同期 を どう 軽量 に やる か**: WebSocket は 入れず ポーリング 10 秒 で 妥協。 共働き 夫婦 が 朝 〜 夜 で 数 回 開く 程度 の 利用 想定 なら 過剰 な リアル タイム は 不要。 polling は フロント で `setInterval`、 サーバー は 単純 な GET /api/state
- **日付 ロール オーバー の タイミング**: cron 等 で 夜中 に トリガー せず、 「次 に 誰か が ページ を 開いた とき」 に rollover を 実行 する pull モデル。 サーバー が 寝て いて も 大丈夫、 起動 し て いない 日 は タイムライン に 載ら ない (skipped と し て も 残ら ない、 シンプル)。 これ は 「使う 2 人 の リズム に 委ね る」 設計 思想 と 一致
- **FastAPI 0.115+ の TemplateResponse**: 新 API は `(request, "name", ctx)` の 順 (cycle 25 sekai-no-choukan で 学んだ)。 古い `("name", {...})` だと "unhashable type: 'dict'" で 落ちる。 main.py で 新 シグネチャ を 採用

## Potential Next Steps
- カスタム holiday の 追加 (POST /api/holidays で 「結婚 記念 日」 「家族 の 誕生 日」 を 登録)
- ritual の 「気分 で 別 案」 — タップ で 同 タグ 内 で シャッフル
- 過去 365 日 の カレンダー ビュー (1 年 完走 後 解放)
- カップル ペア の 「お互い 別 端末 で だけ 見る」 ノート (右 上 か メモ 欄)
- LINE / Slack 通知 (オプト イン)、 ただし リマインド は 出さ ない (CLAUDE.md と 整合)
- 旅行 中 の 「外 出 先 でも 同じ 暦」 を 共有 する ため の クラウド 同期 (将来 拡張)
- タイム ライン から 「思い出 PDF」 を 1 年 分 export
