"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-snip-text2 tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-snip-text3 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-surface2 border rounded-[10px] px-3.5 py-3 text-sm font-body",
              "text-snip-text placeholder:text-snip-text3",
              "transition-all duration-150 outline-none",
              "focus:border-accent focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)]",
              error ? "border-red" : "border-border",
              icon ? "pl-10" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red font-body mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
