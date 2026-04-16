"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    leads: 0,
    donations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get("admin_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [events, gallery, leads, donations] = await Promise.all([
          fetch(`${API_URL}/admin/events`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/gallery`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/leads`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/admin/donations`, { headers }).then(r => r.json())
        ]);

        setStats({
          events: Array.isArray(events) ? events.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          leads: Array.isArray(leads) ? leads.length : 0,
          donations: Array.isArray(donations) ? donations.length : 0
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-primary mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-manrope text-gray-500 mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-primary">{stats.events}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-manrope text-gray-500 mb-2">Gallery Images</h3>
          <p className="text-3xl font-bold text-primary">{stats.gallery}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-manrope text-gray-500 mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-primary">{stats.leads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-lg font-manrope text-gray-500 mb-2">Donations Logged</h3>
          <p className="text-3xl font-bold text-primary">{stats.donations}</p>
        </div>
      </div>
    </div>
  );
}
