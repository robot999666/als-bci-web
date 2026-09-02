import SectionHeading from "@/components/site/SectionHeading";

const DATA_FACTS = [
  { value: "BCI 2a", label: "BCI Competition IV 2a 主数据集" },
  { value: "22 通道", label: "标准运动想象脑电布局" },
  { value: "250 Hz", label: "脑电信号采样率" },
  { value: "288 试次", label: "每名受试者四类样本总数" },
  { value: "2 秒 · 501 点", label: "单个分析时间窗" },
  { value: "4 频带 · 24 维", label: "22 通道 FBCSP 特征表示" },
];

const CORE_RESULTS = [
  {
    value: "53.6%",
    title: "跨受试者冷启动",
    detail: "无本人校准数据时，采用欧氏对齐（EA）与预训练 FBCSP。",
    color: "text-cyan-300",
  },
  {
    value: "71.3%",
    title: "个体化训练",
    detail: "BCI 2a 九名受试者平均，采用五折交叉验证。",
    color: "text-emerald-300",
  },
  {
    value: "69.0–73.6%",
    title: "四类召回率范围",
    detail: "四类指令识别较为均衡，不依赖单一类别贡献总体结果。",
    color: "text-indigo-300",
  },
];

const RECALLS = [
  { label: "左转（左手）", value: 73.6, color: "bg-cyan-400" },
  { label: "右转（右手）", value: 69.0, color: "bg-indigo-400" },
  { label: "直行（双脚）", value: 70.7, color: "bg-emerald-400" },
  { label: "停止（舌头）", value: 71.8, color: "bg-amber-400" },
];

export default function ResearchEvidence() {
  return (
    <section
      id="evidence"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/50 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="数据、算法与实验依据"
          title="用明确参数和离线实验支撑技术选择"
          description="模型围绕运动想象脑电的小样本特征设计，采用可解释、计算量低的滤波器组共空间模式（FBCSP）与正则化线性判别分析（LDA）。"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DATA_FACTS.map((fact) => (
            <article
              key={fact.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5"
            >
              <p className="text-xl font-bold text-white">{fact.value}</p>
              <p className="mt-2 text-[15px] leading-7 text-slate-400">
                {fact.label}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CORE_RESULTS.map((result) => (
            <article key={result.title} className="card-surface rounded-2xl p-6">
              <p className={`text-3xl font-black ${result.color}`}>
                {result.value}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {result.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-slate-400">
                {result.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.14em] text-cyan-300">
              四类指令召回率
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              四个控制方向均获得稳定识别
            </h3>
            <p className="mt-3 text-[15px] leading-8 text-slate-400">
              左手、右手、双脚和舌头四类运动想象分别映射为左转、右转、直行和停止，召回率集中在 69%–74%。
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {RECALLS.map((recall) => (
              <div key={recall.label}>
                <div className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="text-slate-300">{recall.label}</span>
                  <span className="font-semibold text-white">
                    {recall.value.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${recall.color}`}
                    style={{ width: `${recall.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/5 px-5 py-4 text-[13px] leading-6 text-amber-100/75">
          以上数据来自项目书中的 BCI Competition IV 2a 离线实验。当前在线平台只接入冷启动批量模型，不提供在线个体化训练；实验页中的 S3 回归结果仅用于软件复现，不能与跨受试者泛化准确率混用。
        </div>
        <p className="mt-4 text-[12px] leading-6 text-slate-500">
          方法依据：Ang 等提出的滤波器组共空间模式（FBCSP，2008）；He 与 Wu 提出的脑机接口欧氏空间数据对齐方法（EA，2020）。
        </p>
      </div>
    </section>
  );
}
