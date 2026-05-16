# asu-no-eki — Conventions

## トーン (絶対)
- 禁止語: 「絶対」 「必ず」 「驚愕」 「衝撃」 「ヤバい」 「神」 「最強」 「革命的」
- 押し付けない: 「毎日チェック!」 「今すぐ訪問!」 のような煽り NG
- 数字は事実ベース: 「2027 年に開業予定」 OK、 「あと N 日!」 はカウントダウン煽りで NG
- 一駅 1 event = 60 字以内、 「ですます」 か 体言止め

## データ
- 山手線 30 駅、 ring_index 0-29 (東京駅 = 0、 時計回り)
- event の type: "redev" 再開発 / "open" OPEN / "close" 閉鎖 / "transit" 交通 / "construction" 工事
- year, month は西暦 (2024-2030 の範囲)
- 公開情報 / 一般に知られた情報をベースに、 創作も少し混じえる (「2026 年 5 月時点で公知の情報」 という前提)

## 配色 (CSS / SVG)
- 紙: #faf6ee
- 墨: #2a2520
- 鈍金: #b8945b (今日の駅、 SVG の dot)
- 朝: #97a7a0 (補助、 dim)
- ライン: #9aaab8 (山手線の輪)

## テスト
- pytest + FastAPI TestClient
- 純ロジック (stations / rotator) → tests/test_*.py、 FastAPI app は server.py の `app` インスタンスから直接 TestClient で動作確認

## Endpoints
- `GET /` -> HTML (Jinja2)
- `GET /api/stations` -> list of brief
- `GET /api/stations/{id}` -> full detail
- `GET /api/today` -> { station, events, date }
- `GET /healthz` -> {"ok": true}
