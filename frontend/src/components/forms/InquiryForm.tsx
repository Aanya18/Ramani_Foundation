import { useState } from "react";
import { apiPost } from "../../lib/api";
import type { MessageResponse } from "../../types/api";

type InquiryFormProps = {
  inquiryType?: string;
  sourcePage?: string;
  submitLabel?: string;
};

export function InquiryForm({
  inquiryType = "general",
  sourcePage = "contact",
  submitLabel = "Submit inquiry",
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await apiPost<MessageResponse, Record<string, unknown>>("/contact", {
        ...formData,
        inquiry_type: inquiryType,
        source_page: sourcePage,
      });

      setStatus("success");
      setFeedback(response.message);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (submitError) {
      setStatus("error");
      setFeedback(
        submitError instanceof Error ? submitError.message : "Unable to submit your inquiry.",
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
        <label className="text-sm font-semibold text-ink" htmlFor="name">
          Full name
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="name"
          placeholder="Your full name"
          type="text"
          value={formData.name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, name: event.target.value }))
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="email">
          Email
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="email"
          placeholder="name@example.org"
          type="email"
          value={formData.email}
          onChange={(event) =>
            setFormData((current) => ({ ...current, email: event.target.value }))
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="subject">
          Subject
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="subject"
          placeholder="How can we help?"
          type="text"
          value={formData.subject}
          onChange={(event) =>
            setFormData((current) => ({ ...current, subject: event.target.value }))
          }
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="message">
          Message
        </label>
        <textarea
          className="mt-2 min-h-32 w-full rounded-2xl border border-trust-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-trust-300"
          id="message"
          placeholder="Tell us how you'd like to contribute or collaborate."
          value={formData.message}
          onChange={(event) =>
            setFormData((current) => ({ ...current, message: event.target.value }))
          }
          required
        />
      </div>
      <button
        className="w-full rounded-full bg-trust-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-trust-900 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
}
