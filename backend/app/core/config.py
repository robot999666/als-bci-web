"""全局配置：所有可调参数集中管理，可通过环境变量、backend/.env 或根目录 .env 覆盖。"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parents[2]
_REPO_DIR = _BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=[_REPO_DIR / ".env", _BACKEND_DIR / ".env"],
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ALS-BCI V0 Demo"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"

    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # 公网前端地址（由根目录 .env 提供；支持逗号分隔配置多个来源，
    # 例如 https://a.example.com,https://b.example.com）
    public_frontend_url: str | None = None

    @property
    def effective_cors_origins(self) -> list[str]:
        """CORS 白名单 = 本地开发地址 + 根目录 .env 中的公网前端地址。"""
        origins = list(self.cors_origins)
        if self.public_frontend_url:
            for raw in self.public_frontend_url.split(","):
                url = raw.strip().rstrip("/")
                if url and url not in origins:
                    origins.append(url)
        return origins

    # 上传/响应限制
    max_upload_mb: int = 20
    max_intent_windows: int = 100

    # BCI 四分类冷启动模型
    bci_sampling_rate_hz: int = 250
    bci_window_samples: int = 501
    bci_max_decompressed_mb: int = 64
    bci_max_concurrent_inferences: int = 1
    bci_demo_trials: int = 8


@lru_cache
def get_settings() -> Settings:
    return Settings()
