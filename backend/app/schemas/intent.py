"""BCI 四分类预测结果结构。"""

from typing import Literal

from pydantic import BaseModel

IntentLabel = Literal["left", "right", "forward", "stop"]


class ClassProbabilities(BaseModel):
    left: float
    right: float
    forward: float
    stop: float


class IntentPrediction(BaseModel):
    """一个 trial 的四分类预测。"""

    trial_index: int
    class_id: int
    label: IntentLabel
    label_zh: str
    confidence: float
    probabilities: ClassProbabilities
    expected_class_id: int | None = None
    correct: bool | None = None
    reason: str
    is_mock: Literal[False] = False
