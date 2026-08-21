"""健康检查接口。"""

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.api import HealthResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service="als-bci-demo-v0",
        version=settings.app_version,
        time=datetime.now(timezone.utc).isoformat(),
    )

