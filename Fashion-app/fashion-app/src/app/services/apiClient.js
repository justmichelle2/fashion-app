const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || "";

const joinUrl = (baseUrl, path) => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const hasBackendApi = () => Boolean(API_BASE_URL);

export async function apiRequest(path, options = {}) {
  if (!hasBackendApi()) {
    throw new Error("Backend API base URL is not configured.");
  }

  const url = joinUrl(API_BASE_URL, path);
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  const response = await fetch(url, config);
  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "object" && body?.error ? body.error : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}
