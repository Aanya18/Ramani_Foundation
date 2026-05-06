import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Ramani Foundation" },
      {
        name: "description",
        content:
          "Get in touch with Ramani Foundation to volunteer, partner, or learn more about our community work.",
      },
      { property: "og:title", content: "Contact Ramani Foundation" },
      {
        property: "og:description",
        content: "Volunteer, partner, or reach out, we'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = useSearch({ from: "/contact" }) as {
    subject?: string;
    amount?: string;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultSubject = search.subject || "";
  const defaultMessage = search.amount
    ? `I would like to donate ₹${Number(search.amount).toLocaleString()}. Please contact me with the next steps.`
    : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await api.submitContact({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone") || undefined,
        message: `Subject: ${formData.get("subject")}\n\n${formData.get("message")}`,
      });
      toast.success("Thanks! We'll get back to you soon.");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to submit contact form", error);
      toast.error("Could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />
      <PageHero
        eyebrow="Contact"
        title="Let's build change together"
        description="Whether you'd like to volunteer, partner, or simply learn more, we'd love to hear from you."
      />
      <section className="section-y">
        <div className="container-page grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, t: "Visit us", d: "Udaipur, Rajasthan, India" },
              { icon: Mail, t: "Email", d: "contact@ramanifoundation.org" },
              { icon: Phone, t: "Call", d: "+91 00000 00000" },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="flex gap-4 p-5 bg-card rounded-2xl border border-border shadow-soft"
              >
                <div className="size-12 shrink-0 rounded-xl bg-gradient-brand text-white grid place-items-center">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
            <div className="p-6 rounded-2xl bg-gradient-brand text-white shadow-elevated">
              <div className="text-xs font-bold tracking-wider uppercase opacity-80">
                Volunteer with us
              </div>
              <h3 className="mt-1 text-2xl font-bold">Give your time. Change a life.</h3>
              <p className="mt-2 text-sm text-white/85">
                Join our growing community of volunteers across Udaipur and beyond.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-card rounded-3xl border border-border p-6 md:p-8 shadow-soft space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@email.com" disabled={isSubmitting} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+91 00000 00000" disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                required
                defaultValue={defaultSubject}
                placeholder="I'd like to volunteer / partner / donate"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={6}
                required
                defaultValue={defaultMessage}
                placeholder="Tell us how you'd like to engage..."
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="rounded-full bg-gradient-brand text-white border-0 hover:opacity-90 w-full md:w-auto"
            >
              {isSubmitting ? "Sending..." : "Send message"} <Send className="size-4" />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
