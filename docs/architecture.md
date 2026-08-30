# BCI 四分类 Web 接入架构

## 数据流

```text
NPZ 批量文件
  → 上传大小与 ZIP 结构检查
  → np.load(allow_pickle=False)
  → dtype / finite / 250Hz / μV / (N, 3|22, 501) 校验
  → 使用整批 trial 计算 EA 参考协方差
  → 四频带滤波与 CSP 特征
  → LDA 四分类概率
  → REST 响应与网页 trial 时间线
```

模型在进程启动时只加载一次。权重来自镜像内 `bci_4class/models`，加载前验证固定
SHA-256；上传内容绝不会作为 pickle 或 Python 对象反序列化。推理通过线程池执行并用
信号量限制并发，避免 CPU 任务阻塞 FastAPI 事件循环。

## API 契约

`POST /api/v1/analyze` 接收 multipart：

- `file`: NPZ，包含 `X` 和可选 `y`；
- `sampling_rate_hz=250`；
- `unit=uV`。

响应核心结构：

```json
{
  "model_name": "EA+FBCSP",
  "model_mode": "cold_start",
  "channel_layout": "3ch",
  "trial_count": 8,
  "window_samples": 501,
  "batch_coupled_alignment": true,
  "predictions": [
    {
      "trial_index": 0,
      "class_id": 0,
      "label": "left",
      "label_zh": "左转",
      "confidence": 0.71,
      "probabilities": {
        "left": 0.71,
        "right": 0.09,
        "forward": 0.12,
        "stop": 0.08
      },
      "is_mock": false
    }
  ]
}
```

提供 `y` 时，每项增加预期类别与是否正确，并返回整批 `validation.accuracy`。

## 运行与安全边界

- 压缩上传最大 20 MB，ZIP 声明的解压总量及 `X.nbytes` 最大 64 MB；
- 只接受 `X`/`y` 两个数组，不接受路径成员、加密 ZIP、对象数组、NaN/Inf；
- 单批至少 2 个 trial，固定 501 点、250Hz、μV；
- 日志只记录 trial 数、通道布局、推理耗时和错误类型，不记录原始脑电；
- Docker 使用非 root 用户、单 Uvicorn worker和 CPU-only 依赖。

## 后续实时化

实时设备接入应新增独立 WebSocket 会话层：连续 EEG 缓冲 → 501 点窗口 → 用户级 EA
参考 → 推理 → 多帧平滑 → 指令推送。EA 参考需要由足量、同一用户的历史窗口建立并固定，
不得对每个单独窗口重新计算。用户身份、参考生命周期、断线恢复和并发隔离应在该阶段一并设计。
