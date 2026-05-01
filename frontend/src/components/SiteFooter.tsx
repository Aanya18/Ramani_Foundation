import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/ramani-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-gradient-soft">
      <div className="container-page py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Ramani Foundation" className="h-12 w-12" />
            <div>
              <div className="font-display font-bold tracking-tight">RAMANI</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">FOUNDATION</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Transforming lives through education, empowerment, and sustainable community
            development.
          </p>
          <div className="flex gap-2 mt-5">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="size-9 grid place-items-center rounded-full bg-card border border-border hover:bg-gradient-brand hover:text-white hover:border-transparent transition-all"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-foreground">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-foreground">
                Events
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-foreground">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Get Involved</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/donate" className="hover:text-foreground">
                Donate
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Volunteer
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Partner with Us
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-foreground">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-4">Reach Us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="size-4 mt-0.5 shrink-0 text-[var(--brand-orange)]" /> Udaipur,
              Rajasthan, India
            </li>
            <li className="flex gap-2">
              <Mail className="size-4 mt-0.5 shrink-0 text-[var(--brand-orange)]" />{" "}
              contact@ramanifoundation.org
            </li>
            <li className="flex gap-2">
              <Phone className="size-4 mt-0.5 shrink-0 text-[var(--brand-orange)]" /> +91 00000
              00000
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Ramani Foundation. All rights reserved.</div>
          <div>Made with care for the communities we serve.</div>
        </div>
      </div>
    </footer>
  );
}
