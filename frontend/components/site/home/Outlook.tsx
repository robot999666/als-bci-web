import SectionHeading from "@/components/site/SectionHeading";

export default function Outlook() {
  return (
    <section id="outlook" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="应用价值与研究展望"
          title="以可验证平台支撑后续辅助交互研究"
          description="当前系统聚焦运动想象脑电四分类，为算法比较、数据回放和交互验证提供统一实验环境。"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="card-surface rounded-3xl p-7 sm:p-8">
            <p className="text-[13px] font-semibold tracking-[0.14em] text-cyan-300">
              当前研究价值
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              将抽象算法转化为可观察的交互过程
            </h3>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              平台把原始脑电、信号处理、分类概率和辅助指令放在同一界面中，
              便于研究人员复核模型行为，也便于非算法背景的评审理解完整技术链路。
            </p>
          </article>
          <article className="rounded-3xl border border-indigo-400/20 bg-indigo-500/6 p-7 sm:p-8">
            <p className="text-[13px] font-semibold tracking-[0.14em] text-indigo-300">
              后续研究方向
            </p>
            <h3 className="mt-4 text-xl font-semibold text-white">
              从离线批量验证走向稳定实时交互
            </h3>
            <p className="mt-4 text-[15px] leading-8 text-slate-400">
              后续计划围绕 ADS1299 脑电采集硬件、实时数据链路、用户级对齐参考与预测平滑开展研究；
              相关内容属于后续工作，不作为当前网页功能展示。
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
