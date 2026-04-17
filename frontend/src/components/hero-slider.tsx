"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Strengthening early neurological development",
    subtitle: "Curated programs that support prenatal care, early learning, and family resilience.",
    badge: "Early childhood excellence",
    image: "/images/hero-community.jpg",
  },
  {
    title: "Empowering families with trusted guidance",
    subtitle: "Practical support for parents, caregivers, and local leaders across every community.",
    badge: "Family-led impact",
    image: "/images/hero-community.jpg",
  },
  {
    title: "Scaling community impact with evidence-based care",
    subtitle: "Health, education, and livelihood programs designed for meaningful, sustainable change.",
    badge: "Sustainable growth",
    image: "/images/hero-community.jpg",
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_35px_120px_-40px_rgba(56,178,172,0.45)]">
      <div className="relative h-[70vh] max-h-[70vh] min-h-[70vh]">
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${activeIndex === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Image src={slide.image} alt={slide.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="relative flex h-full items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[0.95fr_0.9fr] items-center h-full">
                  <div className="max-w-2xl text-white">
                    <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white/90 shadow-sm">
                      {slide.badge}
                    </span>
                    <h2 className="mt-8 text-4xl font-manrope font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-lg text-slate-200 sm:text-xl">
                      {slide.subtitle}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <a href="/donate" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-[1.01]">
                        Join the movement
                      </a>
                      <a href="/about" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-bold text-white transition hover:bg-white/20">
                        Learn more
                      </a>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-[0_30px_100px_-40px_rgba(0,0,0,0.65)]">
                      <div className="relative h-[42rem] rounded-[1.75rem] overflow-hidden bg-slate-900">
                        <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-3 w-9 rounded-full transition-all duration-300 ${activeIndex === index ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
