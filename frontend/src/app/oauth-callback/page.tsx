"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";

// This page has exactly one job: it is the landing spot Spring Boot's
// OAuth2SuccessHandler redirects the browser to once Google login succeeds,
// with the freshly-minted JWT sitting in the ?token=... query string. From
// here the flow re-joins the same pattern LoginForm.tsx already uses for
// username/password login: save the token to localStorage (for lib/api.ts to
// attach as a Bearer header) AND to a cookie (for middleware.ts to read on
// the server before /dashboard renders).
export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      saveToken(token);
      document.cookie = `snip_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.replace("/dashboard");
    } else {
      // Google login can fail, or someone can hit this URL directly with no
      // token — send them back to login with a flag the UI can show an error for.
      router.replace("/login?error=oauth_failed");
    }
  }, [params, router]);

  return <div style={{ padding: "2rem" }}>Signing you in...</div>;
}
