import { InquiryForm } from "../../components/forms/InquiryForm";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function VolunteerSection() {
  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionHeading
              eyebrow="Get involved"
              title="Support should not be limited to donations alone."
              description="Ramani Foundation also needs volunteers, mentors, collaborators, and people who can contribute skills, time, or community networks."
            />
            <div className="mt-8 space-y-4 text-sm leading-7 text-ink/70">
              <p>Structured onboarding for volunteers and mentors</p>
              <p>Clear follow-up pathways for partnership and outreach interest</p>
              <p>Compact forms that the internal team can manage without technical help</p>
            </div>
          </div>
          <InquiryForm />
        </div>
      </Container>
    </section>
  );
}
