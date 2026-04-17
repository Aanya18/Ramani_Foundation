// app/layout.tsx (Server Component - Updated)
import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "Ramani Foundation",
  description: "A community-focused NGO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${publicSans.variable} font-publicSans bg-background text-foreground antialiased min-h-screen flex flex-col`}
      >
        {/* Top bar - static */}
        <div className="bg-primary-foreground/5 py-2 hidden md:block border-b border-primary/10">
          <div className="container mx-auto flex justify-end items-center text-sm font-publicSans text-primary px-4 lg:px-8 space-x-6">
            <span>📞 +91 98765 43210</span>
            <span>✉️ info@ramanifoundation.org</span>
          </div>
        </div>

        {/* Client-side Navbar with active highlighting & mobile menu */}
        <Navbar />

        <main className="flex-grow">{children}</main>

        <footer className="bg-[#0d343d] text-white pt-16 pb-8 mt-auto">
          <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-5">
              <div className="flex items-center gap-3 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Ramani Foundation Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover bg-white"
                />
                <div>
                  <h3 className="font-manrope text-2xl font-bold tracking-tight">
                    Ramani Foundation
                  </h3>
                  <p className="text-sm text-slate-300">
                    Building resilient communities through education, healthcare,
                    and livelihood support.
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Our team works closely with local partners to deliver measurable
                impact. We welcome your support, partnership, and collaboration
                as we scale our work across India.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 xl:col-span-7">
              <div>
                <h3 className="font-manrope text-xl font-bold mb-5 text-accent">
                  Quick Links
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li>
                    <a href="/about" className="transition hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/events" className="transition hover:text-white">
                      Upcoming Events
                    </a>
                  </li>
                  <li>
                    <a href="/gallery" className="transition hover:text-white">
                      Impact Gallery
                    </a>
                  </li>
                  <li>
                    <a href="/donate" className="transition hover:text-white">
                      Donate
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-manrope text-xl font-bold mb-5 text-accent">
                  Contact
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1">📍</span>
                    <span>123 NGO Lane, NGO Hub, New Delhi, India</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span>📞</span>
                    <span>+91 98765 43210</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span>✉️</span>
                    <span>info@ramanifoundation.org</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Ramani Foundation. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/privacy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}