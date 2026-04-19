"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StatsSection() {
  return (
    <section className="relative py-20 px-4 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Stats Circle with decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Decorative hands background */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-8 w-48 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-2xl" />
              
              {/* Main stat circle */}
              <div className="relative z-10 w-64 h-64 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <span className="block text-6xl font-extrabold text-white">15+</span>
                  <span className="block text-lg font-semibold text-white/90 mt-2">Years Of Service</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content and avatars */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
                ✓ Our Impact
              </span>
              <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground mb-4">
                Helping Each Other can Make World Better
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                With over 15 years of dedicated service, we've worked with thousands of individuals and families to create lasting positive change in our communities.
              </p>
            </div>

            {/* Feature points */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                  <span className="text-primary font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Start Giving Impact Today</h4>
                  <p className="text-slate-600 text-sm">Join our mission to transform lives</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                  <span className="text-accent font-bold text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Be Part of Our Community</h4>
                  <p className="text-slate-600 text-sm">Connect with like-minded change makers</p>
                </div>
              </div>
            </div>

            {/* Team avatars */}
            <div className="pt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-white flex items-center justify-center text-white font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-foreground">5,000+ Active Members</p>
                <p className="text-sm text-slate-500">Across our community</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
