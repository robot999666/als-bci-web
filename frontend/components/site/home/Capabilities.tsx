import SectionHeading from "@/components/site/SectionHeading";

const CAPABILITIES = [
  {
    title: "双通道布局模型",
    text: "同时加载 3 通道与标准 22 通道模型，按上传数据自动选择对应推理布局。",
  },
  {
    title: "安全数据接入",
    text: "严格校验 NumPy 压缩数组文件（NPZ）的容量、形状、单位和有限数值。",
  },
  {
    title: "真实批量推理",
    text: "使用已固定版本的欧氏对齐、滤波器组共空间模式和线性判别分析模型。",
  },
  {
    title: "完整预测解释",
    text: "逐试次提供分类编号、中文指令、置信度与四类概率。",
  },
  {
    title: "交互式科研回放",
    text: "支持内置科研样例回放与自定义数据上传，直观查看脑电波形和识别结果。",
  },
  {
    title: "容器化运行",
    text: "后端采用 CPU-only Docker 环境，模型在服务启动时完成校验与就绪检查。",
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
          eyebrow="已完成系统能力"
          title="从模型推理到网页交互均已贯通"
          description="评委可以通过在线实验平台直接回放科研数据或上传符合规范的数据文件，观察真实模型输出。"
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
              <p className="mt-3 text-[14px] leading-7 text-slate-400">
                {capability.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
