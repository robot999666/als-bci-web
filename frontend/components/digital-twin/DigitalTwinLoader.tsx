"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function LoadingCard() {
  return (
    <section className="mt-12 border-t border-slate-800/80 pt-12" aria-label="3D交互式数字孪生演示载入中">
      <div className="rounded-[24px] border border-slate-800 bg-slate-900/45 p-6 sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan-300">系统工作原理交互演示</p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">3D交互式数字孪生演示</h2>
        <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/70 text-sm text-slate-500 sm:h-80">
          正在载入轻量化三维场景…
        </div>
      </div>
    </section>
  );
}

const DigitalTwinDemo = dynamic(() => import("./DigitalTwinDemo"), {
  ssr: false,
  loading: LoadingCard,
});

export default function DigitalTwinLoader() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return <div ref={anchorRef}>{shouldLoad ? <DigitalTwinDemo /> : <LoadingCard />}</div>;
}
