import { Link } from "react-router-dom";
import { brandMeta } from "../../data/siteContent";
import { useApiData } from "../../hooks/useApiData";
import type { PublicSettings } from "../../types/api";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { BrandMark } from "./BrandMark";

const footerLinks = [
  { label: "About Us", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Impact", to: "/impact" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Partner", to: "/partner" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/legal/privacy" },
];

export function SiteFooter() {
  const { data } = useApiData<PublicSettings | null>("/settings/public", null);

  return (
    <footer className="mt-16 border-t border-trust-100 bg-white/80">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <BrandMark />
          <h3 className="mt-6 font-display text-3xl text-ink">
            Community-rooted support with clear intent, visible impact, and a human-first public presence.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink/70">
            {data?.organization_name ?? brandMeta.name} works across education, women empowerment,
            skill development, and community outreach with a strong focus on trust, dignity, and
            continuity of support.
          </p>
          <div className="mt-6">
            <Button to="/donate" variant="donate">
              Support the Mission
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.22em] text-trust-700">
            Quick links
          </h4>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link className="text-sm text-ink/70 transition hover:text-trust-700" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.22em] text-trust-700">
            Connect
          </h4>
          <div className="mt-5 space-y-3 text-sm text-ink/70">
            {data?.primary_email ? <p>{data.primary_email}</p> : null}
            {data?.primary_phone ? <p>{data.primary_phone}</p> : null}
            <a className="text-link" href={brandMeta.instagramUrl} target="_blank" rel="noreferrer">
              Instagram {brandMeta.instagramHandle}
            </a>
            <p>Registered NGO | Donation-led impact | Admin-manageable public content</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
