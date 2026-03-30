import { brandMeta } from "../../data/siteContent";

type BrandMarkProps = {
  name?: string;
  compact?: boolean;
};

export function BrandMark({ name = brandMeta.name, compact = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-clay-500 via-ambergold-500 to-trust-700 text-white shadow-float">
        <span className="absolute inset-[3px] rounded-[15px] border border-white/20" />
        <span className="relative font-display text-lg font-semibold">RF</span>
      </div>
      {!compact ? (
        <div>
          <p className="font-display text-xl font-semibold text-ink">{name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/55">{brandMeta.tagline}</p>
        </div>
      ) : null}
    </div>
  );
}
