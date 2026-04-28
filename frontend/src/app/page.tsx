import { fetchEvents, fetchGallery, fetchTeam, fetchTestimonials, fetchArticles } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import GalleryGridSection from "@/components/GalleryGridSection";
import CTASection from "@/components/CTASection";
import StatsIndicators from "@/components/StatsIndicators";
import EventScheduleSection from "@/components/EventScheduleSection";
import VolunteerSection from "@/components/VolunteerSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsSection from "@/components/NewsSection";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allEvents, allGallery, teamMembers, testimonials, articles] = await Promise.all([
    fetchEvents().catch(() => []),
    fetchGallery().catch(() => []),
    fetchTeam().catch(() => []),
    fetchTestimonials().catch(() => []),
    fetchArticles().catch(() => []),
  ]);

  const upcomingEvents = allEvents.slice(0, 4);
  const galleryPreview = allGallery.slice(0, 6);
  const newsPreview = articles.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />

      <section className="relative py-20 px-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Foundation Statement
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground mb-12">
            Mission Statement
          </h2>
          <div className="space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              <strong>Ramani Foundation</strong> is dedicated to uplifting underprivileged communities through education, healthcare, and empowerment with a long-term focus on sustainable development.
            </p>
            <blockquote className="border-l-4 border-primary bg-primary/5 rounded-lg p-8 italic text-lg text-slate-700 relative">
              <span className="text-5xl text-primary/30 absolute top-2 left-4">&quot;</span>
              <p className="pl-6">Transforming lives through education, empowerment, and sustainable community development.</p>
              <p className="text-right mt-4 not-italic font-semibold text-primary">RAMANI MISSION</p>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-24 text-white -translate-y-1/2" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>

        <div className="container mx-auto px-4 lg:px-8 pt-12">
          <div className="flex justify-center mb-6">
            <span className="inline-flex rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Why It Matters
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-16">
            Case for Support
          </h2>

          <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Our annual report highlights field-based interventions focused on education, hygiene and nutrition, child participation, and skill development for children and communities in underserved areas.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">1.</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Education and Learning Support</h4>
                    <p className="text-slate-600">Strengthening access to education through local units, learning materials, and mentoring.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">2.</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Women Empowerment</h4>
                    <p className="text-slate-600">Expanding opportunities through awareness, leadership, and livelihood initiatives.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">3.</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Essential Facility Access</h4>
                    <p className="text-slate-600">Improving access to medical care, clean water, transportation, and basic infrastructure.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-200 shadow-lg relative">
                  <Image src="/images/hero-community.jpg" alt="Support 1" fill className="object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-200 shadow-lg relative">
                  <Image src="/images/hero-community.jpg" alt="Support 2" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-24 text-gray-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section className="relative py-24 px-4 bg-gray-50">
        <svg className="absolute top-0 left-0 w-full h-24 text-gray-50 -translate-y-1/2" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>

        <div className="container mx-auto px-4 lg:px-8 pt-12">
          <div className="flex justify-center mb-6">
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Program Portfolio
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-6">
            Specific Initiatives
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
            Our focused implementation through four key projects from the annual report
          </p>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                label: "P1",
                title: "Project Pahal",
                description: "Educational support for children through local SPOCs, learning materials, and regular mentoring sessions.",
              },
              {
                label: "P2",
                title: "Project Udaan",
                description: "Institutional collaboration with NGOs, orphanages, and old age homes to widen impact.",
              },
              {
                label: "P3",
                title: "Project Shakti",
                description: "Women-focused skill building, entrepreneurship support, wellness, and rights awareness.",
              },
              {
                label: "P4",
                title: "Project Prayaas",
                description: "Holistic village and basti development through healthcare, water, transport, hygiene, and lighting support.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] bg-white border border-slate-100 p-8 text-center shadow-sm transition hover:shadow-lg hover:-translate-y-1">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {item.label}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-24 text-background" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section className="relative py-24 px-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-6">
            <span className="inline-flex rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Execution Priorities
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-6">
            Action Statement
          </h2>

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-primary mb-12">We Will</h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-20">
            {[
              {
                label: "A1",
                title: "Strengthen Local Partnerships",
                description: "Work with SPOCs, institutions, and local authorities to deliver community-led development programs.",
              },
              {
                label: "A2",
                title: "Build Skills and Awareness",
                description: "Promote education, rights awareness, and practical skill development for children and women.",
              },
              {
                label: "A3",
                title: "Expand Essential Services",
                description: "Support access to healthcare, hygiene, clean water, transport, and other basic facilities.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm transition hover:shadow-lg text-center">
                <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                  {item.label}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full h-24 text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <GalleryGridSection items={galleryPreview} />
      <CTASection />
      <StatsIndicators />
      <EventScheduleSection events={upcomingEvents} />
      <VolunteerSection />
      <TeamSection members={teamMembers} />
      <TestimonialsSection testimonials={testimonials} />
      <NewsSection articles={newsPreview} />
    </div>
  );
}
