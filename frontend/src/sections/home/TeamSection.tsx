import { teamGroups } from "../../data/siteContent";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";

export function TeamSection() {
  return (
    <section className="section-space bg-white/65">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Our team"
            title="A credible foundation is also defined by the people and functions behind the work."
            description="This section introduces how Ramani Foundation is organized across leadership, programs, training, and community outreach so supporters can understand who carries the work forward."
          />
          <Button to="/about" variant="secondary">
            Meet the Team
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {teamGroups.map((group) => (
            <article className="panel p-7" key={group.title}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-trust-700">Team area</p>
              <h3 className="mt-4 font-display text-2xl text-ink">{group.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/70">{group.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
