"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { type Testimonial, mediaUrl } from "@/lib/api";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

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
            What Our Community Says
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
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col"
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
              <p className="text-slate-700 mb-6 leading-relaxed flex-grow">{testimonial.content}</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                {testimonial.image_url ? (
                   <img
                   src={mediaUrl(testimonial.image_url)}
                   alt={testimonial.name}
                   className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                 />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  {testimonial.role && <p className="text-xs text-primary">{testimonial.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
