"use client";

import Link from "next/link";
import { useState } from "react";
import BrandMark from "@/components/site/BrandMark";

const NAV_LINKS = [
  { href: "/#als", label: "了解渐冻症" },
  { href: "/#solution", label: "项目方案" },
  { href: "/#architecture", label: "技术架构" },
  { href: "/#evidence", label: "实验成果" },
  { href: "/#capabilities", label: "系统能力" },
  { href: "/#team", label: "团队" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="text-[15px] font-bold tracking-wide text-white sm:text-base">
            ALS-BCI
            <span className="ml-2 hidden text-[13px] font-normal tracking-normal text-slate-400 md:inline">
              脑机接口意图识别平台
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-[14px] text-slate-300 lg:flex">
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

        <div className="flex items-center gap-2">
          <Link
            href="/lab"
            className="shrink-0 whitespace-nowrap rounded-lg bg-cyan-400 px-3.5 py-2.5 text-[13px] font-semibold text-slate-950 transition-colors hover:bg-cyan-300 sm:px-4 sm:text-sm"
          >
            在线实验平台
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 lg:hidden"
          >
            <span className="sr-only">导航菜单</span>
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>
      </nav>
      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-slate-800 bg-slate-950 px-4 py-3 lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] text-slate-300 hover:bg-slate-900 hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
