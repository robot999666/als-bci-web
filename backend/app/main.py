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
        "面向 ALS 重度运动障碍人群的脑电四分类意图识别系统（科研原型）。\n"
        "使用 EA+FBCSP 冷启动模型识别左转/右转/直行/停止；"
        "非医疗器械，结果仅供科研实验。"
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.effective_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "ALS-BCI 四分类冷启动 API",
        "docs": "/docs",
        "health": f"{settings.api_prefix}/health",
    }
