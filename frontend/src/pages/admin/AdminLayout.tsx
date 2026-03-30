import { NavLink, Outlet } from "react-router-dom";

const items = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Content", to: "/admin/content" },
  { label: "Blogs", to: "/admin/blogs" },
  { label: "Programs", to: "/admin/programs" },
  { label: "Events", to: "/admin/events" },
  { label: "Stories", to: "/admin/stories" },
  { label: "Gallery", to: "/admin/gallery" },
  { label: "Donations", to: "/admin/donations" },
  { label: "Donors", to: "/admin/donors" },
  { label: "Contacts", to: "/admin/contacts" },
  { label: "Volunteers", to: "/admin/volunteers" },
  { label: "Reports", to: "/admin/reports" },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f2f5f6] text-ink">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-trust-100 bg-trust-900 px-6 py-8 text-white">
          <p className="font-display text-2xl">Ramani Admin</p>
          <p className="mt-2 text-sm text-white/70">Designed for non-technical NGO teams</p>
          <nav className="mt-8 space-y-2">
            {items.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="p-6 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
