import Link from "next/link";

const HERO_POINTS = [
  "多模态 EEG + EOG",
  "时间窗意图识别",
  "确定性 Mock 演示",
  "科研原型 · 待验证",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(8,145,178,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(51,65,85,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300">
            科研原型 · V0 Demo · 待真实数据验证
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            模块化便携辅助终端
          </h1>
          <p className="mt-6 text-lg font-medium text-cyan-200 sm:text-xl">
            面向 ALS 重度运动障碍人群，通过脑电（EEG）与眼电（EOG）
            识别极简沟通意图
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            以时间窗为单位识别「确认 / 否定 / 紧急求助」等少量关键意图，
            为无法进行言语与肢体沟通的患者提供辅助表达通道。
            本平台当前为实验性 Demo，使用确定性模拟数据演示完整流程。
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/lab"
              className="w-full rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 sm:w-auto"
            >
              进入在线实验平台
            </Link>
            <Link
              href="/#architecture"
              className="w-full rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/50 hover:text-cyan-300 sm:w-auto"
            >
              了解系统架构
            </Link>
          </div>

          <ul className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
            {HERO_POINTS.map((point) => (
              <li
                key={point}
                className="rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-400"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

