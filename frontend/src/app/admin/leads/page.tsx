"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = Cookies.get("admin_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setLeads(await res.json());
    };
    fetchLeads();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-primary mb-8">Leads & Inquiries</h1>
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: { id: number; type: string; name: string; email: string; phone: string | null; message: string; created_at: string }) => (
              <tr key={lead.id} className="border-b border-border last:border-0">
                <td className="p-4 capitalize">
                  <span className={`px-2 py-1 rounded text-xs ${lead.type === 'volunteer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {lead.type}
                  </span>
                </td>
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.email}</td>
                <td className="p-4">{lead.phone || '-'}</td>
                <td className="p-4 max-w-xs truncate" title={lead.message}>{lead.message}</td>
                <td className="p-4">{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
