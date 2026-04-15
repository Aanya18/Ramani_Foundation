"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    fetchGallery();
    fetchEvents();
  }, []);

  const fetchGallery = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setItems(await res.json());
  };

  const fetchEvents = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/events`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setEvents(await res.json());
  };

  const handleEdit = (item: any) => {
    setIsAdding(true);
    setEditingId(item.id);
    setTitle(item.title);
    setEventId(item.event_id || "");
    setImage(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchGallery();
    } else {
      alert("Failed to delete image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !image) return alert("Image is required");

    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("title", title);
    if (eventId) formData.append("event_id", eventId);
    if (image) formData.append("image", image);

    const url = editingId
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/gallery/${editingId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setIsAdding(false);
      setEditingId(null);
      setTitle(""); setImage(null); setEventId("");
      fetchGallery();
    } else {
      alert(editingId ? "Failed to update image" : "Failed to add image");
    }
  };

  const toggleForm = () => {
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setTitle(""); setImage(null); setEventId("");
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Gallery</h1>
        <Button onClick={toggleForm}>{isAdding ? "Cancel" : "Add Image"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div>
            <Label>Title/Caption</Label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Associated Event (Optional)</Label>
            <select
              value={eventId}
              onChange={e => setEventId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">None</option>
              {events.map((evt: any) => (
                <option key={evt.id} value={evt.id}>{evt.title}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Image {editingId ? "(Optional: leave blank to keep current image)" : ""}</Label>
            <Input type="file" required={!editingId} onChange={e => setImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit">{editingId ? "Update Image" : "Upload Image"}</Button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-2 flex flex-col justify-between group relative overflow-hidden">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`http://localhost:8000${item.image_url}`} alt={item.title} className="w-full h-32 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105" />
              <p className="font-publicSans text-sm truncate font-medium mb-1">{item.title}</p>
              {item.event_title && (
                 <p className="font-publicSans text-xs text-gray-500 truncate mb-2">Event: {item.event_title}</p>
              )}
            </div>
            <div className="flex justify-between items-center mt-2 border-t pt-2 border-border">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-primary h-8 px-2">Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive hover:bg-destructive hover:text-white h-8 px-2">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
