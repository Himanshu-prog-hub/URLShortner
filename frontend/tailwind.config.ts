import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg:          "#070b12",
        surface:     "#0d1523",
        surface2:    "#121d30",
        surface3:    "#18243a",
        border:      "#1c2c44",
        border2:     "#243447",
        accent:      "#0ea5e9",
        accent2:     "#38bdf8",
        snip: {
          text:  "#dde5f0",
          text2: "#7a90b0",
          text3: "#3d5270",
        },
        green:  "#10d9a0",
        red:    "#f05d6a",
        yellow: "#f0c040",
        retro: {
          bg:      "#050508",
          surface: "#09090f",
          panel:   "#0d0d1a",
          border:  "#1a1a3a",
          cyan:    "#00d4ff",
          cyan2:   "#38e8ff",
          green:   "#00ff41",
          pink:    "#ff2d78",
          yellow:  "#ffd700",
          orange:  "#ff8c00",
          white:   "#e8f4f8",
          gray:    "#3a4a6a",
        },
      },
      fontFamily: {
        sans:  ["Space Grotesk", "sans-serif"],
        body:  ["Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
        pixel: ["'Press Start 2P'", "monospace"],
        retro: ["VT323", "monospace"],
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle, #1c2c44 1px, transparent 1px)",
        "glow-accent": "radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, transparent 70%)",
        "gradient-text": "linear-gradient(160deg, #e8edf5 30%, #6b90c0)",
        "gradient-hero": "linear-gradient(135deg, #070b12 0%, #0d1523 100%)",
      },
      backgroundSize: {
        "dot-28": "28px 28px",
      },
      boxShadow: {
        "glow-sm":  "0 0 14px rgba(14,165,233,0.20)",
        "glow":     "0 0 24px rgba(14,165,233,0.28)",
        "glow-lg":  "0 0 48px rgba(14,165,233,0.30)",
        "card":     "0 4px 24px rgba(0,0,0,0.40)",
      },
      animation: {
        "pulse-dot": "pulseDot 2s cubic-bezier(0.16,1,0.3,1) infinite",
        "float":     "float 6s ease-in-out infinite",
        "shimmer":   "shimmer 2s linear infinite",
        "spotlight": "spotlight 2s ease .75s 1 forwards",
        "border-glow": "borderGlow 2s ease-in-out infinite",
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%":     { transform: "scale(1.5)", opacity: "0.6" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spotlight: {
          "0%":   { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%, -40%) scale(1)" },
        },
        borderGlow: {
          "0%,100%": { borderColor: "rgba(14,165,233,0.20)" },
          "50%":     { borderColor: "rgba(14,165,233,0.50)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
