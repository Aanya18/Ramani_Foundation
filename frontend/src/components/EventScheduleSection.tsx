"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { type Event, mediaUrl } from "@/lib/api";

interface EventScheduleSectionProps {
  events: Event[];
}

export default function EventScheduleSection({ events }: EventScheduleSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
            ✓ Events
          </span>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-white">
            Upcoming Events & Programs
          </h2>
        </motion.div>

        {/* Events Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Image */}
              <div className="h-48 relative overflow-hidden">
                {event.image_url ? (
                  <img
                    src={mediaUrl(event.image_url)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {event.title}
                </h3>

                {/* Event details */}
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* CTA button */}
                <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm hover:shadow-lg hover:shadow-primary/50 transition-all duration-300">
                  Learn More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
