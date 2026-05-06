"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

import logo from "@/assets/ramani-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container-page flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <img src={logo.src} alt="Ramani Foundation" className="h-11 w-11 object-contain" />
          <div className="leading-tight">
            <div className="font-display font-bold text-lg tracking-tight">RAMANI</div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">FOUNDATION</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                  active && "text-foreground bg-muted",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden sm:inline-flex rounded-full bg-gradient-brand text-white border-0 hover:opacity-90"
          >
            <Link href="/donate">
              <Heart className="size-4" /> Donate
            </Link>
          </Button>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-3 flex flex-col">
            {nav.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-2 py-3 text-sm font-medium text-muted-foreground",
                    active && "text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 rounded-full bg-gradient-brand text-white border-0">
              <Link href="/donate" onClick={() => setOpen(false)}>
                Donate
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
