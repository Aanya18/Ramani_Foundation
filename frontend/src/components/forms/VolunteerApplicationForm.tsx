import { useState } from "react";
import { apiPost } from "../../lib/api";
import type { MessageResponse } from "../../types/api";

export function VolunteerApplicationForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    interest_area: "",
    motivation: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await apiPost<MessageResponse, Record<string, unknown>>(
        "/volunteers",
        formData,
      );

      setStatus("success");
      setFeedback(response.message);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        city: "",
        interest_area: "",
        motivation: "",
      });
    } catch (submitError) {
      setStatus("error");
      setFeedback(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your volunteer application.",
      );
    }
  }

  return (
    <form className="panel space-y-4 p-7" onSubmit={handleSubmit}>
      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            status === "success"
              ? "bg-leaf-100 text-leaf-700"
              : "bg-clay-100 text-clay-700"
          }`}
        >
          {feedback}
        </div>
      ) : null}
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="full_name">
          Full name
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, full_name: event.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="volunteer_email">
            Email
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
            id="volunteer_email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="phone">
            Phone
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
            id="phone"
            type="text"
            value={formData.phone}
            onChange={(event) =>
              setFormData((current) => ({ ...current, phone: event.target.value }))
            }
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="city">
            City
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
            id="city"
            type="text"
            value={formData.city}
            onChange={(event) =>
              setFormData((current) => ({ ...current, city: event.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="interest_area">
            Interest area
          </label>
          <input
            className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
            id="interest_area"
            type="text"
            value={formData.interest_area}
            onChange={(event) =>
              setFormData((current) => ({ ...current, interest_area: event.target.value }))
            }
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="motivation">
          Why do you want to volunteer?
        </label>
        <textarea
          className="mt-2 min-h-32 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="motivation"
          value={formData.motivation}
          onChange={(event) =>
            setFormData((current) => ({ ...current, motivation: event.target.value }))
          }
          required
        />
      </div>
      <button
        className="w-full rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-trust-900 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Apply to Volunteer"}
      </button>
    </form>
  );
}
