import { useEffect, useState } from "react";
import { AdminModuleLayout } from "../../components/admin/AdminModuleLayout";
import {
  AdminTextField,
  AdminTextareaField,
} from "../../components/admin/AdminFormControls";
import { AsyncState } from "../../components/ui/AsyncState";
import { useApiData } from "../../hooks/useApiData";
import { apiPut } from "../../lib/api";
import type { PublicMetric, PublicSettings } from "../../types/api";

function impactStatsToText(stats: PublicMetric[]) {
  return stats.map((item) => `${item.label}|${item.value}|${item.note ?? ""}`).join("\n");
}

function parseList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseImpactStats(value: string): PublicMetric[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", statValue = "", note = ""] = line.split("|");
      return {
        label: label.trim(),
        value: statValue.trim(),
        note: note.trim(),
      };
    });
}

export function AdminContentPage() {
  const { data, loading, error, reload } = useApiData<PublicSettings | null>(
    "/settings/admin/public-content",
    null,
  );
  const [formState, setFormState] = useState({
    organization_name: "",
    donation_currency: "INR",
    primary_phone: "",
    primary_email: "",
    hero_title: "",
    hero_subtitle: "",
    mission_title: "",
    mission_description: "",
    trust_items: "",
    donation_presets: "",
    trust_notes: "",
    impact_stats: "",
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!data) {
      return;
    }

    setFormState({
      organization_name: data.organization_name,
      donation_currency: data.donation_currency,
      primary_phone: data.primary_phone,
      primary_email: data.primary_email,
      hero_title: data.hero_title,
      hero_subtitle: data.hero_subtitle,
      mission_title: data.mission_title,
      mission_description: data.mission_description,
      trust_items: data.trust_items.join("\n"),
      donation_presets: data.donation_presets.join("\n"),
      trust_notes: data.trust_notes.join("\n"),
      impact_stats: impactStatsToText(data.impact_stats),
    });
  }, [data]);

  async function handleSave() {
    setSaveState("saving");
    setMessage("");

    try {
      await apiPut<PublicSettings, Record<string, unknown>>(
        "/settings/admin/public-content",
        {
          organization_name: formState.organization_name,
          donation_currency: formState.donation_currency,
          primary_phone: formState.primary_phone,
          primary_email: formState.primary_email,
          hero_title: formState.hero_title,
          hero_subtitle: formState.hero_subtitle,
          mission_title: formState.mission_title,
          mission_description: formState.mission_description,
          trust_items: parseList(formState.trust_items),
          donation_presets: parseList(formState.donation_presets).map((value) => Number(value)),
          trust_notes: parseList(formState.trust_notes),
          impact_stats: parseImpactStats(formState.impact_stats),
        },
      );
      setSaveState("saved");
      setMessage("Public content settings saved.");
      reload();
    } catch (saveError) {
      setSaveState("error");
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save content.");
    }
  }

  return (
    <AdminModuleLayout
      title="Content"
      description="Edit homepage trust signals, hero content, mission copy, donation presets, and impact statistics used on the public site."
      action={
        <button
          className="rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={handleSave}
        >
          {saveState === "saving" ? "Saving..." : "Save content"}
        </button>
      }
      sidebar={
        <div className="space-y-4 text-sm text-ink/70">
          <p>Changes here affect the public homepage and donation experience.</p>
          <p>For lists, enter one item per line.</p>
          <p>For impact stats, use `label|value|note` on each line.</p>
          {message ? (
            <div
              className={`rounded-2xl px-4 py-3 ${
                saveState === "saved"
                  ? "bg-leaf-100 text-leaf-700"
                  : "bg-clay-100 text-clay-700"
              }`}
            >
              {message}
            </div>
          ) : null}
        </div>
      }
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading content settings..." />
      {!loading && !error ? (
        <div className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextField
              label="Organization name"
              value={formState.organization_name}
              onChange={(value) => setFormState((current) => ({ ...current, organization_name: value }))}
            />
            <AdminTextField
              label="Donation currency"
              value={formState.donation_currency}
              onChange={(value) => setFormState((current) => ({ ...current, donation_currency: value }))}
            />
            <AdminTextField
              label="Primary phone"
              value={formState.primary_phone}
              onChange={(value) => setFormState((current) => ({ ...current, primary_phone: value }))}
            />
            <AdminTextField
              label="Primary email"
              value={formState.primary_email}
              onChange={(value) => setFormState((current) => ({ ...current, primary_email: value }))}
            />
          </div>
          <AdminTextareaField
            label="Hero title"
            value={formState.hero_title}
            onChange={(value) => setFormState((current) => ({ ...current, hero_title: value }))}
          />
          <AdminTextareaField
            label="Hero subtitle"
            value={formState.hero_subtitle}
            onChange={(value) => setFormState((current) => ({ ...current, hero_subtitle: value }))}
          />
          <AdminTextareaField
            label="Mission title"
            value={formState.mission_title}
            onChange={(value) => setFormState((current) => ({ ...current, mission_title: value }))}
          />
          <AdminTextareaField
            label="Mission description"
            value={formState.mission_description}
            onChange={(value) => setFormState((current) => ({ ...current, mission_description: value }))}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <AdminTextareaField
              label="Trust items"
              value={formState.trust_items}
              onChange={(value) => setFormState((current) => ({ ...current, trust_items: value }))}
            />
            <AdminTextareaField
              label="Donation presets"
              value={formState.donation_presets}
              onChange={(value) => setFormState((current) => ({ ...current, donation_presets: value }))}
            />
            <AdminTextareaField
              label="Trust notes"
              value={formState.trust_notes}
              onChange={(value) => setFormState((current) => ({ ...current, trust_notes: value }))}
            />
            <AdminTextareaField
              label="Impact stats"
              value={formState.impact_stats}
              onChange={(value) => setFormState((current) => ({ ...current, impact_stats: value }))}
            />
          </div>
        </div>
      ) : null}
    </AdminModuleLayout>
  );
}
