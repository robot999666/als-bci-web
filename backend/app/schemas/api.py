"""接口响应契约。"""

from typing import Literal

from pydantic import BaseModel

from app.schemas.intent import IntentPrediction
from app.schemas.signal import SignalData


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    time: str
    model_ready: bool
    model_name: str
    model_mode: str
    loaded_layouts: list[str]
    model_checksums: dict[str, str]
    runtime_versions: dict[str, str]
    model_error: str | None = None


class ValidationMetrics(BaseModel):
    labeled_trials: int
    correct_trials: int
    accuracy: float


class BciBatchResponse(BaseModel):
    source: Literal["demo", "upload"]
    filename: str | None = None
    model_name: str = "EA+FBCSP"
    model_mode: Literal["cold_start"] = "cold_start"
    sampling_rate_hz: int
    channel_layout: Literal["3ch", "22ch"]
    channels: list[str]
    trial_count: int
    window_samples: int
    total_samples: int
    signal: SignalData
    predictions: list[IntentPrediction]
    validation: ValidationMetrics | None = None
    batch_coupled_alignment: Literal[True] = True
    generated_at: str


class DemoSignalsResponse(BciBatchResponse):
    source: Literal["demo"]


class AnalyzeResponse(BciBatchResponse):
    source: Literal["upload"]
    filename: str
