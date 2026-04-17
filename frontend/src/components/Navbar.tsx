// components/Navbar.tsx (Client Component)
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (isMobileMenuOpen && event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white text-foreground shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Ramani Foundation Logo"
              width={48}
              height={48}
              className="rounded-full object-cover border border-primary/10 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-manrope text-xl md:text-2xl font-extrabold tracking-tight">
                Ramani Foundation
              </span>
              <span className="text-[10px] md:text-xs font-publicSans text-secondary font-semibold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                Empowering Lives
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-primary/5 ${
                    active
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Donate Button + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/donate"
              className={`hidden md:inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 focus-visible:ring-4 focus-visible:ring-primary/30 ${
                isActive("/donate")
                  ? "bg-primary/80 ring-2 ring-primary/40"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              Donate Now
            </Link>

            {/* Mobile menu button */}
            <button
              ref={buttonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:border-primary hover:text-primary"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              Menu
              <span className="ml-2 text-xl leading-none transition-transform duration-200">
                {isMobileMenuOpen ? "✕" : "≡"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu with animation */}
        <div
          ref={menuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-[500px] opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2 border-t border-slate-100">
                <Link
                  href="/donate"
                  className={`block rounded-full px-4 py-3 text-center font-semibold transition-all duration-200 ${
                    isActive("/donate")
                      ? "bg-primary/80 text-white"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}