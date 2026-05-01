import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Ramani Foundation" },
      {
        name: "description",
        content:
          "Upcoming and recent events by Ramani Foundation — health camps, education drives, women empowerment workshops and community celebrations.",
      },
      { property: "og:title", content: "Events — Ramani Foundation" },
      {
        property: "og:description",
        content: "Join our health camps, education drives and community workshops.",
      },
    ],
  }),
  loader: async () => {
    const events = await api.getEvents();
    const now = new Date();
    const upcoming = events.filter((event) => new Date(event.date) >= now);
    const past = events.filter((event) => new Date(event.date) < now);
    return { upcoming, past };
  },
  component: EventsPage,
});

function EventsPage() {
  const { upcoming, past } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where we're showing up"
        description="Be part of upcoming camps, workshops and drives — or relive moments from past events."
      />

      <section className="section-y">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-[var(--brand-orange)]">
                Coming up
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">Upcoming Events</h2>
            </div>
            <Link to="/donate">
              <Button>
                Donate to Support
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <div key={event.id} className="group">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={event.image_url || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-xs font-semibold tracking-wider uppercase text-[var(--brand-orange)] mb-2">
                  EVENT
                </div>
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {event.location}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-muted/50">
        <div className="container-page">
          <div className="mb-10">
            <div className="text-xs font-semibold tracking-wider uppercase text-[var(--brand-orange)]">
              Past Events
            </div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Memorable Moments</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <div key={event.id} className="group">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={event.image_url || "/placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
