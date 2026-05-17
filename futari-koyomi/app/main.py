from __future__ import annotations

import datetime as _dt
from pathlib import Path

from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.holidays import get_holiday
from app.store import Store


app = FastAPI(title="ふたり暦")

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

store = Store()


def _today() -> _dt.date:
    return _dt.date.today()


def _state_payload() -> dict:
    today = _today()
    holiday = get_holiday(today)
    state = store.get_state()
    promise = None
    if state.promise and state.promise.date == today.isoformat():
        promise = {
            "date": state.promise.date,
            "holiday_id": state.promise.holiday_id,
            "ritual_index": state.promise.ritual_index,
            "ritual_text": state.promise.ritual_text,
            "status": state.promise.status,
            "note": state.promise.note,
            "set_at": state.promise.set_at,
            "done_at": state.promise.done_at,
        }
    timeline = [
        {
            "date": e.date,
            "holiday_name": e.holiday_name,
            "ritual_text": e.ritual_text,
            "status": e.status,
            "note": e.note,
        }
        for e in state.timeline[-7:][::-1]
    ]
    return {
        "today": today.isoformat(),
        "weekday": _weekday_jp(today),
        "holiday": {
            "date_key": holiday.date_key,
            "name": holiday.name,
            "source": holiday.source,
            "tag": holiday.tag,
            "rituals": list(holiday.rituals),
        },
        "promise": promise,
        "timeline": timeline,
    }


def _weekday_jp(d: _dt.date) -> str:
    return ["月", "火", "水", "木", "金", "土", "日"][d.weekday()] + "曜"


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    payload = _state_payload()
    return templates.TemplateResponse(request, "index.html", {"state": payload})


@app.get("/api/state")
def api_state():
    return _state_payload()


@app.post("/api/set-promise")
def api_set_promise(body: dict = Body(...)):
    idx = body.get("ritual_index")
    if not isinstance(idx, int) or idx < 0 or idx > 2:
        raise HTTPException(status_code=400, detail="ritual_index must be 0-2")
    today = _today()
    holiday = get_holiday(today)
    ritual = holiday.rituals[idx]
    promise = store.set_promise(holiday.date_key, idx, ritual)
    return {"ok": True, "promise": _promise_dict(promise)}


@app.post("/api/mark-done")
def api_mark_done(body: dict = Body(default={})):
    note = (body or {}).get("note") or None
    promise = store.mark_done(note)
    if not promise:
        raise HTTPException(status_code=400, detail="no promise set today")
    return {"ok": True, "promise": _promise_dict(promise)}


@app.post("/api/clear-promise")
def api_clear_promise():
    store.clear_promise()
    return {"ok": True}


@app.get("/api/timeline")
def api_timeline(n: int = 30):
    n = max(1, min(366, n))
    entries = store.recent_timeline(n)
    return {
        "entries": [
            {
                "date": e.date,
                "holiday_name": e.holiday_name,
                "ritual_text": e.ritual_text,
                "status": e.status,
                "note": e.note,
            }
            for e in entries
        ]
    }


def _promise_dict(p) -> dict:
    return {
        "date": p.date,
        "holiday_id": p.holiday_id,
        "ritual_index": p.ritual_index,
        "ritual_text": p.ritual_text,
        "status": p.status,
        "note": p.note,
        "set_at": p.set_at,
        "done_at": p.done_at,
    }
