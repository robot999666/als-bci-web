import SectionHeading from "@/components/site/SectionHeading";

export default function Background() {
  return (
    <section id="background" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="项目背景"
          title="为“说不出”的人，打开一条表达通道"
          description="ALS（肌萎缩侧索硬化）晚期患者运动能力严重受限，言语与肢体沟通逐渐丧失，但认知与意图往往保持清晰。"
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-white">问题</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              重度运动障碍人群需要低负担、离散且可靠的辅助控制指令。
              传统眼动或肢体辅助在疾病后期可能同样失效。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-white">思路</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              使用 EEG 运动想象信号，以 2 秒 trial 识别左转、右转、直行和停止，
              构建模块化、可扩展的便携辅助终端原型。
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-sm font-semibold text-white">现状</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              当前阶段已完成 Web 系统与冷启动模型接入，以 S3 科研数据验证 3/22
              通道批量推理，后续再接入采集设备与实时会话。
            </p>
          </div>
        </div>
        <p className="mt-8 rounded-xl border border-amber-400/20 bg-amber-500/5 px-5 py-4 text-center text-xs leading-relaxed text-amber-200/80">
          声明：本项目为科研原型实验平台，当前识别结果来自科研样例与冷启动模型，
          非医疗器械，不具备临床可靠性，须经真实数据与伦理审查验证后方可进入应用研究。
        </p>
      </div>
    </section>
  );
}
