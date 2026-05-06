import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  events_count: number;
  gallery_items_count: number;
  created_at: string;
}

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects", error);
      toast.error("Failed to load projects");
    }
  };

  const openAddDialog = () => {
    setEditing(null);
    setForm({ name: "", description: "", status: "active" });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editing) {
        await api.updateProject(editing.id, form);
        toast.success("Project updated");
      } else {
        await api.createProject(form);
        toast.success("Project created");
      }
      await loadProjects();
      setIsDialogOpen(false);
      setEditing(null);
      setForm({ name: "", description: "", status: "active" });
    } catch (error) {
      console.error("Failed to save project", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? Related events and gallery items may also be affected.")) {
      return;
    }

    try {
      await api.deleteProject(id);
      await loadProjects();
      toast.success("Project deleted");
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, and archive foundation projects.
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="size-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {project.description}
              </p>
              <div className="grid grid-cols-2 gap-3 py-4 text-sm">
                <div className="rounded-md border border-border p-3">
                  <div className="font-semibold">{project.events_count}</div>
                  <div className="text-muted-foreground">Events</div>
                </div>
                <div className="rounded-md border border-border p-3">
                  <div className="font-semibold">{project.gallery_items_count}</div>
                  <div className="text-muted-foreground">Gallery</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(project)}>
                  <Edit className="size-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
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
            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
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
