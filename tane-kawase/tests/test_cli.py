from pathlib import Path

from tane_kawase.cli import main
from tane_kawase.storage import load_field


def test_no_args_shows_field_with_invitation(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    rc = main(["--field", str(f)])
    out = capsys.readouterr().out
    assert rc == 0
    assert "畑" in out
    assert "tane-kawase demo" in out


def test_demo_creates_field(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    rc = main(["--field", str(f), "demo", "--name", "ちあき"])
    out = capsys.readouterr().out
    assert rc == 0
    field = load_field(f)
    assert field.my_name == "ちあき"
    assert field.total_packets() >= 3


def test_send_writes_packet_and_logs_to_field(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    packet_path = tmp_path / "packet.json"
    rc = main([
        "--field", str(f),
        "send",
        "--name", "週末の動詞",
        "--topic", "natsu_yasai",
        "--out", str(packet_path),
        "--sender", "ちあき",
        "--receiver", "りん",
        "--language", "en",
        "--letter", "りんへ",
        "--seed", "hang out|だらだら過ごす",
        "--seed", "wing it|ぶっつけ本番|||スピーチで便利",
    ])
    out = capsys.readouterr().out
    assert rc == 0
    assert packet_path.exists()
    field = load_field(f)
    assert len(field.sent_log) == 1
    assert field.sent_log[0]["to"] == "りん"
    assert field.sent_log[0]["seed_count"] == 2


def test_send_rejects_unknown_topic(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    rc = main([
        "--field", str(f),
        "send", "--name", "x", "--topic", "ueeee", "--out", str(tmp_path / "p.json"),
        "--seed", "x|y",
    ])
    out = capsys.readouterr().out
    assert rc == 2
    assert "トピックが不明" in out


def test_send_rejects_no_seeds(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    rc = main([
        "--field", str(f),
        "send", "--name", "x", "--topic", "haru_na", "--out", str(tmp_path / "p.json"),
    ])
    out = capsys.readouterr().out
    assert rc == 2
    assert "種が 1 つもありません" in out


def test_plant_appends_to_field(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    packet_path = tmp_path / "packet.json"
    # Create packet via send first
    main([
        "--field", str(f), "send",
        "--name", "n", "--topic", "haru_na", "--out", str(packet_path),
        "--seed", "a|gloss",
    ])
    capsys.readouterr()
    # Plant it on a fresh field
    other_field = tmp_path / "other.json"
    rc = main(["--field", str(other_field), "plant", str(packet_path)])
    out = capsys.readouterr().out
    assert rc == 0
    assert "畑に植えました" in out
    field2 = load_field(other_field)
    assert field2.total_seeds() == 1


def test_open_previews_without_planting(capsys, tmp_path: Path):
    packet_path = tmp_path / "packet.json"
    f = tmp_path / "field.json"
    main([
        "--field", str(f), "send",
        "--name", "n", "--topic", "haru_na", "--out", str(packet_path),
        "--seed", "term|meaning",
    ])
    capsys.readouterr()
    other_field = tmp_path / "other.json"
    rc = main(["--field", str(other_field), "open", str(packet_path)])
    out = capsys.readouterr().out
    assert rc == 0
    assert "term" in out
    assert "meaning" in out
    field2 = load_field(other_field)
    assert field2.total_seeds() == 0  # didn't plant


def test_open_missing_file(capsys, tmp_path: Path):
    rc = main(["--field", str(tmp_path / "f.json"), "open", str(tmp_path / "nope.json")])
    out = capsys.readouterr().out
    assert rc == 2
    assert "ファイルが見つかりません" in out


def test_plant_missing_file(capsys, tmp_path: Path):
    rc = main(["--field", str(tmp_path / "f.json"), "plant", str(tmp_path / "nope.json")])
    out = capsys.readouterr().out
    assert rc == 2


def test_field_subcommand(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    main(["--field", str(f), "demo", "--name", "ちあき"])
    capsys.readouterr()
    rc = main(["--field", str(f), "field"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "ちあき の畑" in out


def test_stats_subcommand(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    main(["--field", str(f), "demo", "--name", "ちあき"])
    capsys.readouterr()
    rc = main(["--field", str(f), "stats"])
    out = capsys.readouterr().out
    assert rc == 0
    assert "種交わせ 帳" in out


def test_harvest_succeeds(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    main(["--field", str(f), "demo", "--name", "me"])
    capsys.readouterr()
    field = load_field(f)
    seed = field.packets[0].seeds[0]
    rc = main(["--field", str(f), "harvest", seed.id])
    out = capsys.readouterr().out
    assert rc == 0
    assert "収穫" in out
    field2 = load_field(f)
    assert seed.id in field2.harvested


def test_harvest_missing_seed(capsys, tmp_path: Path):
    f = tmp_path / "field.json"
    main(["--field", str(f), "demo"])
    capsys.readouterr()
    rc = main(["--field", str(f), "harvest", "nope-id"])
    out = capsys.readouterr().out
    assert rc == 2
    assert "見つかりません" in out
