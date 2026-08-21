"""模型服务抽象：上层 API 只依赖 ModelService.predict，不关心具体实现。

TODO(真实模型): 未来按同一契约接入——
- PyTorchModelService: 加载 .pt/.pth 模型，将窗口特征/片段转为张量推理；
- ONNXModelService: 通过 onnxruntime 加载 .onnx 模型；
- EdgeDeviceModelService: 调用边缘设备/穿戴终端的推理接口。
新增实现只需在 app/api/deps.py 的 Pipeline 构造处替换为真实服务。
"""

from dataclasses import dataclass
from typing import Protocol

from app.services.signal_processor import WindowFeatures

LABELS: dict[str, str] = {
    "confirm": "确认",
    "negate": "否定",
    "sos": "紧急求助",
    "none": "无有效意图",
}


@dataclass(frozen=True)
class IntentPrediction:
    label: str
    label_zh: str
    confidence: float
    reason: str


class ModelService(Protocol):
    def predict(self, features: WindowFeatures) -> IntentPrediction:
        """输入一个时间窗的特征，输出意图预测。"""
        ...


class MockModelService:
    """确定性演示模型：基于简单信号特征的规则表，不使用随机数。

    注意：这些规则不是医学算法，仅为 V0 演示提供稳定、可复现的结果；
    正式算法上线前必须由真实数据验证并替换。
    """

    def predict(self, features: WindowFeatures) -> IntentPrediction:
        blinks = features.eog_blinks
        if blinks >= 2:
            confidence = min(0.95, 0.86 + 0.03 * min(blinks, 3.0))
            return IntentPrediction(
                "confirm",
                LABELS["confirm"],
                round(confidence, 2),
                "演示规则：窗口内检测到≥2次眼电脉冲（双眨眼）→ 确认",
            )
        if features.eog_drift > 18.0:
            return IntentPrediction(
                "negate",
                LABELS["negate"],
                0.82,
                "演示规则：窗口内眼电存在长时漂移（缓慢眼动）→ 否定",
            )
        if blinks >= 1 and features.eog_p2p > 60.0:
            return IntentPrediction(
                "sos",
                LABELS["sos"],
                0.78,
                "演示规则：窗口内检测到大幅单次眼电脉冲 → 紧急求助",
            )
        if features.eeg_var < 4.0:
            return IntentPrediction(
                "none",
                LABELS["none"],
                0.80,
                "演示规则：窗口内 EEG 活动度较低 → 无有效意图",
            )
        return IntentPrediction(
            "none",
            LABELS["none"],
            0.87,
            "演示规则：未匹配到明确特征 → 无有效意图",
        )

