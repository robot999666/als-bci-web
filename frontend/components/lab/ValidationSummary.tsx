import type { BciBatchResponse } from "@/lib/types";

interface ValidationSummaryProps {
  result: BciBatchResponse | null;
}

const BASELINES = [
  { layout: "3 通道", accuracy: 63.54, color: "bg-cyan-400" },
  { layout: "22 通道", accuracy: 82.99, color: "bg-indigo-400" },
];

export default function ValidationSummary({ result }: ValidationSummaryProps) {
  const averageConfidence = result?.predictions.length
    ? result.predictions.reduce((sum, item) => sum + item.confidence, 0) /
      result.predictions.length
    : null;

  return (
    <section className="card-surface rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">验证结果概览</h2>
          <p className="mt-1 text-[12px] text-slate-500">
            动态结果来自当前批次，离线基线来自完整 S3 样例。
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-[11px] text-slate-400">
          科研数据回归
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">当前批次</p>
          <p className="mt-1 text-xl font-bold text-white">
            {result ? `${result.trial_count} 个试次` : "等待数据"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">通道布局</p>
          <p className="mt-1 text-xl font-bold text-white">
            {result ? `${result.channels.length} 通道` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">平均置信度</p>
          <p className="mt-1 text-xl font-bold text-cyan-300">
            {averageConfidence === null
              ? "—"
              : `${Math.round(averageConfidence * 100)}%`}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">本批次准确率</p>
          <p className="mt-1 text-xl font-bold text-emerald-300">
            {result?.validation
              ? `${(result.validation.accuracy * 100).toFixed(2)}%`
              : "无标签"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-800 pt-5 md:grid-cols-2">
        {BASELINES.map((baseline) => (
          <div key={baseline.layout}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-300">{baseline.layout}离线回归基线</span>
              <span className="font-semibold text-white">{baseline.accuracy}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${baseline.color}`}
                style={{ width: `${baseline.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] leading-6 text-amber-100/65">
        基线使用每套 288 个 S3 样例试次，仅用于软件回归与结果复现，不代表模型对新患者或新设备数据的泛化性能。
      </p>
    </section>
  );
}
