"use client";

import {
  COMMANDS,
  PHASE_LABELS,
  PROCESS_STEPS,
  type DemoCommand,
  type DemoPhase,
  type WheelchairPose,
} from "./types";

interface DemoControlsProps {
  phase: DemoPhase;
  command: DemoCommand | null;
  pose: WheelchairPose;
  completedCount: number;
  isRunning: boolean;
  reducedMotion: boolean;
  onCommand: (command: DemoCommand) => void;
  onReset: () => void;
}

const ACCENT_CLASS = {
  cyan: "border-cyan-400/55 bg-cyan-500/12 text-cyan-100",
  violet: "border-violet-400/55 bg-violet-500/12 text-violet-100",
  emerald: "border-emerald-400/55 bg-emerald-500/12 text-emerald-100",
  rose: "border-rose-400/55 bg-rose-500/12 text-rose-100",
};

function phaseIndex(phase: DemoPhase) {
  if (phase === "complete") return PROCESS_STEPS.length;
  return PROCESS_STEPS.findIndex((step) => step.phase === phase);
}

export default function DemoControls({
  phase,
  command,
  pose,
  completedCount,
  isRunning,
  reducedMotion,
  onCommand,
  onReset,
}: DemoControlsProps) {
  const activeIndex = phaseIndex(phase);
  const yawDegrees = Math.round((pose.yaw * 180) / Math.PI);

  return (
    <aside className="flex min-w-0 flex-col gap-4">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan-300">交互控制</p>
            <h3 className="mt-1 text-base font-semibold text-white">选择运动想象指令</h3>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
          >
            复位
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {COMMANDS.map((item) => {
            const selected = command?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={isRunning}
                aria-pressed={selected}
                onClick={() => onCommand(item)}
                className={`group flex min-h-16 items-center justify-between rounded-xl border px-4 py-3 text-left transition disabled:cursor-wait disabled:opacity-60 ${
                  selected
                    ? ACCENT_CLASS[item.accent]
                    : "border-slate-800 bg-slate-900/70 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                <span>
                  <span className="block text-[14px] font-semibold">{item.imagination}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">对应指令：{item.intent}</span>
                </span>
                <span className="ml-3 text-lg text-slate-500 transition group-hover:text-cyan-300">→</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan-300">当前阶段</p>
            <p className="mt-1 text-[15px] font-semibold text-white" aria-live="polite">
              {PHASE_LABELS[phase]}
            </p>
          </div>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isRunning ? "bg-cyan-300 shadow-[0_0_14px_#22d3ee]" : "bg-slate-600"
            }`}
          />
        </div>

        <ol className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 xl:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => {
            const active = index === activeIndex;
            const finished = activeIndex > index;
            return (
              <li
                key={step.phase}
                className={`rounded-lg border px-2 py-2 text-center text-[11px] transition ${
                  active
                    ? "border-cyan-400/55 bg-cyan-500/12 text-cyan-100"
                    : finished
                      ? "border-emerald-400/25 bg-emerald-500/6 text-emerald-200/75"
                      : "border-slate-800 bg-slate-900/50 text-slate-500"
                }`}
              >
                <span className="block text-[9px] opacity-60">0{index + 1}</span>
                <span>{step.short}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 text-[11px] text-slate-400">
          <p>
            已执行 <strong className="ml-1 text-slate-200">{completedCount}</strong>
          </p>
          <p className="text-right">
            朝向 <strong className="ml-1 text-slate-200">{yawDegrees}°</strong>
          </p>
          <p className="col-span-2 font-mono text-[10px] text-slate-500" data-testid="twin-pose">
            POSITION X {pose.x.toFixed(2)} / Z {pose.z.toFixed(2)} · ROTATION Y {pose.yaw.toFixed(2)}
          </p>
        </div>
        {reducedMotion ? (
          <p className="mt-3 text-[10px] leading-5 text-slate-500">
            已遵循系统“减少动态效果”设置，缩短动画并降低粒子运动。
          </p>
        ) : null}
      </div>
    </aside>
  );
}
