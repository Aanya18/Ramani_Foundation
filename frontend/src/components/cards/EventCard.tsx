type EventCardProps = {
  title: string;
  date: string;
  location: string;
  description: string;
};

export function EventCard({ title, date, location, description }: EventCardProps) {
  return (
    <article className="reading-card rounded-[30px] p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[22px] bg-trust-50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-trust-700">{date}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-trust-700 shadow-sm">
          {location}
        </span>
      </div>
      <h3 className="mt-5 max-w-[15rem] font-display text-[1.75rem] leading-[1.18] text-ink">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-ink/70">{description}</p>
      <div className="soft-divider mt-6" />
      <p className="mt-5 text-sm font-semibold text-trust-700">View details</p>
    </article>
  );
}
