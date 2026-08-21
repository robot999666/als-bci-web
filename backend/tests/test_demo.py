import numpy as np
from fastapi.testclient import TestClient

from app.main import app
from app.providers.demo_provider import DemoProvider

client = TestClient(app)

VALID_LABELS = {"confirm", "negate", "sos", "none"}


def test_demo_signals_shape() -> None:
    response = client.get("/api/v1/demo/signals?window_seconds=2.0")
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "demo"
    assert "EOG" in data["channels"]
    assert data["signal"]["time_reference"] == "epoch"
    assert data["total_samples"] == 500  # 2s × 250Hz
    for channel in data["channels"]:
        assert len(data["signal"]["values"][channel]) == data["total_samples"]
        assert all(isinstance(v, float) for v in data["signal"]["values"][channel][:10])
    assert data["intents"], "Demo 窗口内应产生意图结果"
    for intent in data["intents"]:
        assert intent["is_mock"] is True
        assert intent["label"] in VALID_LABELS
        assert 0.0 <= intent["confidence"] <= 1.0
        assert intent["start_time"] <= intent["end_time"]


def test_demo_generator_is_deterministic() -> None:
    provider = DemoProvider()
    t = np.linspace(1_752_000_000.0, 1_752_000_005.0, 1250)
    a = provider.generate(t)
    b = provider.generate(t)
    for channel in a:
        np.testing.assert_array_equal(a[channel], b[channel])


def test_demo_intent_label_variety() -> None:
    """10 秒 Demo 数据应稳定覆盖“确认/否定/无有效意图”等（确定性规则）。"""
    response = client.get("/api/v1/demo/signals?window_seconds=10.0")
    assert response.status_code == 200
    labels = {intent["label"] for intent in response.json()["intents"]}
    assert "confirm" in labels and "none" in labels
    assert labels <= {"confirm", "negate", "sos", "none"}
