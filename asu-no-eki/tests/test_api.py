from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from asu_no_eki.server import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_healthz(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_list_stations_returns_thirty(client):
    r = client.get("/api/stations")
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body, list)
    assert len(body) == 30


def test_list_stations_shape(client):
    r = client.get("/api/stations")
    body = r.json()
    for s in body:
        assert {"id", "jp", "kana", "ring_index", "event_count"} <= set(s.keys())


def test_list_stations_is_ring_ordered(client):
    body = client.get("/api/stations").json()
    indices = [s["ring_index"] for s in body]
    assert indices == sorted(indices)


def test_station_detail_known(client):
    r = client.get("/api/stations/tokyo")
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == "tokyo"
    assert body["jp"] == "東京"
    assert isinstance(body["events"], list)
    assert len(body["events"]) >= 1


def test_station_detail_unknown_returns_404(client):
    r = client.get("/api/stations/no-such-station")
    assert r.status_code == 404


def test_today_endpoint_shape(client):
    r = client.get("/api/today")
    assert r.status_code == 200
    body = r.json()
    assert "date" in body
    assert "station" in body
    assert body["station"]["events"]


def test_today_endpoint_returns_a_real_station(client):
    body = client.get("/api/today").json()
    all_ids = {s["id"] for s in client.get("/api/stations").json()}
    assert body["station"]["id"] in all_ids


def test_index_renders_html(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "明日の駅" in r.text
    # ring SVG should be present
    assert "ring" in r.text.lower() or "svg" in r.text.lower()


def test_index_includes_today_station_name(client):
    today_body = client.get("/api/today").json()
    name = today_body["station"]["jp"]
    r = client.get("/")
    assert name in r.text
