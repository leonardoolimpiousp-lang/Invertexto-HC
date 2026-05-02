import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, required, leftIcon, rightSlot, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const describedById = helperText || error ? `${inputId}-desc` : undefined;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-body font-semibold text-neutral-700"
          >
            {label}
            {required && (
              <span aria-hidden className="ml-0.5 text-error-strong">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={describedById}
            className={cn(
              "h-10 w-full rounded-md border bg-white text-body text-neutral-800 placeholder-neutral-400",
              "transition-colors duration-fast",
              "focus:outline-none",
              leftIcon ? "pl-10 pr-3" : "px-3",
              rightSlot && "pr-10",
              hasError
                ? "border-error-strong focus:ring-[3px] focus:ring-error-soft"
                : "border-neutral-300 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100",
              "disabled:bg-neutral-100 disabled:text-neutral-400",
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightSlot}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <p
            id={describedById}
            className={cn(
              "flex items-start gap-1 text-small",
              hasError ? "text-error-base" : "text-neutral-500",
            )}
          >
            {hasError && <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />}
            <span>{error ?? helperText}</span>
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
