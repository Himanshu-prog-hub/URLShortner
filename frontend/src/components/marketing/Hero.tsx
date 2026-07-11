"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Dot-grid canvas that ripples outward from the cursor */
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext("2d")!;
    const SPACING = 28;
    const BASE_RADIUS = 1.1;
    const MAX_RADIUS  = 4;
    const INFLUENCE   = 120;

    let W = 0, H = 0;

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / SPACING) + 1;
      const rows = Math.ceil(H / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * SPACING;
          const y = r * SPACING;
          const dist = Math.hypot(x - mouse.current.x, y - mouse.current.y);
          const t      = Math.max(0, 1 - dist / INFLUENCE);
          const radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * t;
          const alpha  = 0.22 + 0.55 * t;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,233,${alpha})`;
          ctx.fill();
        }
      }
      rafId.current = requestAnimationFrame(draw);
    }

    draw();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    canvas.parentElement!.addEventListener("mousemove", onMove);
    canvas.parentElement!.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
}

const ROTATING_WORDS = ["any link.", "long URLs.", "every link.", "your links."];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ minWidth: "9ch" }}>
      <motion.span
        key={index}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%",   opacity: 1 }}
        exit={{   y: "-100%", opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="block text-gradient-accent"
      >
        {ROTATING_WORDS[index]}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 px-6 overflow-hidden"
    >
      {/* Dot grid */}
      <div className="absolute inset-0">
        <DotGrid />
      </div>

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[480px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
      >
        {/* Badge */}
        <motion.div variants={item} className="mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
            style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8", borderColor: "rgba(14,165,233,0.25)" }}>
            ⚡ Blazing fast link shortener
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="font-sans font-bold tracking-tight mb-5"
          style={{ fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 1.05, letterSpacing: "-0.04em" }}
        >
          <span className="text-gradient">Shorten&nbsp;</span>
          <RotatingWord />
          <br />
          <span className="text-gradient">Track every click.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={item}
          className="text-lg text-snip-text2 font-body max-w-md leading-relaxed mb-10"
        >
          Turn long URLs into sharp, trackable links — with real-time analytics
          on clicks, referrers, and geography.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Start for free — it&apos;s instant
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="ghost" size="lg">
              See how it works →
            </Button>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={item} className="mt-5 text-xs text-snip-text3 font-body">
          No credit card · No setup · 30-second onboarding
        </motion.p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 mt-20 flex flex-wrap justify-center gap-12"
      >
        {[
          { value: "28.4M", label: "Links shortened", sub: "↑ 12% this month" },
          { value: "1.2B",  label: "Clicks tracked",  sub: null },
          { value: "190+",  label: "Countries reached", sub: null },
        ].map(({ value, label, sub }) => (
          <motion.div key={label} variants={item} className="text-center">
            <div className="font-sans font-bold text-snip-text" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>{value}</div>
            <div className="text-sm text-snip-text2 mt-1 font-body">{label}</div>
            {sub && <div className="text-xs text-accent mt-0.5 font-body">{sub}</div>}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
