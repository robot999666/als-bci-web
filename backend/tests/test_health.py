from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "als-bci-demo-v0"
    assert data["version"]
    assert data["time"]


def test_root() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert "/docs" in response.json()["docs"]

