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
    <section className="card-surface h-full rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">当前识别结果</h2>
        <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] text-slate-400">
          冷启动批量模型
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
              试次 #{current.trial_index + 1} · 类别编号 {current.class_id}
            </p>
            <ConfidenceBar confidence={current.confidence} />
          </div>
          <p className="mt-3 rounded-lg bg-slate-800/50 px-3 py-2 text-[12px] leading-6 text-slate-400">
            整批数据先进行欧氏对齐（EA），再由滤波器组共空间模式（FBCSP）和线性判别分析（LDA）完成分类。
          </p>
          {current.expected_class_id !== null ? (
            <p className="mt-2 text-[12px] text-slate-500">
              样例标签：{current.expected_class_id} ·
              {current.correct ? " 预测正确" : " 预测不同"}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
          等待推理结果…
        </div>
      )}
    </section>
  );
}
