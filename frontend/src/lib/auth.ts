"use client";

export function saveToken(token: string) {
  localStorage.setItem("snip_token", token);
}

export function clearToken() {
  localStorage.removeItem("snip_token");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("snip_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/** Lightweight JWT payload decode (no verification — server does that) */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function getUsername(): string | null {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  return (payload?.sub as string) ?? null;
}
