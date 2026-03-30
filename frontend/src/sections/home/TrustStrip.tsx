import { useApiData } from "../../hooks/useApiData";
import { Container } from "../../components/ui/Container";
import { AsyncState } from "../../components/ui/AsyncState";
import type { PublicSettings } from "../../types/api";

export function TrustStrip() {
  const { data, loading, error } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <section className="py-6">
      <Container>
        <AsyncState error={error} loading={loading} loadingLabel="Loading trust markers..." />
        {!loading && !error && data ? (
          <div className="section-surface grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.trust_items.map((item) => (
              <div
                className="rounded-[24px] bg-gradient-to-br from-trust-50 to-white px-5 py-4 text-center text-sm font-semibold text-trust-700 shadow-sm"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
