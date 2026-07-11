"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
const card = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

const SKILLS = [
  {
    id:       "SKILL-001",
    icon:     "⚡",
    name:     "INSTANT CAST",
    type:     "Active",
    element:  "Speed",
    color:    "var(--r-cyan)",
    boxClass: "pixel-box",
    level:    "MAX",
    desc:     "Forge any URL into a short portal in under 100ms. Custom codes, bulk creation, and branded domains all supported.",
    stats:    [{ label: "CAST TIME", val: "<100ms" }, { label: "COOLDOWN", val: "NONE" }],
  },
  {
    id:       "SKILL-002",
    icon:     "📊",
    name:     "TRACKING AURA",
    type:     "Passive",
    element:  "Insight",
    color:    "var(--r-green)",
    boxClass: "pixel-box-green",
    level:    "MAX",
    desc:     "Every click earns XP data. Real-time analytics on referrers, countries, devices, and time — no external tools.",
    stats:    [{ label: "XP PER CLICK", val: "∞" }, { label: "RANGE", val: "GLOBAL" }],
  },
  {
    id:       "SKILL-003",
    icon:     "🛡️",
    name:     "IRON SHIELD",
    type:     "Passive",
    element:  "Defence",
    color:    "var(--r-yellow)",
    boxClass: "pixel-box-yellow",
    level:    "MAX",
    desc:     "JWT authentication guards your link inventory. Each adventurer sees only their own loot. One-click link deletion.",
    stats:    [{ label: "DEF RATING", val: "S+" }, { label: "AUTH", val: "JWT" }],
  },
];

export function Features() {
  return (
    <section id="features" style={{ padding: "5rem 1.5rem", background: "var(--r-bg)", position: "relative" }}>

      {/* Area transition header */}
      <div className="area-transition">
        <div className="retro-divider" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          ⚔ NEW AREA UNLOCKED ⚔
        </div>
      </div>

      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div className="retro-section-label" style={{ marginBottom: "1rem" }}>
            SKILL TREE · CHAPTER II
          </div>
          <h2 style={{
            fontFamily: "'Press Start 2P'",
            fontSize: "clamp(16px, 3vw, 24px)",
            color: "var(--r-white)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            marginBottom: "1rem",
          }}>
            UNLOCK YOUR<br />
            <span style={{ color: "var(--r-cyan)", textShadow: "0 0 16px var(--r-cyan)" }}>ABILITIES</span>
          </h2>
          <p style={{ fontFamily: "'VT323'", fontSize: "22px", color: "var(--r-gray)", maxWidth: "36rem", margin: "0 auto" }}>
            Every adventurer gains these powers upon joining the guild. No grinding required.
          </p>
        </motion.div>

        {/* Skill cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}
        >
          {SKILLS.map(({ id, icon, name, type, element, color, boxClass, level, desc, stats }) => (
            <motion.article
              key={id}
              variants={card}
              whileHover={{ y: -5 }}
              className={boxClass}
              style={{ padding: "1.75rem", cursor: "default", position: "relative", overflow: "hidden" }}
            >
              {/* Corner badge */}
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                fontFamily: "'Press Start 2P'", fontSize: "6px",
                color: color, letterSpacing: "0.08em",
              }}>
                {id}
              </div>

              {/* Type badge */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "'Press Start 2P'", fontSize: "6px",
                  padding: "4px 8px",
                  border: `1px solid ${color}`,
                  color,
                  letterSpacing: "0.08em",
                }}>
                  {type.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: "'Press Start 2P'", fontSize: "6px",
                  padding: "4px 8px",
                  border: "1px solid var(--r-border)",
                  color: "var(--r-gray)",
                  letterSpacing: "0.08em",
                }}>
                  {element.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: "'Press Start 2P'", fontSize: "6px",
                  padding: "4px 8px",
                  border: "1px solid var(--r-yellow)",
                  color: "var(--r-yellow)",
                  letterSpacing: "0.08em",
                  marginLeft: "auto",
                }}>
                  LV {level}
                </span>
              </div>

              {/* Icon + name */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2rem" }}>{icon}</span>
                <h3 style={{
                  fontFamily: "'Press Start 2P'",
                  fontSize: "11px",
                  color: "var(--r-white)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.5,
                }}>
                  {name}
                </h3>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "'VT323'",
                fontSize: "20px",
                color: "var(--r-gray)",
                lineHeight: 1.55,
                marginBottom: "1.25rem",
              }}>
                {desc}
              </p>

              {/* Mini stats */}
              <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid var(--r-border)", paddingTop: "1rem" }}>
                {stats.map(({ label, val }) => (
                  <div key={label}>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", marginBottom: "3px", letterSpacing: "0.08em" }}>{label}</div>
                    <div style={{ fontFamily: "'Press Start 2P'", fontSize: "9px", color, textShadow: `0 0 8px ${color}` }}>{val}</div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
