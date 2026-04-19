"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function VolunteerSection() {
  const faqs = [
    {
      question: "How do I become a volunteer?",
      answered: true,
    },
    {
      question: "What are the requirements?",
      answered: true,
    },
    {
      question: "Is there a time commitment?",
      answered: true,
    },
  ];

  return (
    <section className="relative py-24 px-4 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden h-96 lg:h-full min-h-80 shadow-2xl">
              <img
                src="/images/volunteer.jpg"
                alt="Volunteers working together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
                ✓ Volunteer
              </span>
              <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground mb-4">
                Join Us in Transforming Udaipur
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Volunteers are the heart of Ramani Foundation. By dedicating your time and talents to Udaipur's development, you can help create lasting change in our beautiful city. Whether you want to teach, organize health camps, or support our environmental initiatives, we have meaningful opportunities for everyone.
              </p>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 pt-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full md:w-fit bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all rounded-full"
            >
              <Link href="/volunteer">Become a Volunteer</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
