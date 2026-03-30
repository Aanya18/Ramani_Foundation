type StoryCardProps = {
  name: string;
  role: string;
  quote: string;
};

export function StoryCard({ name, role, quote }: StoryCardProps) {
  return (
    <article className="reading-card rounded-[30px] p-7">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay-100 font-display text-lg text-clay-700">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-ink">{name}</p>
          <p className="mt-1 inline-flex rounded-full bg-trust-50 px-3 py-1 text-xs font-semibold text-trust-700">
            {role}
          </p>
        </div>
      </div>
      <p className="mt-6 font-display text-[1.45rem] leading-[1.35] text-ink/90">"{quote}"</p>
      <div className="soft-divider mt-6" />
      <p className="mt-5 text-sm font-semibold text-clay-700">Story-led impact, not just numbers</p>
    </article>
  );
}
