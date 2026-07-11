"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataGridHero } from "@/components/ui/data-grid-hero";

const EASE = [0.16, 1, 0.3, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } };
const fadeUp  = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

/* ── Typewriter ──────────────────────────────────────────────── */
function TypeWriter({ text, speed = 28 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState("");
  const [done,  setDone]  = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) { setShown(text.slice(0, ++i)); }
      else { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <>{shown}{!done && <span className="blink" style={{ color: "var(--r-cyan)" }}>█</span>}</>;
}

/* ── Stat bar ────────────────────────────────────────────────── */
function StatBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ minWidth: "72px" }}>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", marginBottom: "4px", letterSpacing: "0.1em" }}>{label}</div>
      <div className="stat-bar-track" style={{ width: "72px" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 1.2 }}
          style={{ height: "100%", background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ── World stat chip ─────────────────────────────────────────── */
function WorldStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <motion.div variants={fadeUp} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0.625rem 1.125rem",
      background: "rgba(5,5,8,0.85)",
      border: `1px solid ${color}`,
      boxShadow: `0 0 0 1px var(--r-bg), 0 0 0 2px ${color}, 0 0 16px ${color}22`,
    }}>
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: "14px", color, textShadow: `0 0 12px ${color}`, letterSpacing: "-0.02em" }}>{value}</span>
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", marginTop: "5px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
    </motion.div>
  );
}

/* ── Props ───────────────────────────────────────────────────── */
interface ParticleHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: { text: string; onClick: () => void };
  secondaryButton?: { text: string; onClick: () => void };
  interactiveHint?: string;
  className?: string;
  particleCount?: number;
  children?: ReactNode;
}

const NPC_LINES = [
  "The realm is plagued by monstrous URLs. Forge them into sharp, trackable short links!",
  "Each link you forge earns precious XP — click data, referrers, and geo intelligence.",
  "Join 28 million adventurers already shortening URLs in the Digital Realm.",
];

