import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import type { AdminDonorRow } from "../../types/api";

export function AdminDonorsPage() {
  const { data, loading, error } = useApiData<AdminDonorRow[]>("/admin/donors", []);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">Admin module</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Donors</h1>
      <p className="mt-3 text-sm leading-7 text-ink/65">
        View donor records created from successful donation submissions.
      </p>

      <div className="mt-8 rounded-[30px] border border-white bg-white p-6 shadow-panel">
        <AsyncState error={error} loading={loading} loadingLabel="Loading donors..." />
        {!loading && !error ? (
          <div className="overflow-hidden rounded-3xl border border-trust-100">
            <table className="min-w-full divide-y divide-trust-100 text-sm">
              <thead className="bg-trust-50 text-left text-trust-700">
                <tr>
                  {["Name", "Email", "Phone", "Status", "Created"].map((heading) => (
                    <th className="px-4 py-3 font-semibold" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-trust-100 bg-white">
                {data.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4">{row.full_name}</td>
                    <td className="px-4 py-4 text-ink/65">{row.email ?? "-"}</td>
                    <td className="px-4 py-4 text-ink/65">{row.phone ?? "-"}</td>
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
