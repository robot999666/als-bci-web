"""FastAPI 应用入口。"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "面向 ALS 重度运动障碍人群的脑电-眼电多模态意图识别系统（V0 科研原型）。\n"
        "本阶段使用确定性 Mock 数据与 Mock 模型，非医疗器械，结果仅供实验演示。"
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "ALS-BCI V0 Demo API",
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }

