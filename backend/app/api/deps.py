"""共享依赖：BCI 模型单例与推理并发限制。"""

import asyncio
from pathlib import Path

from app.core.config import get_settings
from app.services.bci_model_service import Bci4ClassService
from app.services.project_assistant import ProjectAssistantService

settings = get_settings()
bci_service = Bci4ClassService()
inference_semaphore = asyncio.Semaphore(settings.bci_max_concurrent_inferences)
assistant_service = ProjectAssistantService(
    settings=settings,
    repo_dir=Path(__file__).resolve().parents[3],
)
