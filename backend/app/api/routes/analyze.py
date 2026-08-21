"""CSV 上传分析与模拟意图识别接口。"""

from datetime import datetime, timezone

from fastapi import APIRouter, File, Form, UploadFile

from app.api.deps import pipeline
from app.core.config import get_settings
from app.schemas.api import AnalyzeResponse
from app.schemas.signal import SignalData
from app.services.csv_reader import read_upload_csv

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file: UploadFile = File(...),
    window_seconds: float = Form(2.0, ge=1.0, le=10.0),
) -> AnalyzeResponse:
    settings = get_settings()
    content = await file.read()
    raw = read_upload_csv(file.filename or "upload.csv", content)
    result = pipeline.run(raw, window_seconds, time_reference=raw.time_reference)
    display = pipeline.processor.downsample_for_display(result.signal, settings.max_display_points)
    return AnalyzeResponse(
        source="upload",
        filename=file.filename or "upload.csv",
        sampling_rate_hz=raw.sampling_rate_hz,
        channels=list(raw.channels),
        total_samples=len(raw.timestamps),
        signal=SignalData.from_window(display, raw.time_reference),
        intents=result.intents[: settings.max_intent_windows],
        generated_at=datetime.now(timezone.utc).isoformat(),
    )

