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
import type { AdminProgram } from "../../types/api";

type ProgramFormState = Omit<AdminProgram, "id" | "updated_at">;

const blankProgram: ProgramFormState = {
  title: "",
  slug: "",
  excerpt: "",
  focus_area: "Education",
  beneficiary_count: 0,
  location_text: "",
  status: "published",
  is_featured: false,
};

export function AdminProgramsPage() {
  const { data, loading, error, reload } = useApiData<AdminProgram[]>("/programs/admin", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProgramFormState>(blankProgram);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.length) {
      setSelectedId(null);
      setFormState(blankProgram);
      return;
    }

    const selected = data.find((item) => item.id === selectedId) ?? data[0];
    setSelectedId(selected.id);
    setFormState({
      title: selected.title,
      slug: selected.slug,
      excerpt: selected.excerpt,
      focus_area: selected.focus_area,
      beneficiary_count: selected.beneficiary_count,
      location_text: selected.location_text ?? "",
      status: selected.status,
      is_featured: selected.is_featured,
    });
  }, [data, selectedId]);

  function startNew() {
    setSelectedId(null);
    setFormState(blankProgram);
    setMessage("");
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      let saved: AdminProgram;
      if (selectedId) {
        saved = await apiPut<AdminProgram, Record<string, unknown>>(
          `/programs/admin/${selectedId}`,
          formState,
        );
      } else {
        saved = await apiPost<AdminProgram, Record<string, unknown>>("/programs/admin", formState);
      }
      setSelectedId(saved.id);
      setMessage("Program saved.");
      reload();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save program.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Programs"
      description="Manage the NGO's public program cards and program summaries. Changes here flow into the public Programs and Home sections."
      action={
        <div className="flex gap-3">
          <button
            className="rounded-full border border-trust-200 px-5 py-3 text-sm font-semibold text-trust-700"
            type="button"
            onClick={startNew}
          >
            New program
          </button>
          <button
            className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
            type="button"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save program"}
          </button>
        </div>
      }
      sidebar={
        <div className="space-y-3">
          <AsyncState error={error} loading={loading} loadingLabel="Loading programs..." />
          {!loading
            ? data.map((item) => (
                <AdminListCard
                  key={item.id}
                  active={item.id === selectedId}
                  title={item.title}
                  subtitle={`${item.focus_area} - ${item.status}`}
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
          label="Focus area"
          value={formState.focus_area}
          onChange={(value) => setFormState((current) => ({ ...current, focus_area: value }))}
        />
        <AdminTextField
          label="Beneficiary count"
          type="number"
          value={String(formState.beneficiary_count)}
          onChange={(value) =>
            setFormState((current) => ({ ...current, beneficiary_count: Number(value) || 0 }))
          }
        />
        <AdminTextField
          label="Location text"
          value={formState.location_text ?? ""}
          onChange={(value) => setFormState((current) => ({ ...current, location_text: value }))}
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
        <AdminToggleField
          label="Feature this program on the site"
          checked={formState.is_featured}
          onChange={(checked) => setFormState((current) => ({ ...current, is_featured: checked }))}
        />
      </div>
    </AdminModuleLayout>
  );
}
