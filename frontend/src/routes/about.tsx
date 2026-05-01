import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Heart, Target, Eye, Users } from "lucide-react";
import { api } from "@/lib/api";
import shakti from "@/assets/shakti-women.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ramani Foundation" },
      {
        name: "description",
        content:
          "Learn about Ramani Foundation's vision, mission and the people working to transform underprivileged communities through education and empowerment.",
      },
      { property: "og:title", content: "About Ramani Foundation" },
      {
        property: "og:description",
        content: "Our vision, mission and the team behind Ramani Foundation.",
      },
    ],
  }),
  loader: async () => {
    const team = await api.getTeamMembers();
    return { team };
  },
  component: AboutPage,
});

function AboutPage() {
  const { team } = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="People-first. Purpose-driven."
        description="Ramani Foundation is a grassroots organisation working to uplift underprivileged communities through education, women empowerment and basic infrastructure."
      />

      <section className="section-y">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-[3rem]" />
            <img
              src={shakti}
              alt="Women with foundation members"
              className="relative rounded-3xl shadow-elevated w-full aspect-square object-cover"
            />
          </div>
          <div className="space-y-8">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                text: "Transforming lives through education, empowerment, and sustainable community development.",
              },
              {
                icon: Target,
                title: "Our Mission",
                text: "To uplift underprivileged communities through education, healthcare and empowerment; to foster women empowerment through innovative schemes; and to ensure access to medical care, clean water and transportation in underserved areas.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Empathy, dignity, transparency, and long-term commitment to the communities we serve.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-5">
                <div className="size-12 shrink-0 rounded-xl bg-gradient-brand text-white grid place-items-center shadow-soft">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-gradient-soft">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold tracking-wider uppercase text-[var(--brand-blue)]">
              <Users className="size-3.5" /> Our Volunteers
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              The hands behind the change
            </h2>
            <p className="mt-4 text-muted-foreground">
              A growing team of volunteers contributing time, skill and heart.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="group bg-card rounded-2xl p-6 text-center border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div
                  className="mx-auto size-20 rounded-full grid place-items-center text-white text-2xl font-bold shadow-soft"
                  style={{
                    background: `linear-gradient(135deg, var(--brand-${["teal", "blue", "orange", "magenta"][i % 4]}), color-mix(in oklab, var(--brand-${["blue", "magenta", "teal", "orange"][i % 4]}) 80%, white))`,
                  }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="mt-4 font-semibold">{member.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
