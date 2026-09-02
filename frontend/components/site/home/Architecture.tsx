import SectionHeading from "@/components/site/SectionHeading";

const STAGES = [
  {
    number: "01",
    title: "标准窗口输入",
    detail: "3 / 22 通道 · 250 Hz · 2 秒 501 点",
  },
  {
    number: "02",
    title: "数据安全校验",
    detail: "格式、形状、数值与容量检查",
  },
  {
    number: "03",
    title: "多频带分解",
    detail: "4–12、8–16、12–24、20–36 Hz",
  },
  {
    number: "04",
    title: "欧氏对齐（EA）",
    detail: "冷启动批次估计参考协方差",
  },
  {
    number: "05",
    title: "CSP 空间特征",
    detail: "22 通道每频带提取 6 个判别特征",
  },
  {
    number: "06",
    title: "线性判别分析（LDA）",
    detail: "24 维特征输出四分类概率",
  },
  {
    number: "07",
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              <p className="mt-2 text-[15px] leading-7 text-slate-400">
                {stage.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
