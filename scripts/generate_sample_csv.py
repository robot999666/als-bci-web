"""生成 sample_data/demo_eeg.csv（10 秒、250Hz、EEG1-4 + EOG）。

与 Demo 实时数据源使用同一确定性生成器，保证示例数据与在线 Demo 表现一致。
用法：python scripts/generate_sample_csv.py
"""

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.providers.demo_provider import DemoProvider  # noqa: E402


def main() -> None:
    provider = DemoProvider()
    rate = provider.settings.demo_sampling_rate_hz
    duration_seconds = 10.0
    base_epoch = 1_752_000_000.0  # 固定基准时间，保证生成结果可复现
    n = int(round(duration_seconds * rate))
    t_absolute = base_epoch + np.arange(n) / float(rate)
    values = provider.generate(t_absolute)
    timestamps = t_absolute - base_epoch

    out_path = Path(__file__).resolve().parents[1] / "sample_data" / "demo_eeg.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    header = "timestamp," + ",".join(provider.channels)
    lines = [header]
    for i in range(n):
        row = [f"{timestamps[i]:.6f}"]
        row.extend(f"{values[channel][i]:.6f}" for channel in provider.channels)
        lines.append(",".join(row))
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"已生成 {out_path}（{n} 行 × {len(provider.channels)} 通道）")


if __name__ == "__main__":
    main()

