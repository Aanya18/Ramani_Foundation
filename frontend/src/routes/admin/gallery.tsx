import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Plus, Edit, Trash } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  event_id?: string;
  event_title?: string;
  created_at: string;
}

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", image: null as File | null, event_id: "" });

  useEffect(() => {
    if (typeof window === 'undefined' || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadItems();
  }, [navigate]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await api.getAdminGallery();
      setItems(data);
    } catch (error) {
      console.error("Failed to load gallery", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.updateGallery(editing.id, form);
      } else {
        await api.createGallery(form);
      }
      loadItems();
      setIsDialogOpen(false);
      setEditing(null);
      setForm({ title: "", image: null, event_id: "" });
    } catch (error) {
      console.error("Failed to save gallery item", error);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditing(item);
    setForm({ title: item.title, image: null, event_id: item.event_id || "" });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await api.deleteGallery(id);
        loadItems();
      } catch (error) {
        console.error("Failed to delete gallery item", error);
      }
    }
  };

  const openAddDialog = () => {
    setEditing(null);
    setForm({ title: "", image: null, event_id: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="container-page py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
        <Button onClick={openAddDialog}>
          <Plus className="size-4 mr-2" />
          Add Image
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover rounded"
              />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="size-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Gallery Item" : "Add Gallery Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                required={!editing}
              />
            </div>
            <div>
              <Label htmlFor="event_id">Event ID (optional)</Label>
              <Input
                id="event_id"
                value={form.event_id}
                onChange={(e) => setForm({ ...form, event_id: e.target.value })}
              />
            </div>
            <Button type="submit">{editing ? "Update" : "Add"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
