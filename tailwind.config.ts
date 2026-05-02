import type { Config } from "tailwindcss";

/**
 * Tokens espelhados do design system (.llm/design-system.md §1, §3, §4).
 * Toda mudança aqui exige atualização do changelog do design system.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          600: "#0F766E",
          700: "#134E4A",
        },
        accent: {
          100: "#FEF3C7",
          500: "#F59E0B",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        success: { soft: "#F0FDF4", base: "#15803D", strong: "#16A34A" },
        warning: { soft: "#FFFBEB", base: "#B45309", strong: "#D97706" },
        error:   { soft: "#FEF2F2", base: "#B91C1C", strong: "#DC2626" },
        info:    { soft: "#EFF6FF", base: "#1D4ED8", strong: "#2563EB" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        display: ["3.5rem",  { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "800" }],
        h1:      ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2:      ["1.75rem", { lineHeight: "1.2",  letterSpacing: "-0.01em", fontWeight: "700" }],
        h3:      ["1.375rem",{ lineHeight: "1.3",  fontWeight: "600" }],
        h4:      ["1.125rem",{ lineHeight: "1.4",  fontWeight: "600" }],
        subtitle:["1.25rem", { lineHeight: "1.5",  fontWeight: "400" }],
        "body-lg":  ["1.0625rem", { lineHeight: "1.65" }],
        body:       ["0.9375rem", { lineHeight: "1.6" }],
        small:      ["0.8125rem", { lineHeight: "1.5" }],
        caption:    ["0.75rem",   { lineHeight: "1.45", fontWeight: "500" }],
        overline:   ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      spacing: {
        "1":  "4px",  "2": "8px",  "3": "12px", "4": "16px",
        "5":  "20px", "6": "24px", "8": "32px", "10": "40px",
        "12": "48px", "16": "64px","20": "80px",
      },
      borderRadius: {
        sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
        sm: "0 2px 4px rgba(15, 23, 42, 0.06)",
        md: "0 4px 12px rgba(15, 23, 42, 0.08)",
        lg: "0 12px 32px -8px rgba(15, 118, 110, 0.18)",
        xl: "0 24px 48px -12px rgba(15, 118, 110, 0.24)",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
