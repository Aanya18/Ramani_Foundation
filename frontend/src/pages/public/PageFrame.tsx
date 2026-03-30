import type { ReactNode } from "react";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  children,
  ctaLabel = "Donate Now",
  ctaTo = "/donate",
}: PageFrameProps) {
  return (
    <div className="section-space">
      <Container>
        <section className="page-hero px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
          <span className="eyebrow border-white/20 bg-white/10 text-white">{eyebrow}</span>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-[3.8rem]">{title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{description}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/80">
                {["Clear structure", "Easy to scan", "Actionable next steps"].map((item) => (
                  <span
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="panel border-white/15 bg-white/10 p-6 text-white shadow-none">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ambergold-300">
                Next step
              </p>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/75">
                Keep the page readable and goal-oriented. Every page should either inform clearly,
                deepen trust, or move the visitor toward donation, contact, or participation.
              </p>
              <div className="mt-6">
                <Button to={ctaTo} variant="donate">
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </div>
        </section>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </div>
  );
}
