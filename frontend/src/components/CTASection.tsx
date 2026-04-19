"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-slate-950 to-slate-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left: Organize Donate */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl lg:text-4xl font-manrope font-extrabold text-white mb-4">
                  Organize Donate Now
                </h3>
                <p className="text-lg text-slate-300">
                  Start your fundraising journey and inspire others to support our cause.
                </p>
              </div>

              {/* Tag list */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  💰 Fundraising
                </span>
                <span className="inline-flex items-center bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Easy Setup
                </span>
                <span className="inline-flex items-center bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                  📊 Track Impact
                </span>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all rounded-full"
              >
                <Link href="/donate">Start Fundraising</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right: Support Kids */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 lg:p-12 text-white"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl lg:text-4xl font-manrope font-extrabold mb-4">
                  Support Kids by Raising Valuable Donations
                </h3>
                <p className="text-lg text-white/90">
                  Make a direct impact by supporting our initiatives focused on children's wellbeing and education.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                  <span>Direct impact on children's lives</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                  <span>Transparent fund allocation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">✓</span>
                  <span>Regular impact reports</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-white text-primary hover:bg-slate-100 transition-all rounded-full font-bold"
              >
                <Link href="/donate">Donate Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
