import { InquiryForm } from "../../components/forms/InquiryForm";
import { PageFrame } from "./PageFrame";

export function PartnerPage() {
  return (
    <PageFrame
      ctaLabel="View Compliance"
      ctaTo="/legal/compliance"
      description="Ramani Foundation should present partnerships as structured, measurable, and grounded in real community outcomes rather than generic sponsorship language."
      eyebrow="Partner with us"
      title="Give CSR teams, schools, and institutional partners a reason to trust the conversation."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-7 text-sm leading-7 text-ink/70">
          <p>Program sponsorships aligned to education, women empowerment, and community development</p>
          <p>Campaign co-funding, volunteer engagement, and event collaboration</p>
          <p>Outcome-linked reporting and a cleaner handoff for non-technical NGO operations</p>
        </div>
        <InquiryForm
          inquiryType="partnership"
          sourcePage="partner"
          submitLabel="Request partnership call"
        />
      </div>
    </PageFrame>
  );
}
