"""NPZ 批量冷启动分析接口。"""

import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.api.deps import bci_service, inference_semaphore
from app.schemas.api import AnalyzeResponse
from app.services.bci_response import build_bci_response
from app.services.npz_reader import read_bci_npz

router = APIRouter(tags=["analyze"])
LOGGER = logging.getLogger(__name__)


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    file: UploadFile = File(...),
    sampling_rate_hz: int = Form(250),
    unit: str = Form("uV"),
) -> AnalyzeResponse:
    content = await file.read()
    filename = file.filename or "upload.npz"
    try:
        batch = read_bci_npz(filename, content, sampling_rate_hz, unit)
        if not bci_service.ready:
            raise HTTPException(
                status_code=503,
                detail=f"BCI 模型未就绪：{bci_service.error or '未知错误'}",
            )
        async with inference_semaphore:
            probabilities = await run_in_threadpool(
                bci_service.predict_proba, batch.x
            )
        return build_bci_response(
            source="upload",
            filename=filename,
            x=batch.x,
            y=batch.y,
            probabilities=probabilities,
        )
    except HTTPException:
        raise
    except Exception as exc:
        LOGGER.exception("BCI analyze failed filename=%s", filename)
        raise HTTPException(status_code=500, detail=f"模型推理失败：{type(exc).__name__}")
