import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchEvents, fetchGallery, mediaUrl, type Event, type GalleryItem } from "@/lib/api";
import { format } from "date-fns";
import HeroSection from "@/components/HeroSection";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allEvents: Event[] = await fetchEvents().catch(() => []);
  const upcomingEvents = allEvents.slice(0, 4);

  const allGallery: GalleryItem[] = await fetchGallery().catch(() => []);
  const galleryPreview = allGallery.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
     
      <HeroSection />

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
              <strong>Ramani Foundation</strong> is a 501(c)(3) nonprofit driven to empower, facilitate and deliver knowledge and guidance for the organization's enrichment of the early childhood environment.
            </p>
            <blockquote className="border-l-4 border-primary bg-primary/5 rounded-lg p-8 italic text-lg text-slate-700 relative">
              <span className="text-5xl text-primary/30 absolute top-2 left-4">"</span>
              <p className="pl-6">An expectant mother provides for the physical growth of a developing child through consciousness choices, diet, and the use of prenatal vitamins. The introduction of age-appropriate activities in the womb promotes sound organization and execution of early academic skills in infancy.</p>
              <p className="text-right mt-4 not-italic font-semibold text-primary">— RAMANI MISSION</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Case for Support Section */}
      <section className="relative py-24 px-4 bg-white overflow-hidden">
        {/* Curved Wave Divider Top */}
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
                The National Institute of Health reports that by the age of five, <strong>90% of the brain</strong> is developed. Ramani Foundation is inspired to adequately experience and to the fostering of lifelong acquiring thinking capabilities through peer-reviewed robust activities.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Discovering and disseminating recruitment information</h4>
                    <p className="text-slate-600">with a focus on earliest childhood</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Increasing awareness among parents, caregivers and health care</h4>
                    <p className="text-slate-600">results from providing an optimal environment during a period and early development influence</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-2xl text-primary flex-shrink-0 mt-1">✓</span>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Providing access to prenatal premier protocol to preschool developmental</h4>
                    <p className="text-slate-600">training skills in ALL countries and programs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-200 shadow-lg">
                  <Image src="/images/hero-community.jpg" alt="Support 1" fill className="object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-gray-200 shadow-lg">
                  <Image src="/images/hero-community.jpg" alt="Support 2" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved Wave Divider Bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-24 text-gray-50" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>
      </section>

      {/* Specific Initiatives Section */}
      <section className="relative py-24 px-4 bg-gray-50">
        {/* Curved Wave Divider Top */}
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
                description: "Provide disadvantaged and underserved expecting mothers with access to education during the period of brain development.",
              },
              {
                icon: "📚",
                title: "Education Programs",
                description: "Partner with programs that work to identify interventions within elementary and secondary school structure.",
              },
              {
                icon: "🏥",
                title: "Collaboration & Care",
                description: "Collaborate with physicians, nurses and social workers to develop comprehensive intervention protocols.",
              },
              {
                icon: "🔬",
                title: "Research Partnerships",
                description: "Initiate research partnerships to explore the positive impacts of research evidence and sealing of intervention.",
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

        {/* Curved Wave Divider Bottom */}
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
                title: "Collaborate with research",
                description: "educational programs and stakeholders that design and implement cycles of development to improve systems, methods and skills.",
              },
              {
                icon: "📖",
                title: "Teach parents & companions",
                description: "early years compared and education about the neurological growth of emerging child through the experience of promoting a child.",
              },
              {
                icon: "🔬",
                title: "Foster and fund scientific research",
                description: "with a focus on improving nutritional developmental outcomes and increased school success.",
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

        {/* Curved Wave Divider Bottom */}
        <svg className="absolute bottom-0 left-0 w-full h-24 text-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,60 Q360,0 720,60 T1440,60 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section className="py-20 px-4 bg-background border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Visual stories</p>
          <h2 className="mt-3 text-3xl font-manrope font-extrabold text-foreground sm:text-4xl">A closer look at our work.</h2>
        </div>
        <div className="mt-12 grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {galleryPreview.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(item.image_url)} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Impact</p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-24 px-4 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,178,172,0.35),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(49,130,206,0.25),_transparent_25%)]" />
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">Become a partner</p>
                <h2 className="mt-4 text-4xl font-manrope font-extrabold text-white">Help us scale impact across communities.</h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Your support powers sustainable programs in education, health, livelihoods, and community resilience. Together we can create brighter futures at scale.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <Link href="/contact">
                  <Button className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90 px-8 py-4 text-lg font-bold">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border border-white/20 bg-white/10 text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-bold">
                    Give Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
