"""CSV 上传解析与基本格式校验。"""

import io

import numpy as np
import pandas as pd
from fastapi import HTTPException

from app.core.config import get_settings
from app.providers.base import SignalWindow

TIMESTAMP_COLUMN = "timestamp"


def read_upload_csv(filename: str, content: bytes) -> SignalWindow:
    """解析上传的 CSV 为 SignalWindow；格式非法时抛出带中文提示的 HTTPException。"""
    settings = get_settings()
    if not filename.lower().endswith(".csv"):
        raise HTTPException(status_code=422, detail="仅支持 CSV 文件上传（.csv 扩展名）")
    if len(content) == 0:
        raise HTTPException(status_code=422, detail="文件内容为空")
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(
            status_code=413, detail=f"文件超过大小限制（{settings.max_upload_mb}MB）"
        )

    try:
        text = content.decode("utf-8-sig")
        df = pd.read_csv(io.StringIO(text))
    except Exception:
        raise HTTPException(
            status_code=422, detail="CSV 解析失败：请检查编码（UTF-8）与分隔符（逗号）"
        )

    columns = [str(col).strip() for col in df.columns]
    df.columns = columns
    ts_column = next((col for col in columns if col.lower() == TIMESTAMP_COLUMN), None)
    if ts_column is None:
        raise HTTPException(status_code=422, detail="CSV 缺少 timestamp 列")

    channel_columns = [col for col in columns if col != ts_column]
    if not channel_columns:
        raise HTTPException(
            status_code=422,
            detail="CSV 未检测到信号通道列：timestamp 之外至少需要一列数值数据（如 EEG1、EOG）",
        )

    # --- 时间戳解析：数值 → 相对秒；时间格式 → 墙钟 epoch ---
    timestamps, time_reference, start_epoch = _parse_timestamps(df, ts_column)

    # --- 通道解析：要求全部为数值 ---
    values: dict[str, np.ndarray] = {}
    for col in channel_columns:
        arr = pd.to_numeric(df[col], errors="coerce").to_numpy(dtype=float)
        if np.isnan(arr).all():
            raise HTTPException(
                status_code=422, detail=f"通道列 {col} 全部为非数值内容，无法解析"
            )
        values[col] = arr

    n = len(timestamps)
    if n < 10:
        raise HTTPException(status_code=422, detail="数据点数过少（至少需要 10 个采样点）")
    duration = float(timestamps[-1] - timestamps[0])
    if duration < 0.2:
        raise HTTPException(status_code=422, detail="数据时长过短（至少 0.2 秒）")

    dt = np.diff(timestamps)
    dt = dt[dt > 0]
    if len(dt) == 0:
        raise HTTPException(status_code=422, detail="timestamp 必须随时间递增")
    sampling_rate_hz = max(1, min(100_000, int(round(1.0 / float(np.median(dt))))))

    return SignalWindow(
        source="upload",
        sampling_rate_hz=sampling_rate_hz,
        channels=channel_columns,
        start_epoch=start_epoch,
        timestamps=timestamps,
        values=values,
        time_reference=time_reference,
    )


def _parse_timestamps(
    df: pd.DataFrame, ts_column: str
) -> tuple[np.ndarray, str, float]:
    numeric = pd.to_numeric(df[ts_column], errors="coerce")
    if numeric.notna().any():
        timestamps = numeric.to_numpy(dtype=float)
        if timestamps[0] > 1e10:
            timestamps = timestamps / 1000.0  # 毫秒时间戳 → 秒
        timestamps = timestamps - timestamps[0]  # 统一为相对秒
        return timestamps, "relative", 0.0

    parsed = pd.to_datetime(df[ts_column], errors="coerce", utc=True)
    if parsed.isna().all():
        raise HTTPException(
            status_code=422,
            detail="timestamp 列无法解析：请使用数值秒数、ISO 时间或 HH:MM:SS 格式",
        )
    epochs = parsed.to_numpy(dtype="datetime64[s]").astype(float)
    if np.isnan(epochs).any():
        raise HTTPException(
            status_code=422,
            detail="timestamp 列包含无法解析的时间值，请统一格式",
        )
    start_epoch = float(epochs[0])
    return epochs - start_epoch, "epoch", start_epoch

