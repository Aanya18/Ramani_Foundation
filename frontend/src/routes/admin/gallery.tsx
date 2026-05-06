import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, getImageUrl } from "@/lib/api";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  event_id?: string;
  project_id?: string;
  event_title?: string;
  project_name?: string;
  images?: Array<{
    id: string;
    image_url: string;
    image_filename: string;
    order: number;
  }>;
  created_at: string;
}

interface EventOption {
  id: string;
  title: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    images: [] as File[],
    event_id: "",
    project_id: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadItems();
    loadEvents();
    loadProjects();
  }, [navigate]);

  useEffect(() => {
    loadItems();
    loadEvents();
    loadProjects();
  }, []);

  const loadItems = async () => {
    try {
      const data = await api.getAdminGallery();
      // Sort by created_at descending
      const sorted = [...data].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setItems(sorted);
    } catch (error) {
      console.error("Failed to load gallery", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!editing && form.images.length === 0) {
      setSubmitError("Select at least one image.");
      return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await api.updateGallery(editing.id, form);
      } else {
        const [first, ...rest] = form.images;
        const created = await api.createGallery({
          title: form.title,
          event_id: form.event_id,
          project_id: form.project_id,
          image: first,
        });
        if (rest.length > 0) {
          await api.addGalleryImagesBulk(created.id, rest);
        }
      }
      loadItems();
      setIsDialogOpen(false);
      setEditing(null);
      setForm({ title: "", images: [], event_id: "", project_id: "" });
    } catch (error) {
      console.error("Failed to save gallery item", error);
      setSubmitError("Save failed. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditing(item);
    setSubmitError(null);
    setForm({
      title: item.title,
      images: [],
      event_id: item.event_id || "",
      project_id: item.project_id || "",
    });
    setIsDialogOpen(true);
  };

  const loadEvents = async () => {
    try {
      const data = await api.getAdminEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events list", error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects list", error);
    }
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
    setSubmitError(null);
    setForm({ title: "", images: [], event_id: "", project_id: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="container-page py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
        <Button onClick={openAddDialog}>
          <Plus className="size-4 mr-2" />
          Add photos
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              {getImageUrl(item.image_url) ? (
                <img
                  src={getImageUrl(item.image_url) as string}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 rounded bg-muted" />
              )}
              <CardTitle>{item.title}</CardTitle>
              {item.project_name && (
                <p className="text-sm text-muted-foreground">Project: {item.project_name}</p>
              )}
              {item.event_title && (
                <p className="text-sm text-muted-foreground">Event: {item.event_title}</p>
              )}
              {item.images && item.images.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {item.images.length} image{item.images.length === 1 ? "" : "s"}
                </p>
              )}
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
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open && isSaving) return;
          setIsDialogOpen(open);
        }}
      >
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
                disabled={isSaving}
              />
            </div>
            <div>
              <Label htmlFor="images">
                {editing ? "Add more images (optional)" : "Images"}
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setForm({
                    ...form,
                    images: e.target.files?.length ? Array.from(e.target.files) : [],
                  })
                }
                required={!editing}
                disabled={isSaving}
              />
              {form.images.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {form.images.length} file{form.images.length === 1 ? "" : "s"} selected
                </p>
              )}
              {editing && (
                <p className="text-sm text-muted-foreground mt-1">
                  New uploads are added to this album without removing existing photos.
                </p>
              )}
            </div>
            {submitError && <p className="text-sm text-destructive">{submitError}</p>}
            <div>
              <Label htmlFor="event_id">Event (optional)</Label>
              <select
                id="event_id"
                value={form.event_id}
                onChange={(e) => setForm({ ...form, event_id: e.target.value })}
                disabled={isSaving}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              >
                <option value="">No event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="project_id">Project (optional)</Label>
              <select
                id="project_id"
                value={form.project_id}
                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                disabled={isSaving}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={isSaving} className="min-w-[9rem]">
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {editing
                    ? form.images.length > 0
                      ? "Uploading…"
                      : "Saving…"
                    : "Uploading…"}
                </>
              ) : editing ? (
                "Update"
              ) : (
                "Add"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
