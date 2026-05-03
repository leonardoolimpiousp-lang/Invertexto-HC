"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Search } from "lucide-react";
import { CID10_DATA } from "@/lib/constants/cid10";

export function CidPanel() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CID10_DATA.slice(0, 20);
    return CID10_DATA.filter(
      (e) =>
        e.code.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    ).slice(0, 30);
  }, [query]);

  const handleCopy = async (entry: (typeof CID10_DATA)[number]) => {
    const text = `${entry.code} — ${entry.description}`;
    await navigator.clipboard.writeText(text);
    setCopied(entry.code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      {/* search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por código ou diagnóstico…"
          className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2.5 text-small text-neutral-800 placeholder-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
      </div>

      {/* results */}
      <div className="max-h-[420px] overflow-y-auto rounded-xl border border-neutral-100 bg-white divide-y divide-neutral-100">
        {results.length === 0 ? (
          <p className="p-6 text-center text-small text-neutral-400">
            Nenhum resultado para &quot;{query}&quot;.
          </p>
        ) : (
          results.map((entry) => (
            <div
              key={entry.code}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <code className="shrink-0 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                  {entry.code}
                </code>
                <span className="text-small text-neutral-700 truncate">
                  {entry.description}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(entry)}
                aria-label={`Copiar ${entry.code}`}
                className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-brand-700"
              >
                {copied === entry.code ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-neutral-400">
        {results.length} resultado{results.length !== 1 ? "s" : ""}
        {query ? ` para "${query}"` : " recentes"} · Base curada dos CIDs mais frequentes no HC.
      </p>
    </div>
  );
}
