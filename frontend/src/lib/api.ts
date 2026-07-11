const BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("snip_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("snip_token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────
export interface AuthRequest  { username: string; password: string }
export interface AuthResponse { token: string; username: string }

export const auth = {
  login:    (body: AuthRequest)  => request<AuthResponse>("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  register: (body: AuthRequest)  => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Links ───────────────────────────────────────────────────────
export interface ShortenRequest  { longUrl: string; customCode?: string }
export interface ShortenResponse { shortCode: string; shortUrl: string; longUrl: string; createdAt: string }
export interface StatsResponse   { shortCode: string; shortUrl: string; longUrl: string; clickCount: number; createdAt: string }

export const links = {
  shorten:  (body: ShortenRequest) => request<ShortenResponse>("/shorten", { method: "POST", body: JSON.stringify(body) }),
  getAll:   ()                      => request<StatsResponse[]>("/links"),
  getStats: (code: string)          => request<StatsResponse>(`/stats/${code}`),
  delete:   (code: string)          => request<void>(`/shorten/${code}`, { method: "DELETE" }),
};
