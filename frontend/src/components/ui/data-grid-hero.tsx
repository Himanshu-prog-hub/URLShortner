"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from "react";

/* ── Types ────────────────────────────────────────────────────── */
export type AnimationType = "pulse" | "wave" | "random";

export interface DataGridHeroProps {
  /** Fixed rows — ignored when responsive=true */
  rows?: number;
  /** Fixed cols — ignored when responsive=true */
  cols?: number;
  /**
   * Auto-fill the container from its pixel size.
   * Uses cellSize + spacing as the pitch. Default: true
   */
  responsive?: boolean;
  /** Cell size in px (used in responsive mode). Default: 22 */
  cellSize?: number;
  /** Gap between cells in px. Default: 3 */
  spacing?: number;
  /** Single cell animation duration in seconds. Default: 5 */
  duration?: number;
  /** CSS color for each cell. Default: snip blue */
  color?: string;
  /** How the pulse delay is distributed. Default: "wave" */
  animationType?: AnimationType;
  /** Enable opacity animation on cells. Default: true */
  pulseEffect?: boolean;
  /** Enable mouse-follow radial glow. Default: true */
  mouseGlow?: boolean;
  /** Glow color (CSS). Default: snip accent */
  glowColor?: string;
  /** Glow radius in px. Default: 320 */
  glowRadius?: number;
  /** Cell opacity at rest. Default: 0.03 */
  opacityMin?: number;
  /** Cell opacity at peak. Default: 0.50 */
  opacityMax?: number;
  /** Container background. Default: snip dark */
  background?: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/* ═══════════════════════════════════════════════════════════════ */
export function DataGridHero({
  rows: fixedRows,
  cols: fixedCols,
  responsive = true,
  cellSize = 22,
  spacing = 3,
  duration = 5,
  color = "rgba(14,165,233,1)",
  animationType = "wave",
  pulseEffect = true,
  mouseGlow = true,
  glowColor = "rgba(14,165,233,0.15)",
  glowRadius = 320,
  opacityMin = 0.03,
  opacityMax = 0.50,
  background = "#070b12",
  children,
  className = "",
  style,
}: DataGridHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Responsive sizing ──────────────────────────────────────── */
  const [dims, setDims] = useState({ rows: fixedRows ?? 24, cols: fixedCols ?? 38 });

  useEffect(() => {
    if (!responsive || !rootRef.current) return;
    const pitch = cellSize + spacing;
    const update = () => {
      const el = rootRef.current;
      if (!el) return;
      setDims({
        rows: Math.ceil(el.offsetHeight / pitch) + 1,
        cols: Math.ceil(el.offsetWidth  / pitch) + 1,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [responsive, cellSize, spacing]);

  // Sync fixed-mode dims
  useEffect(() => {
    if (!responsive) {
      setDims({ rows: fixedRows ?? 24, cols: fixedCols ?? 38 });
    }
  }, [responsive, fixedRows, fixedCols]);

  /* ── Build cells ────────────────────────────────────────────── */
  useEffect(() => {
    const container = gridRef.current;
    if (!container || dims.rows === 0 || dims.cols === 0) return;

    container.innerHTML = "";
    container.style.gridTemplateColumns = `repeat(${dims.cols}, 1fr)`;
    container.style.gridTemplateRows    = `repeat(${dims.rows}, 1fr)`;
    container.style.gap = `${spacing}px`;

    const total     = dims.rows * dims.cols;
    const centerRow = Math.floor(dims.rows / 2);
    const centerCol = Math.floor(dims.cols / 2);

    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / dims.cols);
      const c = i % dims.cols;

      const cell = document.createElement("div");
      cell.className = "dgh-cell";
      cell.style.backgroundColor = color;
      cell.style.setProperty("--dgh-opacity-min", String(opacityMin));
      cell.style.setProperty("--dgh-opacity-max", String(opacityMax));

      if (pulseEffect) {
        let delay = 0;
        if (animationType === "wave") {
          // diagonal wave top-left → bottom-right
          delay = (r + c) * 0.07;
        } else if (animationType === "random") {
          delay = Math.random() * duration;
        } else {
          // pulse outward from center
          const dr = Math.abs(r - centerRow);
          const dc = Math.abs(c - centerCol);
          delay = Math.sqrt(dr * dr + dc * dc) * 0.18;
        }
        cell.style.animation      = `dgh-pulse ${duration}s infinite alternate`;
        cell.style.animationDelay = `${delay.toFixed(3)}s`;
      } else {
        cell.style.opacity = String(opacityMin);
      }

      container.appendChild(cell);
    }
  }, [dims, spacing, color, animationType, pulseEffect, duration, opacityMin, opacityMax]);

  /* ── Mouse glow via CSS custom properties ───────────────────── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--dgh-mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--dgh-my", `${e.clientY - rect.top}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    gridRef.current?.style.setProperty("--dgh-mx", "-9999px");
    gridRef.current?.style.setProperty("--dgh-my", "-9999px");
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!mouseGlow || !el) return;
    el.addEventListener("mousemove",  handleMouseMove  as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave as EventListener);
    return () => {
      el.removeEventListener("mousemove",  handleMouseMove  as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [mouseGlow, handleMouseMove, handleMouseLeave]);

  /* ── Inline glow radius (so CSS var reads it) ───────────────── */
  useEffect(() => {
    gridRef.current?.style.setProperty("--dgh-glow-radius", `${glowRadius}px`);
    gridRef.current?.style.setProperty("--dgh-glow-color",  glowColor);
  }, [glowRadius, glowColor]);

  return (
    <div
      ref={rootRef}
      className={`dgh-root ${className}`}
      style={{ background, ...style }}
    >
      {/* Grid layer */}
      <div
        ref={gridRef}
        className="dgh-grid"
        aria-hidden="true"
        style={{
          // default mouse position off-screen
          ["--dgh-mx" as string]: "-9999px",
          ["--dgh-my" as string]: "-9999px",
        }}
      />

      {/* Vignette — darkens edges, focuses center */}
      <div className="dgh-vignette" aria-hidden="true" />

      {/* Content */}
      <div className="dgh-content">{children}</div>
    </div>
  );
}
