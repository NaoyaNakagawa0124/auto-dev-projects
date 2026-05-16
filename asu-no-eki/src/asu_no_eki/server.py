"""FastAPI app — read-only API + Jinja HTML dashboard.

Routes:
  GET /                       Jinja-rendered dashboard
  GET /api/stations           list of 30 stations (brief)
  GET /api/stations/{id}      full detail for one station
  GET /api/today              today's station + events
  GET /healthz                {"ok": true}
"""

from __future__ import annotations

from dataclasses import asdict
from datetime import date
from importlib import resources
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .rotator import today_station
from .stations import STATIONS, in_ring_order, by_id

PACKAGE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = PACKAGE_DIR.parent.parent

# Templates and static can live at the project root for ergonomic editing.
TEMPLATES_DIR = PROJECT_DIR / "templates"
STATIC_DIR = PROJECT_DIR / "static"


app = FastAPI(title="明日の駅", version="0.1.0")

if STATIC_DIR.is_dir():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

templates = Jinja2Templates(directory=str(TEMPLATES_DIR)) if TEMPLATES_DIR.is_dir() else None


def _station_brief(s) -> dict:
    return {
        "id": s.id,
        "jp": s.jp,
        "kana": s.kana,
        "ring_index": s.ring_index,
        "event_count": len(s.events),
    }


def _station_full(s) -> dict:
    return {
        **_station_brief(s),
        "events": [asdict(e) for e in s.events],
    }


@app.get("/healthz")
def healthz() -> dict:
    return {"ok": True}


@app.get("/api/stations")
def api_stations() -> list[dict]:
    return [_station_brief(s) for s in in_ring_order()]


@app.get("/api/stations/{station_id}")
def api_station_detail(station_id: str) -> dict:
    s = by_id(station_id)
    if s is None:
        raise HTTPException(status_code=404, detail="station not found")
    return _station_full(s)


@app.get("/api/today")
def api_today() -> dict:
    today = date.today()
    s = today_station(today)
    return {
        "date": today.isoformat(),
        "station": _station_full(s),
    }


@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    if templates is None:
        return HTMLResponse(
            "<h1>明日の駅</h1><p>テンプレートが見つかりません。</p>",
            status_code=500,
        )
    today = date.today()
    station = today_station(today)
    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "today": today.isoformat(),
            "today_station": _station_full(station),
            "stations": [_station_brief(s) for s in in_ring_order()],
        },
    )


def main() -> None:  # pragma: no cover — entry point
    import uvicorn
    uvicorn.run("asu_no_eki.server:app", host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":  # pragma: no cover
    main()
