import SectionHeading from "@/components/site/SectionHeading";

const LAYERS = [
  {
    name: "信号采集层",
    items: ["EEG / EOG 传感器", "Demo 模拟数据（当前）", "ADS1299 设备（开发中）"],
  },
  {
    name: "数据链路层",
    items: ["REST API（当前）", "WebSocket 实时链路（预留）", "FastAPI 后端"],
  },
  {
    name: "信号处理层",
    items: ["数据检查", "预处理 / 时间窗", "特征提取"],
  },
  {
    name: "识别与展示层",
    items: ["模型推理（Mock 模型）", "意图输出", "波形可视化 / 时间轴"],
  },
];

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="scroll-mt-20 border-t border-slate-800/60 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="系统架构"
          title="分层解耦，为真实设备与算法预留接入点"
          description="API、信号处理与模型推理相互独立；数据源与模型均通过统一接口抽象，未来替换不牵动上层。"
        />
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          {LAYERS.map((layer, index) => (
            <div key={layer.name} className="flex flex-1 flex-col gap-3">
              <div className="h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  {layer.name}
                </p>
                <ul className="mt-3 space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="text-xs text-slate-400">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {index < LAYERS.length - 1 ? (
                <span className="hidden text-center text-slate-600 lg:block">
                  ↓
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          处理流程：原始信号 → 数据检查 → 信号预处理 → 时间窗切分 → 特征提取 →
          模型推理 → 意图输出（模型推理当前为 MockModel，标识 Demo 模拟结果）
        </p>
      </div>
    </section>
  );
}

