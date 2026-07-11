"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

const ITEMS = [
  {
    tier:      "NOVICE",
    name:      "FREE KIT",
    rarity:    "COMMON",
    price:     { monthly: 0, annual: 0 },
    color:     "var(--r-gray)",
    boxClass:  "",
    cta:       "EQUIP FREE",
    href:      "/register",
    highlight: false,
    loot: [
      "50 portals / month",
      "Basic click analytics",
      "QR code scrolls",
      "7-day data crystal",
    ],
  },
  {
    tier:      "WARRIOR",
    name:      "PRO BUNDLE",
    rarity:    "RARE ★★★",
    price:     { monthly: 9, annual: 7 },
    color:     "var(--r-cyan)",
    boxClass:  "pixel-box",
    cta:       "EQUIP PRO",
    href:      "/register?plan=pro",
    highlight: true,
    loot: [
      "∞ Unlimited portals",
      "Full analytics tome",
      "Custom short codes",
      "90-day data crystal",
      "CSV export scroll",
      "API access key",
    ],
  },
  {
    tier:      "GUILD MASTER",
    name:      "TEAM PACK",
    rarity:    "LEGENDARY",
    price:     { monthly: 29, annual: 22 },
    color:     "var(--r-yellow)",
    boxClass:  "",
    cta:       "CONTACT GUILD",
    href:      "mailto:sales@snip.link",
    highlight: false,
    loot: [
      "Everything in PRO",
      "Team war room",
      "SSO / SAML shield",
      "∞ data crystal",
      "Dedicated sage",
      "Custom domain rune",
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" style={{ padding: "5rem 1.5rem", background: "var(--r-bg)", position: "relative" }}>

      <div className="area-transition">
        <div className="retro-divider" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          🏪 ENTERING THE GUILD SHOP · CHAPTER IV
        </div>
      </div>

      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <div className="retro-section-label" style={{ marginBottom: "1rem" }}>ITEM SHOP · SELECT TIER</div>
          <h2 style={{
            fontFamily: "'Press Start 2P'",
            fontSize: "clamp(14px, 2.5vw, 20px)",
            color: "var(--r-white)", lineHeight: 1.7, marginBottom: "0.75rem",
          }}>
            CHOOSE YOUR <span style={{ color: "var(--r-yellow)", textShadow: "0 0 12px var(--r-yellow)" }}>LOADOUT</span>
          </h2>
          <p style={{ fontFamily: "'VT323'", fontSize: "22px", color: "var(--r-gray)", marginBottom: "1.5rem" }}>
            No hidden fees. No vendor lock-in. Upgrade or retire your gear anytime.
          </p>

          {/* Payment cycle toggle */}
          <div style={{
            display: "inline-flex",
            border: "1px solid var(--r-border)",
            background: "var(--r-panel)",
            overflow: "hidden",
          }}>
            {["MONTHLY", "ANNUAL"].map(mode => {
              const isActive = mode === "ANNUAL" ? annual : !annual;
              return (
                <button
                  key={mode}
                  onClick={() => setAnnual(mode === "ANNUAL")}
                  style={{
                    padding: "8px 16px",
                    fontFamily: "'Press Start 2P'", fontSize: "7px",
                    background: isActive ? "var(--r-cyan)" : "transparent",
                    color: isActive ? "var(--r-bg)" : "var(--r-gray)",
                    border: "none", cursor: "pointer",
                    letterSpacing: "0.08em",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                >
                  {mode}
                  {mode === "ANNUAL" && (
                    <span style={{
                      fontSize: "6px", padding: "2px 5px",
                      background: isActive ? "rgba(0,0,0,0.3)" : "rgba(0,255,65,0.15)",
                      color: isActive ? "var(--r-bg)" : "var(--r-green)",
                      border: isActive ? "none" : "1px solid var(--r-green)",
                    }}>
                      -20%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", alignItems: "start" }}
        >
          {ITEMS.map(({ tier, name, rarity, price, color, boxClass, cta, href, highlight, loot }) => (
            <motion.div
              key={tier}
              variants={card}
              whileHover={{ y: -5 }}
              style={{
                padding: "1.75rem",
                background: "var(--r-panel)",
                border: highlight ? `2px solid ${color}` : "2px solid var(--r-border)",
                boxShadow: highlight ? `0 0 0 1px var(--r-bg), 0 0 0 3px ${color}, 0 0 32px ${color}22` : "none",
                position: "relative",
              }}
            >
              {/* Rarity tag */}
              <div style={{
                position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)",
                background: "var(--r-bg)", padding: "0 8px",
                fontFamily: "'Press Start 2P'", fontSize: "7px",
                color, textShadow: `0 0 8px ${color}`,
                whiteSpace: "nowrap",
              }}>
                {rarity}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-gray)", letterSpacing: "0.15em", marginBottom: "0.5rem" }}>
                  {tier} TIER
                </div>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: "13px", color, textShadow: `0 0 10px ${color}`, letterSpacing: "0.04em", marginBottom: "1rem" }}>
                  {name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                  <span style={{ fontFamily: "'Press Start 2P'", fontSize: "24px", color: "var(--r-white)" }}>
                    ${annual ? price.annual : price.monthly}
                  </span>
                  {price.monthly > 0 && (
                    <span style={{ fontFamily: "'VT323'", fontSize: "18px", color: "var(--r-gray)" }}>/MOON</span>
                  )}
                </div>
              </div>

              <Link href={href} style={{ textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  style={{
                    width: "100%",
                    fontFamily: "'Press Start 2P'", fontSize: "7px",
                    padding: "10px",
                    background: highlight ? color : "transparent",
                    color: highlight ? "var(--r-bg)" : color,
                    border: `2px solid ${color}`,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    boxShadow: highlight ? `0 0 16px ${color}44` : "none",
                    transition: "all 0.1s",
                  }}
                >
                  ▶ {cta}
                </motion.button>
              </Link>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>
                  LOOT CONTENTS:
                </div>
                {loot.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <span style={{ color: "var(--r-green)", flexShrink: 0, fontSize: "12px" }}>◆</span>
                    <span style={{ fontFamily: "'VT323'", fontSize: "18px", color: "rgba(232,244,248,0.65)", lineHeight: 1.3 }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
