import SectionHeading from "@/components/site/SectionHeading";

const TECHS = [
  {
    name: "EEG 脑电信号",
    desc: "反映脑皮层电活动，用于识别运动想象相关节律；当前由 S3 科研样例演示。",
    tag: "演示中",
  },
  {
    name: "EA 欧氏对齐",
    desc: "使用同一请求中的整批 trial 估计参考协方差，缓解跨受试者分布差异。",
    tag: "已接入",
  },
  {
    name: "FBCSP + LDA",
    desc: "多频带 CSP 提取空间节律特征，由 LDA 输出四分类概率。",
    tag: "已接入",
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
    desc: "固定模型 checksum 与依赖版本，使用科研样例提供可回归的批量预测。",
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
