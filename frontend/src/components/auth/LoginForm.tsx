"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import { saveToken } from "@/lib/auth";

const EASE = [0.16, 1, 0.3, 1];

/* ── Pixel input ─────────────────────────────────────────────── */
function PixelInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  prefix,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  prefix: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.12em", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{
        display: "flex",
        border: `2px solid ${focused ? "var(--r-cyan)" : "var(--r-border)"}`,
        background: "var(--r-bg)",
        boxShadow: focused ? "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 12px rgba(0,212,255,0.15)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <div style={{
          padding: "0 10px",
          display: "flex", alignItems: "center",
          background: focused ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.02)",
          borderRight: `2px solid ${focused ? "var(--r-cyan)" : "var(--r-border)"}`,
          fontFamily: "'Press Start 2P'", fontSize: "8px",
          color: focused ? "var(--r-cyan)" : "var(--r-gray)",
          transition: "all 0.15s",
          flexShrink: 0,
        }}>
          {prefix}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            padding: "10px 12px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--r-white)",
            fontFamily: "'VT323'",
            fontSize: "20px",
            letterSpacing: "0.05em",
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // No fetch/axios call here — we just navigate the whole browser to Spring
  // Boot's OAuth2 authorization endpoint. Spring Security intercepts that URL
  // (see SecurityConfig's .oauth2Login(...)) and redirects again to Google's
  // consent screen. This can't be an XHR/fetch call because the user needs to
  // actually see and interact with Google's login page.
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("ALL FIELDS REQUIRED"); return;
    }
    setError(""); setLoading(true);
    try {
      const data = await auth.login({ username: username.trim(), password });
      saveToken(data.token);
      document.cookie = `snip_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message?.toUpperCase() || "INVALID CREDENTIALS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-gray)", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
          ── ADVENTURER LOGIN ──
        </div>
        <h1 style={{
          fontFamily: "'Press Start 2P'",
          fontSize: "clamp(12px, 2vw, 16px)",
          color: "var(--r-white)",
          lineHeight: 1.7,
          letterSpacing: "0.04em",
          marginBottom: "0.5rem",
        }}>
          CONTINUE<br/>
          <span style={{ color: "var(--r-cyan)", textShadow: "0 0 10px var(--r-cyan)" }}>QUEST</span>
        </h1>
        <p style={{ fontFamily: "'VT323'", fontSize: "18px", color: "var(--r-gray)" }}>
          New adventurer?{" "}
          <Link href="/register" style={{ color: "var(--r-cyan)", textDecoration: "none" }}>
            CREATE CHARACTER ▶
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="retro-divider" style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.1em" }}>
          ENTER CREDENTIALS
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <PixelInput
          label="ADVENTURER NAME"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="your-username"
          autoComplete="username"
          prefix="👤"
        />
        <div>
          <PixelInput
            label="PASSWORD RUNE"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            prefix="🔐"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.375rem" }}>
            <Link href="#" style={{
              fontFamily: "'Press Start 2P'", fontSize: "5px",
              color: "var(--r-border)", letterSpacing: "0.1em", textDecoration: "none",
            }}>
              FORGOT RUNE?
            </Link>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{
                padding: "0.625rem 0.875rem",
                background: "rgba(255,45,120,0.08)",
                border: "2px solid var(--r-pink)",
                fontFamily: "'Press Start 2P'",
                fontSize: "7px",
                color: "var(--r-pink)",
                letterSpacing: "0.05em",
                lineHeight: 1.8,
                textShadow: "0 0 8px var(--r-pink)",
              }}>
                ✗ {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { y: -2, boxShadow: "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 20px rgba(0,212,255,0.3)" } : {}}
          whileTap={!loading ? { y: 1 } : {}}
          style={{
            width: "100%",
            padding: "12px",
            fontFamily: "'Press Start 2P'",
            fontSize: "9px",
            letterSpacing: "0.1em",
            background: loading ? "rgba(0,212,255,0.1)" : "var(--r-cyan)",
            color: loading ? "var(--r-cyan)" : "var(--r-bg)",
            border: "2px solid var(--r-cyan)",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 0 16px rgba(0,212,255,0.3)",
            transition: "all 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            marginTop: "0.25rem",
          }}
        >
          {loading ? (
            <>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▶▶▶
              </motion.span>
              LOADING SAVE...
            </>
          ) : (
            "▶ CONTINUE QUEST"
          )}
        </motion.button>
      </form>

      {/* OAuth disabled note */}
      <div style={{ marginTop: "1rem" }}>
        <div className="retro-divider" style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-border)", letterSpacing: "0.08em" }}>
            OTHER PORTALS
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { label: "GITHUB", icon: "⬡", enabled: false },
            { label: "GOOGLE", icon: "◈", enabled: true },
          ].map(({ label, icon, enabled }) => (
            <button
              key={label}
              disabled={!enabled}
              onClick={enabled ? handleGoogleLogin : undefined}
              style={{
                padding: "8px",
                fontFamily: "'Press Start 2P'", fontSize: "6px",
                background: "transparent",
                border: `2px solid ${enabled ? "var(--r-cyan)" : "var(--r-border)"}`,
                color: enabled ? "var(--r-cyan)" : "var(--r-border)",
                cursor: enabled ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                letterSpacing: "0.08em",
                opacity: enabled ? 1 : 0.5,
              }}
            >
              {icon} {label}
              {!enabled && <span style={{ fontSize: "5px", color: "var(--r-border)" }}>[LOCKED]</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Trust note */}
      <p style={{ marginTop: "1.25rem", textAlign: "center", fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-border)", letterSpacing: "0.1em", lineHeight: 2 }}>
        🔐 REALM SECURED · JWT SHIELD ACTIVE
      </p>
    </motion.div>
  );
}
