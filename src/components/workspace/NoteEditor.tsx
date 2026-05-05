"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ArrowLeft, Check, ListChecks, Loader2, Plus, Stethoscope, X } from "lucide-react";
import { SaveStatus, type SaveState } from "@/components/workspace/SaveStatus";
import { TagSuggestions } from "@/components/workspace/TagSuggestions";
import {
  getNoteEncounterClosedAt,
  getNotePatientDestination,
  getNotePlantaoRegistro,
  getVisibleHdList,
  isNoteEncounterClosed,
  withClinicalNoteMetadata,
  type PatientDestination,
} from "@/lib/clinical-note-metadata";
import { cn } from "@/lib/utils/cn";
import { PROCEDIMENTOS } from "@/lib/constants/procedimentos";
import type { Database } from "@/types/database";
import type { ToolId } from "@/lib/constants/tools";

type ClinicalFolder = Database["public"]["Tables"]["clinical_folders"]["Row"];
type ClinicalNote = Database["public"]["Tables"]["clinical_notes"]["Row"];

type AutoCompleteRule = {
  linePrefix: string;
  suggestion: string;
  section?: string;
};

const DESTINATION_OPTIONS: { value: PatientDestination; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "alta_retorno_ambulatorial", label: "Alta com retorno ambulatorial" },
  { value: "internacao", label: "Internação" },
  { value: "obito", label: "Óbito" },
];

const PS_AUTOCOMPLETE_RULES: AutoCompleteRule[] = [
  { linePrefix: "# QD:", suggestion: "demanda espontanea? CROSS?" },
  { linePrefix: "Comorbidades:", suggestion: "nega" },
  { linePrefix: "MUC:", suggestion: "nega" },
  { linePrefix: "Cirurgias prévias:", suggestion: "nega" },
  { linePrefix: "Alergias:", suggestion: "nega" },
  { linePrefix: "HV:", suggestion: "nega" },
  { linePrefix: "Estado geral:", suggestion: "BEG, CHAAAE" },
  {
    linePrefix: "ACV:",
    suggestion: "BRNF2TSS, pulsos simetricos e com boa amplitude. EJ-",
  },
  { linePrefix: "AR:", suggestion: "MV+ bilat, sem RA, eupneico" },
  {
    linePrefix: "ABD:",
    suggestion:
      "flacido, indolor a palpacao. Nao palpo massas ou VMG. Sem ascite. DB-, Murphy-, Blumberg-, Giordano -",
  },
  {
    linePrefix: "Pele/Extremidades:",
    suggestion: "quentes, bem perfundida, TEC<3s. Panturrilhas livres, sem edemas",
  },
];

const PS_CONTEXTS = new Set(["ps", "ambulatorial", "sala_de_emergencia", "cirurgia"]);

