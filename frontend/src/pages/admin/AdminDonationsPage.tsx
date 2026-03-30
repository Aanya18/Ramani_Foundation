import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import type { AdminDonationRow } from "../../types/api";

export function AdminDonationsPage() {
  const { data, loading, error } = useApiData<AdminDonationRow[]>("/donations/admin/list", []);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">Admin module</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Donations</h1>
      <p className="mt-3 text-sm leading-7 text-ink/65">
        Review donation records captured through the public donation flow.
      </p>

      <div className="mt-8 rounded-[30px] border border-white bg-white p-6 shadow-panel">
        <AsyncState error={error} loading={loading} loadingLabel="Loading donations..." />
        {!loading && !error ? (
          <div className="overflow-hidden rounded-3xl border border-trust-100">
            <table className="min-w-full divide-y divide-trust-100 text-sm">
              <thead className="bg-trust-50 text-left text-trust-700">
                <tr>
                  {["Donor", "Email", "Amount", "Frequency", "Status", "Created"].map((heading) => (
                    <th className="px-4 py-3 font-semibold" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-trust-100 bg-white">
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4">{row.donor_name}</td>
                    <td className="px-4 py-4 text-ink/65">{row.donor_email}</td>
                    <td className="px-4 py-4">{row.amount_display}</td>
                    <td className="px-4 py-4 capitalize">{row.frequency.replace("_", " ")}</td>
                    <td className="px-4 py-4 capitalize">{row.status}</td>
                    <td className="px-4 py-4 text-ink/65">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
