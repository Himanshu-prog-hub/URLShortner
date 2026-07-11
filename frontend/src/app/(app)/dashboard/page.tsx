"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isAuthenticated, getUsername, clearToken } from "@/lib/auth";
import { links, StatsResponse } from "@/lib/api";
import Link from "next/link";

/* ── SVG icons ─────────────────────────────────────────────────── */
const CopyIcon    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const TrashIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const ExternalIcon= () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const CheckIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const RefreshIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

/* ── Animation constants ───────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp   = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };
const listItem = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.35, ease: EASE } },
  exit:   { opacity: 0, x: -24, scale: 0.98, transition: { duration: 0.22 } },
};

/* ── Toast ─────────────────────────────────────────────────────── */
interface Toast { id: number; msg: string; type: "success" | "error" }

function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 100, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.625rem 1rem",
              background: t.type === "success" ? "rgba(0,255,65,0.08)" : "rgba(255,45,120,0.08)",
              border: `2px solid ${t.type === "success" ? "var(--r-green)" : "var(--r-pink)"}`,
              boxShadow: `0 0 12px ${t.type === "success" ? "rgba(0,255,65,0.2)" : "rgba(255,45,120,0.2)"}`,
              fontFamily: "'Press Start 2P'",
              fontSize: "7px",
              color: t.type === "success" ? "var(--r-green)" : "var(--r-pink)",
              letterSpacing: "0.06em",
              minWidth: "200px",
            }}
          >
            {t.type === "success" ? <CheckIcon /> : "✗"}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = "var(--r-cyan)" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        padding: "1rem 1.25rem",
        background: "var(--r-panel)",
        border: `2px solid var(--r-border)`,
        flex: 1,
        minWidth: "130px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Corner accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "6px", background: color }} />
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Press Start 2P'", fontSize: "clamp(14px, 2.5vw, 20px)", color, textShadow: `0 0 10px ${color}`, lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "'VT323'", fontSize: "16px", color: "var(--r-gray)", marginTop: "4px" }}>{sub}</div>
      )}
    </motion.div>
  );
}

