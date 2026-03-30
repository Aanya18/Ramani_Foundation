import { InquiryForm } from "../../components/forms/InquiryForm";
import { brandMeta } from "../../data/siteContent";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";
import { PageFrame } from "./PageFrame";

export function ContactPage() {
  const { data } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <PageFrame
      description="Contact Ramani Foundation through the form below, or use the official contact details added in admin settings. The Instagram handle shared with this project is also linked here."
      eyebrow="Contact"
      title="A responsive, accountable contact experience helps trust continue after the first visit."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-7 text-sm leading-7 text-ink/70">
          <p className="font-semibold text-ink">Ramani Foundation</p>
          {data?.primary_email ? <p>Email: {data.primary_email}</p> : null}
          {data?.primary_phone ? <p>Phone: {data.primary_phone}</p> : null}
          <p>
            Instagram:{" "}
            <a className="text-link" href={brandMeta.instagramUrl} target="_blank" rel="noreferrer">
              {brandMeta.instagramHandle}
            </a>
          </p>
          <p>Response window: usually within 2 working days for contact and partnership enquiries.</p>
          <p className="mt-4">
            Official email and phone can be updated anytime from the admin content settings panel.
          </p>
        </div>
        <InquiryForm inquiryType="contact" sourcePage="contact" submitLabel="Send message" />
      </div>
    </PageFrame>
  );
}
