import { PageFrame } from "./PageFrame";
import { AsyncState } from "../../components/ui/AsyncState";
import { StatCard } from "../../components/cards/StatCard";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";

export function ImpactPage() {
  const { data, loading, error } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <PageFrame
      ctaLabel="Read Success Stories"
      ctaTo="/stories"
      description="Ramani Foundation's impact page should make outcomes easy to scan, easy to trust, and easy to connect back to real work on the ground."
      eyebrow="Impact"
      title="Proof of work should sit in the main journey, not disappear into hidden documents."
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading impact metrics..." />
      {!loading && !error && data ? (
        <div className="grid gap-6 lg:grid-cols-4">
          {data.impact_stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      ) : null}
    </PageFrame>
  );
}
