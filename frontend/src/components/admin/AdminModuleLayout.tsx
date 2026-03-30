import type { ReactNode } from "react";

type AdminModuleLayoutProps = {
  title: string;
  description: string;
  action?: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
};

export function AdminModuleLayout({
  title,
  description,
  action,
  sidebar,
  children,
}: AdminModuleLayoutProps) {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">
            Admin module
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/65">{description}</p>
        </div>
        {action}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-[30px] border border-white bg-white p-5 shadow-panel">
          {sidebar}
        </aside>
        <section className="rounded-[30px] border border-white bg-white p-6 shadow-panel">
          {children}
        </section>
      </div>
    </div>
  );
}
