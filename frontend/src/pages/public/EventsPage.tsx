import { PageFrame } from "./PageFrame";
import { AsyncState } from "../../components/ui/AsyncState";
import { EventCard } from "../../components/cards/EventCard";
import { useApiData } from "../../hooks/useApiData";
import type { EventSummary } from "../../types/api";

export function EventsPage() {
  const { data, loading, error } = useApiData<EventSummary[]>("/events", []);

  return (
    <PageFrame
      ctaLabel="Volunteer for a Drive"
      ctaTo="/volunteer"
      description="Use this area for upcoming drives, campaign calendars, registrations, and past-event highlights that show active field presence."
      eyebrow="Events and campaigns"
      title="Upcoming drives signal energy, transparency, and local presence."
    >
      <AsyncState error={error} loading={loading} loadingLabel="Loading events..." />
      {!loading && !error ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      ) : null}
    </PageFrame>
  );
}
