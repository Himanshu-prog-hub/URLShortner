"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };

const LEADERBOARD = [
  { rank: "01", name: "STRIPE CORP",   score: "12.4M", badge: "GUILD MASTER",  color: "var(--r-yellow)" },
  { rank: "02", name: "NOTION GUILD",  score: "8.2M",  badge: "WARLORD",       color: "var(--r-cyan)" },
  { rank: "03", name: "VERCEL CLAN",   score: "6.1M",  badge: "CHAMPION",      color: "var(--r-green)" },
  { rank: "04", name: "LINEAR SQUAD",  score: "4.8M",  badge: "VETERAN",       color: "var(--r-cyan)" },
  { rank: "05", name: "FIGMA TRIBE",   score: "3.9M",  badge: "RANGER",        color: "var(--r-gray)" },
];

const REVIEWS = [
  {
    avatar: "MC",
    name:   "Maya Chen",
    class:  "Growth Mage @ Stripe",
    stars:  5,
    text:   "Switched from Bitly. Night and day difference. The analytics are actually useful.",
    color:  "var(--r-yellow)",
  },
  {
    avatar: "JO",
    name:   "James Okafor",
    class:  "Platform Warrior @ Notion",
    stars:  5,
    text:   "We shorten 50k+ links a month. snip.link handles it without breaking a sweat.",
    color:  "var(--r-cyan)",
  },
  {
    avatar: "SR",
    name:   "Sofia Reyes",
    class:  "Dev Ranger @ Linear",
    stars:  5,
    text:   "The API is clean, the dashboard is fast, and the custom codes are a game changer.",
    color:  "var(--r-green)",
  },
];

export function SocialProof() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "var(--r-surface)", position: "relative" }}>

      {/* Area header */}
      <div className="area-transition">
        <div className="retro-divider" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          🏆 HALL OF FAME · CHAPTER III
        </div>
      </div>

      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div className="retro-section-label" style={{ marginBottom: "1rem" }}>GUILD RECORDS</div>
          <h2 style={{
            fontFamily: "'Press Start 2P'",
            fontSize: "clamp(14px, 2.5vw, 20px)",
            color: "var(--r-white)", lineHeight: 1.7, marginBottom: "0.75rem",
          }}>
            THE TOP <span style={{ color: "var(--r-yellow)", textShadow: "0 0 12px var(--r-yellow)" }}>ADVENTURERS</span>
          </h2>
          <p style={{ fontFamily: "'VT323'", fontSize: "22px", color: "var(--r-gray)" }}>
            Join 28 million link forgers already dominating the realm.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem", alignItems: "start" }}>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-cyan)", letterSpacing: "0.2em", marginBottom: "1rem", textShadow: "0 0 8px var(--r-cyan)" }}>
              ★ TOP GUILDS BY LINKS FORGED ★
            </div>
            <div className="pixel-box" style={{ overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "40px 1fr auto auto",
                padding: "0.625rem 1rem",
                background: "rgba(0,212,255,0.06)",
                borderBottom: "1px solid var(--r-border)",
                fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.1em",
                gap: "0.5rem",
              }}>
                <span>RANK</span><span>GUILD</span><span>LINKS</span><span>TITLE</span>
              </div>
              {LEADERBOARD.map(({ rank, name, score, badge, color }) => (
                <motion.div
                  key={rank}
                  whileHover={{ background: "rgba(0,212,255,0.04)" }}
                  style={{
                    display: "grid", gridTemplateColumns: "40px 1fr auto auto",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid var(--r-border)",
                    alignItems: "center", gap: "0.5rem", transition: "background 0.15s",
                  }}
                >
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: rank === "01" ? "var(--r-yellow)" : "var(--r-gray)" }}>
                    {rank === "01" ? "👑" : `#${rank}`}
                  </span>
                  <span style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-white)" }}>{name}</span>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-green)", textShadow: "0 0 6px var(--r-green)" }}>{score}</span>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color, letterSpacing: "0.05em" }}>{badge}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-yellow)", letterSpacing: "0.2em", marginBottom: "0.25rem", textShadow: "0 0 8px var(--r-yellow)" }}>
              ★ ADVENTURER REVIEWS ★
            </div>
            {REVIEWS.map(({ avatar, name, class: cls, stars, text, color }) => (
              <motion.div
                key={name}
                variants={item}
                whileHover={{ x: 4 }}
                style={{
                  padding: "1.125rem 1.25rem",
                  background: "var(--r-panel)",
                  border: `1px solid ${color}22`,
                  borderLeft: `3px solid ${color}`,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.625rem" }}>
                  <div style={{
                    width: "32px", height: "32px",
                    background: color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-bg)", flexShrink: 0,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-white)", letterSpacing: "0.05em" }}>{name}</div>
                    <div style={{ fontFamily: "'VT323'", fontSize: "16px", color: "var(--r-gray)", marginTop: "2px" }}>{cls}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "var(--r-yellow)", fontSize: "12px", letterSpacing: "2px" }}>
                    {"★".repeat(stars)}
                  </div>
                </div>
                <p style={{ fontFamily: "'VT323'", fontSize: "20px", color: "rgba(232,244,248,0.75)", lineHeight: 1.5 }}>
                  &ldquo;{text}&rdquo;
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
