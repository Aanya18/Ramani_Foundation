import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Image, MessageSquare, Heart } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined' || !localStorage.getItem("token")) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    window.location.href = "/";
  };

  return (
    <div className="container-page py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5" />
              Events
            </CardTitle>
            <CardDescription>Manage upcoming and recent events</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/events">
              <Button className="w-full">Manage Events</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="size-5" />
              Gallery
            </CardTitle>
            <CardDescription>Manage gallery images</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/gallery">
              <Button className="w-full">Manage Gallery</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5" />
              Leads
            </CardTitle>
            <CardDescription>Manage contact leads</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/leads">
              <Button className="w-full">Manage Leads</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-5" />
              Donations
            </CardTitle>
            <CardDescription>View donations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/donations">
              <Button className="w-full">View Donations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
