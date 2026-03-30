import { PageFrame } from "./PageFrame";
import { AsyncState } from "../../components/ui/AsyncState";
import { ProgramCard } from "../../components/cards/ProgramCard";
import { useApiData } from "../../hooks/useApiData";
import type { ProgramSummary } from "../../types/api";

export function ProgramsPage() {
  const { data, loading, error } = useApiData<ProgramSummary[]>("/programs", []);

  return (
    <PageFrame
      description="Ramani Foundation's programs should read as focused, practical, and clearly connected to the communities they serve."
      eyebrow="Programs"
      title="Clear focus areas make the foundation easier to understand and easier to trust."
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading programs..." />
      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {data.map((card) => (
            <ProgramCard key={card.slug} {...card} />
          ))}
        </div>
      ) : null}
    </PageFrame>
  );
}
