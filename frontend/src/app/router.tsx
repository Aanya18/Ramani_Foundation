import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { HomePage } from "../pages/public/HomePage";
import { AboutPage } from "../pages/public/AboutPage";
import { ProgramsPage } from "../pages/public/ProgramsPage";
import { ImpactPage } from "../pages/public/ImpactPage";
import { StoriesPage } from "../pages/public/StoriesPage";
import { EventsPage } from "../pages/public/EventsPage";
import { BlogPage } from "../pages/public/BlogPage";
import { GalleryPage } from "../pages/public/GalleryPage";
import { VolunteerPage } from "../pages/public/VolunteerPage";
import { DonatePage } from "../pages/public/DonatePage";
import { ContactPage } from "../pages/public/ContactPage";
import { PartnerPage } from "../pages/public/PartnerPage";
import { LegalPage } from "../pages/public/LegalPage";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminContentPage } from "../pages/admin/AdminContentPage";
import { AdminBlogsPage } from "../pages/admin/AdminBlogsPage";
import { AdminProgramsPage } from "../pages/admin/AdminProgramsPage";
import { AdminEventsPage } from "../pages/admin/AdminEventsPage";
import { AdminStoriesPage } from "../pages/admin/AdminStoriesPage";
import { AdminGalleryPage } from "../pages/admin/AdminGalleryPage";
import { AdminDonationsPage } from "../pages/admin/AdminDonationsPage";
import { AdminDonorsPage } from "../pages/admin/AdminDonorsPage";
import { AdminContactsPage } from "../pages/admin/AdminContactsPage";
import { AdminReportsPage } from "../pages/admin/AdminReportsPage";
import { AdminVolunteersPage } from "../pages/admin/AdminVolunteersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "programs", element: <ProgramsPage /> },
      { path: "impact", element: <ImpactPage /> },
      { path: "stories", element: <StoriesPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "volunteer", element: <VolunteerPage /> },
      { path: "donate", element: <DonatePage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "partner", element: <PartnerPage /> },
      { path: "legal/:slug", element: <LegalPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "content", element: <AdminContentPage /> },
      { path: "blogs", element: <AdminBlogsPage /> },
      { path: "programs", element: <AdminProgramsPage /> },
      { path: "events", element: <AdminEventsPage /> },
      { path: "stories", element: <AdminStoriesPage /> },
      { path: "gallery", element: <AdminGalleryPage /> },
      { path: "donations", element: <AdminDonationsPage /> },
      { path: "donors", element: <AdminDonorsPage /> },
      { path: "contacts", element: <AdminContactsPage /> },
      { path: "volunteers", element: <AdminVolunteersPage /> },
      { path: "reports", element: <AdminReportsPage /> },
    ],
  },
]);
