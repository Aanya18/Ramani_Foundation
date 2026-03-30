import { PageFrame } from "./PageFrame";
import { brandMeta, teamGroups } from "../../data/siteContent";

const pillars = [
  {
    title: "Mission",
    copy:
      "Ramani Foundation works to widen access to education, support women-led growth, and strengthen community development through practical, sustained interventions.",
  },
  {
    title: "Vision",
    copy:
      "We want opportunity, dignity, and local support systems to reach people consistently, not only during moments of visibility or campaign urgency.",
  },
  {
    title: "Approach",
    copy:
      "The foundation's approach is grounded in trust, field connection, and follow-through so support can translate into measurable progress over time.",
  },
];

export function AboutPage() {
  return (
    <PageFrame
      ctaLabel="Support Ramani Foundation"
      ctaTo="/donate"
      description="Ramani Foundation is being presented as a community-rooted NGO platform focused on clarity, credibility, and visible social impact across education, women empowerment, and local development."
      eyebrow="About us"
      title="A foundation identity that feels human, serious, and trustworthy from the first screen."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {pillars.map((item) => (
          <div className="panel p-7" key={item.title}>
            <h2 className="font-display text-2xl text-ink">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-ink/70">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 panel p-8 sm:p-10">
        <p className="eyebrow">Foundation story</p>
        <h2 className="mt-5 font-display text-3xl text-ink">Why this digital direction matters</h2>
        <p className="mt-5 max-w-4xl text-sm leading-8 text-ink/75">
          The public website should help visitors understand {brandMeta.name} quickly: what the
          foundation stands for, where it works, how support is used, and why donors, volunteers,
          and partners can engage with confidence. The goal is not just a beautiful homepage. It is
          a digital presence that feels sincere, organized, and accountable.
        </p>
      </div>

      <div className="mt-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Our team</p>
          <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
            The work is carried by focused teams, not a vague mission statement.
          </h2>
          <p className="mt-4 text-base leading-8 text-ink/75">
            This structure gives visitors a clearer sense of how the foundation operates across
            leadership, programs, training, and on-ground engagement.
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {teamGroups.map((group) => (
            <article className="panel p-7" key={group.title}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-trust-700">Team area</p>
              <h3 className="mt-4 font-display text-2xl text-ink">{group.title}</h3>
              <p className="mt-4 text-sm leading-7 text-ink/70">{group.description}</p>
            </article>
          ))}
        </div>
      </div>
    </PageFrame>
  );
}
