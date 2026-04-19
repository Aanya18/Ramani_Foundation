"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventScheduleSection() {
  const events = [
    {
      id: 1,
      title: "Udaipur Health Camp",
      date: "April 25, 2024",
      time: "09:00 AM - 05:00 PM",
      location: "Ramani Community Center, Udaipur",
      bgClass: "from-primary to-secondary",
      image: "/images/event-health-camp.jpg",
    },
    {
      id: 2,
      title: "Digital Education Workshop",
      date: "May 02, 2024",
      time: "10:00 AM - 02:00 PM",
      location: "Udaipur City Hall",
      bgClass: "from-secondary to-accent",
      image: "/images/event-workshop.jpg",
    },
    {
      id: 3,
      title: "Lake Pichola Cleanup Drive",
      date: "May 10, 2024",
      time: "08:00 AM - 04:00 PM",
      location: "Lake Pichola, Udaipur",
      bgClass: "from-accent to-primary",
      image: "/images/event-volunteer.jpg",
    },
    {
      id: 4,
      title: "Annual Udaipur Fundraiser",
      date: "May 20, 2024",
      time: "06:00 PM - 10:00 PM",
      location: "The Leela Palace, Udaipur",
      bgClass: "from-primary to-accent",
      image: "/images/event-gala.jpg",
    },
  ];

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
            Charities Information Of Event Schedule
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
              {/* Image placeholder */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${event.bgClass} opacity-40`} />
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{event.location}</span>
                  </div>
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
