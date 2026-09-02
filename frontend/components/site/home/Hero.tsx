import Link from "next/link";

const EVIDENCE_POINTS = [
  "BCI 2a 基准数据",
  "4 个重叠频带",
  "24 维空间特征",
  "CPU 轻量推理",
];

const INTENTS = ["左转", "右转", "直行", "停止"];

export default function Hero() {
  return (
    <section className="academic-grid relative overflow-hidden border-b border-slate-800/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_20%,rgba(14,116,144,0.2),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.05),#020617_92%)]" />
      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 px-4 py-2 text-[13px] font-medium text-cyan-200">
            首都师范大学跨学科科研项目
          </p>
          <h1 className="mt-7 text-[38px] font-black leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[62px]">
            <span className="block text-cyan-300">ALS-BCI</span>
            <span className="block sm:inline">脑机接口</span>
            <span className="block sm:inline">意图识别平台</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-cyan-100 sm:text-xl">
            面向渐冻症患者的运动想象脑电四分类辅助交互研究
          </p>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-400 sm:text-base">
            平台将脑电信号（EEG）转换为左转、右转、直行和停止四类离散指令，
            已完成示例数据动画、3/22 通道 NPZ 真实推理、批量预测和多通道波形可视化。
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/lab"
              className="rounded-xl bg-cyan-400 px-6 py-3.5 text-center text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              进入在线实验平台
            </Link>
            <Link
              href="/#architecture"
              className="rounded-xl border border-slate-600 bg-slate-950/40 px-6 py-3.5 text-center text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60 hover:text-cyan-200"
            >
              了解系统架构
            </Link>
            <Link
              href="/#als"
              className="rounded-xl border border-slate-700 px-6 py-3.5 text-center text-sm font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              了解渐冻症
            </Link>
          </div>

          <ul className="mt-9 grid max-w-2xl grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
            {EVIDENCE_POINTS.map((point) => (
              <li
                key={point}
                className="rounded-lg border border-slate-800 bg-slate-900/65 px-3 py-2 text-center text-[12px] text-slate-300 sm:text-left"
              >
                <span className="mr-1.5 text-cyan-400">●</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -inset-8 rounded-full bg-cyan-500/8 blur-3xl" />
          <div className="card-surface relative overflow-hidden rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-[13px] font-semibold text-white">脑电到指令</p>
                <p className="mt-1 text-[12px] text-slate-500">核心算法结构可视化</p>
              </div>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[12px] text-emerald-300">
                技术链路概览
              </span>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/65 p-4">
              <div className="flex items-center justify-between text-[12px] text-slate-400">
                <span>脑电信号（EEG）</span>
                <span>2.0 秒</span>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 460 100"
                className="mt-3 h-24 w-full"
                preserveAspectRatio="none"
              >
                <path d="M0 50H460" stroke="#1E293B" strokeWidth="1" />
                <path
                  d="M0 54 18 48 34 52 48 45 62 56 75 47 88 51 101 39 114 63 126 44 138 52 150 49 164 55 178 45 193 51 208 42 222 58 238 47 252 51 267 31 281 68 295 46 310 54 326 43 341 55 356 48 372 52 388 40 405 61 421 45 440 51 460 47"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="my-5 flex items-center justify-center gap-2 text-[12px] text-slate-400">
              <span className="rounded-lg border border-slate-700 px-3 py-2">欧氏对齐</span>
              <span aria-hidden="true">→</span>
              <span className="rounded-lg border border-slate-700 px-3 py-2">特征提取</span>
              <span aria-hidden="true">→</span>
              <span className="rounded-lg border border-cyan-400/30 bg-cyan-500/8 px-3 py-2 text-cyan-200">
                四分类
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {INTENTS.map((intent, index) => (
                <div
                  key={intent}
                  className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold ${
                    index === 2
                      ? "border-cyan-400/45 bg-cyan-500/12 text-cyan-200"
                      : "border-slate-800 bg-slate-950/45 text-slate-400"
                  }`}
                >
                  {intent}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
