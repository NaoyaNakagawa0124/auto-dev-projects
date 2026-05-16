# PLAN — 明日の駅

## Phase 1: stations.py (静的データ、 7 min)
- 山手線 30 駅、 北行 (東京→上野→田端→...→品川→東京) の順番
- 各駅: { id, jp, kana, ring_index (0-29), events: [...] }
- events の各 item: { year, month, type, blurb }
  - type: "redev"(再開発) / "open"(OPEN) / "close"(閉鎖) / "transit"(交通) / "construction"(工事)
- 全 30 駅 × 3-4 events = 約 100 件、 全部静的データ
- 禁止語: 「絶対」 「必ず」 「驚愕」 「衝撃」 「ヤバい」

## Phase 2: rotator.py (日付選び、 2 min)
- `today_station_id(date)` で date.toordinal() % 30 で deterministic に 1 駅を選ぶ
- これで毎日違う駅、 30 日で一周

## Phase 3: server.py (FastAPI、 8 min)
- `GET /` — HTML dashboard (Jinja2 で templates/index.html を返す)
- `GET /api/stations` — 全 30 駅の (id, jp, ring_index, event_count) リスト
- `GET /api/stations/{id}` — 特定駅の詳細 (events 含む)
- `GET /api/today` — 今日の駅 + その events
- `GET /healthz` — 単純な OK
- 静的ファイルは /static/ にマウント

## Phase 4: templates/index.html + static/app.js + style.css (8 min)
- SVG で 30 駅を円形に配置 (山手線環状図風)、 今日の駅は鈍金で大きく
- クリックで右ペインに event リスト
- 上部に「今日の一駅: 〇〇」 ハイライト
- 配色: 紙白 + 駅は墨、 今日は灯火色

## Phase 5: テスト (5 min)
- `tests/test_stations.py` — 30 駅、 id 重複なし、 ring_index 0-29 ユニーク、 各駅 events 1+、 禁止語フリー
- `tests/test_rotator.py` — 同日同駅 / 違う日別駅 / 30 日サイクル
- `tests/test_api.py` — TestClient で全 4 エンドポイント、 ステータスコード + シェイプ
