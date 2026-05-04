import {
  Calculator,
  ClipboardList,
  Search,
  FileText,
  Stethoscope,
  Pill,
  Bug,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";

export type ToolId =
  | "receituarios"
  | "procedimentos"
  | "exames"
  | "escores"
  | "calculadoras"
  | "diluicao"
  | "antimicrobianos"
  | "guias"
  | "score_residente"
  | "cid"
  | "duvidas"
  | "plantonista";

export interface Tool {
  id: ToolId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Mapeia ao numerador F1..F10 do PRD §4. */
  prdRef: string;
}

/** Ordem segue a frequência de uso esperada em consulta/plantão. */
export const TOOLS: readonly Tool[] = [
  {
    id: "receituarios",
    label: "Receituários",
    description: "Templates simples, controlado e especial.",
    icon: FileText,
    prdRef: "F5",
  },
  {
    id: "procedimentos",
    label: "Guia de Procedimentos",
    description: "Passo-a-passo curado por preceptores.",
    icon: Stethoscope,
    prdRef: "F6",
  },
  {
    id: "exames",
    label: "Compactador de Exames",
    description: "Valores laboratoriais para evolução.",
    icon: FlaskConical,
    prdRef: "F9",
  },
  {
    id: "escores",
    label: "Escores Clínicos",
    description: "CHA₂DS₂-VASc, GRACE, qSOFA, Glasgow, Wells, NIHSS.",
    icon: ClipboardList,
    prdRef: "F3",
  },
  {
    id: "calculadoras",
    label: "Calculadoras",
    description: "Clearance, IMC, dose pediátrica, balanço hídrico.",
    icon: Calculator,
    prdRef: "F2",
  },
  {
    id: "diluicao",
    label: "Guia de Diluição e Doses",
    description: "Bomba de infusão, diluições, taxa.",
    icon: Pill,
    prdRef: "F7",
  },
  {
    id: "antimicrobianos",
    label: "Guia de Antimicrobianos",
    description: "Esquemas empíricos por foco infeccioso.",
    icon: Bug,
    prdRef: "F8",
  },
  {
    id: "guias",
    label: "Guia Completo por Doença",
    description: "Revisão por doença, 5 áreas das provas.",
    icon: BookOpen,
    prdRef: "F10",
  },
  {
    id: "score_residente",
    label: "Score do Residente",
    description: "Acompanhamento de performance e aprendizado.",
    icon: ClipboardList,
    prdRef: "F13",
  },
  {
    id: "cid",
    label: "CID-10",
    description: "Busca por código ou termo, copiar com 1 clique.",
    icon: Search,
    prdRef: "F4",
  },
  {
    id: "duvidas",
    label: "Dúvidas no Plantão",
    description: "Canal de suporte e perguntas frequentes.",
    icon: HelpCircle,
    prdRef: "F11",
  },
  {
    id: "plantonista",
    label: "Residente de Plantão",
    description: "Identificação e registro do plantonista.",
    icon: Clock,
    prdRef: "F12",
  },
] as const;
