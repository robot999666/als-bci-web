"""项目知识助手接口契约。"""

from pydantic import BaseModel, Field, field_validator

from app.core.config import get_settings


class AssistantQuestion(BaseModel):
    question: str = Field(min_length=1)

    @field_validator("question")
    @classmethod
    def normalize_question(cls, value: str) -> str:
        question = value.strip()
        if not question:
            raise ValueError("问题不能为空")
        max_chars = get_settings().assistant_question_max_chars
        if len(question) > max_chars:
            raise ValueError(f"问题不能超过 {max_chars} 个字符")
        return question


class AssistantSource(BaseModel):
    title: str
    section: str


class AssistantChatResponse(BaseModel):
    answer: str
    sources: list[AssistantSource]


class AssistantHealthResponse(BaseModel):
    status: str
    rag_ready: bool
    document_count: int
    chunk_count: int
    provider_configured: bool
    model: str
    error: str | None = None
