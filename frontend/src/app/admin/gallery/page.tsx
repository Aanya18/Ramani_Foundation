"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const token = Cookies.get("admin_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setItems(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Image is required");

    const token = Cookies.get("admin_token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/gallery`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      setIsAdding(false);
      setTitle(""); setImage(null);
      fetchGallery();
    } else {
      alert("Failed to add image");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-manrope font-bold text-primary">Manage Gallery</h1>
        <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? "Cancel" : "Add Image"}</Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-border mb-8 space-y-4 font-publicSans">
          <div>
            <Label>Title/Caption</Label>
            <Input required value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" required onChange={e => setImage(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit">Upload Image</Button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item: { id: number; title: string; image_url: string }) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`http://localhost:8000${item.image_url}`} alt={item.title} className="w-full h-32 object-cover rounded mb-2" />
            <p className="font-publicSans text-sm truncate">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
