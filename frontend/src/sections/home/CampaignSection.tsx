import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";

export function CampaignSection() {
  return (
    <section className="section-space">
      <Container>
        <div className="panel overflow-hidden p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Featured campaign"
                title="A focused campaign should help donors act without losing context."
                description="This section is positioned as a direct giving moment for Ramani Foundation, with enough narrative and progress visibility to feel credible instead of generic."
              />
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink/65">
                <span className="rounded-full bg-ambergold-100 px-4 py-2 font-semibold text-ambergold-700">
                  Education continuity
                </span>
                <span className="rounded-full bg-trust-50 px-4 py-2 font-semibold text-trust-700">
                  312 donors so far
                </span>
              </div>
              <div className="mt-8">
                <Button to="/donate" variant="donate">
                  Fund This Campaign
                </Button>
              </div>
            </div>
            <div className="rounded-[30px] bg-trust-700 p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ambergold-300">
                Progress
              </p>
              <p className="mt-5 font-display text-5xl">Rs. 12,80,000</p>
              <p className="mt-2 text-sm text-white/70">Goal: Rs. 21,00,000</p>
              <div className="mt-8 h-3 rounded-full bg-white/10">
                <div className="h-3 w-[61%] rounded-full bg-ambergold-500" />
              </div>
              <p className="mt-6 text-sm leading-7 text-white/75">
                The featured appeal is framed around school continuity, learning support, and
                local follow-up so the donor ask remains specific and understandable.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
