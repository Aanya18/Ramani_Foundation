type BlogCardProps = {
  category: string;
  title: string;
  excerpt: string;
};

export function BlogCard({ category, title, excerpt }: BlogCardProps) {
  return (
    <article className="reading-card rounded-[30px] p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="rounded-full bg-leaf-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-leaf-700">
          {category}
        </p>
        <span className="text-xs font-semibold text-ink/40">Field note</span>
      </div>
      <h3 className="mt-5 max-w-[16rem] font-display text-[1.75rem] leading-[1.18] text-ink">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-ink/70">{excerpt}</p>
      <div className="soft-divider mt-6" />
      <p className="mt-5 text-sm font-semibold text-trust-700">Read article</p>
    </article>
  );
}
