type AdminListCardProps = {
  title: string;
  subtitle?: string;
  active?: boolean;
  onClick: () => void;
};

export function AdminListCard({
  title,
  subtitle,
  active = false,
  onClick,
}: AdminListCardProps) {
  return (
    <button
      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
        active
          ? "border-trust-300 bg-trust-50"
          : "border-trust-100 bg-white hover:border-trust-200 hover:bg-trust-50/60"
      }`}
      type="button"
      onClick={onClick}
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      {subtitle ? <p className="mt-1 text-xs leading-5 text-ink/60">{subtitle}</p> : null}
    </button>
  );
}
