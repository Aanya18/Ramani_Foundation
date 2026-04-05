"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setEvents(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    if (image) formData.append("image", image);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setIsAdding(false);
      // Reset form
      setTitle(""); setDescription(""); setDate(""); setLocation(""); setImage(null);
      fetchEvents();
    } else {
      alert("Failed to add event");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Events</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? "Cancel" : "Add Event"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div>
            <Label>Title</Label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea required value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date (YYYY-MM-DD)</Label>
              <Input required value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input required value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Image (Optional)</Label>
            <Input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit">Save Event</Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: { id: number; title: string; date: string; location: string }) => (
              <tr key={event.id} className="border-b border-border last:border-0">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.date}</td>
                <td className="p-4">{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
