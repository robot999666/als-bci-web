"""将模型数组输出转换为稳定的 Web API 契约。"""

from __future__ import annotations

from datetime import datetime, timezone

import numpy as np

from app.schemas.api import AnalyzeResponse, DemoSignalsResponse, ValidationMetrics
from app.schemas.intent import ClassProbabilities, IntentPrediction
from app.schemas.signal import SignalData
from app.services.bci_model_service import (
    CHANNEL_NAMES,
    CLASS_LABELS,
    CLASS_NAMES_ZH,
    SFREQ,
    WINDOW_SAMPLES,
)


def build_bci_response(
    *,
    source: str,
    filename: str | None,
    x: np.ndarray,
    y: np.ndarray | None,
    probabilities: np.ndarray,
) -> AnalyzeResponse | DemoSignalsResponse:
    n_trials, n_channels, n_times = x.shape
    class_ids = np.argmax(probabilities, axis=1).astype(int)
    predictions: list[IntentPrediction] = []
    for index, class_id in enumerate(class_ids):
        expected = int(y[index]) if y is not None else None
        predictions.append(
            IntentPrediction(
                trial_index=index,
                class_id=int(class_id),
                label=CLASS_LABELS[class_id],
                label_zh=CLASS_NAMES_ZH[class_id],
                confidence=round(float(probabilities[index, class_id]), 6),
                probabilities=ClassProbabilities(
                    **{
                        label: round(float(probabilities[index, i]), 6)
                        for i, label in enumerate(CLASS_LABELS)
                    }
                ),
                expected_class_id=expected,
                correct=(bool(class_id == expected) if expected is not None else None),
                reason=(
                    "EA+FBCSP 冷启动批量推理；EA 参考由本次上传的全部 trial 共同计算"
                ),
                is_mock=False,
            )
        )

    channel_names = list(CHANNEL_NAMES[n_channels])
    preview = SignalData(
        sampling_rate_hz=SFREQ,
        channels=channel_names,
        timestamps=[i / SFREQ for i in range(n_times)],
        values={
            channel: [float(value) for value in x[0, channel_index]]
            for channel_index, channel in enumerate(channel_names)
        },
        time_reference="relative",
        start_epoch=None,
    )
    validation = None
    if y is not None:
        correct_trials = int(np.sum(class_ids == y))
        validation = ValidationMetrics(
            labeled_trials=n_trials,
            correct_trials=correct_trials,
            accuracy=round(correct_trials / n_trials, 6),
        )

    common = dict(
        filename=filename,
        sampling_rate_hz=SFREQ,
        channel_layout=f"{n_channels}ch",
        channels=channel_names,
        trial_count=n_trials,
        window_samples=WINDOW_SAMPLES,
        total_samples=n_times,
        signal=preview,
        predictions=predictions,
        validation=validation,
        generated_at=datetime.now(timezone.utc).isoformat(),
    )
    if source == "demo":
        common.pop("filename")
        return DemoSignalsResponse(source="demo", **common)
    return AnalyzeResponse(source="upload", **common)
