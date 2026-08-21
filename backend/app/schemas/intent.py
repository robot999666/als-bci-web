"""意图识别结果结构。"""

from typing import Literal

from pydantic import BaseModel

IntentLabel = Literal["confirm", "negate", "sos", "none"]


class IntentWindow(BaseModel):
    """一个时间窗的意图识别结果。"""

    index: int
    start_epoch: float
    end_epoch: float
    start_time: str
    end_time: str
    label: IntentLabel
    label_zh: str
    confidence: float
    reason: str
    is_mock: bool = True

