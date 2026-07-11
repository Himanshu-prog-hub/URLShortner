"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Konami code easter egg ──────────────────────────────────── */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function useKonami(onSuccess: () => void) {
  const [seq, setSeq] = useState<string[]>([]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSeq(s => {
        const next = [...s, e.key].slice(-KONAMI.length);
        if (next.join(",") === KONAMI.join(",")) { onSuccess(); return []; }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSuccess]);
}

const COLS = [
  {
    heading: "PORTAL",
    links: [
      { label: "Features",    href: "#features" },
      { label: "Pricing",     href: "#pricing" },
      { label: "API Docs",    href: "#" },
      { label: "Status Page", href: "#" },
    ],
  },
  {
    heading: "GUILD",
    links: [
      { label: "About",    href: "#" },
      { label: "Blog",     href: "#" },
      { label: "Careers",  href: "#" },
      { label: "Contact",  href: "#" },
    ],
  },
  {
    heading: "LORE",
    links: [
      { label: "Privacy",      href: "#" },
      { label: "Terms",        href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Security",     href: "#" },
    ],
  },
];

export function Footer() {
  const [unlocked, setUnlocked] = useState(false);
  useKonami(() => setUnlocked(true));

  return (
    <footer style={{ background: "var(--r-bg)", borderTop: "2px solid var(--r-border)", position: "relative" }}>

      {/* Top scanline accent */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, var(--r-cyan), transparent)", boxShadow: "0 0 8px var(--r-cyan)" }} />

      <div style={{ maxWidth: "68rem", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>

          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{
                width: "24px", height: "24px",
                background: "var(--r-cyan)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 8px var(--r-cyan)",
                fontSize: "12px",
              }}>⚡</div>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: "9px", color: "var(--r-cyan)", textShadow: "0 0 6px var(--r-cyan)" }}>SNiP.LINK</span>
            </Link>
            <p style={{ fontFamily: "'VT323'", fontSize: "18px", color: "var(--r-gray)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Forge long URLs into sharp, trackable portals. Level up your link game.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {["X", "GH", "LI"].map(s => (
                <motion.a
                  key={s}
                  href="#"
                  whileHover={{ color: "var(--r-cyan)", borderColor: "var(--r-cyan)", boxShadow: "0 0 8px var(--r-cyan)" }}
                  style={{
                    width: "28px", height: "28px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--r-border)",
                    fontFamily: "'Press Start 2P'", fontSize: "6px",
                    color: "var(--r-gray)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ heading, links }) => (
            <div key={heading}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-cyan)", letterSpacing: "0.18em", marginBottom: "1.25rem", textShadow: "0 0 6px var(--r-cyan)" }}>
                {heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {links.map(({ label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ color: "var(--r-cyan)", x: 3 }}
                    style={{
                      fontFamily: "'VT323'",
                      fontSize: "18px",
                      color: "var(--r-gray)",
                      textDecoration: "none",
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      transition: "color 0.15s",
                    }}
                  >
                    <span style={{ color: "var(--r-border)", fontSize: "10px" }}>▶</span>
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--r-border)",
          paddingTop: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.1em" }}>
            © 2025 SNiP.LINK · ALL RIGHTS RESERVED · v2.4.0
          </p>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-border)", letterSpacing: "0.12em" }}>
            ↑ ↑ ↓ ↓ ← → ← → B A
          </p>
        </div>
      </div>

      {/* Konami code easter egg */}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(5,5,8,0.95)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "1.5rem",
          }}
          onClick={() => setUnlocked(false)}
        >
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(12px,3vw,24px)", color: "var(--r-green)", textShadow: "0 0 24px var(--r-green)", textAlign: "center", lineHeight: 2 }}>
            🎮 CHEAT CODE ACTIVATED 🎮
          </p>
          <p style={{ fontFamily: "'VT323'", fontSize: "28px", color: "var(--r-cyan)", textAlign: "center" }}>
            +30 LIVES · INFINITE LINKS · GOD MODE ENABLED
          </p>
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-gray)", letterSpacing: "0.1em" }}>
            (click anywhere to continue)
          </p>
        </motion.div>
      )}
    </footer>
  );
}
