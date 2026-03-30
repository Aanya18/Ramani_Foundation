type StatCardProps = {
  value: string;
  label: string;
  note?: string | null;
};

export function StatCard({ value, label, note }: StatCardProps) {
  return (
    <div className="rounded-[30px] border border-white/12 bg-white/8 p-8 text-white shadow-float backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">{label}</p>
      <p className="mt-4 font-display text-[2.5rem] leading-none sm:text-[3.2rem]">{value}</p>
      {note ? <p className="mt-5 max-w-[18rem] text-sm leading-7 text-white/75">{note}</p> : null}
    </div>
  );
}
