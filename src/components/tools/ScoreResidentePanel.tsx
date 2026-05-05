"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Baby,
  CalendarDays,
  CheckCircle2,
  ListChecks,
  Plus,
  Trash2,
  UserRound,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PROCEDIMENTOS } from "@/lib/constants/procedimentos";
import { cn } from "@/lib/utils/cn";
import type { Database } from "@/types/database";

type ResidentProcedureLog = Database["public"]["Tables"]["resident_procedure_logs"]["Row"];
type ResidentProcedureInsert = Database["public"]["Tables"]["resident_procedure_logs"]["Insert"];
type TrainingYear = ResidentProcedureLog["training_year"];
type PatientType = ResidentProcedureLog["patient_type"];
type Assistance = ResidentProcedureLog["assistance"];
type StorageMode = "supabase" | "local";

const TRAINING_YEAR_OPTIONS: Array<{ value: TrainingYear; label: string }> = [
  { value: "5_ano", label: "5 ano" },
  { value: "6_ano", label: "6 ano" },
  { value: "R1", label: "R1" },
  { value: "R2", label: "R2" },
  { value: "R3", label: "R3" },
  { value: "R_plus", label: "R+" },
];

const PATIENT_TYPE_OPTIONS: Array<{ value: PatientType; label: string }> = [
  { value: "adulto", label: "Adulto" },
  { value: "pediatrico", label: "Pediátrico" },
];

const ASSISTANCE_OPTIONS: Array<{ value: Assistance; label: string }> = [
  { value: "assistente", label: "Assistente" },
  { value: "r_plus", label: "R+" },
  { value: "preceptor", label: "Preceptor" },
  { value: "sem_auxilio", label: "Sem auxílio" },
];

const SUCCESS_OPTIONS = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
] as const;

const procedureOptions = [...PROCEDIMENTOS].sort((a, b) => a.name.localeCompare(b.name));

function todayIsoDate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function getLocalStorageKey(slug: string) {
  return `resident-procedure-score:${slug}`;
}

function readLocalLogs(slug: string): ResidentProcedureLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(slug));
    const logs = raw ? (JSON.parse(raw) as ResidentProcedureLog[]) : [];
    return logs.map((log) => ({
      ...log,
      assistance: log.assistance === ("e_plus" as Assistance) ? "r_plus" : log.assistance,
      unsuccessful: Boolean(log.unsuccessful),
    }));
  } catch {
    return [];
  }
}

function writeLocalLogs(slug: string, logs: ResidentProcedureLog[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getLocalStorageKey(slug), JSON.stringify(logs));
}

