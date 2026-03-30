import { BlogCard } from "../../components/cards/BlogCard";
import { AsyncState } from "../../components/ui/AsyncState";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { useApiData } from "../../hooks/useApiData";
import type { BlogSummary } from "../../types/api";

export function BlogSection() {
  const { data, loading, error } = useApiData<BlogSummary[]>("/blogs", []);

  return (
    <section className="section-space bg-white/70">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="From the field"
            title="Updates from the field help Ramani Foundation feel active, thoughtful, and transparent."
            description="Editorial cards keep the page polished while making room for grounded reporting, program learning, and updates that build trust over time."
          />
          <p className="max-w-sm text-sm leading-7 text-ink/62">
            The layout is intentionally quieter here so the written content gets more attention.
          </p>
        </div>
        <div className="mt-10">
          <AsyncState error={error} loading={loading} loadingLabel="Loading blog highlights..." />
          {!loading && !error ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {data.map((post) => (
                <BlogCard key={post.title} {...post} />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
