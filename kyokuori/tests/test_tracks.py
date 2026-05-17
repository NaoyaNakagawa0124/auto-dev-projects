from __future__ import annotations

from kyokuori.tracks import TRACKS, BANNED_WORDS, by_id, top_n


def test_thirty_tracks():
    assert len(TRACKS) == 30


def test_track_ids_unique():
    ids = [t.id for t in TRACKS]
    assert len(set(ids)) == len(ids)


def test_chart_ranks_are_unique_and_1_to_30():
    ranks = sorted(t.chart_rank for t in TRACKS)
    assert ranks == list(range(1, 31))


def test_bpm_in_reasonable_range():
    for t in TRACKS:
        assert 60 <= t.bpm <= 200, f"{t.id} bpm out of range: {t.bpm}"


def test_key_in_range():
    for t in TRACKS:
        assert 0 <= t.key <= 11, f"{t.id} key out of range: {t.key}"


def test_mode_is_binary():
    for t in TRACKS:
        assert t.mode in (0, 1), f"{t.id} mode invalid: {t.mode}"


def test_features_in_unit_interval():
    for t in TRACKS:
        for v in (t.energy, t.valence, t.danceability):
            assert 0.0 <= v <= 1.0, f"{t.id} feature out of range: {v}"


def test_no_banned_words_in_artist_or_title():
    for t in TRACKS:
        for w in BANNED_WORDS:
            assert w not in t.artist, f"banned '{w}' in artist of {t.id}"
            assert w not in t.title,  f"banned '{w}' in title of {t.id}"


def test_by_id_resolves():
    assert by_id("espresso").artist == "Sabrina Carpenter"
    assert by_id("not-a-real-id") is None


def test_top_n_returns_in_rank_order():
    top = top_n(5)
    assert len(top) == 5
    assert [t.chart_rank for t in top] == [1, 2, 3, 4, 5]
