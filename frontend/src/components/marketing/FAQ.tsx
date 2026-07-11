"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const EASE = [0.16, 1, 0.3, 1];

const NPCS = [
  {
    id:       "NPC-001",
    avatar:   "🧙",
    name:     "WIZARD MORPH",
    role:     "Lore Keeper",
    question: "What is a portal link and how does it work?",
    answer:   "A portal link is a short URL that acts as a magical gateway. When a traveler clicks it, our realm server instantly redirects them to the original destination. You forge the long URL into a 6-character portal code — it takes under 100 milliseconds.",
  },
  {
    id:       "NPC-002",
    avatar:   "⚔️",
    name:     "CAPTAIN VANCE",
    role:     "Battle Strategist",
    question: "How do the click analytics actually work?",
    answer:   "Every time a traveler enters your portal, our tracking crystal logs the XP: their realm of origin (country), the referring map (referrer URL), their device class, and the exact timestamp. View your loot in the Quest Log dashboard.",
  },
  {
    id:       "NPC-003",
    avatar:   "🔐",
    name:     "GUARDIAN KRIX",
    role:     "Shield Bearer",
    question: "Are my portals protected? Who can see them?",
    answer:   "Each adventurer's portal inventory is guarded by JWT shield magic. Only you can view, edit, or delete your own links. No other guild member can access your data. One-click deletion available anytime from your Quest Log.",
  },
  {
    id:       "NPC-004",
    avatar:   "💎",
    name:     "MERCHANT TOVA",
    role:     "Guild Treasurer",
    question: "Can I upgrade or change my tier later?",
    answer:   "Aye! You may upgrade your loadout from Novice to Warrior tier at any time. Payment is processed through the enchanted Stripe gateway. Cancel anytime with no cursed lock-in fees. Annual subscribers save 20% gold.",
  },
  {
    id:       "NPC-005",
    avatar:   "🗺️",
    name:     "EXPLORER DANA",
    role:     "Realm Scout",
    question: "Do my portals expire?",
    answer:   "Free tier portals persist for 7 days of inactivity before dissolving. Pro and Guild tier portals live forever — or until you choose to destroy them. Pro tier also stores up to 90 days of click history in the data crystal.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" style={{ padding: "5rem 1.5rem", background: "var(--r-surface)", position: "relative" }}>

      <div className="area-transition">
        <div className="retro-divider" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          💬 NPC VILLAGE · CHAPTER V
        </div>
      </div>

      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <div className="retro-section-label" style={{ marginBottom: "1rem" }}>TALK TO NPC · PRESS ▶ TO SPEAK</div>
          <h2 style={{
            fontFamily: "'Press Start 2P'",
            fontSize: "clamp(14px, 2.5vw, 20px)",
            color: "var(--r-white)", lineHeight: 1.7, marginBottom: "0.75rem",
          }}>
            FREQUENTLY ASKED <br/>
            <span style={{ color: "var(--r-cyan)", textShadow: "0 0 12px var(--r-cyan)" }}>QUESTIONS</span>
          </h2>
          <p style={{ fontFamily: "'VT323'", fontSize: "22px", color: "var(--r-gray)" }}>
            Speak with our village NPCs to learn more about the realm.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {NPCS.map(({ id, avatar, name, role, question, answer }) => {
            const isOpen = open === id;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div
                  style={{
                    border: isOpen ? "2px solid var(--r-cyan)" : "2px solid var(--r-border)",
                    background: "var(--r-panel)",
                    boxShadow: isOpen ? "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 20px rgba(0,212,255,0.1)" : "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    overflow: "hidden",
                  }}
                >
                  {/* NPC trigger */}
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    style={{
                      width: "100%",
                      padding: "1rem 1.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      textAlign: "left",
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: "40px", height: "40px", flexShrink: 0,
                      background: isOpen ? "rgba(0,212,255,0.1)" : "var(--r-bg)",
                      border: `1px solid ${isOpen ? "var(--r-cyan)" : "var(--r-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.25rem",
                      transition: "all 0.2s",
                    }}>
                      {avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: isOpen ? "var(--r-cyan)" : "var(--r-gray)", letterSpacing: "0.08em", transition: "color 0.2s", textShadow: isOpen ? "0 0 8px var(--r-cyan)" : "none" }}>
                          {name}
                        </span>
                        <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-border)", letterSpacing: "0.06em" }}>
                          [{role}]
                        </span>
                      </div>
                      <p style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-white)", lineHeight: 1.4, margin: 0 }}>
                        {question}
                      </p>
                    </div>

                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? "var(--r-cyan)" : "var(--r-gray)" }}
                      transition={{ duration: 0.2 }}
                      style={{ fontFamily: "'Press Start 2P'", fontSize: "12px", flexShrink: 0, color: "var(--r-gray)" }}
                    >
                      +
                    </motion.div>
                  </button>

                  {/* Answer dialog */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{
                          padding: "0 1.25rem 1.25rem 4.5rem",
                          borderTop: "1px solid var(--r-border)",
                          paddingTop: "1rem",
                        }}>
                          <div className="dialog-box" style={{ border: "1px solid rgba(0,212,255,0.25)", boxShadow: "none" }}>
                            <div className="dialog-speaker">{name}</div>
                            <p className="dialog-text">{answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Easter egg konami hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-border)", letterSpacing: "0.15em" }}>
            PST... TRY: ↑ ↑ ↓ ↓ ← → ← → B A
          </p>
        </motion.div>
      </div>
    </section>
  );
}
