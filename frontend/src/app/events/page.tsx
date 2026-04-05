export const dynamic = 'force-dynamic';
import { fetchEvents } from "@/lib/api";
import { format } from "date-fns";

export default async function Events() {
  const events = await fetchEvents();

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500 font-publicSans">No upcoming events at the moment. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: { id: number; title: string; date: string; location: string; description: string; image_url: string | null }) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
              {event.image_url ? (
                <div className="h-48 bg-gray-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`http://localhost:8000${event.image_url}`} alt={event.title} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-manrope font-bold opacity-50">Ramani Foundation Event</span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-manrope font-bold text-primary mb-2">{event.title}</h2>
                <div className="text-sm text-accent font-publicSans mb-4">
                  {format(new Date(event.date), 'MMMM d, yyyy')} | {event.location}
                </div>
                <p className="text-gray-700 font-publicSans flex-grow">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
