"use client";

import { useEffect, useMemo, useState } from "react";

type ReviewStatus = "all" | "pending" | "approved";

type DraftItem = {
  id: string;
  disease: string;
  contexts: string[];
  hdTags: Array<{ name: string; weight: 6 | 10 }>;
  sections: Array<{ title: string; content: string[] }>;
  source?: { name?: string; url?: string; updatedAt?: string };
  review?: { status?: "pending" | "approved"; notes?: string };
};

type DraftPayload = {
  generatedAt?: string;
  total?: number;
  drafts: DraftItem[];
};

const CONTEXT_OPTIONS = ["PS", "UTI", "Sala de Emergencia", "Enfermaria", "Ambulatorio"] as const;

function parseTags(value: string): Array<{ name: string; weight: 6 | 10 }> {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .map((name, index) => ({ name, weight: index === 0 ? 10 : 6 }));
}

export default function GuidesReviewPage() {
  const [payload, setPayload] = useState<DraftPayload | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("pending");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/guides/review");
        if (!response.ok) throw new Error();
        const data = (await response.json()) as DraftPayload;
        setPayload(data);
      } catch {
        setError("Falha ao carregar rascunhos de revisão.");
      }
    })();
  }, []);

  const visibleDrafts = useMemo(() => {
    if (!payload) return [];
    return payload.drafts.filter((draft) => {
      const matchesStatus =
        statusFilter === "all" ? true : (draft.review?.status ?? "pending") === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || draft.disease.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [payload, search, statusFilter]);

  const updateDraft = (id: string, update: (draft: DraftItem) => DraftItem) => {
    setPayload((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        drafts: prev.drafts.map((draft) => (draft.id === id ? update(draft) : draft)),
      };
    });
  };

  const saveAll = async () => {
    if (!payload) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/guides/review", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error();
    } catch {
      setError("Falha ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-h2 text-neutral-900">Revisão Clínica de Guias</h1>
          <p className="text-body text-neutral-600">
            Revise contexto, tags de HD e aprove os rascunhos para compilação.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving || !payload}
          className="rounded-lg bg-brand-600 px-4 py-2 text-small font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </header>

      <section className="mb-5 grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar doença..."
          className="rounded-lg border border-neutral-200 px-3 py-2 text-body"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ReviewStatus)}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-body"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovados</option>
        </select>
        <div className="text-small text-neutral-600">
          Mostrando {visibleDrafts.length} de {payload?.drafts.length ?? 0}
        </div>
      </section>

      {error ? <p className="mb-4 text-small text-red-600">{error}</p> : null}

      <div className="space-y-4">
        {visibleDrafts.map((draft) => {
          const tagsValue = draft.hdTags.map((tag) => tag.name).join(", ");
          const status = draft.review?.status ?? "pending";

          return (
            <article key={draft.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-h4 text-neutral-900">{draft.disease}</h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-caption font-semibold ${
                      status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {status === "approved" ? "Aprovado" : "Pendente"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft(draft.id, (item) => ({
                        ...item,
                        review: {
                          ...item.review,
                          status: item.review?.status === "approved" ? "pending" : "approved",
                        },
                      }))
                    }
                    className="rounded-md border border-neutral-300 px-3 py-1 text-caption font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {status === "approved" ? "Reverter" : "Aprovar"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-caption font-semibold text-neutral-700">Contextos clínicos</p>
                  <div className="flex flex-wrap gap-2">
                    {CONTEXT_OPTIONS.map((ctx) => {
                      const active = draft.contexts.includes(ctx);
                      return (
                        <button
                          key={ctx}
                          type="button"
                          onClick={() =>
                            updateDraft(draft.id, (item) => ({
                              ...item,
                              contexts: active
                                ? item.contexts.filter((c) => c !== ctx)
                                : [...item.contexts, ctx],
                            }))
                          }
                          className={`rounded-full px-3 py-1 text-caption font-medium ${
                            active
                              ? "bg-brand-600 text-white"
                              : "border border-neutral-200 bg-white text-neutral-600"
                          }`}
                        >
                          {ctx}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-caption font-semibold text-neutral-700">Tags de HD (separadas por vírgula)</p>
                  <input
                    value={tagsValue}
                    onChange={(event) =>
                      updateDraft(draft.id, (item) => ({
                        ...item,
                        hdTags: parseTags(event.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-body"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-1 text-caption font-semibold text-neutral-700">Notas da revisão</p>
                <textarea
                  value={draft.review?.notes ?? ""}
                  onChange={(event) =>
                    updateDraft(draft.id, (item) => ({
                      ...item,
                      review: {
                        ...item.review,
                        notes: event.target.value,
                      },
                    }))
                  }
                  className="min-h-[72px] w-full rounded-lg border border-neutral-200 px-3 py-2 text-body"
                />
              </div>

              <details className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <summary className="cursor-pointer text-caption font-semibold text-neutral-700">
                  Prévia de conteúdo
                </summary>
                <div className="mt-3 space-y-3">
                  {draft.sections.map((section) => (
                    <div key={section.title}>
                      <p className="text-caption font-semibold text-neutral-700">{section.title}</p>
                      <ul className="mt-1 space-y-1">
                        {section.content.map((line, idx) => (
                          <li key={`${section.title}-${idx}`} className="text-caption text-neutral-600">
                            - {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {draft.source?.url ? (
                    <a
                      href={draft.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-caption text-brand-700 underline"
                    >
                      Fonte: {draft.source.name ?? draft.source.url}
                    </a>
                  ) : null}
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </main>
  );
}
