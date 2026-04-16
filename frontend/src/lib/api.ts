/** Must match backend `API_V1_STR` (see FastAPI `main.py`). */
const API_V1_PREFIX = "/api/v1";

/**
 * Frontend always talks to its own origin. `next.config.mjs` rewrites `/api/*`
 * to the real backend, which avoids leaking a browser-side localhost fallback
 * into production builds.
 */
export const API_URL = API_V1_PREFIX;

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
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
