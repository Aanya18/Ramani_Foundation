import { StatCard } from "../../components/cards/StatCard";
import { AsyncState } from "../../components/ui/AsyncState";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";

export function ImpactSection() {
  const { data, loading, error } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <section className="section-space bg-trust-900 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Impact"
              invert
              title="Visible outcomes make trust easier."
              description="Numbers become easier to trust when they are presented with calm spacing, short context, and no visual clutter."
            />
          </div>
          <div>
            <AsyncState
              className="bg-white/10 text-white"
              error={error}
              loading={loading}
              loadingLabel="Loading impact metrics..."
            />
            {!loading && !error && data ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {data.impact_stats.map((stat) => (
                  <StatCard key={stat.label} label={stat.label} note={stat.note} value={stat.value} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
