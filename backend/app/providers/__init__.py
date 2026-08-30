"""未来实时设备的数据源抽象。"""

from app.providers.base import DataSourceProvider, SignalWindow
from app.providers.realtime_provider import RealtimeDeviceProvider

realtime_provider = RealtimeDeviceProvider()


def get_provider(source: str) -> DataSourceProvider:
    """按名称获取数据源。未来接入真实设备后，前端选择 "realtime" 即可。"""
    if source == "realtime":
        return realtime_provider
    raise ValueError(f"未知数据源: {source}")


__all__ = [
    "DataSourceProvider",
    "SignalWindow",
    "RealtimeDeviceProvider",
    "realtime_provider",
    "get_provider",
]
