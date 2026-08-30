"""安全读取 BCI 批量 NPZ 上传。"""

from __future__ import annotations

import io
import zipfile
from dataclasses import dataclass

import numpy as np
from fastapi import HTTPException

from app.core.config import get_settings


@dataclass(frozen=True)
class BciBatch:
    x: np.ndarray
    y: np.ndarray | None


def _reject(detail: str, status_code: int = 422) -> None:
    raise HTTPException(status_code=status_code, detail=detail)


def read_bci_npz(
    filename: str,
    content: bytes,
    sampling_rate_hz: int,
    unit: str,
) -> BciBatch:
    settings = get_settings()
    if not filename.lower().endswith(".npz"):
        _reject("仅支持 NPZ 文件上传（.npz 扩展名）")
    if not content:
        _reject("文件内容为空")
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        _reject(f"压缩文件超过大小限制（{settings.max_upload_mb}MB）", 413)
    if sampling_rate_hz != settings.bci_sampling_rate_hz:
        _reject(f"采样率必须为 {settings.bci_sampling_rate_hz} Hz")
    if unit.strip().lower().replace("μ", "u").replace("µ", "u") != "uv":
        _reject("输入单位必须为 μV（表单字段 unit=uV）")

    max_decompressed = settings.bci_max_decompressed_mb * 1024 * 1024
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            members = archive.infolist()
            if not members:
                _reject("NPZ 文件为空")
            if any(info.flag_bits & 0x1 for info in members):
                _reject("不支持加密 NPZ 文件")
            if any("/" in info.filename or "\\" in info.filename for info in members):
                _reject("NPZ 中包含非法路径")
            if sum(info.file_size for info in members) > max_decompressed:
                _reject(
                    f"NPZ 解压后超过大小限制（{settings.bci_max_decompressed_mb}MB）",
                    413,
                )
    except zipfile.BadZipFile:
        _reject("NPZ 文件损坏或格式无效")

    try:
        with np.load(io.BytesIO(content), allow_pickle=False) as payload:
            if "X" not in payload.files:
                _reject("NPZ 缺少必需数组 X")
            if any(name not in {"X", "y"} for name in payload.files):
                _reject("NPZ 仅允许包含 X 和可选 y 数组")
            x = np.asarray(payload["X"])
            y = np.asarray(payload["y"]) if "y" in payload.files else None
    except (ValueError, OSError, EOFError) as exc:
        _reject(f"NPZ 数组读取失败：{exc}")

    if x.dtype.kind not in "fiu":
        _reject("X 必须是数值数组，禁止对象数组")
    if x.ndim != 3:
        _reject("X 形状必须为 (n_trials, n_channels, 501)")
    n_trials, n_channels, n_times = x.shape
    if n_trials < 2:
        _reject("冷启动 EA 至少需要 2 个 trial，不能进行单 trial 推理")
    if n_channels not in (3, 22):
        _reject("通道数必须为 3 或 22")
    if n_times != settings.bci_window_samples:
        _reject(f"每个 trial 必须为 {settings.bci_window_samples} 个采样点")
    if x.nbytes > max_decompressed:
        _reject(
            f"X 数组超过解压后大小限制（{settings.bci_max_decompressed_mb}MB）",
            413,
        )
    x = np.asarray(x, dtype=np.float64)
    if not np.isfinite(x).all():
        _reject("X 包含 NaN 或 Inf")

    if y is not None:
        if y.dtype.kind not in "iu" or y.shape != (n_trials,):
            _reject("y 必须是一维整数数组，长度与 trial 数一致")
        y = np.asarray(y, dtype=np.int64)
        if not np.isin(y, [0, 1, 2, 3]).all():
            _reject("y 标签只能取 0、1、2、3")
    return BciBatch(x=x, y=y)
