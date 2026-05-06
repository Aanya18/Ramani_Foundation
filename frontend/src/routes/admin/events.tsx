import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api, getImageUrl } from "@/lib/api";
import { Plus, Edit, Ticket, Trash } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  project_id?: string | null;
  image_url?: string;
}

interface Project {
  id: string;
  name: string;
}

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    project_id: "",
    image: null as File | null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadEvents();
    loadProjects();
  }, [navigate]);

  useEffect(() => {
    loadEvents();
    loadProjects();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getAdminEvents();
      // Sort by date descending
      const sorted = [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setEvents(sorted);
    } catch (error) {
      console.error("Failed to load events", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editing) {
        await api.updateEvent(editing.id, form);
        toast.success("Event updated successfully");
      } else {
        await api.createEvent(form);
        toast.success("Event created successfully");
      }
      loadEvents();
      setIsDialogOpen(false);
      setEditing(null);
      setForm({ title: "", description: "", date: "", location: "", project_id: "", image: null });
    } catch (error) {
      console.error("Failed to save event", error);
      toast.error("Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditing(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      project_id: event.project_id || "",
      image: null,
    });
    setIsDialogOpen(true);
  };

  const loadProjects = async () => {
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await api.deleteEvent(id);
        loadEvents();
      } catch (error) {
        console.error("Failed to delete event", error);
      }
    }
  };

  const openAddDialog = () => {
    setEditing(null);
    setForm({ title: "", description: "", date: "", location: "", project_id: "", image: null });
    setIsDialogOpen(true);
  };

  return (
    <div className="container-page py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button onClick={openAddDialog}>
          <Plus className="size-4 mr-2" />
          Add Event
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {event.image_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={getImageUrl(event.image_url) ?? ""}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p>{event.description}</p>
              <p>
                {event.date} - {event.location}
              </p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(event)}>
                  <Edit className="size-4" />
                </Button>
                <Link to="/admin/rsvps">
                  <Button size="sm" variant="outline">
                    <Ticket className="size-4" />
                  </Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
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
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="project_id">Project (optional)</Label>
              <select
                id="project_id"
                value={form.project_id}
                onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editing ? "Update" : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
