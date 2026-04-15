import type { Metadata } from "next";
import { Manrope, Public_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
      <body className={`${manrope.variable} ${publicSans.variable} font-publicSans bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        {/* Top bar for extra trust info */}
        <div className="bg-primary-foreground/5 py-2 hidden md:block border-b border-primary/10">
          <div className="container mx-auto flex justify-end items-center text-sm font-publicSans text-primary px-4 lg:px-8 space-x-6">
            <span>📞 +91 98765 43210</span>
            <span>✉️ info@ramanifoundation.org</span>
          </div>
        </div>

        <header className="bg-white text-primary shadow-sm sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center px-4 lg:px-8 py-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Ramani Foundation Logo" width={48} height={48} className="rounded-full object-cover border border-primary/10" />
              <div className="flex flex-col">
                <span className="font-manrope text-2xl font-extrabold tracking-tight">Ramani Foundation</span>
                <span className="text-xs font-publicSans text-secondary font-medium tracking-wide uppercase">Empowering Lives</span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center space-x-8 font-publicSans font-medium">
              <Link href="/" className="hover:text-accent transition-colors">Home</Link>
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/events" className="hover:text-accent transition-colors">Events</Link>
              <Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link>
              <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
            </nav>
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/donate" className="bg-accent text-white px-6 py-2.5 rounded-full font-bold hover:bg-accent/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Donate Now
              </Link>
            </div>
            {/* Mobile Nav could be added here */}
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#1A2521] text-white pt-16 pb-8 mt-auto">
          <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 font-publicSans">
            <div className="md:col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                 <Image src="/logo.jpg" alt="Ramani Foundation Logo" width={40} height={40} className="rounded-full object-cover bg-white" />
                 <h3 className="font-manrope text-2xl font-bold tracking-tight">Ramani Foundation</h3>
              </div>
              <p className="text-base text-gray-300 leading-relaxed mb-6 max-w-md">
                We are a non-profit organization dedicated to empowering underprivileged communities across India through education, sustainable livelihoods, and healthcare access.
              </p>
            </div>

            <div>
              <h3 className="font-manrope text-xl font-bold mb-6 text-accent">Quick Links</h3>
              <ul className="space-y-3 text-base text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Upcoming Events</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Our Impact Gallery</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-manrope text-xl font-bold mb-6 text-accent">Get in Touch</h3>
              <ul className="space-y-3 text-base text-gray-300">
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

          <div className="container mx-auto px-4 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Ramani Foundation. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
