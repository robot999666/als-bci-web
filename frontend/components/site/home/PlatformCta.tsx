import Link from "next/link";

export default function PlatformCta() {
  return (
    <section id="lab" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="academic-grid relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/35 px-6 py-14 text-center sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_55%)]" />
          <div className="relative">
          <p className="text-[13px] font-semibold tracking-[0.16em] text-cyan-300">
            在线实验平台
          </p>
          <h2 className="mt-4 text-[28px] font-bold text-white sm:text-4xl">
            亲自查看脑电四分类的完整过程
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-slate-400">
            回放 S3 脑电科研样例或上传 NumPy 压缩数组文件（NPZ），观察波形、
            欧氏对齐、特征提取、四分类概率与逐试次预测结果。
          </p>
          <Link
            href="/lab"
            className="mt-8 inline-block rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            打开实验平台
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
