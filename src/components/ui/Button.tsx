import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md active:translate-y-px disabled:bg-neutral-200 disabled:text-neutral-400",
  secondary:
    "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200",
  ghost:
    "bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100 disabled:text-neutral-400",
  destructive:
    "bg-error-strong text-white hover:bg-error-base active:translate-y-px disabled:bg-neutral-200 disabled:text-neutral-400",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8  px-3 text-small",
  md: "h-10 px-5 text-body",
  lg: "h-12 px-7 text-body-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold",
          "transition-[background-color,box-shadow,transform] duration-fast ease-out-soft",
          "disabled:cursor-not-allowed",
          fullWidth && "w-full",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon && <span className="-ml-1 flex items-center">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="-mr-1 flex items-center">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = "Button";
