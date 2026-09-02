"use client";

import { useEffect, useState } from "react";
import BciScene from "./BciScene";
import DemoControls from "./DemoControls";
import { useDemoMachine } from "./useDemoMachine";

export default function DigitalTwinDemo() {
  const machine = useDemoMachine();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section
      className="mt-12 border-t border-slate-800/80 pt-12"
      aria-labelledby="digital-twin-title"
    >
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/25 bg-cyan-500/8 px-3 py-1 text-[11px] font-semibold tracking-[0.13em] text-cyan-300">
              系统工作原理交互演示
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-400">
              WebGL 三维场景
            </span>
          </div>
          <h2 id="digital-twin-title" className="text-[28px] font-bold text-white sm:text-4xl">
            3D交互式数字孪生演示
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-400">
            通过交互动画展示从运动想象、脑电采集、意图识别到辅助终端执行的完整工作流程。
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-cyan-400/15 bg-[radial-gradient(circle_at_30%_0%,rgba(8,145,178,0.12),transparent_38%),rgba(8,15,31,0.82)] p-3 shadow-[0_30px_90px_rgba(2,6,23,0.42)] sm:p-5">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative h-[430px] min-w-0 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 sm:h-[560px]">
            <BciScene
              timelineRef={machine.timelineRef}
              phase={machine.phase}
              command={machine.command}
              pose={machine.pose}
              resetToken={machine.resetToken}
              reducedMotion={machine.reducedMotion}
              compact={compact}
              isRunning={machine.isRunning}
            />
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-700/80 bg-slate-950/75 px-3 py-2 backdrop-blur sm:left-4 sm:top-4">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-cyan-300">BCI DIGITAL TWIN</p>
              <p className="mt-0.5 text-[10px] text-slate-400">拖动旋转 · 滚轮或双指缩放</p>
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/70 bg-slate-950/72 px-3 py-2 text-[10px] text-slate-400 backdrop-blur sm:bottom-4 sm:left-4 sm:right-4">
              <span>患者与电动轮椅为统一 Three.js Group</span>
              <span>位置与朝向连续保留</span>
            </div>
          </div>

          <DemoControls
            phase={machine.phase}
            command={machine.command}
            pose={machine.pose}
            completedCount={machine.completedCount}
            isRunning={machine.isRunning}
            reducedMotion={machine.reducedMotion}
            onCommand={machine.start}
            onReset={machine.reset}
          />
        </div>
      </div>
    </section>
  );
}
