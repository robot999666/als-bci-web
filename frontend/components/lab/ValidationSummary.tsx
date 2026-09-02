import type { BciBatchResponse } from "@/lib/types";

interface ValidationSummaryProps {
  result: BciBatchResponse | null;
  mode: "example" | "model";
  isPlaying?: boolean;
}

const BASELINES = [
  { layout: "3 通道", accuracy: 63.54, color: "bg-cyan-400" },
  { layout: "22 通道", accuracy: 82.99, color: "bg-indigo-400" },
];

export default function ValidationSummary({
  result,
  mode,
  isPlaying = false,
}: ValidationSummaryProps) {
  const averageConfidence = result?.predictions.length
    ? result.predictions.reduce((sum, item) => sum + item.confidence, 0) /
      result.predictions.length
    : null;

  return (
    <section className="card-surface rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            {mode === "example" ? "动画数据概览" : "验证结果概览"}
          </h2>
          <p className="mt-1 text-[12px] text-slate-400">
            {mode === "example"
              ? "当前内容由浏览器本地播放，不执行模型计算。"
              : "动态结果来自当前批次，离线基线来自完整 S3 样例。"}
          </p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-[11px] text-slate-400">
          {mode === "example" ? "交互效果演示" : "科研数据回归"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">
            {mode === "example" ? "播放状态" : "当前批次"}
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {mode === "example"
              ? isPlaying
                ? "动画播放中"
                : "动画已暂停"
              : result
                ? `${result.trial_count} 个试次`
                : "等待数据"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">通道布局</p>
          <p className="mt-1 text-xl font-bold text-white">
            {mode === "example"
              ? "C3 · Cz · C4"
              : result
                ? `${result.channels.length} 通道`
                : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">
            {mode === "example" ? "采样与窗口" : "平均置信度"}
          </p>
          <p className="mt-1 text-xl font-bold text-cyan-300">
            {mode === "example"
              ? "250 Hz · 2 秒"
              : averageConfidence === null
                ? "—"
                : `${Math.round(averageConfidence * 100)}%`}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-[12px] text-slate-500">
            {mode === "example" ? "计算状态" : "本批次准确率"}
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-300">
            {mode === "example"
              ? "未执行模型"
              : result?.validation
                ? `${(result.validation.accuracy * 100).toFixed(2)}%`
                : "无标签"}
          </p>
        </div>
      </div>

      {mode === "model" ? (
        <>
          <div className="mt-5 grid gap-4 border-t border-slate-800 pt-5 md:grid-cols-2">
            {BASELINES.map((baseline) => (
              <div key={baseline.layout}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-300">
                    {baseline.layout}离线回归基线
                  </span>
                  <span className="font-semibold text-white">
                    {baseline.accuracy}%
                  </span>
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
            基线使用每套 288 个 S3 样例试次，仅用于软件回归与结果复现，不能与跨受试者泛化准确率混用，也不代表模型对新患者或新设备数据的性能。
          </p>
        </>
      ) : (
        <p className="mt-4 border-t border-slate-800 pt-4 text-[12px] leading-6 text-cyan-100/65">
          结果概率与指令顺序均为预设动画内容；请选择并上传符合规范的 NPZ 文件以查看真实冷启动模型结果。
        </p>
      )}
    </section>
  );
}
