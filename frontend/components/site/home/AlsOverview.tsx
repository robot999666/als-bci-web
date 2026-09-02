import SectionHeading from "@/components/site/SectionHeading";

const IMPACTS = [
  { label: "运动", text: "随运动神经元受损，随意运动能力可能逐步减弱。" },
  { label: "沟通", text: "构音与肢体操作困难会显著压缩患者表达意图的通道。" },
  { label: "吞咽与呼吸", text: "疾病进展可能影响吞咽和呼吸相关肌肉，需要专业医疗支持。" },
];

export default function AlsOverview() {
  return (
    <section id="als" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="了解渐冻症"
          title="当行动与表达受限，意图仍值得被听见"
          description="渐冻症的医学名称为肌萎缩侧索硬化（ALS）。理解疾病带来的沟通障碍，是设计辅助交互技术的起点。"
        />

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="card-surface rounded-3xl p-7 sm:p-9">
            <p className="text-[13px] font-semibold tracking-[0.14em] text-cyan-300">
              什么是肌萎缩侧索硬化（ALS）
            </p>
            <p className="mt-5 text-lg font-semibold leading-8 text-white sm:text-xl">
              一种主要影响脑和脊髓运动神经元的进行性神经系统疾病。
            </p>
            <p className="mt-5 text-[15px] leading-8 text-slate-400">
              运动神经元负责控制随意肌运动。随着神经元退化，患者可能逐渐出现肌无力、
              言语和吞咽困难，并在疾病进展中面临呼吸功能受影响的风险。个体表现存在差异，
              相关诊疗与照护应由专业医疗团队完成。
            </p>
            <div className="mt-7 rounded-2xl border border-cyan-400/20 bg-cyan-500/6 p-5">
              <p className="font-semibold text-cyan-100">脑机接口研究为何重要</p>
              <p className="mt-2 text-[15px] leading-7 text-slate-300">
                脑机接口尝试直接解析脑活动中的意图信息，减少对肢体动作和言语输出的依赖，
                为辅助表达与设备控制探索新的技术路径。
              </p>
            </div>
          </article>

          <div className="grid gap-4">
            {IMPACTS.map((impact, index) => (
              <article
                key={impact.label}
                className="card-surface flex items-start gap-5 rounded-2xl p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-500/8 text-sm font-bold text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">{impact.label}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-slate-400">
                    {impact.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/18 bg-amber-500/5 px-5 py-4 text-[13px] leading-6 text-amber-100/75">
          本项目是脑机接口科研与教学平台，不构成医疗器械、诊断工具或治疗建议。
          医学资料参考：
          <a
            href="https://www.ninds.nih.gov/health-information/disorders/amyotrophic-lateral-sclerosis-als"
            target="_blank"
            rel="noreferrer"
            className="mx-1 text-amber-200 underline decoration-amber-300/35 underline-offset-4 hover:text-white"
          >
            美国国家神经疾病和中风研究所（NINDS）
          </a>
          与
          <a
            href="https://www.gov.cn/zhengce/zhengceku/2018-12/31/content_5435167.htm"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-amber-200 underline decoration-amber-300/35 underline-offset-4 hover:text-white"
          >
            国家卫生健康委员会《第一批罕见病目录》
          </a>
          。
        </div>
      </div>
    </section>
  );
}
