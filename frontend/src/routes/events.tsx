import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Calendar, MapPin, ArrowRight, Loader2, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { api, getImageUrl } from "@/lib/api";

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
    const [events, publicSettings] = await Promise.all([api.getEvents(), api.getPublicSettings()]);
    const typedEvents = events as EventItem[];
    const typedSettings = publicSettings as { whatsapp_group_url: string };
    const now = new Date();
    const upcoming = typedEvents.filter((event) => new Date(event.date) >= now);
    const past = typedEvents.filter((event) => new Date(event.date) < now);
    return { upcoming, past, whatsappGroupUrl: typedSettings.whatsapp_group_url };
  },
  component: EventsPage,
});

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string | null;
  accept_rsvp?: boolean;
};

function EventsPage() {
  const { upcoming, past, whatsappGroupUrl } = Route.useLoaderData() as {
    upcoming: EventItem[];
    past: EventItem[];
    whatsappGroupUrl: string;
  };
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoinedWhatsapp, setHasJoinedWhatsapp] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    email: "",
    phone: "",
    rsvp_status: "attending",
    notes: "",
  });

  const openRsvp = (event: EventItem) => {
    setSelectedEvent(event);
    setHasJoinedWhatsapp(false);
    setRsvpForm({
      name: "",
      email: "",
      phone: "",
      rsvp_status: "attending",
      notes: "",
    });
  };

  const closeRsvp = () => {
    setSelectedEvent(null);
    setIsSubmitting(false);
    setHasJoinedWhatsapp(false);
  };

  const handleJoinWhatsapp = () => {
    if (!whatsappGroupUrl) return;
    window.open(whatsappGroupUrl, "_blank", "noopener,noreferrer");
    setHasJoinedWhatsapp(true);
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent || isSubmitting || !hasJoinedWhatsapp) return;

    setIsSubmitting(true);
    try {
      await api.submitEventRsvp(selectedEvent.id, {
        lead: {
          name: rsvpForm.name,
          email: rsvpForm.email,
          phone: rsvpForm.phone || undefined,
        },
        rsvp_status: rsvpForm.rsvp_status,
        is_volunteer: false,
        notes: rsvpForm.notes || undefined,
      });
      toast.success("RSVP submitted successfully.");
      closeRsvp();
    } catch (error) {
      console.error("Failed to submit RSVP", error);
      toast.error("Could not submit RSVP. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />
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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="group relative bg-card rounded-3xl border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-gradient-brand">
                  {event.image_url ? (
                    <>
                      <img
                        src={getImageUrl(event.image_url) as string}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="size-16 text-white/60" />
                      </div>
                    </>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[var(--brand-orange)] shadow-sm">
                    Upcoming
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 group-hover:text-[var(--brand-blue)] transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-4 text-[var(--brand-orange)]" />
                      {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-[var(--brand-orange)]" />
                      {event.location}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="size-4 text-[var(--brand-blue)]" />
                      {event.accept_rsvp === false ? "RSVP closed" : "RSVP open"}
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-brand text-white border-0 hover:opacity-90"
                      onClick={() => openRsvp(event)}
                      disabled={event.accept_rsvp === false}
                    >
                      <Ticket className="size-4 mr-2" />
                      {event.accept_rsvp === false ? "Closed" : "RSVP Now"}
                    </Button>
                  </div>
                </div>
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
              <div
                key={event.id}
                className="group bg-card/50 rounded-2xl border border-border/50 overflow-hidden hover:bg-card hover:border-border transition-all"
              >
                <div className="aspect-video overflow-hidden relative bg-muted">
                  {event.image_url ? (
                    <img
                      src={getImageUrl(event.image_url) as string}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        console.error(
                          "Past event image failed to load:",
                          event.title,
                          event.image_url,
                        );
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="size-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && closeRsvp()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>RSVP for {selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              Fill the details below to confirm your attendance.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rsvp-name">Name</Label>
                <Input
                  id="rsvp-name"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rsvp-email">Email</Label>
                <Input
                  id="rsvp-email"
                  type="email"
                  value={rsvpForm.email}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvp-phone">Phone</Label>
              <Input
                id="rsvp-phone"
                type="tel"
                value={rsvpForm.phone}
                onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                disabled={isSubmitting}
                placeholder="+91 00000 00000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvp-status">RSVP Status</Label>
              <select
                id="rsvp-status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                value={rsvpForm.rsvp_status}
                onChange={(e) => setRsvpForm({ ...rsvpForm, rsvp_status: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="attending">Attending</option>
                <option value="maybe">Maybe</option>
                <option value="not_attending">Not attending</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rsvp-notes">Notes</Label>
              <Textarea
                id="rsvp-notes"
                value={rsvpForm.notes}
                onChange={(e) => setRsvpForm({ ...rsvpForm, notes: e.target.value })}
                disabled={isSubmitting}
                placeholder="Any dietary needs, arrival details, or message"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeRsvp} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-gradient-brand text-white border-0 hover:opacity-90"
                disabled={isSubmitting || !hasJoinedWhatsapp}
              >
                {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </Button>
            </div>

            {whatsappGroupUrl && (
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold">Want group updates?</div>
                    <p className="text-sm text-muted-foreground">
                      Join our WhatsApp group first, then submit the RSVP.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full"
                    onClick={handleJoinWhatsapp}
                    disabled={isSubmitting}
                  >
                    Join WhatsApp Group
                  </Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {hasJoinedWhatsapp
                    ? "WhatsApp group link opened. You can submit the RSVP now."
                    : "RSVP submission stays locked until you click the join button."}
                </p>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
