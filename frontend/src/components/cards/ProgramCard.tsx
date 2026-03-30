type ProgramCardProps = {
  title: string;
  stat: string;
  description: string;
};

export function ProgramCard({ title, stat, description }: ProgramCardProps) {
  return (
    <article className="reading-card overflow-hidden rounded-[30px] p-0">
      <div className="bg-gradient-to-r from-clay-100 via-ambergold-100 to-white px-7 py-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-clay-700">{stat}</span>
      </div>
      <div className="px-7 py-7">
        <h3 className="max-w-[15rem] font-display text-[1.8rem] leading-[1.15] text-ink">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-ink/70">{description}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-trust-700">Explore program</span>
          <span className="rounded-full bg-trust-50 px-3 py-1 text-xs font-semibold text-trust-700">
            Public page
          </span>
        </div>
      </div>
    </article>
  );
}
