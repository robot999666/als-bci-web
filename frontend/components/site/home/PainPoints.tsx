import SectionHeading from "@/components/site/SectionHeading";

const PAINS = [
  {
    title: "运动能力严重受限",
    desc: "疾病后期四肢与躯干活动近乎丧失，传统开关、摇杆等肢体交互方式失效。",
  },
  {
    title: "言语沟通逐步丧失",
    desc: "构音困难使口语表达难以被理解，家属与护理人员需要高成本地猜测意图。",
  },
  {
    title: "关键意图需即时表达",
    desc: "“是 / 否 / 求助”等极简意图在照护中高频出现，需要低延迟、低负担的表达通道。",
  },
  {
    title: "现有方案存在局限",
    desc: "眼动追踪受头动、疲劳与设备成本限制；单一模态信号在噪声环境下可靠性不足。",
  },
];

export default function PainPoints() {
  return (
    <section id="pain" className="scroll-mt-20 border-t border-slate-800/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="用户痛点"
          title="ALS 重度运动障碍人群的真实困境"
          description="患者认知与意图通常保持清晰，但表达通道被疾病逐一切断——这正是本项目要回应的问题。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((pain, index) => (
            <div
              key={pain.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <span className="text-2xl font-black text-cyan-500/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">
                {pain.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {pain.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

