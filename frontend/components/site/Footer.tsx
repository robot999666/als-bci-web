import Link from "next/link";
import BrandMark from "@/components/site/BrandMark";

export default function Footer() {
  const configuredApiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
    /\/+$/,
    "",
  );

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10" />
              <div>
                <p className="font-bold text-white">ALS-BCI 脑机接口意图识别平台</p>
                <p className="mt-0.5 text-[12px] text-slate-500">中国国际大学生创新大赛项目</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-7 text-slate-500">
              本项目为面向渐冻症患者的脑电意图识别与辅助交互系统，不构成医疗器械、诊断工具或治疗建议。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[13px]">
            <div className="space-y-2.5 text-slate-500">
              <p className="font-semibold text-slate-300">项目导航</p>
              <Link href="/#als" className="block hover:text-cyan-300">了解渐冻症</Link>
              <Link href="/#architecture" className="block hover:text-cyan-300">技术架构</Link>
              <Link href="/#team" className="block hover:text-cyan-300">团队成员</Link>
            </div>
            <div className="space-y-2.5 text-slate-500">
              <p className="font-semibold text-slate-300">实验资源</p>
              <Link href="/lab" className="block hover:text-cyan-300">在线实验平台</Link>
              {configuredApiBase ? (
                <a
                  href={`${configuredApiBase}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-cyan-300"
                >
                  推理接口文档
                </a>
              ) : null}
              <a href="/sample_data/S3_3ch.npz" download className="block hover:text-cyan-300">
                脑电示例数据
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-800/80 pt-5 text-center text-[12px] text-slate-600">
          © 2026 ALS-BCI 科研项目组 · 首都师范大学
        </p>
      </div>
    </footer>
  );
}
