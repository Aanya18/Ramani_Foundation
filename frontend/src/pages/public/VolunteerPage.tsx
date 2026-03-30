import { VolunteerApplicationForm } from "../../components/forms/VolunteerApplicationForm";
import { PageFrame } from "./PageFrame";

export function VolunteerPage() {
  return (
    <PageFrame
      ctaLabel="See Upcoming Events"
      ctaTo="/events"
      description="Volunteering with Ramani Foundation should feel meaningful, well-organized, and aligned with real program or outreach needs."
      eyebrow="Volunteer"
      title="Make joining easy, while keeping the foundation's tone grounded and accountable."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-7 text-sm leading-7 text-ink/70">
          <p>Mentorship, scholarship follow-up, and student support</p>
          <p>Campaign operations, community events, and field coordination</p>
          <p>Design, communication, outreach, and donor engagement support</p>
          <p className="mt-4">Use this form to register your interest and the team can follow up directly.</p>
        </div>
        <VolunteerApplicationForm />
      </div>
    </PageFrame>
  );
}
