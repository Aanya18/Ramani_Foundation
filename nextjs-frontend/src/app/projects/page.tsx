import { CheckCircle2 } from "lucide-react";

import g1 from "@/assets/gallery/g1.jpg";
import g4 from "@/assets/gallery/g4.jpg";
import shakti from "@/assets/shakti-women.jpg";
import udaan from "@/assets/udaan-celebration.jpg";
import { PageHero } from "@/components/PageHero";

export const metadata = {
  title: "Projects - Ramani Foundation",
  description:
    "Explore Ramani Foundation's flagship projects: PAHAL (education), UDAAN (collaboration), SHAKTI (women empowerment) and PRAYAAS (infrastructure).",
};

const projects = [
  {
    name: "Project PAHAL",
    tag: "Education",
    color: "var(--brand-blue)",
    img: g1,
    objective: "To provide comprehensive educational support to children in underprivileged areas.",
    activities: [
      "Identifying and appointing local SPOCs in bastis and villages.",
      "Setting up independent educational units in targeted areas.",
      "Providing books, stationery and study materials.",
      "Organising weekly educational workshops and mentoring.",
      "Awareness campaigns for parents about education.",
      "Regular monitoring and evaluation through SPOCs.",
    ],
  },
  {
    name: "Project UDAAN",
    tag: "Collaboration",
    color: "var(--brand-teal)",
    img: udaan,
    objective:
      "To collaborate with local NGOs, orphanages, old age homes and other institutions to expand the scope of impact.",
    activities: [
      "Mapping and connecting with local NGOs and homes.",
      "Conducting need assessment surveys.",
      "Organising joint health check-ups, food distribution and cultural activities.",
      "Volunteer support for partner organisations.",
      "Creating a resource-sharing network.",
      "Documenting success stories and best practices.",
    ],
  },
  {
    name: "Project SHAKTI",
    tag: "Women Empowerment",
    color: "var(--brand-magenta)",
    img: shakti,
    objective: "To empower women by introducing new schemes and promoting self-reliance.",
    activities: [
      "Skill development workshops, tailoring, handicrafts, digital literacy.",
      "Micro-finance and small business support schemes.",
      "Health awareness and wellness camps.",
      "Legal literacy on women's rights and self-defence.",
      "Identifying and supporting women leaders in communities.",
      "Collaborating with government schemes to amplify impact.",
    ],
  },
  {
    name: "Project PRAYAAS",
    tag: "Infrastructure",
    color: "var(--brand-orange)",
    img: g4,
    objective:
      "To foster holistic development in bastis and villages by addressing key infrastructural needs.",
    activities: [
      "Mobile medical camps for basic healthcare.",
      "Improving vehicle accessibility through transportation initiatives.",
      "Ensuring water access via handpumps, tanks and pipelines.",
      "Community cleanliness and hygiene drives.",
      "Lighting solutions for energy-deprived areas.",
      "Partnering with local authorities for advocacy.",
    ],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Projects"
        title="Four pillars. One mission."
        description="Each project is a deliberate intervention designed with the community, for the community."
      />
      <section className="section-y">
        <div className="container-page space-y-20">
          {projects.map((p, i) => (
            <article
              key={p.name}
              className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative">
                <div
                  className="absolute -inset-5 rounded-[2rem] opacity-25 blur-3xl"
                  style={{ background: p.color }}
                />
                <img
                  src={p.img.src}
                  alt={p.name}
                  className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-elevated"
                />
              </div>
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-white"
                  style={{ background: p.color }}
                >
                  {p.tag}
                </div>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold">{p.name}</h2>
                <p className="mt-3 text-muted-foreground text-lg">{p.objective}</p>
                <ul className="mt-6 space-y-3">
                  {p.activities.map((a) => (
                    <li key={a} className="flex gap-3 text-sm">
                      <CheckCircle2 className="size-5 shrink-0 mt-0.5" style={{ color: p.color }} />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