function formatTrainingYear(value: TrainingYear) {
  return TRAINING_YEAR_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

function formatAssistance(value: Assistance) {
  return ASSISTANCE_OPTIONS.find((item) => item.value === value)?.label ?? value;
}

function percent(numerator: number, denominator: number) {
  if (denominator === 0) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

interface ScoreResidentePanelProps {
  slug: string;
  initialProcedureId?: string;
}

export function ScoreResidentePanel({ slug, initialProcedureId }: ScoreResidentePanelProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient() as any, []);
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialProcedure = useMemo(
    () => procedureOptions.find((procedure) => procedure.id === initialProcedureId),
    [initialProcedureId],
  );
  const [logs, setLogs] = useState<ResidentProcedureLog[]>([]);
  const [storageMode, setStorageMode] = useState<StorageMode>("supabase");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dashboardTrainingYear, setDashboardTrainingYear] = useState<"all" | TrainingYear>("all");
  const [dashboardProcedureId, setDashboardProcedureId] = useState<"all" | string>("all");

  const [procedureId, setProcedureId] = useState(procedureOptions[0]?.id ?? "");
  const [performedAt, setPerformedAt] = useState(todayIsoDate());
  const [trainingYear, setTrainingYear] = useState<TrainingYear>("R1");
  const [previousExperience, setPreviousExperience] = useState("");
  const [patientType, setPatientType] = useState<PatientType>("adulto");
  const [assistance, setAssistance] = useState<Assistance>("preceptor");
  const [firstAttemptSuccess, setFirstAttemptSuccess] = useState<"sim" | "nao">("sim");
  const [unsuccessful, setUnsuccessful] = useState<"sim" | "nao">("nao");

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      setIsLoading(true);
      setFeedback(null);

      try {
        const { data, error } = await supabase
          .from("resident_procedure_logs")
          .select("*")
          .eq("slug", slug)
          .order("performed_at", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        setLogs(
          ((data ?? []) as ResidentProcedureLog[]).map((log) => ({
            ...log,
            assistance: log.assistance === ("e_plus" as Assistance) ? "r_plus" : log.assistance,
            unsuccessful: Boolean(log.unsuccessful),
          })),
        );
        setStorageMode("supabase");
      } catch {
        if (cancelled) return;
        setLogs(readLocalLogs(slug));
        setStorageMode("local");
        setFeedback("Registro local ativo até a tabela do Supabase estar disponível.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadLogs();
    return () => {
      cancelled = true;
    };
  }, [slug, supabase]);

  useEffect(() => {
    if (!initialProcedure) return;

    setProcedureId(initialProcedure.id);
    setPerformedAt(todayIsoDate());
    setDashboardProcedureId(initialProcedure.id);
    setFeedback(`Procedimento "${initialProcedure.name}" preenchido pelo notepad. Complete os campos restantes.`);

    const frame = window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialProcedure]);

  useEffect(() => {
    if (!justRegistered) return;
    const timeout = window.setTimeout(() => setJustRegistered(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [justRegistered]);

  const dashboardLogs = useMemo(
    () =>
      logs.filter((log) => {
        const matchesYear =
          dashboardTrainingYear === "all" || log.training_year === dashboardTrainingYear;
        const matchesProcedure =
          dashboardProcedureId === "all" || log.procedure_id === dashboardProcedureId;
        return matchesYear && matchesProcedure;
      }),
    [dashboardProcedureId, dashboardTrainingYear, logs],
  );

  const dashboardTotals = useMemo(() => {
    const successCount = dashboardLogs.filter((log) => log.first_attempt_success).length;
    const unsuccessfulCount = dashboardLogs.filter((log) => log.unsuccessful).length;
    const noHelpSuccessCount = dashboardLogs.filter(
      (log) => log.assistance === "sem_auxilio" && !log.unsuccessful,
    ).length;
    const adultCount = dashboardLogs.filter((log) => log.patient_type === "adulto").length;
    const pediatricCount = dashboardLogs.filter((log) => log.patient_type === "pediatrico").length;

    return {
      total: dashboardLogs.length,
      successCount,
      unsuccessfulCount,
      noHelpSuccessCount,
      adultCount,
      pediatricCount,
    };
  }, [dashboardLogs]);

  const persistLocal = (nextLogs: ResidentProcedureLog[]) => {
    setLogs(nextLogs);
    writeLocalLogs(slug, nextLogs);
    setStorageMode("local");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedProcedure = procedureOptions.find((procedure) => procedure.id === procedureId);
    if (!selectedProcedure) return;

    setIsSaving(true);
    setFeedback(null);

    const payload: ResidentProcedureInsert = {
      slug,
      procedure_id: selectedProcedure.id,
      procedure_name: selectedProcedure.name,
      performed_at: performedAt,
      training_year: trainingYear,
      previous_experience: Number(previousExperience || 0),
      patient_type: patientType,
      assistance,
      first_attempt_success: firstAttemptSuccess === "sim",
      unsuccessful: unsuccessful === "sim",
    };

    const localRecord: ResidentProcedureLog = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...payload,
      previous_experience: payload.previous_experience ?? 0,
      unsuccessful: payload.unsuccessful ?? false,
    };

    try {
      if (storageMode === "supabase") {
        const { data, error } = await supabase
          .from("resident_procedure_logs")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        setLogs((prev) => [data as ResidentProcedureLog, ...prev]);
      } else {
        persistLocal([localRecord, ...logs]);
      }

      setFeedback("Procedimento registrado.");
      setJustRegistered(true);
      setPerformedAt(todayIsoDate());
      setPreviousExperience("");
      setUnsuccessful("nao");
    } catch {
      persistLocal([localRecord, ...logs]);
      setJustRegistered(true);
      setPerformedAt(todayIsoDate());
      setPreviousExperience("");
      setUnsuccessful("nao");
      setFeedback("Registro salvo localmente. Sincronize a migration para persistir no Supabase.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLog = async (id: string) => {
    const nextLogs = logs.filter((log) => log.id !== id);

    if (storageMode === "local") {
      persistLocal(nextLogs);
      return;
    }

    const { error } = await supabase.from("resident_procedure_logs").delete().eq("id", id);
    if (error) {
      setFeedback("Não foi possível excluir no Supabase agora.");
      return;
    }

    setLogs(nextLogs);
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-body font-semibold text-neutral-800">Dashboard</h3>
              <p className="text-caption text-neutral-500">
                Subanálise por ano de formação e procedimento.
              </p>
            </div>
            {storageMode === "local" && (
              <span className="rounded-full border border-warning-base/20 bg-warning-soft px-2.5 py-1 text-[11px] font-medium text-warning-base">
                Local
              </span>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Filtrar por ano da formação">
              <select
                value={dashboardTrainingYear}
                onChange={(event) =>
                  setDashboardTrainingYear(event.target.value as "all" | TrainingYear)
                }
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
              >
                <option value="all">Todos os anos</option>
                {TRAINING_YEAR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Filtrar por procedimento">
              <select
                value={dashboardProcedureId}
                onChange={(event) => setDashboardProcedureId(event.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
              >
                <option value="all">Todos os procedimentos</option>
                {procedureOptions.map((procedure) => (
                  <option key={procedure.id} value={procedure.id}>
                    {procedure.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="Total de procedimentos" value={dashboardTotals.total} icon={ListChecks} />
          <MetricCard
            label="Sucesso na 1ª tentativa"
            value={percent(dashboardTotals.successCount, dashboardTotals.total)}
            icon={CheckCircle2}
          />
          <MetricCard
            label="Êxito sem auxílio"
            value={percent(dashboardTotals.noHelpSuccessCount, dashboardTotals.total)}
            icon={CalendarDays}
          />
          <MetricCard
            label="Sem sucesso"
            value={percent(dashboardTotals.unsuccessfulCount, dashboardTotals.total)}
            icon={XCircle}
          />
          <MetricCard
            label="Adulto"
            value={percent(dashboardTotals.adultCount, dashboardTotals.total)}
            icon={UserRound}
          />
          <MetricCard
            label="Pediátrico"
            value={percent(dashboardTotals.pediatricCount, dashboardTotals.total)}
            icon={Baby}
          />
        </div>
      </section>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="rounded-xl border border-neutral-200 bg-white p-4"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-body font-semibold text-neutral-800">Adicionar procedimento</h3>
            <p className="text-caption text-neutral-500">
              Cada registro alimenta o dashboard por procedimento e formação.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Procedimento">
            <select
              value={procedureId}
              onChange={(event) => setProcedureId(event.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
            >
              {procedureOptions.map((procedure) => (
                <option key={procedure.id} value={procedure.id}>
                  {procedure.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Data">
            <input
              type="date"
              value={performedAt}
              onChange={(event) => setPerformedAt(event.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
              required
            />
          </Field>

          <Field label="Ano da formação">
            <select
              value={trainingYear}
              onChange={(event) => setTrainingYear(event.target.value as TrainingYear)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
            >
              {TRAINING_YEAR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Experiência prévia">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={previousExperience}
              onChange={(event) => setPreviousExperience(event.target.value)}
              placeholder="Quantas vezes já fez antes?"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 focus:border-brand-600 focus:ring-[3px] focus:ring-brand-100"
            />
          </Field>

          <Field label="Tipo de paciente">
            <SegmentedControl
              options={PATIENT_TYPE_OPTIONS}
              value={patientType}
              onChange={(value) => setPatientType(value as PatientType)}
            />
          </Field>

          <Field label="Auxílio">
            <SegmentedControl
              options={ASSISTANCE_OPTIONS}
              value={assistance}
              onChange={(value) => setAssistance(value as Assistance)}
            />
          </Field>

          <Field label="Sucesso na primeira tentativa">
            <SegmentedControl
              options={SUCCESS_OPTIONS}
              value={firstAttemptSuccess}
              onChange={(value) => setFirstAttemptSuccess(value as "sim" | "nao")}
            />
          </Field>

          <Field label="Sem sucesso">
            <SegmentedControl
              options={SUCCESS_OPTIONS}
              value={unsuccessful}
              onChange={(value) => setUnsuccessful(value as "sim" | "nao")}
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSaving || justRegistered || !procedureId}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-body font-medium transition-colors disabled:cursor-not-allowed",
              justRegistered
                ? "border-neutral-300 bg-neutral-200 text-neutral-700 hover:bg-neutral-200"
                : "border-brand-600 bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50",
            )}
          >
            {justRegistered ? (
              <CheckCircle2 className="h-4 w-4" aria-hidden />
            ) : (
              <Plus className="h-4 w-4" aria-hidden />
            )}
            {isSaving
              ? "Registrando..."
              : justRegistered
                ? "Procedimento registrado"
                : "Registrar procedimento"}
          </button>
          {feedback && <p className="text-caption text-neutral-500">{feedback}</p>}
        </div>
      </form>

      <section className="rounded-xl border border-neutral-200 bg-white p-4">
        <h3 className="mb-3 text-body font-semibold text-neutral-800">Histórico de procedimentos</h3>
        {isLoading ? (
          <p className="text-caption text-neutral-500">Carregando registros...</p>
        ) : logs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
              >
                <div>
                  <p className="text-body font-medium text-neutral-800">{log.procedure_name}</p>
                  <p className="text-caption text-neutral-500">
                    {new Date(`${log.performed_at}T00:00:00`).toLocaleDateString("pt-BR")} ·{" "}
                    {formatTrainingYear(log.training_year)} · {log.patient_type} ·{" "}
                    {formatAssistance(log.assistance)} · 1ª tentativa{" "}
                    {log.first_attempt_success ? "sim" : "não"} · Sem sucesso{" "}
                    {log.unsuccessful ? "sim" : "não"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void deleteLog(log.id)}
                  aria-label="Remover registro"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-error-base"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="text-h3 text-neutral-900">{value}</p>
      <p className="text-caption text-neutral-500">{label}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-caption font-medium transition-colors",
            value === option.value
              ? "bg-white text-brand-700 shadow-xs"
              : "text-neutral-500 hover:text-neutral-800",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-neutral-200 py-10 text-center">
      <p className="text-body font-medium text-neutral-500">Nenhum procedimento registrado ainda.</p>
      <p className="mt-1 text-caption text-neutral-400">
        Use o formulário acima para iniciar o score do residente.
      </p>
    </div>
  );
}
