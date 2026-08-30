"""健康检查接口。"""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.api.deps import bci_service
from app.core.config import get_settings
from app.schemas.api import HealthResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok" if bci_service.ready else "degraded",
        service="als-bci-4class",
        version=settings.app_version,
        time=datetime.now(timezone.utc).isoformat(),
        model_ready=bci_service.ready,
        model_name="EA+FBCSP",
        model_mode="cold_start",
        loaded_layouts=[f"{ch}ch" for ch in sorted(bci_service.models)],
        model_checksums=bci_service.checksums,
        runtime_versions=bci_service.versions,
        model_error=bci_service.error,
    )
