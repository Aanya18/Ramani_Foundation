"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sunita Devi",
      role: "Udaipur Community Member",
      content: "Ramani Foundation's education program gave my children the opportunity they deserved. Now my daughter studies medicine in Jaipur. This foundation truly transforms lives in our community.",
      rating: 5,
      bgClass: "from-primary to-secondary",
      avatar: "/images/avatar-sunita.jpg",
    },
    {
      id: 2,
      name: "Arjun Singh",
      role: "Local Volunteer",
      content: "Working with Ramani Foundation has shown me the real impact of community service. Together, we're building a better Udaipur for everyone.",
      rating: 5,
      bgClass: "from-secondary to-accent",
      avatar: "/images/avatar-arjun.jpg",
    },
    {
      id: 3,
      name: "Kavita Jain",
      role: "Regular Donor",
      content: "I've seen firsthand how Ramani Foundation uses donations effectively. Their transparency and focus on Udaipur's specific needs make them trustworthy partners in change.",
      rating: 5,
      bgClass: "from-accent to-primary",
      avatar: "/images/avatar-kavita.jpg",
    },
    {
      id: 4,
      name: "Ramesh Kumar",
      role: "Program Beneficiary",
      content: "The healthcare camps and education support from Ramani Foundation have been life-changing for my family. They're the heart of Udaipur's development.",
      rating: 5,
      bgClass: "from-primary to-accent",
      avatar: "/images/avatar-ramesh.jpg",
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
            ✓ Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground">
            What They Are Talking About Charities
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 mb-6 leading-relaxed">{testimonial.content}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-primary">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
