"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const EASE = [0.16, 1, 0.3, 1];

const ZapIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--r-bg)">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const NAV_LINKS = [
  { href: "#features", label: "SKILLS",  icon: "⚔" },
  { href: "#pricing",  label: "SHOP",    icon: "🏪" },
  { href: "#faq",      label: "NPC",     icon: "💬" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("snip_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("snip_token");
    document.cookie = "snip_token=; path=/; max-age=0";
    window.location.href = "/";
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(5,5,8,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(0,212,255,${borderOpacity.get() * 0.25})`,
      }}
    >
      {/* XP progress bar at very top */}
      <div className="xp-track" style={{ width: "100%" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "68%" }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.8 }}
          style={{ height: "100%", background: "var(--r-cyan)", boxShadow: "0 0 6px var(--r-cyan)" }}
        />
      </div>

      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem", height: "52px", display: "flex", alignItems: "center", gap: "1.5rem" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginRight: "auto" }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              width: "28px", height: "28px",
              background: "var(--r-cyan)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 2px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 12px rgba(0,212,255,0.4)",
            }}
          >
            <ZapIcon />
          </motion.div>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "10px", color: "var(--r-cyan)", textShadow: "0 0 8px var(--r-cyan)", letterSpacing: "0.05em" }}>
            SNiP
          </span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-gray)", letterSpacing: "0.05em" }}>
            .LINK
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="hidden md:flex">
          {NAV_LINKS.map(({ href, label, icon }) => (
            <motion.a
              key={href}
              href={href}
              whileHover={{ color: "var(--r-cyan)" }}
              style={{
                padding: "0.375rem 0.875rem",
                fontFamily: "'Press Start 2P'",
                fontSize: "7px",
                color: "var(--r-gray)",
                textDecoration: "none",
                letterSpacing: "0.1em",
                display: "flex", alignItems: "center", gap: "0.375rem",
                transition: "color 0.15s",
                textShadow: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px var(--r-cyan)"; (e.currentTarget as HTMLElement).style.color = "var(--r-cyan)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textShadow = "none"; (e.currentTarget as HTMLElement).style.color = "var(--r-gray)"; }}
            >
              <span>{icon}</span> {label}
            </motion.a>
          ))}
        </nav>

        {/* CTA — changes based on auth state */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="hidden md:flex">
          {loggedIn ? (
            <>
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  className="btn-pixel"
                  style={{ fontSize: "7px", padding: "8px 14px" }}
                >
                  ▶ OPEN DASHBOARD
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
                onClick={handleLogout}
                style={{
                  fontFamily: "'Press Start 2P'", fontSize: "7px",
                  padding: "8px 14px",
                  background: "transparent",
                  color: "var(--r-gray)",
                  border: "1px solid var(--r-border)",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--r-pink)"; el.style.color = "var(--r-pink)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--r-border)"; el.style.color = "var(--r-gray)"; }}
              >
                QUIT
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  style={{
                    fontFamily: "'Press Start 2P'", fontSize: "7px",
                    padding: "8px 14px",
                    background: "transparent",
                    color: "var(--r-gray)",
                    border: "1px solid var(--r-border)",
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--r-cyan)"; el.style.color = "var(--r-cyan)"; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--r-border)"; el.style.color = "var(--r-gray)"; }}
                >
                  CONTINUE
                </motion.button>
              </Link>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  className="btn-pixel btn-pixel-green"
                  style={{ fontSize: "7px", padding: "8px 14px" }}
                >
                  ▶ NEW GAME
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{
            width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--r-border)",
            color: "var(--r-cyan)",
            cursor: "pointer",
            fontFamily: "'Press Start 2P'",
            fontSize: "10px",
          }}
        >
          {mobileOpen ? "✕" : "☰"}
        </motion.button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            borderTop: "1px solid var(--r-border)",
            background: "rgba(5,5,8,0.98)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {NAV_LINKS.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Press Start 2P'", fontSize: "8px",
                color: "var(--r-gray)",
                textDecoration: "none",
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--r-border)",
              }}
            >
              {icon} {label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}>
            {loggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-pixel" style={{ width: "100%", fontSize: "7px" }}>▶ OPEN DASHBOARD</button>
                </Link>
                <button className="btn-pixel" onClick={handleLogout} style={{ width: "100%", fontSize: "7px", borderColor: "var(--r-pink)", color: "var(--r-pink)" }}>QUIT GAME</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-pixel" style={{ width: "100%", fontSize: "7px" }}>CONTINUE GAME</button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-pixel btn-pixel-green" style={{ width: "100%", fontSize: "7px" }}>▶ NEW GAME</button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
