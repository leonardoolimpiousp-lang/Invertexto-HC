"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SaveStatus, type SaveState } from "@/components/workspace/SaveStatus";

const DEBOUNCE_MS = 500;
const PLACEHOLDER = `# Bloco do plantão

> Comece a escrever — salvamento automático.

Use cabeçalhos com #, listas com -, e cole resultados das ferramentas da lateral.

Lembrete: não inclua dados identificáveis de pacientes.`;

interface NotepadProps {
  slug: string;
  initialContent: string;
  initialUpdatedAt: string | null;
}

export function Notepad({ slug, initialContent, initialUpdatedAt }: NotepadProps) {
  const [content, setContent] = useState(initialContent);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    initialUpdatedAt ? new Date(initialUpdatedAt) : null,
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPersistedRef = useRef(initialContent);
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);

  if (!supabaseRef.current) {
    supabaseRef.current = createSupabaseBrowserClient();
  }

  const persist = useCallback(
    async (text: string) => {
      if (text === lastPersistedRef.current) return;

      setSaveState("saving");
      const { error } = await supabaseRef
        .current!.from("notes")
        .update({ content: text })
        .eq("slug", slug);

      if (error) {
        setSaveState("error");
        return;
      }

      lastPersistedRef.current = text;
      setLastSavedAt(new Date());
      setSaveState("saved");
    },
    [slug],
  );

  // debounce + auto-save
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (content === lastPersistedRef.current) {
      setSaveState("saved");
      return;
    }

    timerRef.current = setTimeout(() => {
      void persist(content);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, persist]);

  // flush ao sair da página
  useEffect(() => {
    const flush = () => {
      if (content !== lastPersistedRef.current) void persist(content);
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [content, persist]);

  // estado offline
  useEffect(() => {
    const setOffline = () => setSaveState("offline");
    const setOnline = () => {
      if (content !== lastPersistedRef.current) void persist(content);
      else setSaveState("saved");
    };
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);
    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, [content, persist]);

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-overline uppercase text-brand-700">Notepad</span>
        <SaveStatus state={saveState} lastSavedAt={lastSavedAt} />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={PLACEHOLDER}
        spellCheck
        aria-label="Notepad clínico"
        className="min-h-[60vh] w-full resize-y rounded-xl border border-neutral-200 bg-white p-5 font-mono text-body text-neutral-800 placeholder-neutral-400 shadow-sm transition-colors duration-fast focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100 md:p-6"
      />
    </div>
  );
}
