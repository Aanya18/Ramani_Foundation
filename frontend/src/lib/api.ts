const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorPayload = (await response.json()) as { detail?: string };
      message = errorPayload.detail ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      Accept: "application/json",
    },
  });

  return parseResponse<T>(response);
}

export async function apiPost<TResponse, TPayload extends Record<string, unknown>>(
  path: string,
  payload: TPayload,
): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<TResponse>(response);
}

export async function apiPut<TResponse, TPayload extends Record<string, unknown>>(
  path: string,
  payload: TPayload,
): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<TResponse>(response);
}
