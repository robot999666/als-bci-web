import SectionHeading from "@/components/site/SectionHeading";

const STAGES = [
  {
    number: "01",
    title: "脑电数据输入",
    detail: "3 / 22 通道 · 250 Hz · 501 点",
  },
  {
    number: "02",
    title: "数据安全校验",
    detail: "格式、形状、数值与容量检查",
  },
  {
    number: "03",
    title: "欧氏对齐（EA）",
    detail: "整批试次估计参考协方差",
  },
  {
    number: "04",
    title: "滤波器组共空间模式",
    detail: "FBCSP 提取多频带空间特征",
  },
  {
    number: "05",
    title: "线性判别分析（LDA）",
    detail: "输出四分类概率与置信度",
  },
  {
    number: "06",
    title: "网页结果展示",
    detail: "波形、意图与试次预测序列",
  },
];

export default function Architecture() {
  return (
    <section id="architecture" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="技术架构"
          title="可追踪的端到端脑电推理流程"
          description="每个环节均对应当前系统中的实际实现，从科研数据输入到四分类结果展示形成完整闭环。"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STAGES.map((stage, index) => (
            <article
              key={stage.number}
              className="card-surface group relative overflow-hidden rounded-2xl p-6 transition hover:border-cyan-400/35"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-3xl font-black text-cyan-400/25 transition group-hover:text-cyan-400/45">
                  {stage.number}
                </span>
                {index < STAGES.length - 1 ? (
                  <span className="text-lg text-slate-600" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{stage.title}</h3>
              <p className="mt-2 text-[14px] leading-7 text-slate-400">
                {stage.detail}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5 text-center text-[14px] leading-7 text-slate-400">
          欧氏对齐使用同一请求中的完整批次计算参考，因此单个试次的结果会受到批次组成影响；
          在线实验平台会明确展示这一算法边界。
        </div>
      </div>
    </section>
  );
}
