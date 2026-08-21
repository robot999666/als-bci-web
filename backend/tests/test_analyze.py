import io
import math

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _make_csv(rows: int = 500, columns: str = "timestamp,EEG1,EEG2,EOG") -> bytes:
    lines = [columns]
    for i in range(rows):
        t = i * 0.004
        eeg1 = 10.0 * math.sin(2 * math.pi * 10.0 * t)
        eeg2 = 8.0 * math.sin(2 * math.pi * 12.0 * t + 0.5)
        eog = 30.0 * math.sin(2 * math.pi * 2.0 * t)
        lines.append(f"{t:.4f},{eeg1:.3f},{eeg2:.3f},{eog:.3f}")
    return "\n".join(lines).encode("utf-8")


def _post(csv_bytes: bytes, filename: str = "demo_eeg.csv") -> object:
    return client.post(
        "/api/v1/analyze",
        files={"file": (filename, io.BytesIO(csv_bytes), "text/csv")},
        data={"window_seconds": "2.0"},
    )


def test_analyze_valid_csv() -> None:
    response = _post(_make_csv())
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "upload"
    assert data["filename"] == "demo_eeg.csv"
    assert data["channels"] == ["EEG1", "EEG2", "EOG"]
    assert data["total_samples"] == 500
    assert data["signal"]["time_reference"] == "relative"
    assert data["intents"], "上传数据应产生意图结果"
    for intent in data["intents"]:
        assert intent["is_mock"] is True
        assert intent["label_zh"]


def test_analyze_rejects_missing_timestamp() -> None:
    response = _post(_make_csv(columns="EEG1,EOG"))
    assert response.status_code == 422
    assert "timestamp" in response.json()["detail"]


def test_analyze_rejects_empty_file() -> None:
    response = _post(b"")
    assert response.status_code == 422


def test_analyze_rejects_non_csv_extension() -> None:
    response = _post(_make_csv(), filename="data.txt")
    assert response.status_code == 422


def test_analyze_rejects_non_numeric_channel() -> None:
    csv_bytes = "timestamp,EEG1,EOG\n0,abc,1\n0.004,def,2\n".encode("utf-8")
    response = _post(csv_bytes)
    assert response.status_code == 422


def test_analyze_epoch_timestamps() -> None:
    rows = ["timestamp,EEG1,EOG"]
    for i in range(100):
        rows.append(f"2026-08-20 10:00:{i % 60:02d},{i},{i * 2}")
    response = _post("\n".join(rows).encode("utf-8"))
    assert response.status_code == 200
    data = response.json()
    assert data["signal"]["time_reference"] == "epoch"
    assert data["signal"]["start_epoch"] is not None

