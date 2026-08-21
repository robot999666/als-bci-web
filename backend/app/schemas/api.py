"""接口响应契约。"""

from typing import Literal

from pydantic import BaseModel

from app.schemas.intent import IntentWindow
from app.schemas.signal import SignalData


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    time: str


class DemoSignalsResponse(BaseModel):
    source: Literal["demo"]
    sampling_rate_hz: int
    channels: list[str]
    window_seconds: float
    total_samples: int
    signal: SignalData
    intents: list[IntentWindow]
    generated_at: str


class AnalyzeResponse(BaseModel):
    source: Literal["upload"]
    filename: str
    sampling_rate_hz: int
    channels: list[str]
    total_samples: int
    signal: SignalData
    intents: list[IntentWindow]
    generated_at: str

