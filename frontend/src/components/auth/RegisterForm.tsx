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
  error,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  prefix: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const borderColor = hasError ? "var(--r-pink)" : focused ? "var(--r-yellow)" : "var(--r-border)";
  const glowColor   = hasError ? "rgba(255,45,120,0.2)" : "rgba(255,215,0,0.15)";
  return (
    <div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: hasError ? "var(--r-pink)" : "var(--r-gray)", letterSpacing: "0.12em", marginBottom: "6px" }}>
        {label}
      </div>
      <div style={{
        display: "flex",
        border: `2px solid ${borderColor}`,
        background: "var(--r-bg)",
        boxShadow: focused ? `0 0 0 1px var(--r-bg), 0 0 0 3px ${borderColor}, 0 0 12px ${glowColor}` : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <div style={{
          padding: "0 10px",
          display: "flex", alignItems: "center",
          background: focused ? `${glowColor}` : "rgba(255,255,255,0.02)",
          borderRight: `2px solid ${borderColor}`,
          fontFamily: "'Press Start 2P'", fontSize: "8px",
          color: focused ? borderColor : "var(--r-gray)",
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
      {error && (
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-pink)", marginTop: "4px", letterSpacing: "0.05em" }}>
          ✗ {error}
        </div>
      )}
    </div>
  );
}

/* ── Pixel strength meter ────────────────────────────────────── */
const PW_CHECKS = [
  { label: "8+ CHARS",  test: (pw: string) => pw.length >= 8 },
  { label: "UPPERCASE", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "NUMBER",    test: (pw: string) => /\d/.test(pw) },
];
const STRENGTH_LABELS = ["WEAK", "FAIR", "STRONG"];
const STRENGTH_COLORS = ["var(--r-pink)", "var(--r-yellow)", "var(--r-green)"];

function PasswordStrength({ pw }: { pw: string }) {
  if (!pw) return null;
  const score = PW_CHECKS.filter(c => c.test(pw)).length;
  const color = STRENGTH_COLORS[score - 1] ?? "var(--r-border)";
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      style={{ marginTop: "0.5rem", overflow: "hidden" }}
    >
      {/* Pixel segments */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "0.4rem" }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: "6px",
              background: i < score ? color : "var(--r-border)",
              boxShadow: i < score ? `0 0 6px ${color}` : "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          />
        ))}
      </div>
      {/* Check labels */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color, letterSpacing: "0.08em", textShadow: `0 0 6px ${color}` }}>
          {score > 0 ? STRENGTH_LABELS[score - 1] : ""}
        </span>
        {PW_CHECKS.map(({ label, test }) => {
          const pass = test(pw);
          return (
            <span key={label} style={{
              fontFamily: "'Press Start 2P'", fontSize: "5px",
              color: pass ? "var(--r-green)" : "var(--r-border)",
              letterSpacing: "0.06em",
              transition: "color 0.2s",
            }}>
              {pass ? "✓" : "○"} {label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Starting loot ───────────────────────────────────────────── */
const STARTER_LOOT = [
  { icon: "🔗", label: "50 PORTALS / MOON" },
  { icon: "📊", label: "CLICK ANALYTICS" },
  { icon: "📱", label: "QR CODE SCROLLS" },
  { icon: "💎", label: "NO CREDIT CARD" },
];

/* ═══════════════════════════════════════════════════════════════ */
export function RegisterForm() {
  const router  = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password)  { setError("ALL FIELDS REQUIRED"); return; }
    if (password !== confirm)           { setError("PASSWORDS DON'T MATCH"); return; }
    if (password.length < 8)            { setError("PASSWORD TOO WEAK — MIN 8 CHARS"); return; }
    setError(""); setLoading(true);
    try {
      const data = await auth.register({ username: username.trim(), password });
      saveToken(data.token);
      document.cookie = `snip_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message?.toUpperCase() || "REGISTRATION FAILED — TRY ANOTHER NAME");
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
      <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-gray)", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
          ── CHARACTER CREATION ──
        </div>
        <h1 style={{
          fontFamily: "'Press Start 2P'",
          fontSize: "clamp(12px, 2vw, 16px)",
          color: "var(--r-white)",
          lineHeight: 1.7,
          letterSpacing: "0.04em",
          marginBottom: "0.5rem",
        }}>
          NEW GAME<br/>
          <span style={{ color: "var(--r-yellow)", textShadow: "0 0 10px var(--r-yellow)" }}>+</span>
        </h1>
        <p style={{ fontFamily: "'VT323'", fontSize: "18px", color: "var(--r-gray)" }}>
          Already a member?{" "}
          <Link href="/login" style={{ color: "var(--r-cyan)", textDecoration: "none" }}>
            LOAD SAVE ▶
          </Link>
        </p>
      </div>

      {/* Starter loot box */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "0.375rem",
        padding: "0.75rem",
        background: "rgba(255,215,0,0.03)",
        border: "1px solid rgba(255,215,0,0.15)",
        marginBottom: "1.25rem",
      }}>
        <div style={{ gridColumn: "span 2", fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-yellow)", letterSpacing: "0.12em", marginBottom: "0.375rem", textShadow: "0 0 8px var(--r-yellow)" }}>
          ★ STARTER PACK INCLUDED:
        </div>
        {STARTER_LOOT.map(({ icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "12px" }}>{icon}</span>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "5.5px", color: "var(--r-gray)", letterSpacing: "0.04em" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <PixelInput
          label="CHOOSE YOUR NAME"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="pick-a-username"
          autoComplete="username"
          prefix="⚔"
        />

        <div>
          <PixelInput
            label="SET PASSWORD RUNE"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="create-strong-rune"
            autoComplete="new-password"
            prefix="🔐"
          />
          <PasswordStrength pw={password} />
        </div>

        <PixelInput
          label="CONFIRM RUNE"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="repeat-rune"
          autoComplete="new-password"
          prefix="🔏"
          error={confirm && confirm !== password ? "RUNES DON'T MATCH" : undefined}
        />

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
          whileHover={!loading ? { y: -2, boxShadow: "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-yellow), 0 0 20px rgba(255,215,0,0.25)" } : {}}
          whileTap={!loading ? { y: 1 } : {}}
          style={{
            width: "100%",
            padding: "12px",
            fontFamily: "'Press Start 2P'",
            fontSize: "9px",
            letterSpacing: "0.1em",
            background: loading ? "rgba(255,215,0,0.1)" : "var(--r-yellow)",
            color: loading ? "var(--r-yellow)" : "var(--r-bg)",
            border: "2px solid var(--r-yellow)",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 0 16px rgba(255,215,0,0.25)",
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
              CREATING CHARACTER...
            </>
          ) : (
            "▶ BEGIN ADVENTURE"
          )}
        </motion.button>
      </form>

      {/* OAuth portals */}
      <div style={{ marginTop: "1rem" }}>
        <div className="retro-divider" style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-border)", letterSpacing: "0.08em" }}>
            OR JOIN VIA PORTAL
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
              onClick={enabled ? handleGoogleSignup : undefined}
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
        NO GOLD REQUIRED · NO LOCK-IN CURSE · 30-SEC SPAWN
      </p>
    </motion.div>
  );
}
