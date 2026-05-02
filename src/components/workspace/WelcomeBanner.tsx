"use client";

import { useState } from "react";
import { Copy, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WelcomeBannerProps {
  slug: string;
}

export function WelcomeBanner({ slug }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível — silencia */
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-100 text-brand-700">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-h4 text-neutral-900">Tudo pronto.</h2>
            <p className="mt-1 text-body text-neutral-600">
              Seu notepad foi criado. Salve esta URL — ela é sua identidade na plataforma.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-small text-neutral-700">
                {url}
              </code>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                onClick={handleCopy}
              >
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dispensar mensagem de boas-vindas"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-white hover:text-neutral-800"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
