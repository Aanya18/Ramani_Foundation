import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navigation } from "../../data/siteContent";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { BrandMark } from "./BrandMark";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-ivory/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link className="flex items-center gap-3" to="/">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/70 p-2 shadow-panel lg:flex">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-trust-50 text-trust-700"
                    : "text-ink/75 hover:bg-trust-50 hover:text-trust-700"
                }`
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/donate" variant="donate">
            Donate Now
          </Button>
        </div>

        <button
          aria-expanded={open}
          className="rounded-full border border-trust-100 px-4 py-2 text-sm font-semibold text-trust-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          Menu
        </button>
      </Container>

      {open ? (
        <div className="border-t border-white/50 bg-white/95 lg:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {navigation.map((item) => (
              <NavLink
                className="text-sm font-semibold text-ink/75"
                key={item.to}
                onClick={() => setOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <Button className="w-full" to="/donate" variant="donate">
              Donate Now
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
