# 明日の駅 (asu-no-eki) — Summary

## What was built
1 時間電車通勤する会社員のための、 山手線 30 駅 × 都市計画イベントを 1 駅 3-4 件まとめた FastAPI dashboard。 ブラウザを開くと「今日の一駅」 が日付 (YYYY-MM-DD) を seed にして deterministic に選ばれ、 その駅で進行中の再開発 / OPEN / 工事 / 交通改良 / 閉鎖が 1 行ずつ表示される。 30 日で全駅一周。 streak も「今日も訪問」 のプレッシャーも無し。

通勤の窓越しに見える駅が、 5 年後にどう変わるのか — 「ただ移動するだけの 1 時間」 を「明日の街を知る 1 時間」 に変えるための小さな静かなツール。

## Discovery Roll
- **Source 19**: Infrastructure / civil engineering / urban planning news
- **Persona 19**: 電車通勤 1 時間の会社員
- **Platform 13**: API service + dashboard (FastAPI + Jinja2)
- **Intent 2**: 困ってる人を助ける — 翌日も開きたくなるか

Source と Persona が両方 19 という偶然 — infrastructure と通勤者は同じものを別角度で見ている (作る側と乗る側) という気付きから、 「変化の側 (infrastructure)」 を「乗る側 (通勤者)」 に届けるという構造にした。

## Tech Stack
- Python 3.10+ / FastAPI 0.136 / uvicorn / Jinja2 3.1 / 標準ライブラリ
- 純ロジック (stations / rotator) は src/asu_no_eki/ に分離、 server.py は薄いラッパー
- 30 駅 × 3-4 events = 約 80 件の静的データ (公開情報ベース + 一部創作、 「2026 年 5 月時点で公知」 という前提)
- 5 種類の event type: redev (再開発) / open (OPEN) / close (閉鎖) / transit (交通) / construction (工事)
- 山手線環状図は SVG で client-side レンダリング (Vanilla JS、 ring_index 0-29 で 12 度ずつ)
- pytest + FastAPI TestClient で 28 テスト

## Features
- 山手線 30 駅 (東京 → 有楽町 → 新橋 → 浜松町 → ... → 神田、 時計回り)
- 1 日 1 駅、 `date.toordinal() % 30` で deterministic に選ばれる
- API endpoints:
  - `GET /healthz` — `{"ok": true}`
  - `GET /api/stations` — 全 30 駅 brief リスト (ring_index 順)
  - `GET /api/stations/{id}` — 駅詳細 (events 含む)
  - `GET /api/today` — 今日の駅 + その events + 日付
  - `GET /` — Jinja2 で render する HTML dashboard
- HTML dashboard:
  - 上部に「今日の一駅」 ハイライト (鈍金、 駅名 + events 1 行ずつ + type タグ)
  - 中央に山手線環状図 SVG (30 駅 dot、 今日の駅は灯火色で大きく)
  - 右ペインに「クリックした駅」 の詳細、 駅を クリックすると右ペインが切り替わる
  - 起動時は今日の駅をプリロード
- 禁止語監査 (「絶対」 「必ず」 「驚愕」 「衝撃」 「ヤバい」 「神レベル」 「最強」 「革命的」 「今すぐ訪問」 「毎日チェック」) を pytest で全 blurb に対して audit
- カラータグ: redev=朱、 open=苔、 close=灰桜、 transit=藍、 construction=麦

## Tests (28 passing)
- `tests/test_stations.py` (12) — 30 件、 id 重複なし、 jp 名重複なし、 ring_index 0-29 ユニーク、 sorted、 events 1+、 type 有効、 年 2024-2030、 月 1-12、 blurb 10-80 字、 BANNED_WORDS フリー、 by_id 動作
- `tests/test_rotator.py` (6) — 同日同駅、 連続日異駅、 30 日サイクルで全駅、 offset=0 で today と一致、 offset=30 でラップ、 デフォルトが今日
- `tests/test_api.py` (10) — /healthz、 /api/stations が 30 件、 シェイプ、 ring 順序、 /api/stations/{id} (known + 404)、 /api/today シェイプ、 today が実在駅、 / が HTML 返す、 today station name が HTML に含まれる

## Files (12 source files, ~919 LOC)
```
asu-no-eki/
├── pyproject.toml         # fastapi + uvicorn + jinja2 + pytest + httpx
├── README.md / PLAN.md / CLAUDE.md / SUMMARY.md
├── .gitignore
├── src/asu_no_eki/
│   ├── __init__.py
│   ├── stations.py        # 30 駅 × 80+ events + BANNED_WORDS
│   ├── rotator.py         # today_station(date) + station_for_offset
│   └── server.py          # FastAPI app + Jinja2 templates
├── templates/
│   └── index.html         # Jinja2、 SVG + 3 ペイン
├── static/
│   ├── style.css          # 紙 / 墨 / 鈍金 / 朝色のパレット
│   └── app.js             # SVG クライアントレンダリング + fetch
└── tests/                 # 3 files / 28 tests
```

## How to Run
```bash
cd asu-no-eki
pip install -e ".[test]"
pytest                          # 28 tests
asu-no-eki                      # uvicorn で起動、 http://localhost:8000/
```

## Challenges & Fixes
- **Jinja2 / Starlette の `TemplateResponse` シグネチャ変更**: FastAPI 0.136 + Starlette の新版で TemplateResponse の第 1 引数が context dict から request になっていた。 古いシグネチャ (`TemplateResponse("index.html", {"request": ..., ...})`) を使うと「unhashable type: 'dict'」 が cache key 解決時に発生。 新シグネチャ (`TemplateResponse(request, "index.html", {...})`) に修正
- **Jinja2 で sin / cos が使えない**: テンプレート内で SVG dot を配置しようとしたが、 Jinja2 にはデフォルトで cos / sin フィルタが無い。 client-side (app.js) で computation する方式に切り替えて template から SVG loop を撤去。 これでデータと表現が分離、 メンテも楽
- **80 イベントを書くトーン管理**: 「絶対」 「必ず」 「ヤバい」 のような煽り語が混入しないよう、 BANNED_WORDS を test で全 blurb に対して audit。 30 駅分書く中で 1 度だけ「驚愕」 を使いそうになったが書く前に止めた
- **公開情報と創作のバランス**: 高輪ゲートウェイ、 リニア中央新幹線、 八重洲三丁目、 渋谷サクラステージ など公知の再開発計画 + 「2026 年 5 月時点で公知の情報をベースに」 のディスクレーマーを README に追記

## Potential Next Steps
- 中央線・京王線・小田急など、 他路線への拡張 (stations.py のスキーマはそのまま使える)
- 「明日訪問予定の駅」 を localStorage に保存して、 当該駅の events をプッシュ表示
- event の type フィルタ (「再開発だけ」 「工事だけ」)
- マップ統合 (Leaflet で実際の駅座標と紐付け)
- 駅周辺の現在の写真 (Google Street View deep link) を 1 駅 1 つ
- 毎週月曜日に「今週通る駅」 を 7 駅ピックアップする週ビュー
- API を JSON Lines に変換して機械可読 (Open Data 風)
