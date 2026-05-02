import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "default" | "accent-brand" | "accent-warning" | "accent-error" | "elevated";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: "border border-neutral-200 shadow-sm",
  "accent-brand": "border border-neutral-200 shadow-sm border-l-4 border-l-brand-600",
  "accent-warning": "border border-neutral-200 shadow-sm border-l-4 border-l-warning-strong",
  "accent-error": "border border-neutral-200 shadow-sm border-l-4 border-l-error-strong",
  elevated: "shadow-lg",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", interactive, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white p-6 md:p-6",
        "max-md:p-4",
        variantStyles[variant],
        interactive &&
          "cursor-pointer transition-[transform,box-shadow] duration-base ease-out-soft hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 flex items-start justify-between gap-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-h4 text-neutral-800", className)} {...props} />;
}

export function CardOverline({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-overline uppercase text-brand-700", className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-body text-neutral-600", className)} {...props} />;
}
