"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SplineScene } from "@/components/ui/splite";

const EASE = [0.16, 1, 0.3, 1];
const slideLeft  = { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } };
const slideRight = { hidden: { opacity: 0, x:  28 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } };
const fadeUp     = { hidden: { opacity: 0, y: 16  }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };
const stagger    = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } };

interface AuthSplitProps {
  mode: "login" | "register";
  children: React.ReactNode;
}

const MODE_CONFIG = {
  login:    { title: "CONTINUE GAME",  sub: "RETURNING ADVENTURER", badge: "SAVE DETECTED", badgeColor: "var(--r-green)",  chapter: "CHAPTER I" },
  register: { title: "NEW GAME",       sub: "CHARACTER CREATION",   badge: "FREE TO PLAY",  badgeColor: "var(--r-yellow)", chapter: "PROLOGUE" },
};

const STATS_LOGIN = [
  { label: "REALM",   val: "DIGITAL", color: "var(--r-cyan)" },
  { label: "CLASS",   val: "LINKER",  color: "var(--r-green)" },
  { label: "SERVER",  val: "ONLINE",  color: "var(--r-green)" },
];

const STATS_REGISTER = [
  { label: "STARTING HP", val: "100/100", color: "var(--r-green)" },
  { label: "LINKS/MOON",  val: "50 FREE", color: "var(--r-cyan)" },
  { label: "XP BONUS",    val: "+500",    color: "var(--r-yellow)" },
];

export function AuthSplit({ mode, children }: AuthSplitProps) {
  const cfg = MODE_CONFIG[mode];
  const stats = mode === "login" ? STATS_LOGIN : STATS_REGISTER;

  return (
    <div className="scanlines" style={{ minHeight: "100vh", display: "flex", background: "var(--r-bg)" }}>

      {/* ══ LEFT — Spline + RPG overlay ═══════════════════════════ */}
      <motion.aside
        variants={slideLeft}
        initial="hidden"
        animate="show"
        className="hidden lg:flex"
        style={{ position: "relative", overflow: "hidden", flexShrink: 0, width: "55%", flexDirection: "column" }}
      >
        {/* Dark base */}
        <div style={{ position: "absolute", inset: 0, background: "var(--r-bg)", pointerEvents: "none" }} />

        {/* Subtle grid */}
        <div className="auth-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />

        {/* Spline 3D */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
        </div>

        {/* Top gradient */}
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: "180px", background: "linear-gradient(to bottom, rgba(5,5,8,0.98) 0%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />

        {/* Bottom gradient */}
        <div style={{ position: "absolute", inset: "auto 0 0 0", height: "72%", background: "linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0.88) 50%, transparent 100%)", zIndex: 10, pointerEvents: "none" }} />

        {/* Scanlines on left panel */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 12, pointerEvents: "none",
          background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
        }} />

        {/* Cyan glow at bottom */}
        <div style={{
          position: "absolute", bottom: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "400px", height: "300px",
          background: "radial-gradient(ellipse, rgba(0,212,255,0.10) 0%, transparent 70%)",
          zIndex: 11, pointerEvents: "none",
        }} />

        {/* ── Logo top-left ── */}
        <div style={{ position: "absolute", top: "1.75rem", left: "2rem", zIndex: 20 }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              style={{
                width: "30px", height: "30px",
                background: "var(--r-cyan)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 0 2px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 14px rgba(0,212,255,0.5)",
                fontSize: "14px",
              }}
            >
              ⚡
            </motion.div>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "9px", color: "var(--r-cyan)", textShadow: "0 0 6px var(--r-cyan)" }}>SNiP.LINK</span>
          </Link>
        </div>

        {/* ── Chapter indicator ── */}
        <div style={{ position: "absolute", top: "1.75rem", right: "2rem", zIndex: 20 }}>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-gray)", letterSpacing: "0.12em" }}>
            {cfg.chapter}
          </span>
        </div>

        {/* ── Bottom overlay content ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2.25rem 2.5rem", zIndex: 20, pointerEvents: "none" }}
        >
          {/* Mode title */}
          <motion.div variants={fadeUp} style={{ marginBottom: "1.25rem" }}>
            <div className="retro-divider" style={{ marginBottom: "0.875rem", justifyContent: "flex-start", gap: "0.75rem" }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-cyan)", letterSpacing: "0.15em" }}>
                ★ {cfg.sub} ★
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Press Start 2P'",
              fontSize: "clamp(18px, 2.5vw, 28px)",
              color: "var(--r-white)",
              lineHeight: 1.5,
              letterSpacing: "0.02em",
              marginBottom: "0.5rem",
            }}>
              {cfg.title}
            </h2>
            <p style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-gray)", lineHeight: 1.5 }}>
              Forge short portals. Track every click.<br/>Rule the Digital Realm.
            </p>
          </motion.div>

          {/* Mini stat bars */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {stats.map(({ label, val, color }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.1em", marginBottom: "3px" }}>{label}</div>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: "9px", color, textShadow: `0 0 8px ${color}` }}>{val}</div>
              </div>
            ))}
          </motion.div>

          {/* NPC quote */}
          <motion.div variants={fadeUp}>
            <div className="dialog-box" style={{ boxShadow: "none", borderColor: "rgba(0,212,255,0.3)" }}>
              <div className="dialog-speaker">GUILD MASTER</div>
              <p className="dialog-text" style={{ fontSize: "18px" }}>
                {mode === "login"
                  ? "Welcome back, adventurer. Your portals await. The realm has been busy."
                  : "A new adventurer enters the realm! Your legend begins here. Forge wisely."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* ══ RIGHT — Form panel ════════════════════════════════════ */}
      <motion.main
        variants={slideRight}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
          background: "var(--r-bg)",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div className="auth-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.25 }} />

        {/* Corner glows */}
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "180px", height: "180px", background: "radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden" style={{ textDecoration: "none", marginBottom: "2rem", position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "26px", height: "26px", background: "var(--r-cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>⚡</div>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "9px", color: "var(--r-cyan)", textShadow: "0 0 6px var(--r-cyan)" }}>SNiP.LINK</span>
        </Link>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 10 }}
        >
          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'Press Start 2P'", fontSize: "7px",
                color: cfg.badgeColor,
                textShadow: `0 0 8px ${cfg.badgeColor}`,
                letterSpacing: "0.12em",
                border: `1px solid ${cfg.badgeColor}`,
                padding: "5px 10px",
                background: `${cfg.badgeColor}11`,
              }}
            >
              ▶ {cfg.badge}
            </motion.span>
          </div>

          {/* Glass card shell with pixel border */}
          <div className="pixel-box" style={{ padding: "2rem 1.75rem" }}>
            {children}
          </div>

          {/* Terms */}
          <p style={{ marginTop: "1.25rem", textAlign: "center", fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.08em", lineHeight: 1.8 }}>
            CONTINUING IMPLIES AGREEMENT WITH OUR{" "}
            <Link href="#" style={{ color: "var(--r-cyan)", textDecoration: "none" }}>TERMS</Link>
            {" "}&amp;{" "}
            <Link href="#" style={{ color: "var(--r-cyan)", textDecoration: "none" }}>PRIVACY</Link>
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
