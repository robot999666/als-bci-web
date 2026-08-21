# 系统架构与设计文档（V0）

> 模块化便携辅助终端：面向 ALS 重度运动障碍人群的脑电-眼电多模态意图识别系统
> 阶段：V0 科研原型 Demo | 非医疗器械，结果未经真实数据验证

## 1. 当前状态与边界

V0 目标是搭建可本地运行的 Web 展示与实验平台，用**确定性 Mock 数据 + Mock 模型**
完整演示“数据输入 → 信号展示 → 模拟处理 → 意图输出”闭环。

本阶段**不包含**：

- 真实 EEG/EOG 采集设备通信（ADS1299/串口/WebSocket 均未实现）；
- 训练完成或医学验证过的 AI 模型（仅 MockModelService 规则表）；
- 用户登录、数据库、Redis、云部署、微服务等非必要组件。

## 2. 系统架构

```text
┌────────────────────────────── 前端（Next.js + TS + Tailwind + ECharts）──────────────┐
│  项目展示页（首页）                        在线实验平台（/lab）                         │
│                                            ├─ 数据源面板（Demo / CSV / 设备占位）       │
│                                            ├─ 多通道波形 SignalChart                   │
│                                            ├─ 当前意图 + 置信度                        │
│                                            └─ 意图 Timeline + 处理 Pipeline            │
└──────────────┬───────────────────────────────────────────────────────────────────────┘
               │ HTTP（REST；未来实时链路将补充 WebSocket）
┌──────────────▼──────────── FastAPI 后端 ─────────────────────────────────────────────┐
│  API 层（routes）        health / demo/signals / analyze                              │
│  数据源层（providers）   DemoProvider（确定性生成）· CSVReader · RealtimeProvider(占位) │
│  业务层（services）      SignalPipeline：数据检查→预处理→时间窗→特征→模型推理→意图      │
│  模型层（model_service） ModelService 协议 + MockModelService（可替换）                │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

分层原则：

- **API 层不写算法**，只做参数解析与响应组装；
- **业务逻辑**集中在 `services/`，其中 `pipeline.py` 是唯一编排入口；
- **数据源**通过 `DataSourceProvider` 协议抽象，新增数据源不影响上层；
- **模型**通过 `ModelService.predict(features)` 抽象，未来替换实现即可。

## 3. 数据契约（未来真实模型沿用）

### 3.1 信号（列式结构，利于实时渲染）

```json
{
  "sampling_rate_hz": 250,
  "channels": ["EEG1", "EEG2", "EEG3", "EEG4", "EOG"],
  "timestamps": [0.0, 0.004, 0.008],
  "values": { "EEG1": [3.4, 5.9, 8.0], "EOG": [48.3, 49.2, 50.1] },
  "time_reference": "epoch",
  "start_epoch": 1784690000.0
}
```

`time_reference = "epoch"`：墙钟时间（Demo 实时、时间格式 CSV）；
`time_reference = "relative"`：相对信号起点（数值时间戳 CSV）。

### 3.2 意图窗口（时间窗粒度，非逐采样点）

```json
{
  "index": 0,
  "start_epoch": 1784690000.0,
  "end_epoch": 1784690002.0,
  "start_time": "10:00:01",
  "end_time": "10:00:03",
  "label": "confirm",
  "label_zh": "确认",
  "confidence": 0.92,
  "reason": "演示规则：窗口内检测到≥2次眼电脉冲（双眨眼）→ 确认",
  "is_mock": true
}
```

`label` 枚举：`confirm`（确认）/ `negate`（否定）/ `sos`（紧急求助）/ `none`（无有效意图）。

## 4. 接口一览

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/health` | 健康检查 |
| GET | `/api/v1/demo/signals?window_seconds=5` | Demo 波形 + 同窗口模拟意图 |
| POST | `/api/v1/analyze` | 上传 CSV（multipart `file` + `window_seconds`）并模拟分析 |

交互式文档：`http://localhost:8000/docs`

## 5. Mock 边界

| 模块 | V0 实现 | 说明 |
| --- | --- | --- |
| 数据源 | DemoProvider | 由绝对时间纯函数确定性生成波形；无随机数，可复现 |
| CSV | sample_data/demo_eeg.csv | 250Hz × 10s × 5 通道，与 Demo 同源 |
| 信号处理 | 缺失值填充 + 5 点滑动平均 | 非医学级滤波，仅演示 |
| 特征 | EOG 脉冲数/峰峰值/漂移、EEG 方差 | 简单启发式，非临床特征 |
| 模型 | MockModelService 规则表 | 确定性，可被真实模型替换 |
| 实时设备 | RealtimeDeviceProvider 占位 | 调用即抛 NotImplementedError |

## 6. 未来接入：真实 AI 模型

只需实现 `ModelService.predict(features)` 契约并在依赖注入处替换：

```text
app/services/model_service.py
├── ModelService (Protocol)        ← 统一接口，上层不改
├── MockModelService               ← 当前默认
├── PyTorchModelService   (TODO)   ← .pt/.pth，输入窗口特征/片段张量
├── ONNXModelService      (TODO)   ← onnxruntime 加载 .onnx
└── EdgeDeviceModelService (TODO)  ← 调用边缘设备/穿戴终端推理
```

替换位置：`backend/app/api/deps.py` 中 `SignalPipeline(model=...)` 的构造参数。
真实算法接入时，信号预处理（`services/signal_processor.py`）应替换为经过验证的
滤波/伪迹去除/特征提取流程，并在 README 中补充数据与伦理声明。

## 7. 未来接入：真实 EEG 设备（ADS1299）

计划链路：

```text
ADS1299 → MCU → USB Serial → 本地采集程序 → WebSocket → Web 前端
```

V0 的预留策略：

1. **数据源协议已抽象**：`providers/base.py` 的 `DataSourceProvider.stream_window()`
   是统一入口；真实设备只需新增 `RealtimeDeviceProvider` 的可用实现。
2. **前端不依赖硬件协议**：前端只消费统一信号契约（`sampling_rate_hz / channels /
   timestamps / values`），不感知 ADS1299 或串口细节。
3. **未来 WebSocket 端点**：建议新增 `WS /api/v1/ws/signals`，由本地采集程序
   （PySerial 读取 ADS1299 数据）推送相同格式的 `SignalData` 帧；前端将 Demo 轮询
   替换为 WebSocket 订阅即可，图表与意图组件无需改动。
4. **采样参数**：真实设备接入后，`sampling_rate_hz` 以设备实际配置为准，
   前端图表已按接口字段自适应。

> 注意：真实生物信号采集涉及电气安全、隐私与伦理审查，接入前需遵守相应规范。

## 8. 未来多模态扩展

计划接入：心率、血氧、姿态、跌倒检测。扩展方式：

- 新信号源同样实现 `DataSourceProvider`（或独立的 `VitalSignProvider`）；
- 新通道自动并入 `channels / values` 契约，前端图表自动渲染；
- 意图枚举按需要扩展（如“求助”“跌倒”），保持 `label + label_zh + confidence` 结构不变。

## 9. 目录结构

```text
web/
├── frontend/            Next.js 前端（app/ 路由、components/、lib/、hooks/）
├── backend/             FastAPI 后端（app/ 分层、tests/、.env.example）
├── sample_data/         示例 CSV（demo_eeg.csv）
├── docs/                本文档
├── scripts/             工具脚本（generate_sample_csv.py）
└── README.md            Windows 启动指南
```

