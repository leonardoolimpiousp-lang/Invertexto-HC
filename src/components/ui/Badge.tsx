import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "neutral" | "brand" | "success" | "warning" | "error" | "info" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  brand:   "bg-brand-100 text-brand-700",
  success: "bg-success-soft text-success-base",
  warning: "bg-warning-soft text-warning-base",
  error:   "bg-error-soft text-error-base",
  info:    "bg-info-soft text-info-base",
  accent:  "bg-accent-100 text-warning-base",
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