const UTI_GHOST_RULES: AutoCompleteRule[] = [
  { linePrefix: "# ID:", suggestion: "nome, idade, peso" },
  {
    linePrefix: "Motivo da internação:",
    suggestion: "cirurgia eletiva, medicação EV, exame, investigação, PS (descompensaçao, infeccao, quimio)",
  },
  { linePrefix: "Motivo da UTI:", suggestion: "RNC, Choque, IRpA" },
  {
    linePrefix: "Antecedentes oncológicos:",
    suggestion:
      "sitio primario, estadiamento, tratamentos /exposições recentes, diretivas / proposta cuidado atuais",
    section: "# AP",
  },
  {
    linePrefix: "Nível de consciência:",
    suggestion: "Vigil, contactante, alerta, responde a comandos",
    section: "# NEURO",
  },
  {
    linePrefix: "RASS:",
    suggestion: "Sedado leve (RASS 0 a -2), sedado profundo (RASS-3 a -5)",
    section: "# NEURO",
  },
  { linePrefix: "Delirium:", suggestion: "hiper/hipo?", section: "# NEURO" },
  {
    linePrefix: "Pupilas:",
    suggestion: "PIFR, mioticas,aniso D>E E>D",
    section: "# NEURO",
  },
  { linePrefix: "Déficit neurológico:", suggestion: "focal? global?", section: "# NEURO" },
  {
    linePrefix: "Analgesia/Sedação:",
    suggestion: "Precedex, Queta , Propofol,Mida, Neurolépticos? DAE? - escrever v. infusao",
    section: "# NEURO",
  },
  {
    linePrefix: "Via aérea:",
    suggestion:
      "espontanea AA ou em suporte ventilatorio\n-CN VNI/CN VNI/MNR MNR/CNAF\n-TOT + VM PSV /PCV / VCV\n-TQT + VM / NBZ\nPreencher Parâmetros",
    section: "# RESP",
  },
  { linePrefix: "Metas ventilatorias:", suggestion: "tolerando desmame?", section: "# RESP" },
  {
    linePrefix: "Ausculta:",
    suggestion: "MV+ simétrico bilateralmente s/RA, sem sinais de desconforto respiratório, POCUS/RX",
    section: "# RESP",
  },
  { linePrefix: "Adjuvantes:", suggestion: "BD, corticoide, secativos", section: "# RESP" },
  {
    linePrefix: "Prevenção de PAV:",
    suggestion:
      "cabeceira 30-45º, pressão do cuff 20-30cmH20, higiene oral com clorex, interrupcao diaria da sedacao, acarmelose, ATBprofilaxia?",
    section: "# RESP",
  },
  {
    linePrefix: "Sinais de congestão:",
    suggestion: "estase jugular, edema MMII, estertores finos, POCUS/RX, ortopneia",
    section: "# CARDIO",
  },
  { linePrefix: "Sinais de hipoperfusão:", suggestion: "TEC, livedo", section: "# CARDIO" },
  {
    linePrefix: "DVA/inotrópicos/corticoide:",
    suggestion: "dose, vel infusao",
    section: "# CARDIO",
  },
  {
    linePrefix: "Metas hemodinâmicas:",
    suggestion: "alvo PAM, Desmame/Ascensão",
    section: "# CARDIO",
  },
  {
    linePrefix: "Outros:",
    suggestion: "BB, antiarritmico, estatina, antiHAS",
    section: "# CARDIO",
  },
  {
    linePrefix: "Via:",
    suggestion: "espontânea, SVD, Bricker, Ureterostomia, Cistostomia",
    section: "# RENAL",
  },
  {
    linePrefix: "HD?",
    suggestion: "intermitente - Convencional x SLED / Contínua-CVVHD com ou sem UF",
    section: "# RENAL",
  },
  {
    linePrefix: "Labs:",
    suggestion: "ClCr, Cr, Ur, Na, K, P, Mg, Ph, BIC",
    section: "# RENAL",
  },
  {
    linePrefix: "Reposições:",
    suggestion: "bicarbonatada, bic intermitente",
    section: "# RENAL",
  },
  {
    linePrefix: "Dieta:",
    suggestion: "Jejum/Aporte/Oral(consistencia)/SNG GTT, NPT com v. infusao",
    section: "# TGI",
  },
  {
    linePrefix: "Abdome:",
    suggestion:
      "RHA, flácido, indolor, sem náusea ou vômito. Sem ascite ou VMG. Debito em colostomia/ileostomia?",
    section: "# TGI",
  },
  { linePrefix: "Drenos:", suggestion: "local, função, aspecto, debito", section: "# TGI" },
  {
    linePrefix: "Insulinoterapia:",
    suggestion: "NPH + scale, sliding scale, BIC",
    section: "# TGI",
  },
  {
    linePrefix: "Labs:",
    suggestion: "TGO, TGP, CT, TAG, AMILASE, BT, BD",
    section: "# TGI",
  },
  {
    linePrefix: "Labs:",
    suggestion: "Hb, Leuco, Plaquetas, PCR, INR, R",
    section: "# HEMATO",
  },
  {
    linePrefix: "Antimicrobianos:",
    suggestion: "Nome, dia do tratamento, cobrir qual foco?",
    section: "# HEMATO",
  },
  { linePrefix: "Medicamentos:", suggestion: "DAPT, ACO, granulokyne", section: "# HEMATO" },
  {
    linePrefix: "Invasões:",
    suggestion: "SNE, CVC, AVP, PAI, SVD, drenos. dia de inserção + aspecto/sinais flogísticos",
    section: "# DISP",
  },
  {
    linePrefix: "TEV:",
    suggestion:
      "enoxa 40mg SC - 1mg/kg se obeso, trauma ou inflamado, 20mg se desnutrido. HNF 5000 8/8h se ClCr<30, CPI se risco de sangramento. Suspender se PLT <50.000, sangramento ativo, suspeita de CIVD, risco de queda. Fondaparinux se HIT",
    section: "# PROF",
  },
  {
    linePrefix: "Úlcera de estresse:",
    suggestion:
      "sem nutricao enteral, neurocriticos, coagulopatia, doenca hepatica, choque refratario. Suspender assim que resolvido.",
    section: "# PROF",
  },
  {
    linePrefix: "Outras:",
    suggestion: "Colirio, úlcera de pressão, clorex oral",
    section: "# PROF",
  },
];

