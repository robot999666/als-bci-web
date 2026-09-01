import SectionHeading from "@/components/site/SectionHeading";

const STEPS = [
  {
    title: "采集运动想象脑电",
    text: "以标准时间窗组织脑电信号，兼容 3 通道与 22 通道数据布局。",
  },
  {
    title: "解析四类意图",
    text: "通过欧氏对齐与空间特征提取，将信号映射为四类辅助控制指令。",
  },
  {
    title: "形成可验证反馈",
    text: "在网页端呈现波形、分类概率、置信度和逐试次预测结果。",
  },
];

export default function ProjectSolution() {
  return (
    <section
      id="solution"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/45 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="项目方案"
          title="从运动想象脑电到离散辅助指令"
          description="ALS-BCI 将科研数据、算法模型和网页交互整合为一条可操作、可观察、可复现的实验链路。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <article key={step.title} className="card-surface relative rounded-2xl p-7">
              <span className="text-[13px] font-semibold tracking-[0.16em] text-cyan-400">
                步骤 {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-slate-400">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/45 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {[
            ["输入", "3 / 22 通道脑电"],
            ["窗口", "501 点 · 250 Hz"],
            ["输出", "四类概率与置信度"],
            ["运行", "网页端批量推理"],
          ].map(([label, value]) => (
            <div key={label} className="border-slate-800 sm:border-l sm:pl-5 first:border-0 first:pl-0">
              <p className="text-[12px] tracking-[0.12em] text-slate-500">{label}</p>
              <p className="mt-1 text-[15px] font-semibold text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
