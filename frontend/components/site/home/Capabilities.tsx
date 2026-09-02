import SectionHeading from "@/components/site/SectionHeading";

const CAPABILITIES = [
  {
    title: "在线脑电实验平台",
    text: "提供独立实验工作区，可体验脑电数据输入、信号展示、分析处理与意图输出的完整流程。",
  },
  {
    title: "多通道信号可视化",
    text: "实时绘制多通道 EEG 时序波形，支持动态刷新、暂停观察和不同数据来源切换，直观看到脑电信号变化。",
  },
  {
    title: "数据文件上传分析",
    text: "支持标准脑电数据文件上传，完成数据读取、格式检查与分析，并将处理结果直接反馈到网页。",
  },
  {
    title: "意图识别结果展示",
    text: "将模型输出转化为左转、右转、直行、停止等直观指令，并通过当前结果、时间范围和历史 Timeline 持续呈现。",
  },
  {
    title: "系统流程可视化",
    text: "将“脑电采集 → 信号处理 → 特征提取 → 意图识别 → 指令输出”完整链路可视化，帮助非专业用户快速理解系统原理。",
  },
  {
    title: "3D 交互式数字孪生演示",
    text: "通过患者、BCI 采集设备与电动轮椅的三维交互动画，演示运动想象、脑电传输、模型识别到轮椅执行指令的全过程。",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="scroll-mt-24 border-y border-slate-800/70 bg-slate-950/50 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="系统能力"
          title="从模型推理到网页交互均已贯通"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <article key={capability.title} className="card-surface rounded-2xl p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/8 text-sm font-bold text-emerald-300">
                ✓
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {capability.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-slate-400">
                {capability.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
