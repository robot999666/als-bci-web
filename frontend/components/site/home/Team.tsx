import SectionHeading from "@/components/site/SectionHeading";

const CORE_MEMBERS = [
  {
    role: "项目负责人",
    name: "刘熙瑞",
    school: "首都师范大学 数学科学学院",
    grade: "2024级本科生",
  },
  {
    role: "硬件工程",
    name: "董曙维",
    school: "首都师范大学 人工智能学院",
    grade: "2026级本科生",
  },
  {
    role: "Web 平台搭建（网页系统开发）",
    name: "李鸿鑫",
    school: "首都师范大学 信息工程学院",
    grade: "2024级本科生",
  },
];

const ALGORITHM_MEMBERS = [
  ["李世超", "首都师范大学 信息工程学院", "2025级本科生"],
  ["柳畅", "首都师范大学 数学科学学院", "2024级本科生"],
  ["邱子腾", "首都师范大学 燕都学院", "2024级本科生"],
  ["孙博雅", "首都师范大学 数学科学学院", "2024级本科生"],
  ["汪潇", "首都师范大学 数学科学学院", "2024级本科生"],
  ["周晗玉", "首都师范大学 燕都学院", "2024级本科生"],
];

export default function Team() {
  return (
    <section
      id="team"
      className="scroll-mt-24 border-t border-slate-800/70 bg-slate-950/45 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="团队成员"
          title="跨学科协作的科研团队"
          description="团队成员来自信息工程、数学科学、人工智能与燕都学院，共同推进算法、硬件与网页平台建设。"
        />

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
          <div className="grid gap-3 border-b border-slate-800 px-6 py-6 sm:grid-cols-[180px_1fr] sm:items-center sm:px-8">
            <p className="text-[13px] font-semibold tracking-[0.12em] text-cyan-300">
              指导老师
            </p>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-xl font-semibold text-white">丁辉</p>
              <p className="text-[14px] text-slate-400">
                首都师范大学 信息工程学院 · 副教授
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {CORE_MEMBERS.map((member) => (
              <div
                key={member.role}
                className="grid gap-2 px-6 py-5 sm:grid-cols-[180px_120px_1fr] sm:items-center sm:px-8"
              >
                <p className="text-[13px] font-semibold text-slate-400">{member.role}</p>
                <p className="text-base font-semibold text-white">{member.name}</p>
                <p className="text-[14px] text-slate-400">
                  {member.school} · {member.grade}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 px-6 py-6 sm:px-8">
            <p className="text-[13px] font-semibold tracking-[0.12em] text-cyan-300">
              算法研究
            </p>
            <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
              {ALGORITHM_MEMBERS.map(([name, school, grade]) => (
                <div
                  key={name}
                  className="grid gap-1 border-b border-slate-800/70 pb-4 sm:grid-cols-[88px_1fr] sm:items-baseline"
                >
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-[13px] leading-6 text-slate-400">
                    {school} · {grade}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
