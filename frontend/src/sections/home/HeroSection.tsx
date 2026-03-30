import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { AsyncState } from "../../components/ui/AsyncState";
import { brandMeta } from "../../data/siteContent";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";

export function HeroSection() {
  const { data, loading, error } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <section className="section-space pt-10">
      <Container>
        <div className="page-hero px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <AsyncState
            className="mb-6 border-white/20 bg-white/10 text-white"
            error={error}
            loading={loading}
            loadingLabel="Loading homepage content..."
          />
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="eyebrow border-white/20 bg-white/10 text-white">
                {brandMeta.name}
              </span>
              <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {data?.hero_title ?? "Support that stays close to people, not far from reality."}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                {data?.hero_subtitle ??
                  `${brandMeta.name} is being positioned as a trust-first NGO working across education, women empowerment, skill development, and community support with a premium but deeply human digital presence.`}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button to="/donate" variant="donate">
                  Donate Now
                </Button>
                <Button className="bg-white/10 text-white hover:bg-white/20" to="/about" variant="ghost">
                  Learn About Us
                </Button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  "Human-centered storytelling",
                  "Clear donate and contact pathways",
                  "Programs shown with context",
                ].map((item) => (
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/10 p-6 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-ambergold-300">
                  Foundation focus
                </p>
                <h2 className="mt-4 font-display text-3xl">Education, dignity, and community growth</h2>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  Ramani Foundation is presented around practical support areas so visitors can quickly understand what the organization does and why the work matters.
                </p>
                <div className="mt-6 rounded-full bg-white/10 px-4 py-3 text-sm text-white/75">
                  Instagram handle: {brandMeta.instagramHandle}
                </div>
              </div>
              <div className="rounded-[28px] bg-gradient-to-br from-white/20 to-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Donation confidence</p>
                <p className="mt-8 font-display text-5xl text-white">80G</p>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  Trust markers, impact visibility, and simple contribution flows should remain visible across the site.
                </p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-6 sm:col-span-2">
                <p className="text-sm leading-7 text-white/75">
                  The homepage balances warmth, clarity, and seriousness so donors, volunteers, and community partners can understand the foundation without friction.
                </p>
                <p className="mt-4 text-sm font-semibold text-white">Trust should be visible in the first screen, not discovered later.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
