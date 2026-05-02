import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, required, options, placeholder, id, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const describedById = helperText || error ? `${selectId}-desc` : undefined;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={selectId} className="text-body font-semibold text-neutral-700">
            {label}
            {required && (
              <span aria-hidden className="ml-0.5 text-error-strong">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={describedById}
            className={cn(
              "h-10 w-full appearance-none rounded-md border bg-white pl-3 pr-10 text-body text-neutral-800",
              "transition-colors duration-fast focus:outline-none",
              hasError
                ? "border-error-strong focus:ring-[3px] focus:ring-error-soft"
                : "border-neutral-300 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100",
              "disabled:bg-neutral-100 disabled:text-neutral-400",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            aria-hidden
          />
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
Select.displayName = "Select";
