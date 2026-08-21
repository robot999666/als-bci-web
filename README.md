# ALS-BCI · 模块化便携辅助终端（V0 Demo）

> 面向 ALS 重度运动障碍人群的脑电-眼电多模态意图识别系统 —— V0 科研原型与在线实验平台。

本仓库提供一个可在本地直接运行的前后端分离 Demo：

- **项目展示网站**：首页介绍项目背景、ALS 用户痛点、系统架构、核心技术、应用场景与团队；
- **在线实验平台**（`/lab`）：Demo 模拟实时数据 / CSV 上传 → 多通道波形可视化 →
  模拟信号处理 → 意图识别时间轴，完整演示“数据输入 → 信号展示 → 模拟处理 → 意图输出”闭环。

> ⚠️ 科研原型声明：当前识别结果由**确定性 Mock 数据与 Mock 模型**生成，
> 非医疗器械，未经真实数据与临床验证，不用于诊断或治疗决策。

## 技术栈

| 端 | 技术 |
| --- | --- |
| 前端 | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · ECharts 6 |
| 后端 | Python 3.12 · FastAPI · Pydantic · NumPy · Pandas |

## 目录结构

```text
web/
├── frontend/            Next.js 前端（app/ 路由、components/、lib/、hooks/）
├── backend/             FastAPI 后端（app/ 分层、tests/、requirements）
│   ├── app/api/         API 路由（health / demo / analyze）
│   ├── app/services/    信号处理、Pipeline、模型服务（Mock）
│   ├── app/providers/   数据源抽象（Demo / 实时设备占位）
│   └── app/schemas/     Pydantic 数据契约
├── sample_data/         示例 CSV（demo_eeg.csv）
├── docs/                docs/architecture.md 架构与未来接入说明
├── scripts/             工具脚本（生成示例 CSV）
└── README.md
```

## Windows 从零启动

### 1. 后端（FastAPI）

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt   # 运行依赖 + 测试依赖
uvicorn app.main:app --reload --port 8000
```

> 只安装运行依赖可改用 `python -m pip install -r requirements.txt`。

### 2. 前端（Next.js）

另开一个终端：

```powershell
cd frontend
npm install
npm run dev
```

### 3. 访问地址

| 项目 | 地址 |
| --- | --- |
| 前端首页 | http://localhost:3000 |
| 在线实验平台 | http://localhost:3000/lab |
| 后端 API 根 | http://localhost:8000 |
| API 交互式文档（Swagger） | http://localhost:8000/docs |

## 后端接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/v1/health` | 健康检查 |
| GET | `/api/v1/demo/signals?window_seconds=5` | Demo 波形 + 同窗口模拟意图（确定性生成） |
| POST | `/api/v1/analyze` | 上传 CSV（multipart `file` + `window_seconds`），模拟分析 |

接口契约详见 [docs/architecture.md](docs/architecture.md)。

## 示例数据格式（CSV 上传）

`sample_data/demo_eeg.csv`（10 秒、250Hz、EEG1-4 + EOG）：

```csv
timestamp,EEG1,EEG2,EEG3,EEG4,EOG
0.000000,3.395735,10.586395,13.300108,10.541709,48.255010
...
```

- 必须包含 `timestamp` 列（数值秒数 / ISO 时间 / HH:MM:SS 均可）；
- `timestamp` 之外的**数值列**均自动识别为信号通道（通道数不写死）；
- 支持 UTF-8 编码、逗号分隔，大小限制 20MB（可配置）。

## 常用命令

```powershell
# 后端测试
cd backend
.\.venv\Scripts\python.exe -m pytest -q

# 重新生成示例 CSV（与 Demo 实时数据同源）
.\.venv\Scripts\python.exe ..\scripts\generate_sample_csv.py

# 前端质量检查
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

## 配置（环境变量）

- 后端：复制 `backend/.env.example` 为 `backend/.env`，可修改端口、CORS、采样率、
  窗口时长、上传限制等；
- 前端：复制 `frontend/.env.example` 为 `frontend/.env.local`，可修改
  `NEXT_PUBLIC_API_BASE_URL`（默认 `http://localhost:8000`）。

## 当前 Mock 边界与未来接入点

| 模块 | V0 状态 | 未来接入位置 |
| --- | --- | --- |
| 信号数据 | DemoProvider 确定性生成；CSV 上传 | `backend/app/providers/` |
| 实时设备 | 占位（调用即抛 NotImplementedError） | ADS1299 → MCU → USB Serial → 采集程序 → WebSocket；见 `docs/architecture.md` |
| 信号处理 | 缺失值填充 + 滑动平均（演示逻辑） | `backend/app/services/signal_processor.py` |
| 模型 | MockModelService 规则表（确定性） | `backend/app/services/model_service.py`，在 `app/api/deps.py` 替换注入 |
| 意图 | confirm / negate / sos / none + 置信度 | 契约固定，真实模型沿用 |

详细设计见 [docs/architecture.md](docs/architecture.md)。

## 常见问题

1. **页面提示“无法连接后端服务”**：确认后端已启动且端口为 8000；前端接口地址见
   `frontend/.env.local`。
2. **上传 CSV 报 422**：检查文件是否为 UTF-8/逗号分隔、是否包含 `timestamp` 列、
   信号列是否全为数值。
3. **端口被占用**：后端用 `--port` 换端口，并在 `frontend/.env.local` 中同步
   `NEXT_PUBLIC_API_BASE_URL`。

