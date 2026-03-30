import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";

export function DonationBanner() {
  return (
    <section className="section-space pt-0">
      <Container>
        <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-ambergold-500 via-ambergold-300 to-clay-300 px-8 py-10 text-ink shadow-float sm:px-10 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink/60">
              Support Ramani Foundation
            </p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              Support work that stays useful long after a single campaign moment passes.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink/75">
              The public experience keeps giving visible across the site, but this final banner is
              written for people who need one more moment of confidence before they contribute.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Button to="/donate" variant="primary">
              Donate Today
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
