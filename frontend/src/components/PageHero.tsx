type Props = { eyebrow?: string; title: string; description?: string };

export function PageHero({ eyebrow, title, description }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-soft border-b border-border">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-24 -left-20 size-72 rounded-full bg-[var(--brand-teal)] blur-3xl opacity-30" />
        <div className="absolute -bottom-24 -right-20 size-80 rounded-full bg-[var(--brand-magenta)] blur-3xl opacity-25" />
      </div>
      <div className="container-page relative py-20 md:py-28 text-center">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold tracking-wider uppercase text-[var(--brand-blue)]">
            <span className="size-1.5 rounded-full bg-gradient-brand" /> {eyebrow}
          </div>
        )}
        <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-gradient-brand">{title}</span>
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
