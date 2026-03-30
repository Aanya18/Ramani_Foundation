import { EventCard } from "../../components/cards/EventCard";
import { AsyncState } from "../../components/ui/AsyncState";
import { Container } from "../../components/ui/Container";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { useApiData } from "../../hooks/useApiData";
import type { EventSummary } from "../../types/api";

export function EventsSection() {
  const { data, loading, error } = useApiData<EventSummary[]>("/events", []);

  return (
    <section className="section-space">
      <Container>
        <div className="section-surface">
          <SectionHeading
            eyebrow="Events and drives"
            title="Participation should feel accessible, not buried."
            description="Upcoming events matter for volunteers, media, and local supporters. They also signal that the organization is active now, not only historically."
          />
          <div className="mt-10">
            <AsyncState error={error} loading={loading} loadingLabel="Loading events..." />
            {!loading && !error ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {data.map((event) => (
                  <EventCard key={event.title} {...event} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
