"use client";

const STEPS = [
  "原始信号",
  "数据检查",
  "信号预处理",
  "时间窗切分",
  "特征提取",
  "模型推理",
  "意图输出",
];

type StepState = "done" | "active" | "pending";

interface PipelineViewProps {
  hasData: boolean;
  streaming: boolean;
}

function stepStates(hasData: boolean, streaming: boolean): StepState[] {
  if (!hasData) {
    return STEPS.map((_, index) => (index === 0 ? "active" : "pending"));
  }
  if (streaming) {
    return STEPS.map((_, index) => {
      if (index < 5) {
        return "done";
      }
      return index === 5 ? "active" : "done";
    });
  }
  return STEPS.map(() => "done");
}

export default function PipelineView({
  hasData,
  streaming,
}: PipelineViewProps) {
  const states = stepStates(hasData, streaming);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">信号处理流程</h2>
        <span className="text-[11px] text-slate-500">
          EA+FBCSP 冷启动
        </span>
      </div>
      <ol className="thin-scrollbar flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((step, index) => {
          const state = states[index];
          const isLast = index === STEPS.length - 1;
          return (
            <li key={step} className="flex shrink-0 items-center gap-1">
              <span
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs ${
                  state === "done"
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                    : state === "active"
                      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-500"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    state === "done"
                      ? "bg-emerald-500/30"
                      : state === "active"
                        ? "bg-cyan-500/30"
                        : "bg-slate-800"
                  }`}
                >
                  {state === "done" ? "✓" : state === "active" ? "•" : index + 1}
                </span>
                {step}
              </span>
              {!isLast ? (
                <span className="px-0.5 text-slate-600">→</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        输入经格式校验后，以整批 trial 计算 EA 对齐参考，再由多频带 CSP 与 LDA
        输出四分类概率。批内样本共同影响 EA 参考，因此结果具有批次耦合性。
      </p>
    </section>
  );
}
