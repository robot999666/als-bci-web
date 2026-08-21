"""Demo 模拟实时数据接口。"""

from datetime import datetime, timezone

from fastapi import APIRouter, Query

from app.api.deps import pipeline
from app.core.config import get_settings
from app.providers import get_provider
from app.schemas.api import DemoSignalsResponse
from app.schemas.signal import SignalData

router = APIRouter(tags=["demo"])


@router.get("/demo/signals", response_model=DemoSignalsResponse)
def get_demo_signals(
    window_seconds: float = Query(5.0, ge=0.5, le=30.0),
) -> DemoSignalsResponse:
    settings = get_settings()
    raw = get_provider("demo").stream_window(window_seconds)
    result = pipeline.run(raw, settings.default_window_seconds, time_reference="epoch")
    return DemoSignalsResponse(
        source="demo",
        sampling_rate_hz=raw.sampling_rate_hz,
        channels=list(raw.channels),
        window_seconds=window_seconds,
        total_samples=len(raw.timestamps),
        signal=SignalData.from_window(result.signal, "epoch"),
        intents=result.intents[: settings.max_intent_windows],
        generated_at=datetime.now(timezone.utc).isoformat(),
    )

