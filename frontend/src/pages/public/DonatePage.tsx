import { useState } from "react";
import { PageFrame } from "./PageFrame";
import { useApiData } from "../../hooks/useApiData";
import { apiPost } from "../../lib/api";
import { AsyncState } from "../../components/ui/AsyncState";
import type { DonationInitiateResponse, PublicSettings } from "../../types/api";

export function DonatePage() {
  const { data, loading, error } = useApiData<PublicSettings | null>("/settings/public", null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    donor_note: "",
    frequency: "one_time",
    anonymous: false,
    customAmount: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const amountValue =
    selectedAmount ?? (formData.customAmount ? Number(formData.customAmount) : 0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await apiPost<DonationInitiateResponse, Record<string, unknown>>(
        "/donations/initiate",
        {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          donor_note: formData.donor_note,
          frequency: formData.frequency,
          anonymous: formData.anonymous,
          amount_paise: Math.round(amountValue * 100),
        },
      );

      setStatus("success");
      setFeedback(`Donation initiated. Reference: ${response.reference}`);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        donor_note: "",
        frequency: "one_time",
        anonymous: false,
        customAmount: "",
      });
      setSelectedAmount(null);
    } catch (submitError) {
      setStatus("error");
      setFeedback(
        submitError instanceof Error ? submitError.message : "Unable to initiate donation.",
      );
    }
  }

  return (
    <PageFrame
      ctaLabel="Contact for CSR Giving"
      ctaTo="/partner"
      description="The donation page now submits to the FastAPI backend. It loads presets and trust notes from public settings and creates a donation initiation record."
      eyebrow="Donate"
      title="Keep the donation experience visible, safe, and friction-light."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form className="panel p-8" onSubmit={handleSubmit}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-trust-700">
            Donation widget
          </p>
          <h2 className="mt-4 font-display text-3xl text-ink">Choose your level of support</h2>
          <div className="mt-6">
            <AsyncState error={error} loading={loading} loadingLabel="Loading donation settings..." />
            {!loading && !error && data ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.donation_presets.map((preset) => (
                  <button
                    className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                      selectedAmount === preset
                        ? "border-ambergold-500 bg-ambergold-100/60"
                        : "border-trust-100 text-ink hover:border-ambergold-500 hover:bg-ambergold-100/60"
                    }`}
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset);
                      setFormData((current) => ({ ...current, customAmount: "" }));
                    }}
                  >
                    Rs. {preset.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
              placeholder="Full name"
              type="text"
              value={formData.full_name}
              onChange={(event) =>
                setFormData((current) => ({ ...current, full_name: event.target.value }))
              }
              required
            />
            <input
              className="rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            <input
              className="rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
              placeholder="Phone"
              type="text"
              value={formData.phone}
              onChange={(event) =>
                setFormData((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <input
              className="rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
              placeholder="Custom amount in INR"
              type="number"
              min="1"
              value={formData.customAmount}
              onChange={(event) => {
                setSelectedAmount(null);
                setFormData((current) => ({ ...current, customAmount: event.target.value }));
              }}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <select
              className="rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
              value={formData.frequency}
              onChange={(event) =>
                setFormData((current) => ({ ...current, frequency: event.target.value }))
              }
            >
              <option value="one_time">One-time donation</option>
              <option value="monthly">Monthly donation</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm text-ink">
              <input
                checked={formData.anonymous}
                type="checkbox"
                onChange={(event) =>
                  setFormData((current) => ({ ...current, anonymous: event.target.checked }))
                }
              />
              Make this donation anonymous
            </label>
          </div>

          <textarea
            className="mt-4 min-h-28 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
            placeholder="Donor note"
            value={formData.donor_note}
            onChange={(event) =>
              setFormData((current) => ({ ...current, donor_note: event.target.value }))
            }
          />

          {feedback ? (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                status === "success"
                  ? "bg-leaf-100 text-leaf-700"
                  : "bg-clay-100 text-clay-700"
              }`}
            >
              {feedback}
            </div>
          ) : null}

          <button
            className="mt-6 w-full rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-trust-900 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={status === "submitting" || amountValue <= 0}
          >
            {status === "submitting" ? "Submitting..." : "Initiate Donation"}
          </button>
        </form>

        <div className="panel p-8">
          <h2 className="font-display text-3xl text-ink">Trust notes</h2>
          <AsyncState error={error} loading={loading} loadingLabel="Loading trust notes..." />
          {!loading && !error && data ? (
            <ul className="mt-6 space-y-4 text-sm leading-7 text-ink/70">
              {data.trust_notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </PageFrame>
  );
}
