const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export function getImageUrl(path: string | undefined | null) {
  if (!path) return "";
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
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    ...options.headers,
  };
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

  return response.json();
}

export const api = {
  // Public endpoints
  getEvents: () => apiRequest("/public/events"),
  getGallery: () => apiRequest("/public/gallery"),
  getTeamMembers: () => apiRequest("/public/team-members"),
  getDonations: () => apiRequest("/public/donations"),
  getLeads: () => apiRequest("/public/leads"),
  // Admin endpoints
  getAdminEvents: () => apiRequest("/admin/events"),
  createEvent: (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("location", data.location);
    if (data.image) formData.append("image", data.image);
    return apiRequest("/admin/events", { method: "POST", body: formData });
  },
  updateEvent: (id: string, data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("location", data.location);
    if (data.image) formData.append("image", data.image);
    return apiRequest(`/admin/events/${id}`, { method: "PUT", body: formData });
  },
  deleteEvent: (id: string) => apiRequest(`/admin/events/${id}`, { method: "DELETE" }),
  getAdminGallery: () => apiRequest("/admin/gallery"),
  createGallery: (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.image) formData.append("image", data.image);
    if (data.event_id) formData.append("event_id", data.event_id);
    return apiRequest("/admin/gallery", { method: "POST", body: formData });
  },
  updateGallery: (id: string, data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.image) formData.append("image", data.image);
    if (data.event_id) formData.append("event_id", data.event_id);
    return apiRequest(`/admin/gallery/${id}`, { method: "PUT", body: formData });
  },
  deleteGallery: (id: string) => apiRequest(`/admin/gallery/${id}`, { method: "DELETE" }),
  getAdminDonations: () => apiRequest("/admin/donations"),
  createDonation: (data: any) => {
    const formData = new FormData();
    formData.append("donor_name", data.donor_name);
    formData.append("email", data.email);
    formData.append("amount", data.amount);
    formData.append("proof_image", data.proof_image);
    return apiRequest("/admin/donations", { method: "POST", body: formData });
  },
  verifyDonation: (id: string) => apiRequest(`/admin/donations/${id}/verify`, { method: "POST" }),
  // Add more admin endpoints as needed
};
