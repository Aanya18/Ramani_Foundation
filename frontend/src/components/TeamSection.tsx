"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { type TeamMember, mediaUrl } from "@/lib/api";

interface TeamSectionProps {
  members: TeamMember[];
}

export default function TeamSection({ members }: TeamSectionProps) {
  if (!members || members.length === 0) return null;

  return (
    <section className="relative py-24 px-4 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center rounded-full bg-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-4">
            ✓ Our Team
          </span>
          <h2 className="text-4xl lg:text-5xl font-manrope font-extrabold text-foreground mb-4">
            Dedicated Professionals Working for Change
          </h2>
        </motion.div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              {/* Image */}
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                {member.image_url ? (
                  <img
                    src={mediaUrl(member.image_url)}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <span className="text-4xl font-bold">{member.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Hover social links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href="#" className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-sm font-semibold text-primary mb-3">{member.role}</p>
              {member.bio && <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{member.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
