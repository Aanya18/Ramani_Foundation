/** Must match backend `API_V1_STR` (see FastAPI `main.py`). */
const API_V1_PREFIX = "/api/v1";
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}${API_V1_PREFIX}`;

export type Event = {
  id: number | string;
  title: string;
  description: string;
  date: string;
  location?: string;
  image_url?: string | null;
};

export type GalleryItem = {
  id: number | string;
  title: string;
  image_url?: string | null;
  event_id?: number | string | null;
  event_title?: string | null;
};

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_API_URL}${normalizedPath}`;
}

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/public/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch(`${API_URL}/public/gallery`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}
