"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type DashboardStats = {
  events: number;
  gallery: number;
  leads: number;
  donations: number;
  pendingDonations: number;
  team: number;
  testimonials: number;
  articles: number;
};

const initialStats: DashboardStats = {
  events: 0,
  gallery: 0,
  leads: 0,
  donations: 0,
  pendingDonations: 0,
  team: 0,
  testimonials: 0,
  articles: 0
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get("admin_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const statsEndpoints = [
        { key: "events", path: "/admin/events" },
        { key: "gallery", path: "/admin/gallery" },
        { key: "leads", path: "/admin/leads" },
        { key: "donations", path: "/admin/donations" },
        { key: "team", path: "/admin/team" },
        { key: "testimonials", path: "/admin/testimonials" },
        { key: "articles", path: "/admin/articles" }
      ] as const;

      try {
        const results = await Promise.allSettled(
          statsEndpoints.map(async ({ path }) => {
            const response = await fetch(`${API_URL}${path}`, { headers });
            if (!response.ok) {
              throw new Error(`Failed to fetch ${path}`);
            }
            return response.json();
          })
        );

        const nextStats: DashboardStats = { ...initialStats };
        const failures: string[] = [];

        results.forEach((result, index) => {
          const endpoint = statsEndpoints[index];
          if (result.status === "fulfilled") {
            const data = result.value;
            if (Array.isArray(data)) {
              if (endpoint.key === "donations") {
                nextStats.donations = data.length;
                nextStats.pendingDonations = data.filter(
                  (donation: { verified?: boolean }) => !donation.verified
                ).length;
              } else {
                nextStats[endpoint.key] = data.length;
              }
            }
          } else {
            failures.push(endpoint.path);
          }
        });

        setStats(nextStats);
        if (failures.length > 0) {
          setErrorMessage(`Some sections could not load: ${failures.join(", ")}`);
        } else {
          setErrorMessage("");
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setErrorMessage("Unable to load dashboard stats right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-primary mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 font-publicSans mb-8">All important admin sections are visible here.</p>

      {errorMessage && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 font-publicSans text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard title="Total Events" value={stats.events} href="/admin/events" />
        <DashboardCard title="Gallery Images" value={stats.gallery} href="/admin/gallery" />
        <DashboardCard title="Total Leads" value={stats.leads} href="/admin/leads" />
        <DashboardCard title="Donations Logged" value={stats.donations} href="/admin/donations" />
        <DashboardCard title="Pending Donations" value={stats.pendingDonations} href="/admin/donations" />
        <DashboardCard title="Team Members" value={stats.team} href="/admin/team" />
        <DashboardCard title="Testimonials" value={stats.testimonials} href="/admin/testimonials" />
        <DashboardCard title="News Articles" value={stats.articles} href="/admin/articles" />
      </div>

      {isLoading && (
        <p className="mt-6 text-sm text-gray-600 font-publicSans">Loading latest dashboard stats...</p>
      )}
    </div>
  );
}

function DashboardCard({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-manrope text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-primary">{value}</p>
    </Link>
  );
}
