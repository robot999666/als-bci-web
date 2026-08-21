import SectionHeading from "@/components/site/SectionHeading";

const SCENARIOS = [
  {
    name: "沟通辅助",
    desc: "以“确认 / 否定”完成是/否问答，配合医护与家属日常照护。",
  },
  {
    name: "紧急求助",
    desc: "通过预设眼动模式表达求助意图，触发提醒与呼叫。",
  },
  {
    name: "护理协作",
    desc: "将意图结果接入护理看板，降低沟通成本与误判风险。",
  },
  {
    name: "多模态扩展",
    desc: "规划接入心率、血氧、姿态与跌倒检测，构建更完整的健康监护。",
    planned: true,
  },
];

export default function Scenarios() {
  return (
    <section
      id="scenarios"
      className="scroll-mt-20 border-t border-slate-800/60 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="应用场景"
          title="从实验室走向照护现场"
          description="以下场景为研究规划方向；V0 仅验证技术可行性，尚未开展临床验证。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {scenario.name}
                </h3>
                {scenario.planned ? (
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                    规划中
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {scenario.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

