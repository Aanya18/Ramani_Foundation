import { ProgramCard } from "../../components/cards/ProgramCard";
import { AsyncState } from "../../components/ui/AsyncState";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { useApiData } from "../../hooks/useApiData";
import type { ProgramSummary } from "../../types/api";

export function ProgramsSection() {
  const { data, loading, error } = useApiData<ProgramSummary[]>("/programs", []);

  return (
    <section className="section-space">
      <Container>
        <div className="section-surface">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Focus areas"
              title="Where change happens"
              description="Programs are grouped clearly so visitors can understand how the foundation works across education, empowerment, skills, and awareness without feeling lost."
            />
            <p className="max-w-sm text-sm leading-7 text-ink/62">
              The reading flow here is built to help someone scan all core program areas in less than a minute.
            </p>
          </div>
          <div className="mt-10">
            <AsyncState error={error} loading={loading} loadingLabel="Loading programs..." />
            {!loading && !error ? (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
                {data.map((card) => (
                  <ProgramCard key={card.slug} {...card} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
