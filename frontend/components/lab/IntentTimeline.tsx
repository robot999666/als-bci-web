"use client";

import { LABEL_META } from "@/lib/labels";
import type { IntentPrediction } from "@/lib/types";

interface IntentTimelineProps {
  predictions: IntentPrediction[];
}

export default function IntentTimeline({ predictions }: IntentTimelineProps) {
  return (
    <section className="card-surface rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">试次预测序列</h2>
        <span className="text-[12px] text-slate-500">
          {predictions.length} 个试次
        </span>
      </div>
      {predictions.length > 0 ? (
        <ol className="thin-scrollbar flex gap-2 overflow-x-auto pb-2">
          {predictions.map((prediction) => {
            const meta = LABEL_META[prediction.label];
            return (
              <li
                key={prediction.trial_index}
                className={`shrink-0 rounded-lg border px-3 py-2 ${meta.chipClass}`}
              >
                <p className="text-[11px] text-slate-400">
                  试次 #{prediction.trial_index + 1}
                </p>
                <p className="mt-0.5 text-xs font-semibold">{meta.zh}</p>
                <p className="mt-0.5 text-[11px] opacity-80">
                  {Math.round(prediction.confidence * 100)}%
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
