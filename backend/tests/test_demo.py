from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
VALID_LABELS = {"left", "right", "forward", "stop"}


def test_demo_replays_labeled_s3_trials() -> None:
    response = client.get("/api/v1/demo/signals?trial_count=8")
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "demo"
    assert data["channel_layout"] == "3ch"
    assert data["channels"] == ["C3", "Cz", "C4"]
    assert data["trial_count"] == 8
    assert data["window_samples"] == 501
    assert data["batch_coupled_alignment"] is True
    assert data["validation"]["labeled_trials"] == 8
    assert len(data["predictions"]) == 8
    assert {p["expected_class_id"] for p in data["predictions"]} == {0, 1, 2, 3}
    for prediction in data["predictions"]:
        assert prediction["is_mock"] is False
        assert prediction["label"] in VALID_LABELS
        assert 0.0 <= prediction["confidence"] <= 1.0
        assert abs(sum(prediction["probabilities"].values()) - 1.0) < 1e-5


def test_demo_rejects_too_few_trials() -> None:
    response = client.get("/api/v1/demo/signals?trial_count=1")
    assert response.status_code == 422
