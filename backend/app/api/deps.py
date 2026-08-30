"""共享依赖：BCI 模型单例与推理并发限制。"""

import asyncio

from app.core.config import get_settings
from app.services.bci_model_service import Bci4ClassService

settings = get_settings()
bci_service = Bci4ClassService()
inference_semaphore = asyncio.Semaphore(settings.bci_max_concurrent_inferences)
