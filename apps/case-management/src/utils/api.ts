/**
 * Authenticated API Fetch client for Akeezo Case Management System
 * Automatically attaches the Bearer token stored in localStorage and credentials.
 * Handles 401 Unauthorized responses by clearing invalid tokens to prevent security leaks.
 */
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("akeezo_auth_token");
  const headers = new Headers(init?.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  if (response.status === 401) {
    console.warn("[Akeezo Security] Unauthorized or expired session token on API call. Clearing token.");
    localStorage.removeItem("akeezo_auth_token");
  }

  return response;
}
