# ALS-BCI 四分类 Web 实验平台

面向 ALS 重度运动障碍人群的脑电运动想象科研原型。系统使用 **EA（欧氏对齐）+
FBCSP + LDA** 冷启动模型，将 2 秒 EEG trial 识别为四类指令：

| class_id | 英文标签 | 中文指令 | 运动想象 |
| --- | --- | --- | --- |
| 0 | `left` | 左转 | 左手 |
| 1 | `right` | 右转 | 右手 |
| 2 | `forward` | 直行 | 双脚 |
| 3 | `stop` | 停止 | 舌头 |

> 本项目是科研原型，不构成医疗器械宣称，不用于诊断或治疗。内置 S3 数据参与过
> 冷启动模型训练，其准确率只能用于软件回归，不能代表对新用户的泛化能力。

## 当前能力

- FastAPI REST 批量推理，支持 3 通道 `[C3, Cz, C4]` 和 BCI 2a 标准 22 通道；
- 启动时加载并校验两套模型 SHA-256，模型失败时健康检查显示 `degraded`，不回退 Mock；
- 安全读取 NPZ（`allow_pickle=False`、压缩/解压大小限制、形状与有限值校验）；
- Next.js 实验页面提供 S3 科研数据回放、NPZ 上传、波形预览和 trial 预测时间线；
- CPU-only Docker 部署，不需要 GPU。

## Docker 启动

确保 Docker Desktop/Engine 可用，然后在仓库根目录运行：

```powershell
docker compose up --build
```

后端地址：`http://localhost:8000`，Swagger：`http://localhost:8000/docs`。

前端仍可在本机启动：

```powershell
cd frontend
npm install
npm run dev
```

## 本地启动

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

依赖固定为 Python 3.12、NumPy 2.2.6、SciPy 1.15.3、scikit-learn 1.6.1、
MNE 1.9.0 等已验证组合。模型 pickle 记录的 scikit-learn 版本为 1.6.1。

## REST API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/v1/health` | 模型就绪、布局、checksum 与运行库版本 |
| `GET` | `/api/v1/demo/signals?trial_count=8` | S3 三通道科研样例回放与真实模型预测 |
| `POST` | `/api/v1/analyze` | 上传 NPZ，完成整批 EA + FBCSP 推理 |

上传使用 multipart：

- `file`：`.npz`，必须含 `X`，可选 `y`；
- `sampling_rate_hz`：固定 `250`；
- `unit`：固定 `uV`。

```powershell
curl.exe -X POST http://localhost:8000/api/v1/analyze `
  -F "file=@bci_4class/data/S3_3ch.npz" `
  -F "sampling_rate_hz=250" `
  -F "unit=uV"
```

`X` 必须是数值数组 `(N, 3|22, 501)`，且 `N >= 2`；`y` 如存在则为 `(N,)`
整数数组，取值 `0..3`。输入单位必须是 μV。响应包含每个 trial 的类别、置信度、
四类概率，以及提供 `y` 时的软件验证准确率。

## 已验证结果

在 Windows/Python 3.12 固定依赖环境中：

| 布局 | 样本数 | S3 回归准确率 | 批量推理耗时 |
| --- | ---: | ---: | ---: |
| 3 通道 | 288 | 63.54% | 约 56 ms |
| 22 通道 | 288 | 82.99% | 约 381 ms |

两次重复推理逐值一致，概率均为有限值且每行之和为 1。后端测试、前端 lint、
TypeScript 检查与生产构建命令如下：

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q

cd ..\frontend
npm run lint
npx tsc --noEmit
npm run build
```

## 重要边界

- 冷启动 EA 的参考协方差由一次请求中的全部 trial 共同计算，所以同一个 trial 的结果
  可能随批次组成变化；首版明确不支持单 trial 无状态推理。
- 当前没有用户校准模型、数据库、实时 WebSocket 或设备通信。
- 实时接入需要为每个用户维护稳定的 EA 参考、滑动窗口、预测平滑与会话隔离，不能简单
  地逐窗调用当前 REST 接口。

详细数据流和部署边界见 [docs/architecture.md](docs/architecture.md)。
