import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  Sparkles,
  Users,
  Stethoscope,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import hero from "@/assets/hero-children.jpg";
import shakti from "@/assets/shakti-women.jpg";
import udaan from "@/assets/udaan-celebration.jpg";
import g1 from "@/assets/gallery/g1.jpg";
import g4 from "@/assets/gallery/g4.jpg";
import g6 from "@/assets/gallery/g6.jpg";
import g8 from "@/assets/gallery/g8.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ramani Foundation — Education, Empowerment, Community" },
      {
        name: "description",
        content:
          "We uplift underprivileged communities through education, women empowerment, healthcare and child development. Join us in transforming lives.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "4", label: "Flagship Projects" },
  { value: "20+", label: "Villages Reached" },
  { value: "500+", label: "Lives Impacted" },
];

const verticals = [
  {
    icon: BookOpen,
    title: "Education",
    text: "Uplifting communities through quality education and mentorship.",
    color: "var(--brand-blue)",
  },
  {
    icon: Stethoscope,
    title: "Hygiene & Nutrition",
    text: "Improving access to essential nutrition, hygiene and healthcare.",
    color: "var(--brand-teal)",
  },
  {
    icon: Users,
    title: "Child Participation",
    text: "Creating platforms where children's voices are heard and valued.",
    color: "var(--brand-orange)",
  },
  {
    icon: Sparkles,
    title: "Skill & Personality",
    text: "Building confidence and life skills through creative learning.",
    color: "var(--brand-magenta)",
  },
];

const projects = [
  {
    name: "Project PAHAL",
    tag: "Education",
    desc: "Comprehensive educational support to children in underprivileged areas through SPOCs, study materials and weekly mentoring.",
    img: g1,
  },
  {
    name: "Project UDAAN",
    tag: "Collaboration",
    desc: "Partnering with NGOs, orphanages and old age homes for joint health camps, drives and resource sharing.",
    img: udaan,
  },
  {
    name: "Project SHAKTI",
    tag: "Women Empowerment",
    desc: "Skill workshops, micro-finance, legal literacy and wellness camps to empower women toward self-reliance.",
    img: shakti,
  },
  {
    name: "Project PRAYAAS",
    tag: "Infrastructure",
    desc: "Mobile medical camps, clean water access, lighting solutions and hygiene drives in bastis and villages.",
    img: g4,
  },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 bg-gradient-hero-overlay"
            style={{
              background:
                "linear-gradient(100deg, oklch(0.18 0.04 250 / 0.85) 0%, oklch(0.30 0.10 280 / 0.70) 50%, oklch(0.35 0.14 30 / 0.55) 100%)",
            }}
          />
        </div>
        <div className="relative container-page py-24 md:py-36 text-white">
          <div className="max-w-3xl anim-rise">
            <h1 className="text-4xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Transforming lives through{" "}
              <span className="bg-gradient-to-r from-[oklch(0.92_0.10_60)] via-[oklch(0.85_0.14_350)] to-[oklch(0.85_0.14_200)] bg-clip-text text-transparent">
                education & empowerment
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
              Ramani Foundation works at the grassroots — uplifting underprivileged communities
              through education, healthcare, women empowerment and child development.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-[var(--brand-blue)] hover:bg-white/90 font-semibold"
              >
                <Link to="/donate">
                  Donate Now <HandHeart className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-white/5 backdrop-blur text-white border-white/30 hover:bg-white/15 hover:text-white"
              >
                <Link to="/projects">
                  Explore Projects <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* stats strip */}
        <div className="relative container-page pb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 bg-white/95 backdrop-blur rounded-2xl p-4 md:p-6 shadow-elevated">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-2">
                <div className="text-2xl md:text-4xl font-bold text-gradient-brand">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION/MISSION */}
      <section className="section-y">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Our Vision & Mission"
              title="Empowering communities. Building futures."
              description="We believe every child deserves an education, every woman deserves opportunity, and every village deserves dignity. Our work is grounded in long-term, holistic change."
            />
            <ul className="mt-8 space-y-4">
              {[
                {
                  icon: BookOpen,
                  t: "Education for every child",
                  d: "Books, mentoring and consistent support so learning never stops.",
                },
                {
                  icon: Users,
                  t: "Women-led empowerment",
                  d: "Skills, micro-finance and awareness for true self-reliance.",
                },
                {
                  icon: Droplets,
                  t: "Healthcare & basic facilities",
                  d: "Medical camps, clean water and hygiene where it matters most.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4">
                  <div className="shrink-0 size-11 rounded-xl bg-gradient-brand grid place-items-center text-white shadow-soft">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-brand opacity-15 blur-3xl rounded-[3rem]" />
            <div className="relative grid grid-cols-2 gap-3">
              <img
                src={g6}
                alt="Children at workshop"
                className="rounded-2xl aspect-[4/5] object-cover shadow-elevated"
              />
              <img
                src={g8}
                alt="Community engagement"
                className="rounded-2xl aspect-[4/5] object-cover shadow-elevated mt-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WORKING VERTICALS */}
      <section className="section-y bg-gradient-soft">
        <div className="container-page">
          <SectionHeader
            eyebrow="What we focus on"
            title="Our working verticals"
            description="A holistic approach to community transformation — built around four pillars."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {verticals.map((v) => (
              <div
                key={v.title}
                className="group relative bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div
                  className="size-12 rounded-xl grid place-items-center text-white shadow-soft"
                  style={{
                    background: `linear-gradient(135deg, ${v.color}, color-mix(in oklab, ${v.color} 70%, white))`,
                  }}
                >
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeader
              align="left"
              eyebrow="Our Projects"
              title="Where impact happens"
              description="Four flagship initiatives reaching children, women and underserved villages."
            />
            <Button asChild variant="ghost" className="self-start rounded-full">
              <Link to="/projects">
                All projects <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft hover:shadow-elevated transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold tracking-wider uppercase text-[var(--brand-orange)]">
                    {p.tag}
                  </div>
                  <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section-y">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 text-white text-center shadow-elevated">
            <div className="absolute -top-20 -right-10 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 size-80 rounded-full bg-white/10 blur-3xl" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Be the reason a child dreams bigger.
              </h2>
              <p className="mt-4 text-white/90 text-lg">
                Every contribution funds books, meals, medical camps, and confidence-building
                workshops.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-[var(--brand-blue)] hover:bg-white/90 font-semibold"
                >
                  <Link to="/donate">Donate Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/contact">Become a Volunteer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
