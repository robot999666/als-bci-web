interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

