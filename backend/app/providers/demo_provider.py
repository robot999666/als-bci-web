"""确定性 Demo 模拟数据源。

波形由纯时间函数生成：同样的绝对时间输入总是产生同样的波形，
避免使用随机数导致每次刷新结果不可控。

TODO(真实数据): 此实现仅用于 V0 演示，不代表真实 EEG/EOG 生理信号。
"""

import math
import time

import numpy as np

from app.core.config import get_settings
from app.providers.base import DataSourceProvider, SignalWindow

_TAU = 2.0 * math.pi


def _pseudo_offset(k: int) -> float:
    """由整数索引产生确定性伪随机偏移（[-0.5, 0.5)），不使用随机数。"""
    x = (k * 2654435761) & 0xFFFFFFFF
    x ^= x >> 16
    x = (x * 2246822519) & 0xFFFFFFFF
    x ^= x >> 13
    return (x % 1000) / 1000.0 - 0.5


def _gaussian_pulses(
    t: np.ndarray,
    interval: float,
    amplitude: float,
    width: float,
    phase_seconds: float = 0.0,
    jitter: float = 0.25,
) -> np.ndarray:
    """确定性高斯脉冲序列（用于模拟眨眼/眼动脉冲）。"""
    out = np.zeros_like(t)
    first = int(math.floor(t[0] / interval))
    last = int(math.floor(t[-1] / interval))
    for k in range(first - 1, last + 2):
        center = k * interval + phase_seconds + jitter * _pseudo_offset(k)
        out += amplitude * np.exp(-((t - center) ** 2) / (2.0 * width**2))
    return out


def _saccade_ramps(t: np.ndarray, interval: float = 9.0, amplitude: float = 60.0) -> np.ndarray:
    """确定性缓慢眼动漂移（上升沿-平台-回落），用于演示“否定”类意图特征。"""
    out = np.zeros_like(t)
    first = int(math.floor(t[0] / interval))
    last = int(math.floor(t[-1] / interval))
    for k in range(first - 1, last + 2):
        center = k * interval + 0.4 * _pseudo_offset(k)
        up = 1.0 / (1.0 + np.exp(-(t - (center - 0.35)) / 0.08))
        down = 1.0 / (1.0 + np.exp(-(t - (center + 0.75)) / 0.08))
        out += amplitude * up * (1.0 - down)
    return out


def _eeg_value(t: np.ndarray, channel_idx: int, phase_offset: float) -> np.ndarray:
    """单通道 EEG 演示波形（单位 µV）：α 节律 + β 活动 + 低频漂移 + 事件增强。"""
    alpha = 7.0 * np.sin(_TAU * (9.5 + channel_idx * 0.4) * t + phase_offset)
    beta = 1.5 * np.sin(_TAU * (22.0 + channel_idx) * t + phase_offset * 1.7)
    drift = 2.0 * np.sin(_TAU * 0.8 * t + phase_offset)
    event = _gaussian_pulses(t, interval=6.0, amplitude=3.5, width=0.35)
    return alpha + beta + drift + event


def _eog_value(t: np.ndarray) -> np.ndarray:
    """EOG 演示波形：眨眼脉冲 + 双眨眼 + 缓慢眼动漂移 + 微小基线波动。"""
    single_blink = _gaussian_pulses(t, interval=2.5, amplitude=45.0, width=0.08)
    double_blink = _gaussian_pulses(
        t, interval=7.5, amplitude=40.0, width=0.08, phase_seconds=0.45, jitter=0.05
    )
    ramp = _saccade_ramps(t, amplitude=30.0)
    baseline = 1.2 * np.sin(_TAU * 3.1 * t) + 0.8 * np.sin(_TAU * 7.7 * t)
    return single_blink + double_blink + ramp + baseline


class DemoProvider:
    """Demo 模拟数据源：按绝对时间确定性生成多通道波形。"""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.channels = list(self.settings.demo_channels)

    def generate(self, t_absolute: np.ndarray) -> dict[str, np.ndarray]:
        """纯函数：给定绝对时间数组，返回各通道波形。相同输入必得相同输出。"""
        values: dict[str, np.ndarray] = {}
        for idx, channel in enumerate(self.channels):
            if channel == "EOG":
                values[channel] = _eog_value(t_absolute)
            else:
                values[channel] = _eeg_value(t_absolute, idx, phase_offset=idx * 0.7)
        return values

    def stream_window(self, window_seconds: float) -> SignalWindow:
        rate = self.settings.demo_sampling_rate_hz
        now = time.time()
        start = now - window_seconds
        n = max(2, int(round(window_seconds * rate)))
        t = start + np.arange(n) / float(rate)
        values = self.generate(t)
        return SignalWindow(
            source="demo",
            sampling_rate_hz=rate,
            channels=list(self.channels),
            start_epoch=start,
            timestamps=t - start,
            values=values,
            time_reference="epoch",
        )
