import Link from "next/link";

export default function DigitalTwinCta() {
  return (
    <section className="scroll-mt-24 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="academic-grid relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/35 px-6 py-14 text-center sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.09),transparent_55%)]" />
          <div className="relative">
            <p className="text-[13px] font-semibold tracking-[0.16em] text-indigo-300">
              3D交互式数字孪生演示
            </p>
            <h2 className="mt-4 text-[28px] font-bold text-white sm:text-4xl">
              亲自感受渐冻症患者从运动想象到轮椅执行的完整链路
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-slate-400">
              选择左手、右手、双脚或舌头运动想象，观察 BCI 头盔采集脑电信号、模型完成意图识别，
              并驱动虚拟电动轮椅执行左转、右转、直行或停止指令。
            </p>
            <Link
              href="/lab#digital-twin"
              className="mt-8 inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition hover:-translate-y-0.5 hover:from-indigo-400 hover:to-violet-400"
            >
              进入 3D 交互演示
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
