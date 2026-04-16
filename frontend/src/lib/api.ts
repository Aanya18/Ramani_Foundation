/** Must match backend `API_V1_STR` (see FastAPI `main.py`). */
const API_V1_PREFIX = "/api/v1";

const DEFAULT_BACKEND_ORIGIN = "http://localhost:8000";

/**
 * `NEXT_PUBLIC_API_URL` = backend origin only (no `/api/v1`), e.g. `https://api.example.com`.
 * `/api/v1` is appended in code. If the env still ends with `/api/v1`, it is stripped once for compatibility.
 */
function resolveBackendOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (!raw) return DEFAULT_BACKEND_ORIGIN;
  let base = raw.replace(/\/+$/, "");
  if (base.endsWith("/api/v1")) {
    base = base.slice(0, -"/api/v1".length);
  }
  return base;
}

export const API_ORIGIN = resolveBackendOrigin();

/** Base for all REST calls: `{origin}/api/v1`. */
export const API_URL = `${API_ORIGIN}${API_V1_PREFIX}`;

/** Same as `API_ORIGIN`; used for media where paths already include `/api/v1/...`. */
export function getApiOrigin(): string {
  return API_ORIGIN;
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
