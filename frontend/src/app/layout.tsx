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
      <body className={`${manrope.variable} ${publicSans.variable} font-publicSans antialiased min-h-screen flex flex-col`}>
        <header className="bg-primary text-white p-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Ramani Foundation Logo" width={40} height={40} className="rounded-full object-cover bg-white" />
              <span className="font-manrope text-2xl font-bold">Ramani Foundation</span>
            </Link>
            <nav className="space-x-4 hidden md:flex items-center font-publicSans">
              <Link href="/" className="hover:text-accent">Home</Link>
              <Link href="/about" className="hover:text-accent">About</Link>
              <Link href="/initiatives" className="hover:text-accent">Initiatives</Link>
              <Link href="/events" className="hover:text-accent">Events</Link>
              <Link href="/gallery" className="hover:text-accent">Gallery</Link>
              <Link href="/stories" className="hover:text-accent">Stories</Link>
              <Link href="/contact" className="hover:text-accent">Contact</Link>
              <Link href="/donate" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">Donate</Link>
            </nav>
            {/* Mobile Nav could be added here using a Sheet */}
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-primary text-white p-8 mt-auto">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 font-publicSans">
            <div>
              <div className="flex items-center gap-2 mb-4">
                 <Image src="/logo.jpg" alt="Ramani Foundation Logo" width={32} height={32} className="rounded-full object-cover bg-white" />
                 <h3 className="font-manrope text-xl font-bold">Ramani Foundation</h3>
              </div>
              <p className="text-sm opacity-80">Empowering communities through education, health, and sustainable initiatives.</p>
            </div>
            <div>
              <h3 className="font-manrope text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-accent">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
                <li><Link href="/admin" className="hover:text-accent">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-manrope text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-sm opacity-80">info@ramanifoundation.org</p>
              <p className="text-sm opacity-80">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="container mx-auto mt-8 pt-8 border-t border-white/20 text-center text-sm opacity-80">
            &copy; {new Date().getFullYear()} Ramani Foundation. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
