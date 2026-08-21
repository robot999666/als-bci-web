"""数据源层：为 Demo / 上传 / 未来实时设备提供统一的数据窗口。"""

from app.providers.base import DataSourceProvider, SignalWindow
from app.providers.demo_provider import DemoProvider
from app.providers.realtime_provider import RealtimeDeviceProvider

demo_provider = DemoProvider()
realtime_provider = RealtimeDeviceProvider()


def get_provider(source: str) -> DataSourceProvider:
    """按名称获取数据源。未来接入真实设备后，前端选择 "realtime" 即可。"""
    if source == "demo":
        return demo_provider
    if source == "realtime":
        return realtime_provider
    raise ValueError(f"未知数据源: {source}")


__all__ = [
    "DataSourceProvider",
    "SignalWindow",
    "DemoProvider",
    "RealtimeDeviceProvider",
    "demo_provider",
    "realtime_provider",
    "get_provider",
]

