"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
    const res = await fetch(`${API_URL}/admin/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setEvents(await res.json());
    }
  };

  const handleEdit = (event: { id: string; title: string; description: string; date: string; location: string }) => {
    setIsAdding(true);
    setEditingId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setLocation(event.location);
    setImage(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchEvents();
    } else {
      alert("Failed to delete event");
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

    const url = editingId
      ? `${API_URL}/admin/events/${editingId}`
      : `${API_URL}/admin/events`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      // Reset form
      setTitle(""); setDescription(""); setDate(""); setLocation(""); setImage(null);
      fetchEvents();
    } else {
      alert(editingId ? "Failed to update event" : "Failed to add event");
    }
  };

  const toggleForm = () => {
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setTitle(""); setDescription(""); setDate(""); setLocation(""); setImage(null);
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Events</h1>
        <Button onClick={toggleForm}>{isAdding ? "Cancel" : "Add Event"}</Button>
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
          <Button type="submit">{editingId ? "Update Event" : "Save Event"}</Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: any) => (
              <tr key={event.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="p-4">{event.title}</td>
                <td className="p-4">{event.date}</td>
                <td className="p-4">{event.location}</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
