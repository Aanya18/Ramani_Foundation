"use client";

import { motion } from "framer-motion";
import { Users, Heart, Target, Zap } from "lucide-react";

export default function StatsIndicators() {
  const stats = [
    {
      icon: Users,
      number: "Many",
      label: "People Helped",
    },
    {
      icon: Heart,
      number: "3+",
      label: "Years Active",
    },
    {
      icon: Target,
      number: "Various",
      label: "Programs",
    },
    {
      icon: Zap,
      number: "Dedicated",
      label: "Support",
    },
  ];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="relative mb-4 flex justify-center">
                  {/* Circular background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Icon container */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-manrope font-extrabold text-white mb-2 group-hover:text-primary transition-colors">
                  {stat.number}
                </h3>
                <p className="text-slate-300 font-semibold">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
