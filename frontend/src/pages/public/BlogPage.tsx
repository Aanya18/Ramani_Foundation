import { PageFrame } from "./PageFrame";
import { AsyncState } from "../../components/ui/AsyncState";
import { BlogCard } from "../../components/cards/BlogCard";
import { useApiData } from "../../hooks/useApiData";
import type { BlogSummary } from "../../types/api";

export function BlogPage() {
  const { data, loading, error } = useApiData<BlogSummary[]>("/blogs", []);

  return (
    <PageFrame
      description="This page is structured for featured stories, category filters, and editorial updates that strengthen transparency and search visibility."
      eyebrow="Blog and news"
      title="An active NGO should publish what it learns and what it delivers."
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading blog updates..." />
      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      ) : null}
    </PageFrame>
  );
}