/* ══════════════════════════════════════════════════════════════ */
export const ParticleHero: React.FC<ParticleHeroProps> = ({
  primaryButton,
  secondaryButton,
  interactiveHint = "Move to interact",
  className = "",
  children,
}) => {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setLineIdx(i => (i + 1) % NPC_LINES.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <DataGridHero
      responsive
      cellSize={20}
      spacing={3}
      duration={4.5}
      color="rgba(0,255,65,1)"
      animationType="wave"
      pulseEffect
      mouseGlow={false}
      opacityMin={0.025}
      opacityMax={0.55}
      background="var(--r-bg)"
      className={`scanlines ${className}`}
      style={{ minHeight: "100vh" }}
    >
      {children ?? (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
            padding: "7rem 1.5rem 4rem",
            maxWidth: "860px",
            margin: "0 auto",
            width: "100%",
          }}
        >

          {/* ── MAIN QUEST badge ────────────────────────────── */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2rem" }}>
            <div className="retro-divider" style={{ marginBottom: "1rem", maxWidth: "360px", margin: "0 auto 1rem" }}>
              ★ MAIN QUEST ★
            </div>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: "'Press Start 2P'",
                fontSize: "8px",
                color: "var(--r-yellow)",
                textShadow: "0 0 8px var(--r-yellow)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
              }}
            >
              ▶ NEW QUEST AVAILABLE ◀
            </motion.span>
          </motion.div>

          {/* ── SNIP title ──────────────────────────────────── */}
          <motion.div variants={fadeUp} style={{ marginBottom: "0.5rem" }}>
            <h1 style={{
              fontFamily: "'Press Start 2P'",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontSize: "clamp(52px, 12vw, 140px)",
              color: "var(--r-cyan)",
              textShadow: "0 0 20px var(--r-cyan), 0 0 60px rgba(0,212,255,0.4), 0 0 100px rgba(0,212,255,0.2)",
              marginBottom: 0,
            }}>
              SNIP
            </h1>
          </motion.div>

          {/* ── Subtitle ────────────────────────────────────── */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "'VT323'",
              fontSize: "clamp(18px, 3vw, 26px)",
              color: "rgba(0,212,255,0.5)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}>
              Link Intelligence · Digital Realm v2.4
            </p>
          </motion.div>

          {/* ── NPC Dialog box ──────────────────────────────── */}
          <motion.div variants={fadeUp} style={{ marginBottom: "2rem", width: "100%", maxWidth: "580px" }}>
            <div className="dialog-box" style={{ textAlign: "left" }}>
              <div className="dialog-speaker">GUILD MASTER SNIP</div>
              <p className="dialog-text">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lineIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TypeWriter key={lineIdx} text={NPC_LINES[lineIdx]} speed={22} />
                  </motion.span>
                </AnimatePresence>
              </p>
              <div style={{
                display: "flex", justifyContent: "flex-end", marginTop: "0.75rem",
                fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-cyan)", letterSpacing: "0.1em",
              }}>
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }}>▼ NEXT</motion.span>
              </div>
            </div>
          </motion.div>

          {/* ── CTA Buttons ─────────────────────────────────── */}
          <motion.div
            variants={fadeUp}
            style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center", marginBottom: "3rem" }}
          >
            {primaryButton && (
              <motion.button
                onClick={primaryButton.onClick}
                whileHover={{ y: -3 }}
                whileTap={{ y: 2 }}
                className="btn-pixel btn-pixel-green"
                style={{ minWidth: "200px" }}
              >
                ▶ {primaryButton.text}
              </motion.button>
            )}
            {secondaryButton && (
              <motion.button
                onClick={secondaryButton.onClick}
                whileHover={{ y: -3 }}
                whileTap={{ y: 2 }}
                className="btn-pixel"
                style={{ minWidth: "200px" }}
              >
                ◈ {secondaryButton.text}
              </motion.button>
            )}
          </motion.div>

          {/* ── Party stats + World stats ────────────────────── */}
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "flex-start",
              marginBottom: "2.5rem",
              width: "100%",
            }}
          >
            {/* Player stats panel */}
            <div style={{
              padding: "1rem 1.25rem",
              background: "rgba(5,5,8,0.85)",
              border: "1px solid var(--r-border)",
              boxShadow: "0 0 0 1px var(--r-bg), 0 0 0 2px var(--r-border)",
              textAlign: "left",
              minWidth: "180px",
            }}>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-gray)", marginBottom: "0.875rem", letterSpacing: "0.15em" }}>
                PLAYER STATS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <StatBar label="HP" pct={100} color="var(--r-green)" />
                <StatBar label="MP" pct={100} color="var(--r-cyan)" />
                <StatBar label="XP" pct={72}  color="var(--r-yellow)" />
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", marginTop: "0.875rem", letterSpacing: "0.1em" }}>
                LVL <span style={{ color: "var(--r-cyan)" }}>∞</span> · CLASS: LINKER
              </div>
            </div>

            {/* World stats */}
            <motion.div
              variants={stagger}
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
            >
              <WorldStat value="28.4M" label="Links Forged"    color="var(--r-cyan)" />
              <WorldStat value="1.2B"  label="XP Collected"    color="var(--r-green)" />
              <WorldStat value="190+"  label="Realms Reached"  color="var(--r-yellow)" />
            </motion.div>
          </motion.div>

          {/* ── Hint ──────────────────────────────────────────── */}
          {interactiveHint && (
            <motion.div
              variants={fadeUp}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: "2rem", height: "1px", background: "var(--r-cyan)", boxShadow: "0 0 4px var(--r-cyan)" }}
              />
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "rgba(0,212,255,0.35)", letterSpacing: "0.25em" }}>
                {interactiveHint}
              </span>
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                style={{ width: "2rem", height: "1px", background: "var(--r-cyan)", boxShadow: "0 0 4px var(--r-cyan)" }}
              />
            </motion.div>
          )}

          {/* Trust */}
          <motion.p variants={fadeUp} style={{
            fontFamily: "'VT323'", fontSize: "18px",
            color: "var(--r-gray)", marginTop: "1.25rem",
          }}>
            NO CREDIT CARD · NO SETUP · 30-SECOND ONBOARDING
          </motion.p>
        </motion.div>
      )}
    </DataGridHero>
  );
};
