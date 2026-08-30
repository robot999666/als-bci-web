"use client";

import { LABEL_META } from "@/lib/labels";
import type { IntentPrediction } from "@/lib/types";

interface IntentPanelProps {
  predictions: IntentPrediction[];
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const percent = Math.round(confidence * 100);
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>置信度</span>
        <span className="font-semibold text-white">{percent}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function IntentPanel({ predictions }: IntentPanelProps) {
  const current = predictions[predictions.length - 1];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">当前识别意图</h2>
        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[10px] text-slate-400">
          EA+FBCSP 冷启动
        </span>
      </div>

      {current ? (
        <div>
          <div
            className={`rounded-xl border p-4 ${LABEL_META[current.label].chipClass}`}
          >
            <p
              className="text-3xl font-black"
              style={{ color: LABEL_META[current.label].color }}
            >
              {current.label_zh}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Trial #{current.trial_index + 1} · 类别 {current.class_id}
            </p>
            <ConfidenceBar confidence={current.confidence} />
          </div>
          <p className="mt-3 rounded-lg bg-slate-800/50 px-3 py-2 text-[11px] leading-relaxed text-slate-400">
            {current.reason}
          </p>
          {current.expected_class_id !== null ? (
            <p className="mt-2 text-[11px] text-slate-500">
              样例标签：{current.expected_class_id} ·
              {current.correct ? " 预测正确" : " 预测不同"}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
          等待数据…
        </div>
      )}
    </section>
  );
}
