import json
from pathlib import Path

from fastapi.testclient import TestClient

from app.api.deps import assistant_service
from app.core.config import Settings
from app.main import app
from app.services.project_assistant import ProjectAssistantService
from app.services.rag import ProjectKnowledgeIndex

client = TestClient(app)
repo_dir = Path(__file__).resolve().parents[2]


def test_rag_index_loads_and_finds_project_facts() -> None:
    index = ProjectKnowledgeIndex(repo_dir)
    assert index.ready is True
    assert len(index.documents) >= 4
    assert len(index.chunks) > 10

    results = index.search("四分类分别是什么？", top_k=5)
    assert results
    assert any("左转" in result.chunk.text for result in results)


def test_unknown_question_does_not_call_provider() -> None:
    settings = Settings(openai_api_key="test-key", _env_file=None)
    service = ProjectAssistantService(settings, repo_dir)

    response = __import__("asyncio").run(service.chat("火星基地的食堂菜单是什么？"))
    assert response.answer == "当前项目资料中未说明这一内容。"
    assert response.sources == []


def test_service_starts_without_api_key() -> None:
    settings = Settings(openai_api_key=None, _env_file=None)
    service = ProjectAssistantService(settings, repo_dir)
    assert service.index.ready is True
    assert service.provider_configured is False


def test_assistant_health_never_returns_key() -> None:
    response = client.get("/api/v1/assistant/health")
    assert response.status_code == 200
    data = response.json()
    assert data["rag_ready"] is True
    assert data["document_count"] >= 4
    assert data["model"] == "deepseek-v4-flash-0731"
    assert "api_key" not in data
    assert "key" not in json.dumps(data).lower()


def test_chat_requires_provider_configuration(monkeypatch) -> None:
    monkeypatch.setattr(assistant_service.settings, "openai_api_key", None)
    response = client.post(
        "/api/v1/assistant/chat",
        json={"question": "这个项目解决什么问题？"},
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "项目知识服务暂时不可用，请稍后再试。"


def test_question_length_is_limited() -> None:
    response = client.post(
        "/api/v1/assistant/chat",
        json={"question": "问" * 501},
    )
    assert response.status_code == 422
