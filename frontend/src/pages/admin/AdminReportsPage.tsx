import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import type { DonationReport } from "../../types/api";

export function AdminReportsPage() {
  const { data, loading, error } = useApiData<DonationReport>("/admin/reports/donations", {
    range: "",
    total_amount: 0,
    transactions: 0,
    top_campaign: "",
  });

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">Admin module</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Reports</h1>
      <p className="mt-3 text-sm leading-7 text-ink/65">
        High-level reporting for donations and campaign performance.
      </p>

      <div className="mt-8 rounded-[30px] border border-white bg-white p-6 shadow-panel">
        <AsyncState error={error} loading={loading} loadingLabel="Loading report..." />
        {!loading && !error ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[24px] bg-trust-50 p-6">
              <p className="text-sm text-trust-700">Range</p>
              <p className="mt-3 font-display text-3xl text-ink">{data.range}</p>
            </div>
            <div className="rounded-[24px] bg-trust-50 p-6">
              <p className="text-sm text-trust-700">Transactions</p>
              <p className="mt-3 font-display text-3xl text-ink">{data.transactions}</p>
            </div>
            <div className="rounded-[24px] bg-trust-50 p-6">
              <p className="text-sm text-trust-700">Top campaign</p>
              <p className="mt-3 font-display text-3xl text-ink">{data.top_campaign}</p>
            </div>
            <div className="rounded-[24px] bg-trust-50 p-6 lg:col-span-3">
              <p className="text-sm text-trust-700">Total amount</p>
              <p className="mt-3 font-display text-4xl text-ink">
                Rs. {(data.total_amount / 100).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
