"""识别 Pipeline：原始信号 → 数据检查 → 预处理 → 时间窗 → 特征提取 → 模型推理 → 意图输出。"""

from dataclasses import dataclass, field
from datetime import datetime

from app.providers.base import SignalWindow
from app.schemas.intent import IntentWindow
from app.services.model_service import MockModelService, ModelService
from app.services.signal_processor import SignalProcessor

PIPELINE_STEPS: list[str] = [
    "原始信号",
    "数据检查",
    "信号预处理",
    "时间窗切分",
    "特征提取",
    "模型推理",
    "意图输出",
]


def _format_clock_time(epoch: float, relative: bool, mode: str = "floor") -> str:
    if relative:
        seconds = max(0, int(epoch) if mode == "floor" else int(epoch) + 1)
        hours, rem = divmod(seconds, 3600)
        minutes, secs = divmod(rem, 60)
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    dt = datetime.fromtimestamp(epoch)
    if mode == "ceil":
        dt = datetime.fromtimestamp(int(epoch) + 1)
    return dt.strftime("%H:%M:%S")


@dataclass
class PipelineResult:
    signal: SignalWindow
    intents: list[IntentWindow]
    issues: list[str] = field(default_factory=list)


class SignalPipeline:
    def __init__(
        self,
        processor: SignalProcessor | None = None,
        model: ModelService | None = None,
    ) -> None:
        # TODO(真实模型): 将 MockModelService 替换为 PyTorch/ONNX/边缘设备实现。
        self.processor = processor or SignalProcessor()
        self.model = model or MockModelService()

    def run(
        self,
        raw: SignalWindow,
        window_seconds: float,
        time_reference: str = "relative",
    ) -> PipelineResult:
        issues = self.processor.check(raw)
        processed = self.processor.preprocess(raw)
        slices = self.processor.split(processed, window_seconds)

        intents: list[IntentWindow] = []
        relative = time_reference == "relative"
        for idx, slice_ in enumerate(slices):
            features = self.processor.features(processed, slice_)
            prediction = self.model.predict(features)
            start_epoch = raw.start_epoch + slice_.start_offset
            end_epoch = raw.start_epoch + slice_.end_offset
            intents.append(
                IntentWindow(
                    index=idx,
                    start_epoch=start_epoch,
                    end_epoch=end_epoch,
                    start_time=_format_clock_time(
                        slice_.start_offset if relative else start_epoch, relative, "floor"
                    ),
                    end_time=_format_clock_time(
                        slice_.end_offset if relative else end_epoch, relative, "ceil"
                    ),
                    label=prediction.label,  # type: ignore[arg-type]
                    label_zh=prediction.label_zh,
                    confidence=prediction.confidence,
                    reason=prediction.reason,
                    is_mock=True,
                )
            )
        return PipelineResult(signal=processed, intents=intents, issues=issues)
