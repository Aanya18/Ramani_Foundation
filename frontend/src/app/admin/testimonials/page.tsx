"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL, type Testimonial } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/testimonials`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setTestimonials(await res.json());
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setIsAdding(true);
    setEditingId(String(testimonial.id));
    setName(testimonial.name);
    setRole(testimonial.role ?? "");
    setContent(testimonial.content);
    setRating(String(testimonial.rating));
    setImage(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const token = Cookies.get("admin_token");
    const res = await fetch(`${API_URL}/admin/testimonials/${String(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchTestimonials();
    } else {
      alert("Failed to delete testimonial");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("role", role);
    formData.append("content", content);
    formData.append("rating", rating);
    if (image) formData.append("image", image);

    const url = editingId
      ? `${API_URL}/admin/testimonials/${editingId}`
      : `${API_URL}/admin/testimonials`;

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
      setName(""); setRole(""); setContent(""); setRating("5"); setImage(null);
      fetchTestimonials();
    } else {
      alert(editingId ? "Failed to update testimonial" : "Failed to add testimonial");
    }
  };

  const toggleForm = () => {
    if (isAdding) {
      setIsAdding(false);
      setEditingId(null);
      setName(""); setRole(""); setContent(""); setRating("5"); setImage(null);
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Testimonials</h1>
        <Button onClick={toggleForm}>{isAdding ? "Cancel" : "Add Testimonial"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <Label>Role (Optional)</Label>
              <Input value={role} onChange={e => setRole(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea required value={content} onChange={e => setContent(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" required value={rating} onChange={e => setRating(e.target.value)} />
            </div>
            <div>
              <Label>Image (Optional)</Label>
              <Input type="file" onChange={e => setImage(e.target.files?.[0] || null)} />
            </div>
          </div>
          <Button type="submit">{editingId ? "Update Testimonial" : "Save Testimonial"}</Button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left font-publicSans">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="p-4">{testimonial.name}</td>
                <td className="p-4">{testimonial.rating} / 5</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(testimonial.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
