import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container-page py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-elevated">
          <div className="text-xs font-semibold tracking-wider uppercase text-[var(--brand-orange)]">
            Admin
          </div>
          <h1 className="mt-3 text-3xl font-bold">Dashboard</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            This is a placeholder admin landing page for the Next.js port. Connect the existing
            admin screens here if you want the full management UI.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
