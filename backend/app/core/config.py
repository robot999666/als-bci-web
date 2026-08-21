"""全局配置：所有可调参数集中管理，可通过环境变量或 backend/.env 覆盖。"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "ALS-BCI V0 Demo"
    app_version: str = "0.1.0"
    api_prefix: str = "/api/v1"

    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Demo 模拟数据源
    demo_sampling_rate_hz: int = 250
    demo_window_seconds: float = 5.0
    demo_channels: list[str] = ["EEG1", "EEG2", "EEG3", "EEG4", "EOG"]
    demo_seed: int = 42

    # 分析参数
    default_window_seconds: float = 2.0
    max_upload_mb: int = 20
    max_display_points: int = 12_000
    max_intent_windows: int = 100


@lru_cache
def get_settings() -> Settings:
    return Settings()

