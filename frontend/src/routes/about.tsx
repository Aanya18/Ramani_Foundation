import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Heart, Target, Eye } from "lucide-react";
import shakti from "@/assets/shakti-women.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Ramani Foundation" },
      {
        name: "description",
        content:
          "Learn about Ramani Foundation's vision, mission and the people working to transform underprivileged communities through education and empowerment.",
      },
      { property: "og:title", content: "About Ramani Foundation" },
      {
        property: "og:description",
        content: "Our vision, mission and the work behind Ramani Foundation.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
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

    </>
  );
}
