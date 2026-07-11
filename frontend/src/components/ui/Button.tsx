"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 30 };

type Variant = "primary" | "ghost" | "danger" | "surface";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-glow hover:bg-accent2 border border-transparent",
  ghost:   "bg-transparent border border-border text-snip-text2 hover:bg-surface3 hover:text-snip-text",
  danger:  "bg-transparent border border-border text-snip-text3 hover:bg-red/10 hover:text-red hover:border-red/40",
  surface: "bg-surface2 border border-border text-snip-text2 hover:bg-surface3 hover:text-snip-text",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold rounded-[10px] gap-2",
  lg: "px-7 py-3.5 text-sm font-semibold rounded-[12px] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, children, className, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? {} : { y: -2 }}
        whileTap={disabled || loading ? {} : { scale: 0.97 }}
        transition={SPRING}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-sans transition-colors duration-150 cursor-pointer select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {children}
          </>
        ) : children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
