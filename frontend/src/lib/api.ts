const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

/** Origin (scheme + host[:port]) for media; API returns paths like `/api/v1/public/images/...`. */
export function getApiOrigin(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).trim();
  base = base.replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) {
    return base.slice(0, -"/api/v1".length);
  }
  return base;
}

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiOrigin()}${normalized}`;
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
