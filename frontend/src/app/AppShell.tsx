import { Outlet } from "react-router-dom";
import { SiteHeader } from "../components/layout/SiteHeader";
import { SiteFooter } from "../components/layout/SiteFooter";
import { MobileDonateBar } from "../components/layout/MobileDonateBar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-hero-glow">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <MobileDonateBar />
    </div>
  );
}
