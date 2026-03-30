import { useEffect, useState } from "react";
import { AdminListCard } from "../../components/admin/AdminListCard";
import {
  AdminSelectField,
  AdminTextField,
  AdminTextareaField,
  AdminToggleField,
} from "../../components/admin/AdminFormControls";
import { AdminModuleLayout } from "../../components/admin/AdminModuleLayout";
import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import { apiPost, apiPut } from "../../lib/api";
import type { AdminBlog } from "../../types/api";

type BlogFormState = Omit<AdminBlog, "id" | "updated_at">;

const blankBlog: BlogFormState = {
  title: "",
  slug: "",
  category: "Impact Stories",
  excerpt: "",
  content: "",
  status: "published",
  is_featured: false,
};

export function AdminBlogsPage() {
  const { data, loading, error, reload } = useApiData<AdminBlog[]>("/blogs/admin", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<BlogFormState>(blankBlog);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.length) {
      setSelectedId(null);
      setFormState(blankBlog);
      return;
    }

    const selected = data.find((item) => item.id === selectedId) ?? data[0];
    setSelectedId(selected.id);
    setFormState({
      title: selected.title,
      slug: selected.slug,
      category: selected.category,
      excerpt: selected.excerpt,
      content: selected.content,
      status: selected.status,
      is_featured: selected.is_featured,
    });
  }, [data, selectedId]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      let saved: AdminBlog;
      if (selectedId) {
        saved = await apiPut<AdminBlog, Record<string, unknown>>(
          `/blogs/admin/${selectedId}`,
          formState,
        );
      } else {
        saved = await apiPost<AdminBlog, Record<string, unknown>>("/blogs/admin", formState);
      }
      setSelectedId(saved.id);
      setMessage("Blog saved.");
      reload();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save blog.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Blogs"
      description="Create and edit blog/news cards used on the public site. This includes category, excerpt, publish status, and main content."
      action={
        <div className="flex gap-3">
          <button
            className="rounded-full border border-trust-200 px-5 py-3 text-sm font-semibold text-trust-700"
            type="button"
            onClick={() => {
              setSelectedId(null);
              setFormState(blankBlog);
              setMessage("");
            }}
          >
            New post
          </button>
          <button
            className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
            type="button"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save post"}
          </button>
        </div>
      }
      sidebar={
        <div className="space-y-3">
          <AsyncState error={error} loading={loading} loadingLabel="Loading blogs..." />
          {!loading
            ? data.map((item) => (
                <AdminListCard
                  key={item.id}
                  active={item.id === selectedId}
                  title={item.title}
                  subtitle={`${item.category} - ${item.status}`}
                  onClick={() => setSelectedId(item.id)}
                />
              ))
            : null}
        </div>
      }
    >
      {message ? (
        <div className="mb-5 rounded-2xl bg-trust-50 px-4 py-3 text-sm text-trust-700">{message}</div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminTextField
          label="Title"
          value={formState.title}
          onChange={(value) => setFormState((current) => ({ ...current, title: value }))}
        />
        <AdminTextField
          label="Slug"
          value={formState.slug}
          onChange={(value) => setFormState((current) => ({ ...current, slug: value }))}
        />
        <AdminTextField
          label="Category"
          value={formState.category}
          onChange={(value) => setFormState((current) => ({ ...current, category: value }))}
        />
        <AdminSelectField
          label="Status"
          value={formState.status}
          options={["draft", "published", "archived"]}
          onChange={(value) => setFormState((current) => ({ ...current, status: value }))}
        />
      </div>
      <div className="mt-5">
        <AdminTextareaField
          label="Excerpt"
          value={formState.excerpt}
          onChange={(value) => setFormState((current) => ({ ...current, excerpt: value }))}
        />
      </div>
      <div className="mt-5">
        <AdminTextareaField
          label="Content"
          value={formState.content}
          onChange={(value) => setFormState((current) => ({ ...current, content: value }))}
        />
      </div>
      <div className="mt-5">
        <AdminToggleField
          label="Feature this post on the site"
          checked={formState.is_featured}
          onChange={(checked) => setFormState((current) => ({ ...current, is_featured: checked }))}
        />
      </div>
    </AdminModuleLayout>
  );
}
