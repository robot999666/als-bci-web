import Link from "next/link";

const NAV_LINKS = [
  { href: "/#background", label: "项目背景" },
  { href: "/#architecture", label: "系统架构" },
  { href: "/#tech", label: "核心技术" },
  { href: "/#scenarios", label: "应用场景" },
  { href: "/#team", label: "团队" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
            A
          </span>
          <span className="text-sm font-semibold text-white sm:text-base">
            ALS-BCI
            <span className="ml-2 hidden text-xs font-normal text-slate-400 md:inline">
              脑电-眼电多模态意图识别
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-slate-400 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/lab"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-cyan-400"
        >
          进入实验平台
        </Link>
      </nav>
    </header>
  );
}

