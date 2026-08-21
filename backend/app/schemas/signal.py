"""信号数据结构。"""

from typing import Literal

from pydantic import BaseModel

from app.providers.base import SignalWindow


class SignalData(BaseModel):
    """列式时序信号：timestamps 单位为秒。

    time_reference 为 "epoch" 时，timestamps 相对 start_epoch（墙钟秒）；
    为 "relative" 时，timestamps 相对文件/信号起点（start_epoch 为空）。
    """

    sampling_rate_hz: int
    channels: list[str]
    timestamps: list[float]
    values: dict[str, list[float]]
    time_reference: Literal["epoch", "relative"] = "relative"
    start_epoch: float | None = None

    @classmethod
    def from_window(cls, window: SignalWindow, time_reference: str) -> "SignalData":
        return cls(
            sampling_rate_hz=window.sampling_rate_hz,
            channels=list(window.channels),
            timestamps=[float(x) for x in window.timestamps],
            values={ch: [float(x) for x in arr] for ch, arr in window.values.items()},
            time_reference=time_reference,  # type: ignore[arg-type]
            start_epoch=window.start_epoch if time_reference == "epoch" else None,
        )

