"use client";

import { LABEL_META } from "@/lib/labels";
import type { IntentWindow } from "@/lib/types";

interface IntentTimelineProps {
  intents: IntentWindow[];
}

export default function IntentTimeline({ intents }: IntentTimelineProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">意图识别 Timeline</h2>
        <span className="text-[11px] text-slate-500">
          最新 {Math.min(intents.length, 100)} / {intents.length} 个窗口
        </span>
      </div>
      {intents.length > 0 ? (
        <ol className="thin-scrollbar flex gap-2 overflow-x-auto pb-2">
          {intents.map((intent) => {
            const meta = LABEL_META[intent.label];
            return (
              <li
                key={`${intent.start_epoch}-${intent.end_epoch}-${intent.index}`}
                className={`shrink-0 rounded-lg border px-3 py-2 ${meta.chipClass}`}
              >
                <p className="text-[10px] text-slate-400">
                  {intent.start_time} – {intent.end_time}
                </p>
                <p className="mt-0.5 text-xs font-semibold">{meta.zh}</p>
                <p className="mt-0.5 text-[10px] opacity-80">
                  {Math.round(intent.confidence * 100)}%
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
          暂无意图结果
        </div>
      )}
    </section>
  );
}
