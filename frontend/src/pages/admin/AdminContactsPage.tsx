import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import type { AdminContactRow } from "../../types/api";

export function AdminContactsPage() {
  const { data, loading, error } = useApiData<AdminContactRow[]>("/contact/admin/list", []);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">Admin module</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Contact messages</h1>
      <p className="mt-3 text-sm leading-7 text-ink/65">
        Review inbound questions and partner outreach submitted from the public website.
      </p>

      <div className="mt-8 rounded-[30px] border border-white bg-white p-6 shadow-panel">
        <AsyncState error={error} loading={loading} loadingLabel="Loading contact messages..." />
        {!loading && !error ? (
          data.length ? (
            <div className="overflow-hidden rounded-3xl border border-trust-100">
              <table className="min-w-full divide-y divide-trust-100 text-sm">
                <thead className="bg-trust-50 text-left text-trust-700">
                  <tr>
                    {["Name", "Email", "Subject", "Type", "Status", "Received"].map((heading) => (
                      <th className="px-4 py-3 font-semibold" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-trust-100 bg-white">
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4">{row.name}</td>
                      <td className="px-4 py-4 text-ink/65">{row.email}</td>
                      <td className="px-4 py-4">{row.subject ?? "-"}</td>
                      <td className="px-4 py-4">{row.inquiry_type ?? "-"}</td>
                      <td className="px-4 py-4 capitalize">{row.status}</td>
                      <td className="px-4 py-4 text-ink/65">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-[24px] bg-trust-50 px-5 py-6 text-sm text-trust-700">
              No contact messages have been submitted yet.
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
