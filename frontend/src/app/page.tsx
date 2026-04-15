import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchEvents, fetchGallery } from "@/lib/api";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data for previews
  const allEvents = await fetchEvents().catch(() => []);
  const upcomingEvents = allEvents.slice(0, 4);

  const allGallery = await fetchGallery().catch(() => []);
  const galleryPreview = allGallery.slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-community.jpg"
            alt="Community empowerment"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-white">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-accent/90 text-sm font-bold tracking-wider mb-6 font-publicSans">
              EMPOWERING INDIA
            </span>
            <h1 className="text-4xl md:text-6xl font-manrope font-extrabold mb-6 leading-tight">
              Building Stronger Communities Together.
            </h1>
            <p className="text-lg md:text-xl font-publicSans mb-8 text-gray-100 leading-relaxed">
              Join the Ramani Foundation in our mission to provide sustainable education, holistic healthcare, and community-driven development to those who need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90 shadow-lg px-8 py-6 text-lg font-bold" size="lg">
                  Support Our Cause
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-bold" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About/Mission Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-mission.jpg"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-3 font-publicSans">Who We Are</h2>
              <h3 className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-6">
                A Mission of Hope and Transformation
              </h3>
              <p className="text-gray-600 font-publicSans text-lg leading-relaxed mb-6">
                For over a decade, Ramani Foundation has been at the forefront of social change in India. We believe that true development happens when communities are empowered with the right tools, knowledge, and resources.
              </p>
              <p className="text-gray-600 font-publicSans text-lg leading-relaxed mb-8">
                Our focused initiatives in rural education, women's empowerment, and accessible healthcare are designed to break the cycle of poverty and build a resilient future.
              </p>
              <Link href="/about">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white px-6 font-bold">
                  Read Our Full Story &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-6">
              <h3 className="text-5xl font-manrope font-extrabold text-accent mb-3">50k+</h3>
              <p className="text-lg font-publicSans font-medium text-gray-200 uppercase tracking-wide">Lives Touched</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-manrope font-extrabold text-accent mb-3">120</h3>
              <p className="text-lg font-publicSans font-medium text-gray-200 uppercase tracking-wide">Active Projects</p>
            </div>
            <div className="p-6">
              <h3 className="text-5xl font-manrope font-extrabold text-accent mb-3">15</h3>
              <p className="text-lg font-publicSans font-medium text-gray-200 uppercase tracking-wide">Communities Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-2 font-publicSans">Join Us</h2>
              <h3 className="text-3xl md:text-4xl font-manrope font-bold text-foreground">Upcoming Events</h3>
            </div>
            <Link href="/events" className="hidden sm:block text-primary font-bold hover:text-accent transition-colors">
              View All Events &rarr;
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 font-publicSans text-center py-8">No upcoming events at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="bg-background rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  {event.image_url ? (
                    <div className="h-48 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`http://localhost:8000${event.image_url}`} alt={event.title} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="h-48 bg-primary/10 flex items-center justify-center">
                       <span className="text-primary font-manrope font-bold opacity-50">Event</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-accent uppercase mb-2">
                       {format(new Date(event.date), 'MMM d, yyyy')}
                    </div>
                    <h4 className="text-lg font-manrope font-bold text-foreground mb-2 line-clamp-2">{event.title}</h4>
                    <p className="text-sm text-gray-500 font-publicSans flex-grow line-clamp-2">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
             <Link href="/events">
                <Button variant="outline" className="text-primary border-primary">View All Events</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 px-4 bg-background border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8 text-center">
           <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-2 font-publicSans">Our Impact in Pictures</h2>
           <h3 className="text-3xl md:text-4xl font-manrope font-bold text-foreground mb-12">Moments of Change</h3>

           {galleryPreview.length === 0 ? (
             <p className="text-gray-500 font-publicSans">No gallery images available yet.</p>
           ) : (
             <div className="flex flex-wrap justify-center gap-4 mb-10">
               {galleryPreview.map((item: any, idx: number) => (
                 <div key={item.id} className={`relative overflow-hidden rounded-lg shadow-sm group ${idx === 0 ? 'w-full md:w-2/3 h-64 md:h-96' : 'w-[45%] md:w-[23%] h-40 md:h-64'}`}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={`http://localhost:8000${item.image_url}`} alt={item.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                     <p className="text-white font-manrope font-bold text-sm text-left line-clamp-2">{item.title}</p>
                   </div>
                 </div>
               ))}
             </div>
           )}
           <Link href="/gallery">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-4 font-bold">Explore Full Gallery</Button>
           </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 px-4 flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/volunteer.jpg"
            alt="Volunteers"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 container mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-manrope font-extrabold text-white mb-6">Be the Change You Wish to See</h2>
          <p className="text-xl text-gray-200 mb-10 font-publicSans">
            Whether you want to volunteer your time, partner with us, or make a donation, your contribution makes a lasting difference in the lives of many.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90 shadow-lg px-8 py-6 text-lg font-bold">
                Become a Volunteer
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-bold border-none shadow-lg">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
