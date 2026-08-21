import SectionHeading from "@/components/site/SectionHeading";

const TECHS = [
  {
    name: "EEG 脑电信号",
    desc: "反映脑皮层电活动，用于识别认知与意图相关节律；V0 由模拟信号演示。",
    tag: "演示中",
  },
  {
    name: "EOG 眼电信号",
    desc: "捕捉眨眼与眼动电位变化，适合作为沟通意图的补充通道。",
    tag: "演示中",
  },
  {
    name: "多模态融合",
    desc: "EEG + EOG 联合建模，未来扩展心率、血氧、姿态与跌倒检测。",
    tag: "预留",
  },
  {
    name: "时间窗意图识别",
    desc: "以 2 秒左右的时间窗输出意图与置信度，而非逐采样点判定。",
    tag: "已设计",
  },
  {
    name: "边缘/便携部署",
    desc: "面向模块化便携终端，预留边缘设备模型服务接口。",
    tag: "预留",
  },
  {
    name: "可复现 Demo",
    desc: "确定性 Mock 数据与模型，演示结果稳定可复现，便于教学与评审。",
    tag: "当前",
  },
];

export default function Technologies() {
  return (
    <section id="tech" className="scroll-mt-20 border-t border-slate-800/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="核心技术"
          title="技术路线与当前实现状态"
          description="V0 优先验证系统结构与流程闭环；真实算法、融合策略与硬件能力按里程碑逐步接入。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECHS.map((tech) => (
            <div
              key={tech.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-cyan-400/30"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{tech.name}</h3>
                <span className="shrink-0 rounded-full border border-slate-700 px-2.5 py-0.5 text-[10px] text-slate-400">
                  {tech.tag}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

