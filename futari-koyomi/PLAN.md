# futari-koyomi — 実装 計画

## Phase 1: Scaffold
- pyproject.toml
- README / CLAUDE / PLAN / .gitignore

## Phase 2: ドメイン ロジック (app/)
- `app/holidays.py` — 366 件 の micro-holiday データ + 3 ritual ずつ
- `app/store.py` — JSON 永続 化、 promise / timeline / settings
- `app/banned.py` — BANNED_WORDS 監査

## Phase 3: FastAPI + テンプレート
- `app/main.py` — FastAPI app、 ルーティング、 起動 時 store 初期化
- `app/templates/index.html` — Jinja2 ダッシュボード
- `app/static/style.css` — クリーム + 茶 系
- `app/static/app.js` — fetch ポーリング 10 秒

## Phase 4: Tests
- `tests/test_holidays.py` — 366 件、 ritual 3 件 ずつ、 各 ritual 30-80 字、 重複 なし
- `tests/test_store.py` — load/save、 promise lifecycle、 timeline append、 reset_day
- `tests/test_routes.py` — TestClient で 全 ルート の 200 確認、 状態 遷移
- `tests/test_banned.py` — 全 文字列 監査

## Phase 5: Verify
- `pytest` で 全 PASS
- `uvicorn app.main:app` で 起動 して smoke
- HTTP で `/api/state`, `/`, `/api/set-promise` を curl

## Phase 6: Polish
- BANNED 監査
- README / CLAUDE 最終 確認
- dashboard + commit + push
