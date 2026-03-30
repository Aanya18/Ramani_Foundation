import { StoryCard } from "../../components/cards/StoryCard";
import { AsyncState } from "../../components/ui/AsyncState";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { useApiData } from "../../hooks/useApiData";
import type { StorySummary } from "../../types/api";

export function StoriesSection() {
  const { data, loading, error } = useApiData<StorySummary[]>("/stories", []);

  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Success stories"
            title="Real people should remain at the center of the foundation story."
            description="Impact feels more credible when program outcomes are connected back to the voices, progress, and lived experiences of real people."
          />
          <div>
            <AsyncState error={error} loading={loading} loadingLabel="Loading stories..." />
            {!loading && !error ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {data.map((story) => (
                  <StoryCard key={story.name} {...story} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
