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
import type { AdminStory } from "../../types/api";

type StoryFormState = Omit<AdminStory, "id" | "updated_at">;

const blankStory: StoryFormState = {
  story_title: "",
  slug: "",
  person_name: "",
  role_label: "",
  quote: "",
  summary: "",
  status: "published",
  is_featured: false,
};

export function AdminStoriesPage() {
  const { data, loading, error, reload } = useApiData<AdminStory[]>("/stories/admin", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<StoryFormState>(blankStory);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.length) {
      setSelectedId(null);
      setFormState(blankStory);
      return;
    }

    const selected = data.find((item) => item.id === selectedId) ?? data[0];
    setSelectedId(selected.id);
    setFormState({
      story_title: selected.story_title,
      slug: selected.slug,
      person_name: selected.person_name,
      role_label: selected.role_label,
      quote: selected.quote,
      summary: selected.summary,
      status: selected.status,
      is_featured: selected.is_featured,
    });
  }, [data, selectedId]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      let saved: AdminStory;
      if (selectedId) {
        saved = await apiPut<AdminStory, Record<string, unknown>>(
          `/stories/admin/${selectedId}`,
          formState,
        );
      } else {
        saved = await apiPost<AdminStory, Record<string, unknown>>("/stories/admin", formState);
      }
      setSelectedId(saved.id);
      setMessage("Story saved.");
      reload();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save story.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Stories"
      description="Edit beneficiary and volunteer stories shown on the public site."
      action={
        <div className="flex gap-3">
          <button
            className="rounded-full border border-trust-200 px-5 py-3 text-sm font-semibold text-trust-700"
            type="button"
            onClick={() => {
              setSelectedId(null);
              setFormState(blankStory);
              setMessage("");
            }}
          >
            New story
          </button>
          <button
            className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
            type="button"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save story"}
          </button>
        </div>
      }
      sidebar={
        <div className="space-y-3">
          <AsyncState error={error} loading={loading} loadingLabel="Loading stories..." />
          {!loading
            ? data.map((item) => (
                <AdminListCard
                  key={item.id}
                  active={item.id === selectedId}
                  title={item.person_name}
                  subtitle={`${item.role_label} - ${item.status}`}
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
          label="Story title"
          value={formState.story_title}
          onChange={(value) => setFormState((current) => ({ ...current, story_title: value }))}
        />
        <AdminTextField
          label="Slug"
          value={formState.slug}
          onChange={(value) => setFormState((current) => ({ ...current, slug: value }))}
        />
        <AdminTextField
          label="Person name"
          value={formState.person_name}
          onChange={(value) => setFormState((current) => ({ ...current, person_name: value }))}
        />
        <AdminTextField
          label="Role / label"
          value={formState.role_label}
          onChange={(value) => setFormState((current) => ({ ...current, role_label: value }))}
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
          label="Quote"
          value={formState.quote}
          onChange={(value) => setFormState((current) => ({ ...current, quote: value }))}
        />
      </div>
      <div className="mt-5">
        <AdminTextareaField
          label="Summary"
          value={formState.summary}
          onChange={(value) => setFormState((current) => ({ ...current, summary: value }))}
        />
      </div>
      <div className="mt-5">
        <AdminToggleField
          label="Feature this story"
          checked={formState.is_featured}
          onChange={(checked) => setFormState((current) => ({ ...current, is_featured: checked }))}
        />
      </div>
    </AdminModuleLayout>
  );
}
