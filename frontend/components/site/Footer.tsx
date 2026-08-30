import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-white">
              模块化便携辅助终端 · ALS-BCI
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              面向 ALS 重度运动障碍人群的脑电-眼电多模态意图识别系统。
              当前为科研原型：使用 EA+FBCSP 冷启动模型与科研数据回放，
              非医疗器械，未经临床验证，不用于诊断或治疗决策。
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="space-y-2 text-slate-500">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                导航
              </p>
              <Link href="/" className="block hover:text-cyan-300">
                项目首页
              </Link>
              <Link href="/lab" className="block hover:text-cyan-300">
                在线实验平台
              </Link>
              <Link href="/#architecture" className="block hover:text-cyan-300">
                系统架构
              </Link>
            </div>
            <div className="space-y-2 text-slate-500">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                文档
              </p>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-cyan-300"
              >
                API 文档
              </a>
              <a
                href="/sample_data/S3_3ch.npz"
                download
                className="block hover:text-cyan-300"
              >
                BCI 示例数据 NPZ
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-800/80 pt-5 text-center text-xs text-slate-600">
          © 2026 ALS-BCI 科研项目组 · V0 Demo · 仅供科研与教学演示
        </p>
      </div>
    </footer>
  );
}
