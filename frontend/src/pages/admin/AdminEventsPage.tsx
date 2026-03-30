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
import type { AdminEvent } from "../../types/api";

type EventFormState = Omit<AdminEvent, "id" | "updated_at">;

const blankEvent: EventFormState = {
  title: "",
  slug: "",
  excerpt: "",
  event_type: "Drive",
  city: "",
  venue: "",
  start_at: "",
  status: "upcoming",
  is_featured: false,
};

export function AdminEventsPage() {
  const { data, loading, error, reload } = useApiData<AdminEvent[]>("/events/admin", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EventFormState>(blankEvent);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data.length) {
      setSelectedId(null);
      setFormState(blankEvent);
      return;
    }

    const selected = data.find((item) => item.id === selectedId) ?? data[0];
    setSelectedId(selected.id);
    setFormState({
      title: selected.title,
      slug: selected.slug,
      excerpt: selected.excerpt,
      event_type: selected.event_type,
      city: selected.city ?? "",
      venue: selected.venue ?? "",
      start_at: selected.start_at ? selected.start_at.slice(0, 16) : "",
      status: selected.status,
      is_featured: selected.is_featured,
    });
  }, [data, selectedId]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      let saved: AdminEvent;
      if (selectedId) {
        saved = await apiPut<AdminEvent, Record<string, unknown>>(
          `/events/admin/${selectedId}`,
          formState,
        );
      } else {
        saved = await apiPost<AdminEvent, Record<string, unknown>>("/events/admin", formState);
      }
      setSelectedId(saved.id);
      setMessage("Event saved.");
      reload();
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save event.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminModuleLayout
      title="Events"
      description="Manage event, drive, and campaign teaser content that appears on the public site."
      action={
        <div className="flex gap-3">
          <button
            className="rounded-full border border-trust-200 px-5 py-3 text-sm font-semibold text-trust-700"
            type="button"
            onClick={() => {
              setSelectedId(null);
              setFormState(blankEvent);
              setMessage("");
            }}
          >
            New event
          </button>
          <button
            className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
            type="button"
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save event"}
          </button>
        </div>
      }
      sidebar={
        <div className="space-y-3">
          <AsyncState error={error} loading={loading} loadingLabel="Loading events..." />
          {!loading
            ? data.map((item) => (
                <AdminListCard
                  key={item.id}
                  active={item.id === selectedId}
                  title={item.title}
                  subtitle={`${item.city ?? "India"} - ${item.status}`}
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
          label="Event type"
          value={formState.event_type}
          onChange={(value) => setFormState((current) => ({ ...current, event_type: value }))}
        />
        <AdminSelectField
          label="Status"
          value={formState.status}
          options={["draft", "upcoming", "ongoing", "completed", "cancelled"]}
          onChange={(value) => setFormState((current) => ({ ...current, status: value }))}
        />
        <AdminTextField
          label="City"
          value={formState.city ?? ""}
          onChange={(value) => setFormState((current) => ({ ...current, city: value }))}
        />
        <AdminTextField
          label="Venue"
          value={formState.venue ?? ""}
          onChange={(value) => setFormState((current) => ({ ...current, venue: value }))}
        />
        <AdminTextField
          label="Start date and time"
          type="datetime-local"
          value={formState.start_at ?? ""}
          onChange={(value) => setFormState((current) => ({ ...current, start_at: value }))}
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
          label="Feature this event"
          checked={formState.is_featured}
          onChange={(checked) => setFormState((current) => ({ ...current, is_featured: checked }))}
        />
      </div>
    </AdminModuleLayout>
  );
}