function applyInlineAutocomplete(
  value: string,
  cursor: number,
  rules: AutoCompleteRule[],
): { value: string; cursor: number } {
  const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
  const lineEnd = value.indexOf("\n", cursor);
  const resolvedLineEnd = lineEnd === -1 ? value.length : lineEnd;
  const line = value.slice(lineStart, resolvedLineEnd);

  for (const rule of rules) {
    if (!line.startsWith(rule.linePrefix)) continue;

    const trailing = line.slice(rule.linePrefix.length);
    const leadingWhitespace = trailing.match(/^\s*/)?.[0] ?? "";
    const typed = trailing.trim();

    if (typed.length !== 2) continue;
    if (!rule.suggestion.toLowerCase().startsWith(typed.toLowerCase())) continue;

    const spacing = leadingWhitespace || " ";
    const completedLine = `${rule.linePrefix}${spacing}${rule.suggestion}`;
    const nextValue =
      value.slice(0, lineStart) + completedLine + value.slice(resolvedLineEnd);
    const nextCursor = lineStart + completedLine.length;

    return { value: nextValue, cursor: nextCursor };
  }

  return { value, cursor };
}

function getLineSuggestion(
  line: string,
  rules: AutoCompleteRule[],
  currentSection: string,
  enablePartialSuggestion: boolean,
): string | null {
  const rule = rules.find(
    (item) =>
      line.startsWith(item.linePrefix) &&
      (!item.section || item.section === currentSection),
  );
  if (!rule) return null;

  const trailing = line.slice(rule.linePrefix.length);
  const typed = trailing.trimStart();
  const typedLower = typed.toLowerCase();
  const suggestionLower = rule.suggestion.toLowerCase();

  if (typed.length === 0) {
    return ` ${rule.suggestion}`;
  }

  if (enablePartialSuggestion && typed.length < 2 && suggestionLower.startsWith(typedLower)) {
    return rule.suggestion.slice(typed.length);
  }

  return null;
}

function renderEditorPreview(
  value: string,
  rules: AutoCompleteRule[],
  enablePartialSuggestion: boolean,
): ReactNode[] {
  const lines = value.split("\n");
  let currentSection = "";
  let lineStart = 0;

  return lines.map((line, index) => {
    const suggestion = getLineSuggestion(
      line,
      rules,
      currentSection,
      enablePartialSuggestion,
    );
    const currentLineStart = lineStart;

    if (line.trim().startsWith("#")) {
      currentSection = line.trim();
    }

    lineStart += line.length + 1;

    return (
      <span
        key={`line-${index}`}
        className="block min-h-[1.5em]"
        data-preview-line
        data-line-length={line.length}
        data-line-start={currentLineStart}
        data-line-end={currentLineStart + line.length}
      >
        <span data-real-text>{line || "\u200b"}</span>
        {suggestion && <span className="text-neutral-400">{suggestion}</span>}
      </span>
    );
  });
}

function parsePatientIdentity(title: string | null | undefined) {
  const normalizedTitle = title?.trim() ?? "";
  if (!normalizedTitle) return { paciente: "", idade: "" };

  const separatorMatch = normalizedTitle.match(/\s+-\s+/);
  if (!separatorMatch || typeof separatorMatch.index !== "number") {
    return { paciente: normalizedTitle, idade: "" };
  }

  const paciente = normalizedTitle.slice(0, separatorMatch.index).trim();
  const idade = normalizedTitle.slice(separatorMatch.index + separatorMatch[0].length).trim();

  return { paciente, idade };
}

interface NoteEditorProps {
  note: ClinicalNote;
  folder: ClinicalFolder;
  onBack: () => void;
  onGoDashboard: () => void;
  onUpdate: (updated: Partial<ClinicalNote> & { id: string }) => Promise<boolean>;
  onSelectTool: (toolId: ToolId, itemId?: string) => void;
}

type NoteDraftState = {
  content: string;
  hdList: string[];
  conductDoubts: boolean;
  unexpectedOutcome: boolean;
  procedures: string[];
  patientDestination: PatientDestination | null;
  encounterClosed: boolean;
  encounterClosedAt: string | null;
};

