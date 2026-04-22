import { fetchEvents, fetchGallery, fetchTeam, fetchTestimonials, fetchArticles, type Event, type GalleryItem, type TeamMember, type Testimonial, type Article } from "@/lib/api";
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

export const dynamic = 'force-dynamic';

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
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Mission Statement Section */}
      <section className="relative py-20 px-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <span className="text-4xl">💝</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground mb-12">
            Mission Statement
          </h2>
          <div className="space-y-8">
            <p className="text-lg text-slate-600 leading-relaxed">
              <strong>Ramani Foundation</strong> is dedicated to empowering, facilitating, and delivering knowledge and guidance for the enrichment of communities and early childhood environments.
            </p>
            <blockquote className="border-l-4 border-primary bg-primary/5 rounded-lg p-8 italic text-lg text-slate-700 relative">
              <span className="text-5xl text-primary/30 absolute top-2 left-4">"</span>
              <p className="pl-6">Empowering mothers and children through conscious choices and age-appropriate activities promotes sound development and long-term success.</p>
              <p className="text-right mt-4 not-italic font-semibold text-primary">— RAMANI MISSION</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Case for Support Section */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-24 text-white -translate-y-1/2" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>

        <div className="container mx-auto px-4 lg:px-8 pt-12">
          <div className="flex justify-center mb-6">
            <span className="text-4xl">💖</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-16">
            Case for Support
          </h2>

          <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Research shows that by the age of five, <strong>90% of the brain</strong> is developed. Ramani Foundation is inspired to foster lifelong thinking capabilities through robust, peer-reviewed activities.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Early Childhood Development</h4>
                    <p className="text-slate-600">Focusing on the most critical years of growth.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Increasing Awareness</h4>
                    <p className="text-slate-600">Educating parents and caregivers for optimal environments.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Universal Access</h4>
                    <p className="text-slate-600">Providing premier protocol skills across all programs.</p>
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

      {/* Specific Initiatives Section */}
      <section className="relative py-24 px-4 bg-gray-50">
        <svg className="absolute top-0 left-0 w-full h-24 text-gray-50 -translate-y-1/2" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>

        <div className="container mx-auto px-4 lg:px-8 pt-12">
          <div className="flex justify-center mb-6">
            <span className="text-4xl">💝</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-6">
            Specific Initiatives
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
            Our comprehensive approach across four key pillars of impact
          </p>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                icon: "🧠",
                title: "Neuro Development",
                description: "Provide disadvantaged mothers with access to education during critical brain development periods.",
              },
              {
                icon: "📚",
                title: "Education Programs",
                description: "Partner with schools to identify interventions within elementary and secondary structures.",
              },
              {
                icon: "🏥",
                title: "Collaboration & Care",
                description: "Collaborate with health professionals to develop comprehensive intervention protocols.",
              },
              {
                icon: "🔬",
                title: "Research Partnerships",
                description: "Explore the positive impacts of research evidence and scaling of intervention.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.75rem] bg-white border border-slate-100 p-8 text-center shadow-sm transition hover:shadow-lg hover:-translate-y-1">
                <div className="text-5xl mb-4">{item.icon}</div>
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

      {/* Action Statement Section */}
      <section className="relative py-24 px-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-6">
            <span className="text-4xl">💝</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-center text-foreground mb-6">
            Action Statement
          </h2>

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-primary mb-12">We Will:</h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-20">
            {[
              {
                icon: "👥",
                title: "Collaborate with Research",
                description: "Partner with stakeholders to design and implement cycles of development to improve systems.",
              },
              {
                icon: "📖",
                title: "Teach Parents & Caregivers",
                description: "Educate on neurological growth and best practices for promoting child development.",
              },
              {
                icon: "🔬",
                title: "Foster Scientific Research",
                description: "Fund research focused on improving nutritional and developmental outcomes.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm transition hover:shadow-lg text-center">
                <div className="text-5xl mb-6">{item.icon}</div>
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

      {/* Gallery Grid Section */}
      <GalleryGridSection items={galleryPreview} />

      {/* CTA Section */}
      <CTASection />

      {/* Stats Indicators */}
      <StatsIndicators />

      {/* Event Schedule Section */}
      <EventScheduleSection events={upcomingEvents} />

      {/* Volunteer Section */}
      <VolunteerSection />

      {/* Team Section */}
      <TeamSection members={teamMembers} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* News Section */}
      <NewsSection articles={newsPreview} />
    </div>
  );
}
