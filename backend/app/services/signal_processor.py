"""信号处理（V0 仅演示逻辑）。

TODO(真实算法): 将 check/preprocess/features 中的简单规则替换为经过验证的
EEG/EOG 预处理与特征提取（带通滤波、伪迹去除、频带能量特征等），
并补充医学级验证；在此之前所有结果仅作 Demo 演示。
"""

import math
from dataclasses import dataclass

import numpy as np

from app.providers.base import SignalWindow


@dataclass
class WindowSlice:
    start_index: int
    end_index: int  # exclusive
    start_offset: float  # 相对信号起点，秒
    end_offset: float


@dataclass
class WindowFeatures:
    start_offset: float
    end_offset: float
    eog_p2p: float = 0.0
    eog_blinks: float = 0.0
    eog_drift: float = 0.0
    eeg_var: float = 0.0


def _moving_average(x: np.ndarray, k: int) -> np.ndarray:
    if len(x) < k:
        return x.copy()
    kernel = np.ones(k) / k
    return np.convolve(x, kernel, mode="same")


class SignalProcessor:
    """演示版信号处理：数据检查 → 预处理 → 时间窗 → 特征提取 → 降采样展示。"""

    def check(self, window: SignalWindow) -> list[str]:
        issues: list[str] = []
        if len(window.timestamps) < 2:
            issues.append("数据点数过少")
        for channel in window.channels:
            if channel not in window.values:
                issues.append(f"缺少通道 {channel}")
        return issues

    def preprocess(self, window: SignalWindow) -> SignalWindow:
        """演示预处理：缺失值线性填充 + 5 点滑动平均（非医学级滤波）。"""
        values: dict[str, np.ndarray] = {}
        for channel, arr in window.values.items():
            clean = np.asarray(arr, dtype=float).copy()
            if np.isnan(clean).any():
                valid = ~np.isnan(clean)
                if valid.any():
                    idx = np.arange(len(clean))
                    clean[~valid] = np.interp(idx[~valid], idx[valid], clean[valid])
                else:
                    clean[:] = 0.0
            values[channel] = _moving_average(clean, 5)
        return SignalWindow(
            source=window.source,
            sampling_rate_hz=window.sampling_rate_hz,
            channels=list(window.channels),
            start_epoch=window.start_epoch,
            timestamps=window.timestamps,
            values=values,
            time_reference=window.time_reference,
        )

    def split(self, window: SignalWindow, window_seconds: float) -> list[WindowSlice]:
        if window_seconds <= 0:
            window_seconds = 1.0
        n = len(window.timestamps)
        fs = max(1, window.sampling_rate_hz)
        step = max(1, int(round(window_seconds * fs)))
        min_len = max(2, fs // 4)  # 窗口至少 0.25 秒
        slices: list[WindowSlice] = []
        start = 0
        while start < n:
            end = min(n, start + step)
            if end - start >= min_len:
                slices.append(
                    WindowSlice(
                        start_index=start,
                        end_index=end,
                        start_offset=float(window.timestamps[start]),
                        end_offset=float(window.timestamps[end - 1]),
                    )
                )
            start += step
        if not slices and n >= 2:
            slices.append(
                WindowSlice(0, n, float(window.timestamps[0]), float(window.timestamps[-1]))
            )
        return slices

    def features(self, window: SignalWindow, slice_: WindowSlice) -> WindowFeatures:
        feats = WindowFeatures(start_offset=slice_.start_offset, end_offset=slice_.end_offset)
        seg = {
            channel: window.values[channel][slice_.start_index : slice_.end_index]
            for channel in window.channels
            if channel in window.values
        }
        eog = seg.get("EOG")
        if eog is not None and len(eog) > 1:
            feats.eog_p2p = float(np.max(eog) - np.min(eog))
            threshold = max(10.0, 0.30 * feats.eog_p2p) if feats.eog_p2p > 0 else 10.0
            rising = np.diff((eog > threshold).astype(int)) > 0
            # 每个超过阈值的脉冲对应 1 次上升沿；双眨眼 = 2 个脉冲 = 2 次上升沿。
            feats.eog_blinks = float(int(np.sum(rising)))
            quarter = max(1, len(eog) // 4)
            feats.eog_drift = float(
                abs(float(np.mean(eog[-quarter:])) - float(np.mean(eog[:quarter])))
            )
        eeg_vars = [
            float(np.var(seg[channel]))
            for channel in window.channels
            if channel != "EOG" and len(seg.get(channel, [])) > 1
        ]
        feats.eeg_var = float(np.mean(eeg_vars)) if eeg_vars else 0.0
        return feats

    def downsample_for_display(self, window: SignalWindow, max_points: int) -> SignalWindow:
        n = len(window.timestamps)
        if n <= max_points:
            return window
        stride = math.ceil(n / max_points)
        idx = np.arange(0, n, stride)
        if len(idx) < 2:
            idx = np.array([0, n - 1])
        return SignalWindow(
            source=window.source,
            sampling_rate_hz=window.sampling_rate_hz,
            channels=list(window.channels),
            start_epoch=window.start_epoch,
            timestamps=window.timestamps[idx],
            values={channel: arr[idx] for channel, arr in window.values.items()},
            time_reference=window.time_reference,
        )