/* ── Delete confirm modal ──────────────────────────────────────── */
function DeleteModal({ code, onConfirm, onCancel }: { code: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(5,5,8,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        onClick={e => e.stopPropagation()}
        className="pixel-box"
        style={{ padding: "2rem", maxWidth: "380px", width: "90%", background: "var(--r-panel)" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1rem" }}>
          <div className="retro-section-label" style={{ marginBottom: "0.5rem" }}>⚠ SYSTEM WARNING</div>
          <h3 style={{ fontFamily: "'Press Start 2P'", fontSize: "12px", color: "var(--r-pink)", textShadow: "0 0 8px var(--r-pink)", lineHeight: 1.6 }}>
            DESTROY PORTAL?
          </h3>
        </div>

        {/* Dialog box */}
        <div className="dialog-box" style={{ marginBottom: "1.5rem", borderColor: "rgba(255,45,120,0.4)" }}>
          <div className="dialog-speaker" style={{ color: "var(--r-pink)", borderColor: "var(--r-pink)" }}>SYSTEM</div>
          <p className="dialog-text">
            Portal <span style={{ color: "var(--r-pink)", fontFamily: "'Press Start 2P'", fontSize: "8px" }}>/{code}</span> will be permanently destroyed. This cannot be undone. All XP associated with this portal will be lost forever.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              fontFamily: "'Press Start 2P'", fontSize: "7px",
              background: "transparent",
              border: "2px solid var(--r-border)",
              color: "var(--r-gray)",
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            CANCEL
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              fontFamily: "'Press Start 2P'", fontSize: "7px",
              background: "rgba(255,45,120,0.12)",
              border: "2px solid var(--r-pink)",
              color: "var(--r-pink)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              boxShadow: "0 0 12px rgba(255,45,120,0.2)",
            }}
          >
            ✗ DESTROY
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Quest item (link row) ─────────────────────────────────────── */
function QuestItem({
  link,
  onCopy,
  onDelete,
  onOpen,
  copiedCode,
  index,
}: {
  link: StatsResponse;
  onCopy: (code: string) => void;
  onDelete: (code: string) => void;
  onOpen: (url: string) => void;
  copiedCode: string | null;
  index: number;
}) {
  const isCopied = copiedCode === link.shortCode;
  const xp = link.clickCount;
  const xpColor = xp === 0 ? "var(--r-gray)" : xp >= 100 ? "var(--r-yellow)" : xp >= 10 ? "var(--r-cyan)" : "var(--r-green)";

  return (
    <motion.div
      layout
      variants={listItem}
      style={{
        display: "flex", alignItems: "center", gap: "0.875rem",
        padding: "0.875rem 1rem",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,212,255,0.18)",
        transition: "border-color 0.2s, background 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ borderColor: "rgba(0,212,255,0.5)", background: "rgba(0,212,255,0.04)" }}
    >
      {/* Quest number */}
      <div style={{
        fontFamily: "'Press Start 2P'", fontSize: "7px",
        color: "rgba(0,212,255,0.35)",
        flexShrink: 0, width: "24px", textAlign: "right",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* XP badge */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        minWidth: "52px", flexShrink: 0,
        padding: "4px 6px",
        background: xp > 0 ? `${xpColor}11` : "rgba(255,255,255,0.02)",
        border: `1px solid ${xp > 0 ? xpColor : "var(--r-border)"}`,
      }}>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-gray)", letterSpacing: "0.06em", marginBottom: "2px" }}>XP</div>
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "10px", color: xpColor, textShadow: xp > 0 ? `0 0 6px ${xpColor}` : "none" }}>
          {xp}
        </div>
      </div>

      {/* URLs */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "3px", flexWrap: "wrap" }}>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Visit short URL → ${link.shortUrl}`}
            style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-cyan)", textShadow: "0 0 6px rgba(0,212,255,0.4)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            /{link.shortCode}
          </a>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-border)", letterSpacing: "0.06em" }}>
            {new Date(link.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase()}
          </span>
          {xp >= 100 && (
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "5px", color: "var(--r-yellow)", letterSpacing: "0.06em", textShadow: "0 0 6px var(--r-yellow)" }}>
              ★ HOT
            </span>
          )}
        </div>
        <div style={{ fontFamily: "'VT323'", fontSize: "17px", color: "var(--r-gray)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {link.longUrl}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.3rem", flexShrink: 0 }}>
        {/* Copy */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onCopy(link.shortCode)}
          title="Copy portal link"
          style={{
            width: "30px", height: "30px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: isCopied ? "1px solid var(--r-green)" : "1px solid var(--r-border)",
            background: isCopied ? "rgba(0,255,65,0.08)" : "rgba(255,255,255,0.02)",
            color: isCopied ? "var(--r-green)" : "var(--r-gray)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </motion.button>

        {/* Open */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onOpen(link.longUrl)}
          title="Open original URL"
          style={{
            width: "30px", height: "30px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid var(--r-border)",
            background: "rgba(255,255,255,0.02)",
            color: "var(--r-gray)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <ExternalIcon />
        </motion.button>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(link.shortCode)}
          title="Destroy portal"
          style={{
            width: "30px", height: "30px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid rgba(255,45,120,0.2)",
            background: "rgba(255,45,120,0.04)",
            color: "rgba(255,45,120,0.5)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <TrashIcon />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                       */
/* ═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();

  // Must be null initially so server and client render the same thing on first
  // paint. Reading localStorage during render causes a hydration mismatch
  // because the server has no localStorage and renders null/"PLAYER", while
  // the client immediately reads the real value.
  const [username, setUsername] = useState<string | null>(null);

  const [allLinks,     setAllLinks]     = useState<StatsResponse[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [url,          setUrl]          = useState("");
  const [customCode,   setCustomCode]   = useState("");
  const [shortening,   setShortening]   = useState(false);
  const [newResult,    setNewResult]    = useState<StatsResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [copiedCode,   setCopiedCode]   = useState<string | null>(null);
  const [toasts,       setToasts]       = useState<Toast[]>([]);
  const [refreshing,   setRefreshing]   = useState(false);
  const [urlFocused,   setUrlFocused]   = useState(false);
  const [codeFocused,  setCodeFocused]  = useState(false);

  /* Auth guard + username — both read localStorage, so both run after mount */
  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    else setUsername(getUsername());
  }, [router]);

  /* Toast helper */
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg: msg.toUpperCase(), type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  /* Fetch links */
  const fetchLinks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await links.getAll();
      setAllLinks(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      addToast("FAILED TO LOAD QUESTS", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  /* Shorten */
  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setShortening(true);
    setNewResult(null);
    try {
      const result = await links.shorten({ longUrl: url.trim(), customCode: customCode.trim() || undefined });
      const statsResult: StatsResponse = { ...result, clickCount: 0 };
      setNewResult(statsResult);
      setAllLinks(prev => [statsResult, ...prev]);
      setUrl("");
      setCustomCode("");
      addToast("PORTAL FORGED!");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "FORGE FAILED", "error");
    } finally {
      setShortening(false);
    }
  };

  /* Copy */
  const handleCopy = useCallback(async (code: string) => {
    const link = allLinks.find(l => l.shortCode === code);
    const shortUrl = link?.shortUrl ?? `${window.location.origin}/api/${code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedCode(code);
      addToast("PORTAL URL COPIED!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      addToast("COPY FAILED", "error");
    }
  }, [addToast, allLinks]);

  /* Delete */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const code = deleteTarget;
    setDeleteTarget(null);
    try {
      await links.delete(code);
      setAllLinks(prev => prev.filter(l => l.shortCode !== code));
      addToast("PORTAL DESTROYED");
    } catch {
      addToast("DESTROY FAILED", "error");
    }
  };

  /* Logout */
  const handleLogout = () => {
    clearToken();
    document.cookie = "snip_token=; path=/; max-age=0";
    // Hard reload so no React state from this account leaks to the next session
    window.location.href = "/login";
  };

  /* Computed stats */
  const totalClicks = allLinks.reduce((s, l) => s + l.clickCount, 0);
  const topLink     = allLinks.reduce((top, l) => l.clickCount > (top?.clickCount ?? -1) ? l : top, allLinks[0] ?? null);

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className="scanlines" style={{ minHeight: "100vh", background: "var(--r-bg)" }}>

      {/* ── Top HUD bar ─────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        borderBottom: "2px solid var(--r-border)",
        background: "rgba(5,5,8,0.95)",
        backdropFilter: "blur(8px)",
        height: "52px",
        display: "flex", alignItems: "center",
        padding: "0 1.5rem",
        gap: "1rem",
      }}>
        {/* XP scan line accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, var(--r-cyan), transparent)" }} />

        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "26px", height: "26px",
            background: "var(--r-cyan)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 8px var(--r-cyan)",
            fontSize: "12px",
          }}>⚡</div>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-cyan)", textShadow: "0 0 6px var(--r-cyan)" }}>SNiP</span>
          <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-border)" }}>.LINK</span>
        </Link>

        {/* Screen label */}
        <div style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", letterSpacing: "0.15em" }}>
          ▶ QUEST LOG
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Player tag */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "4px 10px",
            border: "1px solid var(--r-border)",
            background: "var(--r-panel)",
            fontFamily: "'Press Start 2P'", fontSize: "6px",
            color: "var(--r-gray)", letterSpacing: "0.08em",
          }}>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: "5px", height: "5px", background: "var(--r-green)", boxShadow: "0 0 4px var(--r-green)" }}
            />
            {username ?? "PLAYER"}
          </div>

          {/* Logout */}
          <motion.button
            whileHover={{ borderColor: "var(--r-pink)", color: "var(--r-pink)", boxShadow: "0 0 8px rgba(255,45,120,0.2)" }}
            onClick={handleLogout}
            style={{
              padding: "4px 10px",
              fontFamily: "'Press Start 2P'", fontSize: "6px",
              background: "transparent",
              border: "1px solid var(--r-border)",
              color: "var(--r-gray)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              transition: "all 0.2s",
            }}
          >
            QUIT
          </motion.button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────── */}
      <main style={{ maxWidth: "64rem", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Area header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{ marginBottom: "2rem" }}
        >
          <div className="area-transition" style={{ marginBottom: "1rem" }}>
            <div className="retro-divider" style={{ maxWidth: "500px" }}>
              📜 QUEST LOG · MAIN CAMPAIGN
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h1 style={{
                fontFamily: "'Press Start 2P'",
                fontSize: "clamp(12px, 2vw, 18px)",
                color: "var(--r-white)",
                lineHeight: 1.6, marginBottom: "0.25rem",
              }}>
                WELCOME BACK,{" "}
                <span style={{ color: "var(--r-cyan)", textShadow: "0 0 10px var(--r-cyan)" }}>
                  {(username ?? "PLAYER").toUpperCase()}
                </span>
              </h1>
              <p style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-gray)" }}>
                Your portals await. Track every click. Dominate the realm.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ──────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", marginBottom: "1.75rem" }}
        >
          <StatCard
            label="PORTALS FORGED"
            value={allLinks.length}
            sub={allLinks.length === 1 ? "1 active portal" : `${allLinks.length} active portals`}
            color="var(--r-cyan)"
          />
          <StatCard
            label="TOTAL XP EARNED"
            value={totalClicks}
            sub={totalClicks > 0 ? "clicks across all portals" : "no clicks yet"}
            color={totalClicks > 0 ? "var(--r-green)" : "var(--r-gray)"}
          />
          <StatCard
            label="TOP PORTAL"
            value={topLink ? `/${topLink.shortCode}` : "—"}
            sub={topLink ? `${topLink.clickCount} XP earned` : undefined}
            color="var(--r-yellow)"
          />
        </motion.div>

        {/* ── Forge portal form ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          style={{ marginBottom: "1.75rem" }}
        >
          <div className="pixel-box" style={{ padding: "1.5rem" }}>
            {/* Form header */}
            <div style={{ marginBottom: "1rem" }}>
              <div className="retro-section-label" style={{ marginBottom: "0.5rem" }}>
                ⚔ MAIN QUEST · ACTIVE
              </div>
              <div style={{ fontFamily: "'Press Start 2P'", fontSize: "11px", color: "var(--r-white)", letterSpacing: "0.03em" }}>
                FORGE NEW PORTAL
              </div>
              <p style={{ fontFamily: "'VT323'", fontSize: "18px", color: "var(--r-gray)", marginTop: "3px" }}>
                Transform a long URL into a razor-sharp portal link
              </p>
            </div>

            <form onSubmit={handleShorten} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                {/* Long URL input */}
                <div style={{
                  flex: "1 1 260px",
                  display: "flex",
                  border: `2px solid ${urlFocused ? "var(--r-cyan)" : "var(--r-border)"}`,
                  background: "var(--r-bg)",
                  boxShadow: urlFocused ? "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 12px rgba(0,212,255,0.12)" : "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <div style={{
                    padding: "0 10px",
                    display: "flex", alignItems: "center",
                    fontFamily: "'Press Start 2P'", fontSize: "7px",
                    color: urlFocused ? "var(--r-cyan)" : "var(--r-gray)",
                    borderRight: `2px solid ${urlFocused ? "var(--r-cyan)" : "var(--r-border)"}`,
                    background: urlFocused ? "rgba(0,212,255,0.06)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}>
                    URL
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://very-long-url-here.com/path/..."
                    required
                    onFocus={() => setUrlFocused(true)}
                    onBlur={() => setUrlFocused(false)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--r-white)",
                      fontFamily: "'VT323'",
                      fontSize: "19px",
                    }}
                  />
                </div>

                {/* Custom code input */}
                <div style={{
                  flex: "0 1 170px",
                  display: "flex",
                  border: `2px solid ${codeFocused ? "var(--r-cyan)" : "var(--r-border)"}`,
                  background: "var(--r-bg)",
                  boxShadow: codeFocused ? "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-cyan), 0 0 12px rgba(0,212,255,0.12)" : "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}>
                  <div style={{
                    padding: "0 8px",
                    display: "flex", alignItems: "center",
                    fontFamily: "'Press Start 2P'", fontSize: "7px",
                    color: codeFocused ? "var(--r-cyan)" : "var(--r-gray)",
                    borderRight: `2px solid ${codeFocused ? "var(--r-cyan)" : "var(--r-border)"}`,
                    background: codeFocused ? "rgba(0,212,255,0.06)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}>
                    /
                  </div>
                  <input
                    type="text"
                    value={customCode}
                    onChange={e => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                    placeholder="custom-code"
                    maxLength={20}
                    onFocus={() => setCodeFocused(true)}
                    onBlur={() => setCodeFocused(false)}
                    style={{
                      flex: 1,
                      padding: "10px 10px",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--r-cyan)",
                      fontFamily: "'Press Start 2P'",
                      fontSize: "8px",
                      letterSpacing: "0.05em",
                    }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={shortening || !url.trim()}
                  whileHover={!shortening && url.trim() ? { y: -2, boxShadow: "0 0 0 1px var(--r-bg), 0 0 0 3px var(--r-green), 0 0 16px rgba(0,255,65,0.25)" } : {}}
                  whileTap={!shortening && url.trim() ? { y: 1 } : {}}
                  style={{
                    padding: "10px 18px",
                    fontFamily: "'Press Start 2P'", fontSize: "8px",
                    letterSpacing: "0.08em",
                    background: !shortening && url.trim() ? "var(--r-green)" : "rgba(0,255,65,0.08)",
                    color: !shortening && url.trim() ? "var(--r-bg)" : "var(--r-green)",
                    border: "2px solid var(--r-green)",
                    cursor: shortening || !url.trim() ? "not-allowed" : "pointer",
                    boxShadow: !shortening && url.trim() ? "0 0 12px rgba(0,255,65,0.2)" : "none",
                    opacity: shortening || !url.trim() ? 0.6 : 1,
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {shortening ? (
                    <>
                      <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>▶▶</motion.span>
                      FORGING...
                    </>
                  ) : (
                    "⚡ FORGE"
                  )}
                </motion.button>
              </div>
            </form>

            {/* New result banner */}
            <AnimatePresence>
              {newResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
                    padding: "0.75rem 1rem",
                    background: "rgba(0,255,65,0.05)",
                    border: "2px solid var(--r-green)",
                    boxShadow: "0 0 12px rgba(0,255,65,0.15)",
                  }}>
                    <span style={{ fontFamily: "'Press Start 2P'", fontSize: "7px", color: "var(--r-green)", textShadow: "0 0 6px var(--r-green)", letterSpacing: "0.06em" }}>
                      ✓ PORTAL FORGED!
                    </span>
                    <span style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-cyan)", flex: 1 }}>
                      {newResult.shortUrl}
                    </span>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 1 }}
                      onClick={() => handleCopy(newResult.shortCode)}
                      style={{
                        padding: "4px 12px",
                        fontFamily: "'Press Start 2P'", fontSize: "6px",
                        border: "1px solid var(--r-green)",
                        background: "rgba(0,255,65,0.08)",
                        color: "var(--r-green)",
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      COPY
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Quest list header ───────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "8px", color: "var(--r-white)", letterSpacing: "0.06em" }}>
              ACTIVE PORTALS
            </span>
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: "6px", color: "var(--r-gray)", marginLeft: "0.625rem", letterSpacing: "0.06em" }}>
              [{allLinks.length}]
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "var(--r-cyan)", color: "var(--r-cyan)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchLinks(true)}
            disabled={refreshing}
            style={{
              display: "flex", alignItems: "center", gap: "0.375rem",
              padding: "5px 10px",
              fontFamily: "'Press Start 2P'", fontSize: "6px",
              border: "1px solid var(--r-border)",
              background: "transparent",
              color: "var(--r-gray)",
              cursor: "pointer",
              letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}
          >
            <motion.span
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
            >
              <RefreshIcon />
            </motion.span>
            REFRESH
          </motion.button>
        </div>

        {/* ── Quest list ──────────────────────────────────────── */}
        {loading ? (
          /* Skeleton */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: "70px",
                background: "var(--r-panel)",
                border: "2px solid var(--r-border)",
                position: "relative", overflow: "hidden",
              }}>
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.04), transparent)",
                  }}
                />
                <div style={{ padding: "0.875rem 1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: "24px", height: "8px", background: "var(--r-border)", opacity: 0.3 }} />
                  <div style={{ width: "52px", height: "40px", background: "var(--r-border)", opacity: 0.15 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: "8px", width: "30%", background: "var(--r-border)", opacity: 0.3, marginBottom: "8px" }} />
                    <div style={{ height: "6px", width: "60%", background: "var(--r-border)", opacity: 0.15 }} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : allLinks.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--r-panel)",
              border: "2px dashed var(--r-border)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📜</div>
            <div style={{ fontFamily: "'Press Start 2P'", fontSize: "10px", color: "var(--r-gray)", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              NO QUESTS ACTIVE
            </div>
            <p style={{ fontFamily: "'VT323'", fontSize: "20px", color: "var(--r-border)" }}>
              Forge your first portal above to begin your legend.
            </p>
          </motion.div>
        ) : (
          /* Quest list */
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <AnimatePresence initial={false}>
              {allLinks.map((link, i) => (
                <QuestItem
                  key={link.shortCode}
                  link={link}
                  index={i}
                  onCopy={handleCopy}
                  onDelete={setDeleteTarget}
                  onOpen={u => window.open(u, "_blank", "noopener,noreferrer")}
                  copiedCode={copiedCode}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div style={{ height: "3rem" }} />
      </main>

      {/* ── Delete modal ────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            code={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toasts ──────────────────────────────────────────── */}
      <Toasts toasts={toasts} />
    </div>
  );
}
