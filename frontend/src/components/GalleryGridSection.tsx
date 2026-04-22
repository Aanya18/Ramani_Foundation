"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { type GalleryItem, mediaUrl } from "@/lib/api";

interface GalleryGridSectionProps {
  items: GalleryItem[];
}

export default function GalleryGridSection({ items }: GalleryGridSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-24 px-4 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
            ✓ Gallery
          </span>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground">
            Impact Stories Through Our Lens
          </h2>
        </motion.div>

        {/* Horizontal scroll gallery */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 group"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={mediaUrl(item.image_url)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Hover arrow button */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
