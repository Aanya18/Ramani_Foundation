const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

type JsonRecord = Record<string, unknown>;

type EventRequestData = {
  title: string;
  description: string;
  date: string;
  location: string;
  project_id?: string;
  image?: File | null;
};

type GalleryRequestData = {
  title: string;
  event_id?: string;
  project_id?: string;
  image?: File | null;
  images?: File[];
};

type DonationRequestData = {
  donor_name: string;
  email: string;
  amount: string;
  proof_image: File | null;
};

export function getImageUrl(path: string | undefined | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  // Handle case where path already includes /api/v1 (e.g. from backend response)
  if (path.startsWith("/api/v1")) {
    const origin = API_BASE_URL.split("/api/v1")[0];
    return `${origin}${path}`;
  }

  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {};

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export const api = {
  // Public endpoints
  getEvents: () => apiRequest("/public/events/"),
  submitEventRsvp: (eventId: string, data: JsonRecord) =>
    apiRequest(`/public/events/${eventId}/rsvp`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getGallery: () => apiRequest("/public/gallery/"),
  getDonations: () => apiRequest("/public/donations/"),
  getLeads: () => apiRequest("/public/leads/"),
  getProjects: () => apiRequest("/public/projects/"),
  getPublicSettings: () => apiRequest("/public/settings/"),
  submitContact: (data: JsonRecord) =>
    apiRequest("/public/leads/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Admin endpoints
  getAdminProjects: () => apiRequest("/admin/projects/"),
  createProject: (data: JsonRecord) =>
    apiRequest("/admin/projects/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: JsonRecord) =>
    apiRequest(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) => apiRequest(`/admin/projects/${id}`, { method: "DELETE" }),
  getContactSubmissions: () => apiRequest("/admin/leads/contact-submissions"),
  getAdminEvents: () => apiRequest("/admin/events/"),
  getEventRsvps: (eventId: string) => apiRequest(`/admin/event-rsvps/event/${eventId}`),
  getEventRsvpStats: (eventId: string) => apiRequest(`/admin/event-rsvps/event/${eventId}/stats`),
  createEvent: (data: EventRequestData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("location", data.location);
    if (data.project_id) formData.append("project_id", data.project_id);
    if (data.image) formData.append("image", data.image);
    return apiRequest("/admin/events/", { method: "POST", body: formData });
  },
  updateEvent: (id: string, data: EventRequestData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("location", data.location);
    if (data.project_id !== undefined) formData.append("project_id", data.project_id);
    if (data.image) formData.append("image", data.image);
    return apiRequest(`/admin/events/${id}`, { method: "PUT", body: formData });
  },
  deleteEvent: (id: string) => apiRequest(`/admin/events/${id}`, { method: "DELETE" }),
  getAdminGallery: () => apiRequest("/admin/gallery/"),
  createGallery: async (data: GalleryRequestData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.event_id) formData.append("event_id", data.event_id);
    if (data.project_id) formData.append("project_id", data.project_id);
    if (data.image) formData.append("image", data.image);
    return apiRequest("/admin/gallery/", { method: "POST", body: formData });
  },
  /** Append one or more images to an existing gallery item (multipart field name: images). */
  addGalleryImagesBulk: (itemId: string, files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }
    return apiRequest(`/admin/gallery/${itemId}/images/bulk`, { method: "POST", body: formData });
  },
  updateGallery: async (id: string, data: GalleryRequestData) => {
    const itemFormData = new FormData();
    itemFormData.append("title", data.title);
    if (data.event_id) itemFormData.append("event_id", data.event_id);
    if (data.project_id !== undefined) itemFormData.append("project_id", data.project_id);

    const updatedItem = await apiRequest(`/admin/gallery/${id}`, {
      method: "PUT",
      body: itemFormData,
    });

    if (data.images?.length) {
      await api.addGalleryImagesBulk(id, data.images);
    }

    return updatedItem;
  },
  deleteGallery: (id: string) => apiRequest(`/admin/gallery/${id}`, { method: "DELETE" }),
  getAdminDonations: () => apiRequest("/admin/donations/"),
  createDonation: (data: DonationRequestData) => {
    const formData = new FormData();
    formData.append("donor_name", data.donor_name);
    formData.append("email", data.email);
    formData.append("amount", data.amount);
    if (data.proof_image) {
      formData.append("proof_image", data.proof_image);
    }
    return apiRequest("/admin/donations/", { method: "POST", body: formData });
  },
  verifyDonation: (id: string) => apiRequest(`/admin/donations/${id}/verify`, { method: "POST" }),
  // Add more admin endpoints as needed
};
