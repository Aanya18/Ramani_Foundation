"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      {/* Newsletter section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative border-t border-white/10 bg-gradient-to-r from-primary to-accent py-12 px-4"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
            <p className="text-lg text-white/90 mb-6">
              Subscribe to our newsletter for updates on our programs and impact stories
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 rounded-full bg-white text-primary font-bold hover:bg-slate-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main footer content */}
      <div className="relative py-16 px-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-2xl font-manrope font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ramani Foundation
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering communities and creating lasting positive change through education, health, and social initiatives.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors text-white font-bold">
                  f
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors text-white font-bold">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors text-white font-bold">
                  I
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary/50 flex items-center justify-center transition-colors text-white font-bold">
                  in
                </a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="font-bold text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-slate-400 hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/events" className="text-slate-400 hover:text-primary transition-colors">Events</Link></li>
                <li><Link href="/donate" className="text-slate-400 hover:text-primary transition-colors">Donate</Link></li>
              </ul>
            </motion.div>

            {/* Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="font-bold text-lg">Programs</h4>
              <ul className="space-y-3">
                <li><Link href="/initiatives" className="text-slate-400 hover:text-primary transition-colors">Education</Link></li>
                <li><Link href="/initiatives" className="text-slate-400 hover:text-primary transition-colors">Health</Link></li>
                <li><Link href="/initiatives" className="text-slate-400 hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="/initiatives" className="text-slate-400 hover:text-primary transition-colors">Volunteer</Link></li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h4 className="font-bold text-lg">Contact</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-accent truncate flex-shrink-0" />
                  <span>ddddinfo@ramanifoundation.org</span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>123 Community Street<br />City, State 12345</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400"
          >
            <p>&copy; {currentYear} Ramani Foundation. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
