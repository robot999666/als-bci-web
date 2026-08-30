import Link from "next/link";

export default function PlatformCta() {
  return (
    <section id="lab" className="scroll-mt-20 border-t border-slate-800/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            亲自体验 V0 在线实验平台
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
            回放 S3 脑电样例、上传 NPZ 批量数据，观察“数据校验 → EA 对齐 →
            FBCSP 推理 → 四分类指令”完整流程。当前结果仅用于科研验证。
          </p>
          <Link
            href="/lab"
            className="mt-8 inline-block rounded-xl bg-cyan-500 px-8 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
          >
            打开实验平台
          </Link>
        </div>
      </div>
    </section>
  );
}
