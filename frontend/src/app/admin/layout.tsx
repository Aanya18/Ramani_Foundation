"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("admin_token");
    if (!token && pathname !== "/admin") {
      router.push("/admin");
    } else if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-publicSans">Loading...</div>;
  }

  if (!isAuthenticated && pathname === "/admin") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-manrope font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-publicSans">
          <Link href="/admin/dashboard" className={`block px-4 py-2 rounded-md ${pathname === "/admin/dashboard" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Dashboard
          </Link>
          <Link href="/admin/events" className={`block px-4 py-2 rounded-md ${pathname === "/admin/events" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Manage Events
          </Link>
          <Link href="/admin/team" className={`block px-4 py-2 rounded-md ${pathname === "/admin/team" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Manage Team
          </Link>
          <Link href="/admin/testimonials" className={`block px-4 py-2 rounded-md ${pathname === "/admin/testimonials" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Manage Testimonials
          </Link>
          <Link href="/admin/articles" className={`block px-4 py-2 rounded-md ${pathname === "/admin/articles" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Manage News
          </Link>
          <Link href="/admin/gallery" className={`block px-4 py-2 rounded-md ${pathname === "/admin/gallery" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Manage Gallery
          </Link>
          <Link href="/admin/leads" className={`block px-4 py-2 rounded-md ${pathname === "/admin/leads" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            View Leads
          </Link>
          <Link href="/admin/donations" className={`block px-4 py-2 rounded-md ${pathname === "/admin/donations" ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
            Verify Donations
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              Cookies.remove("admin_token");
              router.push("/admin");
            }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
