import SectionHeading from "@/components/site/SectionHeading";

const TEAM = [
  { role: "项目负责人", focus: "总体设计 · 课题规划" },
  { role: "算法研究", focus: "信号处理 · 意图识别模型" },
  { role: "硬件工程", focus: "采集设备 · 便携终端" },
  { role: "前端与系统", focus: "Web 平台 · 数据链路" },
];

export default function Team() {
  return (
    <section id="team" className="scroll-mt-20 border-t border-slate-800/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="团队介绍"
          title="跨学科科研团队"
          description="以下为角色占位信息，实际成员名单将在后续版本补充。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div
              key={member.role}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-600/25 text-lg font-bold text-cyan-300">
                {member.role[0]}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                {member.role}
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">{member.focus}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-600">
          * 团队成员为占位信息，可随时替换为实际名单。
        </p>
      </div>
    </section>
  );
}

