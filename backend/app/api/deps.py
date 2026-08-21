"""共享依赖：Pipeline 单例等。"""

from app.services.pipeline import SignalPipeline

# 全局唯一 Pipeline 实例。TODO(真实模型): 未来将 MockModelService 替换为
# PyTorch/ONNX/边缘设备实现后，只需在此处调整依赖注入。
pipeline = SignalPipeline()

