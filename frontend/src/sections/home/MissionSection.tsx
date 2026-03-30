import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { brandMeta } from "../../data/siteContent";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";

export function MissionSection() {
  const { data } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="panel overflow-hidden rounded-[32px] bg-gradient-to-br from-clay-100 via-white to-ambergold-100 p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay-700">
              Mission snapshot
            </p>
            <h3 className="mt-5 font-display text-3xl text-ink">
              {data?.mission_title ?? "Built for long-term community trust, not short-term visibility."}
            </h3>
            <p className="mt-5 text-sm leading-8 text-ink/75">
              {data?.mission_description ??
                `${brandMeta.name} brings together education support, women-led growth, skill development, and community engagement so progress can be practical, measurable, and sustained.`}
            </p>
          </div>
          <div>
            <SectionHeading
              eyebrow="About the mission"
              title="A strong first impression comes from clarity, warmth, and credible intent."
              description={`${brandMeta.name} should feel approachable for beneficiaries, serious for donors, and dependable for institutional partners. The digital experience is being shaped around that balance.`}
            />
            <div className="mt-8">
              <Button to="/about" variant="secondary">
                Learn About the Foundation
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
