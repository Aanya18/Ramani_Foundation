"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/api";

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/donations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setDonations(await res.json());
  };

  const handleVerify = async (id: number) => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/donations/${id}/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchDonations();
    } else {
      alert("Failed to verify donation");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-manrope font-bold text-primary mb-8">Verify Donations</h1>
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans text-sm">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Donor Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Proof</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation: { id: number; donor_name: string; email: string; amount: string; proof_image_url: string; verified: boolean }) => (
              <tr key={donation.id} className="border-b border-border last:border-0">
                <td className="p-4">{donation.donor_name}</td>
                <td className="p-4">{donation.email}</td>
                <td className="p-4">{donation.amount}</td>
                <td className="p-4">
                  <a href={mediaUrl(donation.proof_image_url)} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    View Proof
                  </a>
                </td>
                <td className="p-4">
                  {donation.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  {!donation.verified && (
                    <Button size="sm" onClick={() => handleVerify(donation.id)}>Verify</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
