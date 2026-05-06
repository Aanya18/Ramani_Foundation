import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Calendar, Users, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  accept_rsvp?: boolean;
}

interface EventRsvp {
  id: string;
  rsvp_status: "attending" | "maybe" | "not_attending" | string;
  is_volunteer: boolean;
  volunteer_role?: string | null;
  notes?: string | null;
  created_at: string;
  lead_name?: string | null;
  lead_email?: string | null;
  lead_phone?: string | null;
}

interface RsvpStats {
  total_rsvps: number;
  attending: number;
  maybe: number;
  not_attending: number;
  volunteers: number;
}

export const Route = createFileRoute("/admin/rsvps")({
  component: AdminRsvps,
});

function AdminRsvps() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [stats, setStats] = useState<RsvpStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      const data = (await api.getAdminEvents()) as Event[];
      setEvents(data);
      if (data.length && !selectedEventId) {
        setSelectedEventId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load events", error);
      toast.error("Failed to load events");
    }
  }, [selectedEventId]);

  const loadEventData = useCallback(async (eventId: string) => {
    setIsLoading(true);
    try {
      const [rsvpData, statsData] = await Promise.all([
        api.getEventRsvps(eventId),
        api.getEventRsvpStats(eventId),
      ]);
      setRsvps(rsvpData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load RSVP data", error);
      toast.error("Failed to load RSVP data");
      setRsvps([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadEvents();
  }, [navigate, loadEvents]);

  useEffect(() => {
    if (selectedEventId) {
      loadEventData(selectedEventId);
    }
  }, [selectedEventId, loadEventData]);

  const selectedEvent = events.find((event) => event.id === selectedEventId) || null;

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Event RSVPs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View all RSVP submissions for each event in one place.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.map((event) => (
              <Button
                key={event.id}
                variant={selectedEventId === event.id ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => setSelectedEventId(event.id)}
              >
                <div className="flex w-full flex-col items-start gap-1">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs opacity-80">
                    {new Date(event.date).toLocaleDateString()} · {event.location}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{selectedEvent?.title || "Select an event"}</CardTitle>
                  {selectedEvent && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(selectedEvent.date).toLocaleDateString()} · {selectedEvent.location}
                    </p>
                  )}
                </div>
                {selectedEvent && (
                  <Badge variant={selectedEvent.accept_rsvp === false ? "secondary" : "default"}>
                    {selectedEvent.accept_rsvp === false ? "RSVP closed" : "RSVP open"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="size-4" />
                      Total
                    </div>
                    <div className="mt-2 text-2xl font-bold">{stats.total_rsvps}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserCheck className="size-4" />
                      Attending
                    </div>
                    <div className="mt-2 text-2xl font-bold">{stats.attending}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      Maybe
                    </div>
                    <div className="mt-2 text-2xl font-bold">{stats.maybe}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserX className="size-4" />
                      Volunteers
                    </div>
                    <div className="mt-2 text-2xl font-bold">{stats.volunteers}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {isLoading ? "Loading RSVP data..." : "No RSVP data available."}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {rsvps.length ? (
                <div className="space-y-4">
                  {rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">
                            {rsvp.lead_name || "Unknown attendee"}
                          </div>
                          <div className="text-sm text-muted-foreground">{rsvp.lead_email}</div>
                          {rsvp.lead_phone && (
                            <div className="text-sm text-muted-foreground">{rsvp.lead_phone}</div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge>{rsvp.rsvp_status}</Badge>
                          {rsvp.is_volunteer && <Badge variant="secondary">Volunteer</Badge>}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        {rsvp.volunteer_role ? <div>Role: {rsvp.volunteer_role}</div> : null}
                        {rsvp.notes ? <div className="mt-1">Notes: {rsvp.notes}</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {selectedEventId
                    ? "No RSVPs submitted for this event yet."
                    : "Select an event to view RSVPs."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