export function NoteEditor({
  note,
  folder,
  onBack,
  onGoDashboard,
  onUpdate,
  onSelectTool,
}: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const [hdInput, setHdInput] = useState("");
  const [hdList, setHdList] = useState<string[]>(getVisibleHdList(note.hd_list));
  const [conductDoubts, setConductDoubts] = useState(note.conduct_doubts || false);
  const [unexpectedOutcome, setUnexpectedOutcome] = useState(note.unexpected_outcome || false);
  const [procedures, setProcedures] = useState<string[]>(note.procedures || []);
  const [procedureSelectValue, setProcedureSelectValue] = useState("");
  const [needsHandover, setNeedsHandover] = useState<"sim" | "nao" | null>(null);
  const [patientDestination, setPatientDestination] = useState<PatientDestination | null>(
    getNotePatientDestination(note),
  );
  const [encounterClosed, setEncounterClosed] = useState(isNoteEncounterClosed(note));
  const [encounterClosedAt, setEncounterClosedAt] = useState<string | null>(
    getNoteEncounterClosedAt(note),
  );
  const [closeFeedback, setCloseFeedback] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(note.updated_at);
  const [editorScrollPadding, setEditorScrollPadding] = useState(0);
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [visualCaret, setVisualCaret] = useState<{
    left: number;
    top: number;
    height: number;
  } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const editorShellRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const ghostRef = useRef<HTMLPreElement | null>(null);

  const updateSelectionFromTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    setSelectionRange({
      start: textarea.selectionStart ?? 0,
      end: textarea.selectionEnd ?? 0,
    });
  }, []);
  const latestDraftRef = useRef<NoteDraftState | null>(null);
  const latestNoteRef = useRef<ClinicalNote>(note);

  const getDraftSnapshot = (): NoteDraftState => ({
    content,
    hdList,
    conductDoubts,
    unexpectedOutcome,
    procedures,
    patientDestination,
    encounterClosed,
    encounterClosedAt,
  });

  const hasDraftChanges = (draft: NoteDraftState, sourceNote: ClinicalNote): boolean =>
    draft.content !== sourceNote.content ||
    JSON.stringify(draft.hdList) !== JSON.stringify(getVisibleHdList(sourceNote.hd_list)) ||
    draft.conductDoubts !== sourceNote.conduct_doubts ||
    draft.unexpectedOutcome !== sourceNote.unexpected_outcome ||
    JSON.stringify(draft.procedures) !== JSON.stringify(sourceNote.procedures) ||
    draft.patientDestination !== getNotePatientDestination(sourceNote) ||
    draft.encounterClosed !== isNoteEncounterClosed(sourceNote) ||
    draft.encounterClosedAt !== getNoteEncounterClosedAt(sourceNote);

  const buildUpdatePayload = (draft: NoteDraftState) => ({
    id: note.id,
    content: draft.content,
    hd_list: withClinicalNoteMetadata(draft.hdList, {
      patientDestination: draft.patientDestination,
      encounterClosed: draft.encounterClosed,
      encounterClosedAt: draft.encounterClosedAt,
      plantaoRegistro: getNotePlantaoRegistro(note),
    }),
    conduct_doubts: draft.conductDoubts,
    unexpected_outcome: draft.unexpectedOutcome,
    procedures: draft.procedures,
    patient_destination: draft.patientDestination,
    encounter_closed: draft.encounterClosed,
    encounter_closed_at: draft.encounterClosedAt,
  });

  useEffect(() => {
    latestDraftRef.current = getDraftSnapshot();
    latestNoteRef.current = note;
  }, [
    note,
    content,
    hdList,
    conductDoubts,
    unexpectedOutcome,
    procedures,
    patientDestination,
    encounterClosed,
    encounterClosedAt,
  ]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const draft = getDraftSnapshot();
    const hasChanges = hasDraftChanges(draft, note);
    if (!hasChanges) return;

    setSaveState("saving");
    debounceRef.current = setTimeout(() => {
      void onUpdate(buildUpdatePayload(draft)).then((ok) => {
        if (!ok) {
          setSaveState("error");
          return;
        }
        setLastSavedAt(new Date().toISOString());
        setSaveState("saved");
      });
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    content,
    hdList,
    conductDoubts,
    unexpectedOutcome,
    procedures,
    patientDestination,
    encounterClosed,
    encounterClosedAt,
    note,
    onUpdate,
  ]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const latestDraft = latestDraftRef.current;
      const latestNote = latestNoteRef.current;
      if (!latestDraft || !latestNote) return;
      if (!hasDraftChanges(latestDraft, latestNote)) return;
      void onUpdate(buildUpdatePayload(latestDraft));
    };
  }, [onUpdate]);

  const handleBack = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const draft = getDraftSnapshot();
    if (hasDraftChanges(draft, note)) {
      setSaveState("saving");
      const ok = await onUpdate(buildUpdatePayload(draft));
      if (!ok) {
        setSaveState("error");
        setCloseFeedback("Falha ao salvar as marcações. Tente novamente.");
        setIsLeaving(false);
        return;
      }
      const nowIso = new Date().toISOString();
      setLastSavedAt(nowIso);
      setSaveState("saved");
    }
    onBack();
  };

  const handleCloseEncounter = async () => {
    if (!patientDestination) {
      setCloseFeedback("Selecione o destino do paciente antes de encerrar o atendimento.");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const closedAt = encounterClosedAt || new Date().toISOString();

    setSaveState("saving");
    setCloseFeedback(null);
    setEncounterClosed(true);
    setEncounterClosedAt(closedAt);

    const ok = await onUpdate({
      id: note.id,
      content,
      hd_list: hdList,
      conduct_doubts: conductDoubts,
      unexpected_outcome: unexpectedOutcome,
      procedures,
      patient_destination: patientDestination,
      encounter_closed: true,
      encounter_closed_at: closedAt,
    });
    if (!ok) {
      setSaveState("error");
      setCloseFeedback("Falha ao encerrar atendimento. Revise conexão e tente novamente.");
      return;
    }

    setLastSavedAt(closedAt);
    setSaveState("saved");
    setCloseFeedback("Atendimento encerrado. Destino e sinalizações foram formalizados.");
    onGoDashboard();
  };

  const addHD = () => {
    const trimmed = hdInput.trim();
    if (!trimmed || hdList.includes(trimmed)) return;
    setHdList((prev) => [...prev, trimmed]);
    setHdInput("");
  };

  const removeHD = (hd: string) => setHdList((prev) => prev.filter((h) => h !== hd));

  const availableProcedures = useMemo(() => {
    const contextProcedures = PROCEDIMENTOS.filter((procedure) =>
      procedure.context.includes(folder.context),
    );

    return contextProcedures.length > 0 ? contextProcedures : PROCEDIMENTOS;
  }, [folder.context]);
  const selectedProcedureItems = useMemo(
    () =>
      procedures.map((procedureName) => ({
        name: procedureName,
        catalogItem: PROCEDIMENTOS.find((procedure) => procedure.name === procedureName),
      })),
    [procedures],
  );

  const selectProcedure = (procedureId: string) => {
    const selectedProcedure = availableProcedures.find((procedure) => procedure.id === procedureId);
    setProcedureSelectValue("");

    if (!selectedProcedure) return;

    setProcedures((prev) =>
      prev.includes(selectedProcedure.name) ? prev : [...prev, selectedProcedure.name],
    );
  };

  const removeProcedure = (procedure: string) =>
    setProcedures((prev) => prev.filter((p) => p !== procedure));

  const openHandoverDraft = () => {
    const { paciente, idade } = parsePatientIdentity(note.title);
    const itemId = JSON.stringify({
      source: "notepad",
      sourceNoteId: note.id,
      requestedAt: Date.now(),
      cenario: folder.context,
      paciente,
      idade,
    });

    onSelectTool("passagem", itemId);
  };

  const handleHandoverNeedChange = (value: "sim" | "nao") => {
    setNeedsHandover(value);

    if (value === "sim") {
      openHandoverDraft();
    }
  };

  const contextLabel =
    folder.sub_specialty ??
    (folder.specialty
      ? folder.label
      : { ps: "Pronto-Socorro", uti: "UTI", ambulatorial: "Ambulatório", sala_de_emergencia: "Sala de Emergência", cirurgia: "Cirurgia", enfermaria: "Enfermaria" }[folder.context]);
  const hasPsAutocomplete = PS_CONTEXTS.has(folder.context);
  const previewRules =
    folder.context === "uti"
      ? UTI_GHOST_RULES
      : hasPsAutocomplete
        ? PS_AUTOCOMPLETE_RULES
        : null;
  const editorPreview = previewRules
    ? renderEditorPreview(content, previewRules, hasPsAutocomplete)
    : null;

  const getCaretClientRect = useCallback((offset: number): DOMRect | null => {
    const preview = ghostRef.current;
    if (!preview) return null;

    const lines = Array.from(
      preview.querySelectorAll<HTMLElement>("[data-preview-line]"),
    );
    if (lines.length === 0) return null;

    const line =
      lines.find((item) => {
        const start = Number(item.dataset.lineStart ?? 0);
        const end = Number(item.dataset.lineEnd ?? start);
        return offset >= start && offset <= end;
      }) ?? lines[lines.length - 1];

    const start = Number(line.dataset.lineStart ?? 0);
    const lineLength = Number(line.dataset.lineLength ?? 0);
    const localOffset = Math.max(0, Math.min(offset - start, lineLength));
    const realText = line.querySelector<HTMLElement>("[data-real-text]");
    const textNode = realText?.firstChild;

    if (!realText || !textNode) {
      return line.getBoundingClientRect();
    }

    if (lineLength === 0) {
      return realText.getBoundingClientRect();
    }

    const range = document.createRange();
    const textLength = textNode.textContent?.length ?? 0;

    if (localOffset === lineLength && localOffset > 0) {
      range.setStart(textNode, Math.min(localOffset - 1, textLength));
      range.setEnd(textNode, Math.min(localOffset, textLength));
      const rect = range.getBoundingClientRect();
      range.detach();

      return new DOMRect(rect.right, rect.top, 0, rect.height);
    }

    range.setStart(textNode, Math.min(localOffset, textLength));
    range.setEnd(textNode, Math.min(localOffset + 1, textLength));
    const rect = range.getBoundingClientRect();
    range.detach();

    return new DOMRect(rect.left, rect.top, 0, rect.height);
  }, []);

  const syncVisualCaret = useCallback(() => {
    if (!editorPreview || selectionRange.start !== selectionRange.end) {
      setVisualCaret(null);
      return;
    }

    const shell = editorShellRef.current;
    const rect = getCaretClientRect(selectionRange.end);

    if (!shell || !rect) {
      setVisualCaret(null);
      return;
    }

    const shellRect = shell.getBoundingClientRect();
    setVisualCaret({
      left: rect.left - shellRect.left,
      top: rect.top - shellRect.top,
      height: rect.height,
    });
  }, [editorPreview, getCaretClientRect, selectionRange.end, selectionRange.start]);

  const getContentOffsetFromPoint = useCallback((clientX: number, clientY: number): number => {
    const preview = ghostRef.current;
    if (!preview) return selectionRange.end;

    const lines = Array.from(
      preview.querySelectorAll<HTMLElement>("[data-preview-line]"),
    );
    if (lines.length === 0) return 0;

    let selectedLine = lines[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const line of lines) {
      const rect = line.getBoundingClientRect();
      const verticalDistance =
        clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;

      if (verticalDistance < closestDistance) {
        closestDistance = verticalDistance;
        selectedLine = line;
      }
    }

    const lineStart = Number(selectedLine.dataset.lineStart ?? 0);
    const lineLength = Number(selectedLine.dataset.lineLength ?? 0);

    if (lineLength === 0) return lineStart;

    let bestOffset = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let localOffset = 0; localOffset <= lineLength; localOffset += 1) {
      const rect = getCaretClientRect(lineStart + localOffset);
      if (!rect) continue;

      const verticalDistance =
        clientY < rect.top ? rect.top - clientY : clientY > rect.bottom ? clientY - rect.bottom : 0;
      const horizontalDistance = Math.abs(clientX - rect.left);
      const distance = verticalDistance * 4 + horizontalDistance;

      if (distance < bestDistance) {
        bestDistance = distance;
        bestOffset = localOffset;
      }
    }

    return lineStart + bestOffset;
  }, [getCaretClientRect, selectionRange.end]);

  useLayoutEffect(() => {
    if (!editorPreview || !textareaRef.current || !ghostRef.current) {
      setEditorScrollPadding(0);
      return;
    }

    const textarea = textareaRef.current;
    const ghost = ghostRef.current;

    const syncScrollableHeight = () => {
      const textareaHeightWithoutExtraPadding = textarea.scrollHeight - editorScrollPadding;
      const missingScrollHeight = ghost.scrollHeight - textareaHeightWithoutExtraPadding;
      const nextPadding = Math.max(0, missingScrollHeight + 32);

      setEditorScrollPadding((current) =>
        Math.abs(current - nextPadding) > 1 ? nextPadding : current,
      );
    };

    const animationFrame = requestAnimationFrame(syncScrollableHeight);
    const resizeObserver = new ResizeObserver(syncScrollableHeight);
    resizeObserver.observe(textarea);
    resizeObserver.observe(ghost);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [content, editorPreview, editorScrollPadding]);

  useLayoutEffect(() => {
    const animationFrame = requestAnimationFrame(syncVisualCaret);
    return () => cancelAnimationFrame(animationFrame);
  }, [content, editorPreview, selectionRange, editorScrollPadding, syncVisualCaret]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleBack()}
            disabled={isLeaving}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-h4 font-bold text-neutral-900">{note.title || "Nova nota"}</h2>
            <div className="flex items-center gap-2">
              <span className="text-overline uppercase text-brand-700">{contextLabel}</span>
              <span className="text-caption text-neutral-300">•</span>
              <p className="text-caption text-neutral-400">
                {new Date(note.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLeaving && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              Salvando antes de sair...
            </span>
          )}
          <SaveStatus state={saveState} lastSavedAt={lastSavedAt ? new Date(lastSavedAt) : null} />
        </div>
      </div>

      {/* Prontuário */}
      <div
        ref={editorShellRef}
        className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors duration-fast focus-within:border-brand-600 focus-within:ring-[3px] focus-within:ring-brand-100"
        onPointerDownCapture={(e) => {
          if (!editorPreview || !textareaRef.current) return;

          const rect = e.currentTarget.getBoundingClientRect();
          const isScrollbarOrResizeArea =
            e.clientX > rect.right - 16 || e.clientY > rect.bottom - 16;
          if (isScrollbarOrResizeArea) return;

          e.preventDefault();
          const offset = getContentOffsetFromPoint(e.clientX, e.clientY);
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(offset, offset);
          setSelectionRange({ start: offset, end: offset });
        }}
      >
        {editorPreview && (
          <pre
            ref={ghostRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words rounded-xl p-5 font-mono text-body text-neutral-800"
            style={{ scrollbarWidth: "none" }}
          >
            {editorPreview}
          </pre>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            const target = e.currentTarget;
            const rawValue = target.value;
            const rawCursor = target.selectionStart ?? rawValue.length;
            const scrollTop = target.scrollTop;
            const scrollLeft = target.scrollLeft;
            const next = hasPsAutocomplete
              ? applyInlineAutocomplete(rawValue, rawCursor, PS_AUTOCOMPLETE_RULES)
              : { value: rawValue, cursor: rawCursor };

            setContent(next.value);
            setSelectionRange({ start: next.cursor, end: next.cursor });

            if (next.value !== rawValue) {
              requestAnimationFrame(() => {
                if (!textareaRef.current) return;
                textareaRef.current.selectionStart = next.cursor;
                textareaRef.current.selectionEnd = next.cursor;
                textareaRef.current.scrollTop = scrollTop;
                textareaRef.current.scrollLeft = scrollLeft;
                if (ghostRef.current) {
                  ghostRef.current.scrollTop = scrollTop;
                  ghostRef.current.scrollLeft = scrollLeft;
                }
              });
            }
          }}
          onKeyUp={updateSelectionFromTextarea}
          onScroll={(e) => {
            if (!ghostRef.current) return;
            ghostRef.current.scrollTop = e.currentTarget.scrollTop;
            ghostRef.current.scrollLeft = e.currentTarget.scrollLeft;
            requestAnimationFrame(syncVisualCaret);
          }}
          onSelect={updateSelectionFromTextarea}
          spellCheck
          aria-label="Conteúdo do prontuário"
          style={
            editorScrollPadding
              ? { paddingBottom: `${20 + editorScrollPadding}px` }
              : undefined
          }
          className={cn(
            "relative z-10 block min-h-[42vh] w-full resize-y rounded-xl border-0 bg-transparent p-5 font-mono text-body placeholder-neutral-400 focus:outline-none",
            editorPreview ? "text-transparent caret-transparent" : "text-neutral-800",
          )}
        />
        {editorPreview && visualCaret && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-20 w-px bg-neutral-900"
            style={{
              height: `${visualCaret.height}px`,
              left: `${visualCaret.left}px`,
              top: `${visualCaret.top}px`,
            }}
          />
        )}
      </div>

      {/* HD / Lista de Problemas */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Quais as HD / Lista de Problemas?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          As hipóteses diagnósticas geram sugestões de CID, calculadoras e guias.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={hdInput}
            onChange={(e) => setHdInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHD();
              }
            }}
            placeholder="Ex: IAM, Pneumonia, HAS descompensada…"
            className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-2 text-body text-neutral-800 placeholder-neutral-400 focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={addHD}
            aria-label="Adicionar hipótese"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40"
            disabled={!hdInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {hdList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hdList.map((hd) => (
              <span
                key={hd}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700"
              >
                {hd}
                <button
                  type="button"
                  onClick={() => removeHD(hd)}
                  aria-label={`Remover ${hd}`}
                  className="text-brand-300 hover:text-brand-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Procedures */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Realizará algum procedimento?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          Selecione os procedimentos disponíveis para este cenário clínico.
        </p>

        <select
          value={procedureSelectValue}
          onChange={(event) => selectProcedure(event.target.value)}
          className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-body text-neutral-800 focus:border-brand-600 focus:outline-none focus:ring-[3px] focus:ring-brand-100"
        >
          <option value="">Selecionar procedimento...</option>
          {availableProcedures.map((procedure) => {
            const isSelected = procedures.includes(procedure.name);

            return (
              <option key={procedure.id} value={procedure.id} disabled={isSelected}>
                {procedure.name}
                {isSelected ? " (selecionado)" : ""}
              </option>
            );
          })}
        </select>

        {procedures.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {procedures.map((procedure) => (
                <span
                  key={procedure}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-caption font-medium text-brand-700"
                >
                  {procedure}
                  <button
                    type="button"
                    onClick={() => removeProcedure(procedure)}
                    aria-label={`Remover ${procedure}`}
                    className="text-brand-300 hover:text-brand-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="rounded-lg border border-brand-200 bg-white p-3">
              <p className="mb-2 text-caption font-medium text-neutral-500">
                Sugestões após seleção
              </p>
              <div className="flex flex-col gap-3">
                {selectedProcedureItems.map(({ name, catalogItem }) => (
                  <div
                    key={name}
                    className="rounded-lg border border-brand-100 bg-brand-50/60 p-2.5"
                  >
                    <p className="mb-2 text-caption font-semibold text-neutral-700">
                      {catalogItem?.name ?? name}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => catalogItem && onSelectTool("procedimentos", catalogItem.id)}
                        disabled={!catalogItem}
                        className={cn(
                          "inline-flex items-center justify-between gap-3 rounded-lg bg-brand-600 px-3 py-2 text-left text-caption font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />
                          Abrir guia
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => catalogItem && onSelectTool("score_residente", catalogItem.id)}
                        disabled={!catalogItem}
                        className="inline-flex items-center justify-between gap-3 rounded-lg border border-brand-200 bg-white px-3 py-2 text-left text-caption font-semibold text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ListChecks className="h-4 w-4 shrink-0" aria-hidden />
                          Registrar no score
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <TagSuggestions
        hdList={hdList}
        context={folder.context}
        specialty={(folder.specialty as any) || undefined}
        onSelectTool={onSelectTool}
      />

      {/* Conduct Doubts */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={conductDoubts}
            onChange={(e) => setConductDoubts(e.target.checked)}
            className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
          />
          <span className="text-body font-medium text-neutral-800">
            Dúvidas em relação a conduta?
          </span>
        </label>
      </div>

      {/* Unexpected Outcome */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={unexpectedOutcome}
            onChange={(e) => setUnexpectedOutcome(e.target.checked)}
            className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
          />
          <span className="text-body font-medium text-neutral-800">
            Desfecho não previsto?
          </span>
        </label>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Qual o destino do paciente?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          Selecione o desfecho principal deste atendimento.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DESTINATION_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-brand-200 bg-white px-3 py-2"
            >
              <input
                type="radio"
                name="patient-destination"
                value={option.value}
                checked={patientDestination === option.value}
                onChange={() => setPatientDestination(option.value)}
                className="h-4 w-4 border-brand-300 text-brand-600 focus:ring-2 focus:ring-brand-600"
              />
              <span className="text-caption font-medium text-neutral-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">
          Preciso passar plantão?
        </h3>
        <p className="mb-3 text-caption text-neutral-500">
          Se sim, abrimos a Passagem de Plantão com cenário, paciente e idade já preenchidos.
        </p>
        <div className="flex flex-wrap gap-2">
          {(["sim", "nao"] as const).map((option) => {
            const active = needsHandover === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleHandoverNeedChange(option)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-caption font-semibold transition-colors",
                  active
                    ? "border-brand-500 bg-white text-brand-700 shadow-sm"
                    : "border-brand-200 bg-white/80 text-neutral-600 hover:border-brand-300 hover:bg-white",
                )}
              >
                {option === "sim" ? "Sim" : "Não"}
              </button>
            );
          })}
        </div>
        {needsHandover === "sim" && (
          <p className="mt-3 text-caption text-brand-700">
            Rascunho aberto na ferramenta de Passagem de Plantão. Complete os campos restantes e clique em Adicionar caso.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="mb-1 text-body font-semibold text-neutral-800">Encerrar atendimento</h3>
        <p className="mb-3 text-caption text-neutral-500">
          Isso formaliza o destino do paciente no card e libera as marcações de dúvidas/desfecho para a aba Dúvidas no Plantão.
        </p>
        <button
          type="button"
          onClick={() => void handleCloseEncounter()}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-body font-medium transition-colors ${
            encounterClosed
              ? "cursor-default bg-neutral-200 text-neutral-600"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
          disabled={encounterClosed}
        >
          {encounterClosed ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Atendimento finalizado
            </>
          ) : (
            "Encerrar atendimento"
          )}
        </button>
        {encounterClosedAt && (
          <p className="mt-2 text-caption text-neutral-500">
            Encerrado em{" "}
            {new Date(encounterClosedAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
        {closeFeedback && <p className="mt-2 text-caption text-brand-700">{closeFeedback}</p>}
      </div>
    </div>
  );
}
