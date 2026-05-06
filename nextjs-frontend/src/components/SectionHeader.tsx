type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "center" }: Props) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-semibold tracking-wider uppercase text-[var(--brand-blue)]">
          <span className="size-1.5 rounded-full bg-gradient-brand" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
