import datetime as dt
import importlib
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path, monkeypatch):
    data_path = tmp_path / "state.json"
    monkeypatch.setenv("FUTARI_DATA", str(data_path))
    # Reload app to pick up the new env var
    import app.main as main_module
    importlib.reload(main_module)
    return TestClient(main_module.app)


def test_home_renders(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "ふたり暦" in r.text
    assert "今宵 5 分" in r.text


def test_api_state_returns_today_holiday(client):
    r = client.get("/api/state")
    assert r.status_code == 200
    data = r.json()
    assert "today" in data
    assert "holiday" in data
    assert len(data["holiday"]["rituals"]) == 3
    assert data["promise"] is None


def test_set_promise_and_mark_done_flow(client):
    r1 = client.post("/api/set-promise", json={"ritual_index": 1})
    assert r1.status_code == 200
    assert r1.json()["ok"] is True
    promise = r1.json()["promise"]
    assert promise["ritual_index"] == 1
    assert promise["status"] == "set"

    r2 = client.post("/api/mark-done", json={"note": "ありがとう"})
    assert r2.status_code == 200
    promise2 = r2.json()["promise"]
    assert promise2["status"] == "done"
    assert promise2["note"] == "ありがとう"


def test_set_promise_invalid_index(client):
    r = client.post("/api/set-promise", json={"ritual_index": 5})
    assert r.status_code == 400


def test_set_promise_missing_index(client):
    r = client.post("/api/set-promise", json={})
    assert r.status_code == 400


def test_mark_done_without_promise_400(client):
    r = client.post("/api/mark-done", json={})
    assert r.status_code == 400


def test_clear_promise(client):
    client.post("/api/set-promise", json={"ritual_index": 0})
    assert client.get("/api/state").json()["promise"] is not None
    r = client.post("/api/clear-promise")
    assert r.status_code == 200
    assert client.get("/api/state").json()["promise"] is None


def test_timeline_default_n(client):
    r = client.get("/api/timeline")
    assert r.status_code == 200
    data = r.json()
    assert "entries" in data
    assert isinstance(data["entries"], list)


def test_state_returns_three_rituals_strings(client):
    r = client.get("/api/state")
    rituals = r.json()["holiday"]["rituals"]
    assert all(isinstance(x, str) and len(x) >= 10 for x in rituals)
