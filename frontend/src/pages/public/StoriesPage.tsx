import { PageFrame } from "./PageFrame";
import { AsyncState } from "../../components/ui/AsyncState";
import { StoryCard } from "../../components/cards/StoryCard";
import { useApiData } from "../../hooks/useApiData";
import type { StorySummary } from "../../types/api";

export function StoriesPage() {
  const { data, loading, error } = useApiData<StorySummary[]>("/stories", []);

  return (
    <PageFrame
      description="This page should eventually include story filters by program, geography, and tags, with detailed beneficiary stories and consent-safe media."
      eyebrow="Success stories"
      title="Storytelling is where impact becomes personal."
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading stories..." />
      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.map((story) => (
            <StoryCard key={story.name} {...story} />
          ))}
        </div>
      ) : null}
    </PageFrame>
  );
}
