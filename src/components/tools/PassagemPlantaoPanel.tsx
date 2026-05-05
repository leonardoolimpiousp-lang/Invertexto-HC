"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Plus,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CONTEXT_LABELS } from "@/lib/constants/specialties";
import type { ContextType } from "@/lib/constants/specialties";
import type { Database } from "@/types/database";

const CENARIO_OPTIONS: ContextType[] = [
  "ps",
  "uti",
  "sala_de_emergencia",
  "enfermaria",
  "cirurgia",
  "ambulatorial",
];

type HandoverCase = Database["public"]["Tables"]["handover_cases"]["Row"];
type Severity = "estavel" | "instavel" | "grave";

const SEVERITY_OPTIONS: { value: Severity; label: string; tagClass: string }[] = [
  {
    value: "estavel",
    label: "Estável",
    tagClass: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  {
    value: "instavel",
    label: "Instável",
    tagClass: "border-amber-300 bg-amber-50 text-amber-700",
  },
  {
    value: "grave",
    label: "Grave",
    tagClass: "border-red-300 bg-red-50 text-red-700",
  },
];

const EMPTY_DRAFT = {
  cenario: "" as ContextType | "",
  leito: "",
  paciente: "",
  idade: "",
  severity: null as Severity | null,
  patient_summary: "",
  action_list: "",
  situation: "",
  synthesis: "",
};

type InitialHandoverDraft = Partial<
  Pick<typeof EMPTY_DRAFT, "cenario" | "leito" | "paciente" | "idade">
>;

function isContextType(value: unknown): value is ContextType {
  return typeof value === "string" && CENARIO_OPTIONS.includes(value as ContextType);
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function parseInitialDraft(seed: string | null | undefined): InitialHandoverDraft | null {
  if (!seed) return null;

  try {
    const parsed = JSON.parse(seed) as Record<string, unknown>;
    const draft: InitialHandoverDraft = {
      cenario: isContextType(parsed.cenario) ? parsed.cenario : "",
      leito: getString(parsed.leito),
      paciente: getString(parsed.paciente),
      idade: getString(parsed.idade),
    };

    return draft.cenario || draft.leito || draft.paciente || draft.idade ? draft : null;
  } catch {
    return null;
  }
}

function severityMeta(value: Severity | null) {
  return SEVERITY_OPTIONS.find((option) => option.value === value);
}

interface PassagemPlantaoPanelProps {
  slug: string;
  initialItemId?: string;
}

export function PassagemPlantaoPanel({ slug, initialItemId }: PassagemPlantaoPanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient() as any, []);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [cases, setCases] = useState<HandoverCase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await supabase
        .from("handover_cases")
        .select("*")
        .eq("slug", slug)
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setCases((data || []) as HandoverCase[]);
      setError(null);
    } catch (err) {
      console.error("Error loading handover cases:", err);
      setError("Não foi possível carregar os casos. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }, [slug, supabase]);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  useEffect(() => {
    const initialDraft = parseInitialDraft(initialItemId);
    if (!initialDraft) return;

    setDraft({ ...EMPTY_DRAFT, ...initialDraft });
    setShowForm(true);
    setJustSaved(false);
    setError(null);

    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialItemId]);

  const updateDraft = <K extends keyof typeof EMPTY_DRAFT>(
    key: K,
    value: (typeof EMPTY_DRAFT)[K],
  ) => setDraft((prev) => ({ ...prev, [key]: value }));

  const canSave =
    draft.leito.trim().length > 0 && draft.paciente.trim().length > 0;

  const handleCreate = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        slug,
        cenario: draft.cenario || null,
        leito: draft.leito.trim(),
        paciente: draft.paciente.trim(),
        idade: draft.idade.trim(),
        severity: draft.severity,
        patient_summary: draft.patient_summary.trim(),
        action_list: draft.action_list.trim(),
        situation: draft.situation.trim(),
        synthesis: draft.synthesis.trim(),
      };
      const { data, error: insertError } = await supabase
        .from("handover_cases")
        .insert(payload as any)
        .select()
        .single();
      if (insertError) throw insertError;
      if (data) setCases((prev) => [data as HandoverCase, ...prev]);
      setError(null);
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
        setDraft(EMPTY_DRAFT);
        setShowForm(false);
      }, 1500);
    } catch (err) {
      console.error("Error creating handover case:", err);
      setError("Não foi possível salvar o caso. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previous = cases;
    setCases((prev) => prev.filter((item) => item.id !== id));
    try {
      const { error: deleteError } = await supabase
        .from("handover_cases")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
    } catch (err) {
      console.error("Error deleting handover case:", err);
      setCases(previous);
      setError("Não foi possível excluir o caso.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Criar caso para passagem
        </button>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-caption text-red-700">
          {error}
        </p>
      )}

      {showForm && (
        <div
          ref={formRef}
          className="space-y-4 rounded-xl border border-brand-200 bg-brand-50/40 p-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-overline uppercase text-brand-700">I-PASS</p>
              <h3 className="text-h4 text-neutral-800">Novo caso</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setDraft(EMPTY_DRAFT);
              }}
              aria-label="Cancelar"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="text-caption font-medium text-neutral-700">
              Cenário clínico
            </label>
            <select
              value={draft.cenario}
              onChange={(e) =>
                updateDraft("cenario", e.target.value as ContextType | "")
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">Selecione um cenário</option>
              {CENARIO_OPTIONS.map((ctx) => (
                <option key={ctx} value={ctx}>
                  {CONTEXT_LABELS[ctx]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[100px_1fr_88px] gap-3">
            <div className="min-w-0">
              <label className="block text-caption font-medium text-neutral-700">
                Leito
              </label>
              <input
                type="text"
                value={draft.leito}
                onChange={(e) => updateDraft("leito", e.target.value)}
                placeholder="Ex: 4317"
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-caption font-medium text-neutral-700">
                Paciente
              </label>
              <input
                type="text"
                value={draft.paciente}
                onChange={(e) => updateDraft("paciente", e.target.value)}
                placeholder="Nome"
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-caption font-medium text-neutral-700">
                Idade
              </label>
              <input
                type="text"
                value={draft.idade}
                onChange={(e) => updateDraft("idade", e.target.value)}
                placeholder="62a"
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div>
            <p className="text-caption font-semibold uppercase tracking-wide text-brand-700">
              I — Illness Severity
            </p>
            <p className="text-caption text-neutral-500">Gravidade do caso</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SEVERITY_OPTIONS.map((option) => {
                const active = draft.severity === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateDraft("severity", active ? null : option.value)
                    }
                    className={`rounded-full border px-3 py-1 text-caption font-medium transition-colors ${
                      active
                        ? option.tagClass
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <IPassField
            section="P"
            title="Patient Summary"
            subtitle="Resumo do paciente"
            value={draft.patient_summary}
            onChange={(v) => updateDraft("patient_summary", v)}
            placeholder="Historia, evolucao nas ultimas 24h, exames relevantes"
          />
          <IPassField
            section="A"
            title="Action List"
            subtitle="Ações"
            value={draft.action_list}
            onChange={(v) => updateDraft("action_list", v)}
            placeholder="Condutas, pendencias"
          />
          <IPassField
            section="S"
            title="Situation Awareness"
            subtitle="Consciência situacional"
            value={draft.situation}
            onChange={(v) => updateDraft("situation", v)}
            placeholder="O que pode acontecer, plano de contingencia"
          />
          <IPassField
            section="S"
            title="Synthesis"
            subtitle="Síntese — confirmação do entendimento"
            value={draft.synthesis}
            onChange={(v) => updateDraft("synthesis", v)}
            placeholder="Confirmacao do entendimento"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setDraft(EMPTY_DRAFT);
              }}
              className="rounded-lg px-4 py-2 text-small font-medium text-neutral-600 hover:bg-neutral-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={!canSave || saving || justSaved}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-small font-semibold transition-colors ${
                justSaved
                  ? "cursor-default border-neutral-300 bg-neutral-200 text-neutral-700"
                  : "border-brand-600 bg-brand-600 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              }`}
            >
              {justSaved ? (
                <Check className="h-4 w-4" />
              ) : saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {justSaved
                ? "Caso adicionado"
                : saving
                  ? "Salvando..."
                  : "Adicionar caso"}
            </button>
          </div>
        </div>
      )}

      {loading && cases.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-caption text-neutral-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando casos...
        </div>
      ) : null}

      {!loading && cases.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <p className="text-body font-medium text-neutral-500">
            Nenhum caso registrado.
          </p>
          <p className="mt-1 max-w-xs text-caption text-neutral-400">
            Crie o primeiro caso para organizar a passagem de plantão no formato I-PASS.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {cases.map((item) => (
          <CaseCard
            key={item.id}
            item={item}
            onDelete={() => void handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function IPassField({
  section,
  title,
  subtitle,
  value,
  onChange,
  placeholder,
}: {
  section: string;
  title: string;
  subtitle: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wide text-brand-700">
        {section} — {title}
      </p>
      <p className="text-caption text-neutral-500">{subtitle}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 min-h-[70px] w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

function CaseCard({
  item,
  onDelete,
}: {
  item: HandoverCase;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const severity = severityMeta(item.severity);

  const exportText = () => {
    const lines = [
      `Leito ${item.leito} — ${item.paciente}${item.idade ? `, ${item.idade}` : ""}`,
      severity ? `Gravidade: ${severity.label}` : null,
      "",
      "P — Patient Summary:",
      item.patient_summary || "—",
      "",
      "A — Action List:",
      item.action_list || "—",
      "",
      "S — Situation Awareness:",
      item.situation || "—",
      "",
      "S — Synthesis:",
      item.synthesis || "—",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <header className="flex items-center justify-between gap-3 p-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left min-w-0"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-body text-neutral-800">
              <span className="font-bold">Leito {item.leito}</span>{" "}
              <span className="text-neutral-600">
                — {item.paciente}
                {item.idade ? `, ${item.idade}` : ""}
              </span>
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {item.cenario && (
                <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                  {CONTEXT_LABELS[item.cenario as ContextType] ?? item.cenario}
                </span>
              )}
              {severity && (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${severity.tagClass}`}
                >
                  {severity.label}
                </span>
              )}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar passagem"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Excluir caso"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-300 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {expanded && (
        <div className="space-y-3 border-t border-neutral-100 px-4 py-4">
          <Section
            title="Patient Summary"
            subtitle="Resumo"
            content={item.patient_summary}
          />
          <Section
            title="Action List"
            subtitle="Ações"
            content={item.action_list}
          />
          <Section
            title="Situation Awareness"
            subtitle="Consciência situacional"
            content={item.situation}
          />
          <Section title="Synthesis" subtitle="Síntese" content={item.synthesis} />
        </div>
      )}
    </article>
  );
}

function Section({
  title,
  subtitle,
  content,
}: {
  title: string;
  subtitle: string;
  content: string;
}) {
  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wide text-brand-700">
        {title}
      </p>
      <p className="text-caption text-neutral-400">{subtitle}</p>
      {content ? (
        <p className="mt-1 whitespace-pre-line text-small text-neutral-700">
          {content}
        </p>
      ) : (
        <p className="mt-1 text-small italic text-neutral-400">— sem registro</p>
      )}
    </div>
  );
}
