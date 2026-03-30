import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";

type GalleryResponse = {
  items: Array<{ title: string; media_type: string }>;
};

export function AdminGalleryPage() {
  const { data, loading, error } = useApiData<GalleryResponse>("/gallery", { items: [] });

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">Admin module</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Gallery</h1>
      <p className="mt-3 text-sm leading-7 text-ink/65">
        This module is currently read-only and shows available gallery items.
      </p>

      <div className="mt-8 rounded-[30px] border border-white bg-white p-6 shadow-panel">
        <AsyncState error={error} loading={loading} loadingLabel="Loading gallery..." />
        {!loading && !error ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.items.map((item) => (
              <div className="rounded-[24px] border border-trust-100 p-5" key={item.title}>
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm text-ink/60">{item.media_type}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
