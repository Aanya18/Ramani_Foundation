/** Must match backend `API_V1_STR` (see FastAPI `main.py`). */
const API_V1_PREFIX = "/api/v1";
const backendOrigin = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!backendOrigin) {
  throw new Error("NEXT_PUBLIC_API_URL is required");
}

const BACKEND_ORIGIN = backendOrigin.replace(/\/+$/, "");

export const API_URL = `${BACKEND_ORIGIN}${API_V1_PREFIX}`;

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_ORIGIN}${normalizedPath}`;
}

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/public/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchGallery() {
  const res = await fetch(`${API_URL}/public/gallery`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}
