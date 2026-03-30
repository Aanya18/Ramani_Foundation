import { Link } from "react-router-dom";
import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import type { AdminDonationRow, DashboardResponse } from "../../types/api";

const statLinks: Record<string, string> = {
  "Total donations": "/admin/donations",
  "This month": "/admin/reports",
  "Volunteer requests": "/admin/volunteers",
  "Published posts": "/admin/blogs",
};

export function AdminDashboardPage() {
  const { data, loading, error } = useApiData<DashboardResponse>("/admin/dashboard", {
    stats: [],
    pending_actions: [],
  });
  const {
    data: donations,
    loading: donationsLoading,
    error: donationsError,
  } = useApiData<AdminDonationRow[]>("/donations/admin/list", []);

  function handleExportSummary() {
    const payload = {
      exported_at: new Date().toISOString(),
      stats: data.stats,
      pending_actions: data.pending_actions,
      recent_donations: donations.slice(0, 10),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `admin-summary-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">
            Dashboard
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink">Operational overview</h1>
        </div>
        <button
          className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={handleExportSummary}
        >
          Export summary
        </button>
      </div>

      <div className="mt-8">
        <AsyncState error={error} loading={loading} loadingLabel="Loading dashboard..." />
        {!loading && !error ? (
          <div className="grid gap-5 lg:grid-cols-4">
            {data.stats.map((stat) => (
              <Link
                className="rounded-[26px] border border-white bg-white p-6 shadow-panel"
                key={stat.label}
                to={statLinks[stat.label] ?? "/admin/dashboard"}
              >
                <p className="text-sm text-ink/60">{stat.label}</p>
                <p className="mt-4 font-display text-4xl text-ink">{stat.value}</p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Edit homepage content", to: "/admin/content" },
          { label: "Manage programs", to: "/admin/programs" },
          { label: "Manage blogs", to: "/admin/blogs" },
          { label: "Review contact requests", to: "/admin/contacts" },
          { label: "Review volunteers", to: "/admin/volunteers" },
          { label: "Review donations", to: "/admin/donations" },
        ].map((item) => (
          <Link
            className="rounded-[24px] border border-trust-100 bg-white px-5 py-5 text-sm font-semibold text-trust-700 shadow-panel transition hover:-translate-y-0.5 hover:shadow-float"
            key={item.to}
            to={item.to}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[30px] border border-white bg-white p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Recent donations</h2>
            <Link className="text-sm font-semibold text-trust-700" to="/admin/donations">
              View all
            </Link>
          </div>
          <div className="mt-6">
            <AsyncState
              error={donationsError}
              loading={donationsLoading}
              loadingLabel="Loading recent donations..."
            />
            {!donationsLoading && !donationsError ? (
              donations.length ? (
                <div className="overflow-hidden rounded-3xl border border-trust-100">
                  <table className="min-w-full divide-y divide-trust-100 text-sm">
                    <thead className="bg-trust-50 text-left text-trust-700">
                      <tr>
                        {["Donor", "Email", "Amount", "Status"].map((heading) => (
                          <th className="px-4 py-3 font-semibold" key={heading}>
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-trust-100 bg-white">
                      {donations.slice(0, 5).map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-4 text-ink/75">{row.donor_name}</td>
                          <td className="px-4 py-4 text-ink/65">{row.donor_email || "-"}</td>
                          <td className="px-4 py-4 text-ink/75">{row.amount_display}</td>
                          <td className="px-4 py-4 capitalize text-ink/75">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-[24px] bg-trust-50 px-5 py-6 text-sm text-trust-700">
                  No donations have been recorded yet.
                </div>
              )
            ) : null}
          </div>
        </section>

        <section className="rounded-[30px] border border-white bg-white p-6 shadow-panel">
          <h2 className="font-display text-2xl text-ink">Pending actions</h2>
          <div className="mt-6 space-y-4">
            {data.pending_actions.map((item) => (
              <div className="rounded-2xl bg-trust-50 px-4 py-4 text-sm text-trust-700" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
