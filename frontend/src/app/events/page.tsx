export const dynamic = 'force-dynamic';
import { fetchEvents, mediaUrl, type Event } from "@/lib/api";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Events() {
  const events: Event[] = await fetchEvents().catch(() => []);

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-manrope font-extrabold mb-4">Udaipur Events & Programs</h1>
            <p className="text-lg md:text-xl font-publicSans text-white/85 leading-relaxed">
              Join hands with us in programs designed to strengthen Udaipur's communities through education, healthcare, cultural preservation, and sustainable development.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 lg:px-8">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-manrope font-bold text-foreground mb-4">No events scheduled right now.</h3>
            <p className="text-gray-500 font-publicSans mb-8">We are planning something great. Please check back later.</p>
            <Link href="/contact">
              <Button className="bg-accent hover:bg-accent/90 text-white">Contact Us for Updates</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">
                <div className="h-56 relative overflow-hidden">
                  {event.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(event.image_url)}
                      alt={event.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                      <span className="text-primary font-manrope font-bold opacity-40 uppercase tracking-widest">Ramani Event</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-center min-w-[60px]">
                    <div className="text-sm font-bold text-primary font-manrope">{format(new Date(event.date), 'dd')}</div>
                    <div className="text-xs font-bold text-accent uppercase">{format(new Date(event.date), 'MMM')}</div>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-publicSans mb-3">
                    <span>📍</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                  <h2 className="text-2xl font-manrope font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors">{event.title}</h2>
                  <p className="text-gray-600 font-publicSans leading-relaxed flex-grow mb-6">{event.description}</p>

                  <Link href={`/gallery?event=${event.id}`} className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-primary font-bold hover:text-accent transition-colors group/link">
                    <span>View Event Gallery</span>
                    <span className="transform group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
