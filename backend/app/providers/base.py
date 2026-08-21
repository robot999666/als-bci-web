"""数据源抽象层。

所有信号来源（Demo 模拟 / CSV 上传 / 未来实时设备）统一输出 SignalWindow，
上层 Pipeline 不关心数据来自哪里。
"""

from dataclasses import dataclass
from typing import Protocol

import numpy as np


@dataclass
class SignalWindow:
    source: str
    sampling_rate_hz: int
    channels: list[str]
    start_epoch: float
    timestamps: np.ndarray  # 相对窗口/信号起点，单位秒
    values: dict[str, np.ndarray]
    time_reference: str = "relative"  # "epoch" | "relative"


class DataSourceProvider(Protocol):
    """数据源协议。

    TODO(未来实时设备): ADS1299 → MCU → USB Serial → 本地采集程序 →
    WebSocket → 前端。真实设备接入时实现 stream_window（或提供流式推送），
    并保持本协议，上层 API 与前端无需改动。
    """

    def stream_window(self, window_seconds: float) -> SignalWindow:
        """返回最近 window_seconds 秒的数据窗口。"""
        ...

