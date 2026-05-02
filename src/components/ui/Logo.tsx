import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ href = "/", size = "md", className }: LogoProps) {
  const dimensions = {
    sm: { box: "h-7 w-7", text: "text-body-lg" },
    md: { box: "h-9 w-9", text: "text-h4" },
    lg: { box: "h-11 w-11", text: "text-h3" },
  }[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-brand-600 to-brand-700 font-extrabold text-white shadow-sm",
          dimensions.box,
        )}
        aria-hidden
      >
        i
      </span>
      <span className={cn("font-extrabold tracking-tight text-neutral-900", dimensions.text)}>
        Invertexto<span className="text-brand-600">-HC</span>
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="rounded-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
      {content}
    </Link>
  );
}
