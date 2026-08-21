"""未来实时设备数据源（V0 仅占位，不实现硬件通信）。

计划链路：ADS1299 → MCU → USB Serial → 本地采集程序 → WebSocket → Web 前端。
本阶段不实现 ADS1299/串口/WebSocket 通信；保持与 DataSourceProvider 相同的
stream_window 契约，未来真实设备接入时替换实现即可，API 与前端无需改动。
"""

from app.providers.base import SignalWindow


class RealtimeDeviceProvider:
    def stream_window(self, window_seconds: float) -> SignalWindow:
        raise NotImplementedError(
            "实时设备接入开发中：V0 阶段不实现 ADS1299/串口/WebSocket 通信。"
            "TODO(future): 接入真实采集链路后实现本方法。"
        )

