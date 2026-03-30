import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function PartnersSection() {
  return (
    <section className="section-space">
      <Container>
        <div className="panel grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="CSR and institutions"
              title="Built for serious partnerships and cleaner reporting."
              description="This part of the Ramani Foundation experience is written for CSR teams, schools, local institutions, and implementation partners who need clarity, responsiveness, and visible outcomes."
            />
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl bg-trust-50 p-5 text-sm text-trust-700">
              CSR-ready partnership model with program-linked metrics
            </div>
            <div className="rounded-3xl bg-trust-50 p-5 text-sm text-trust-700">
              Downloadable pitch deck and compliance packet
            </div>
            <div className="rounded-3xl bg-trust-50 p-5 text-sm text-trust-700">
              Custom reporting and campaign-level visibility
            </div>
            <Button to="/partner" variant="primary">
              Partner With Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
