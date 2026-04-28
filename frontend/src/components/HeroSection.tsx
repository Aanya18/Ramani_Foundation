// HeroSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full  overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-20 pb-32 md:pb-40">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(56,178,172,0.2),_transparent_50%),radial-gradient(circle_at_80%_70%,_rgba(49,130,206,0.15),_transparent_50%)]" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/3 right-0 w-56 h-56 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative container mx-auto px-4 py-12 md:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold tracking-[0.3em] uppercase text-primary shadow-sm mb-6">
                Our Mission
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-manrope font-extrabold leading-tight tracking-tight">
                Transforming Lives Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  EDUCATION AND EMPOWERMENT
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0">
                Ramani Foundation uplifts underprivileged communities through education, healthcare access,
                women empowerment, and sustainable community development.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-6 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                <Link href="/donate">
                  SUPPORT OUR WORK
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-all"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-primary">OK</span> Dedicated Service
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">OK</span> Lives Transformed
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">OK</span> Community Initiatives
              </div>
            </div>
          </motion.div>

          {/* Right Image with modern styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-white/5 p-2 shadow-2xl shadow-primary/20 backdrop-blur-sm">
              <div className="relative overflow-hidden rounded-2xl aspect-square">
                <Image
                  src="/images/heroimage1.png"
                  alt="Community empowerment"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12 md:h-16 text-background"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C240,128 480,0 720,32 C960,64 1200,96 1440,64 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}

