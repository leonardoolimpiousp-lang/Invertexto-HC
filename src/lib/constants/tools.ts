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
  type LucideIcon,
} from "lucide-react";

export type ToolId =
  | "calculadoras"
  | "escores"
  | "cid"
  | "receituarios"
  | "procedimentos"
  | "diluicao"
  | "antimicrobianos"
  | "exames"
  | "guias";

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
    id: "calculadoras",
    label: "Calculadoras",
    description: "Clearance, IMC, dose pediátrica, balanço hídrico.",
    icon: Calculator,
    prdRef: "F2",
  },
  {
    id: "escores",
    label: "Escores",
    description: "CHA₂DS₂-VASc, GRACE, qSOFA, Glasgow, Wells, NIHSS.",
    icon: ClipboardList,
    prdRef: "F3",
  },
  {
    id: "cid",
    label: "CID-10",
    description: "Busca por código ou termo, copiar com 1 clique.",
    icon: Search,
    prdRef: "F4",
  },
  {
    id: "receituarios",
    label: "Receituários",
    description: "Templates simples, controlado e especial.",
    icon: FileText,
    prdRef: "F5",
  },
  {
    id: "procedimentos",
    label: "Procedimentos",
    description: "Passo-a-passo curado por preceptores.",
    icon: Stethoscope,
    prdRef: "F6",
  },
  {
    id: "diluicao",
    label: "Diluição & dose",
    description: "Bomba de infusão, diluições, taxa.",
    icon: Pill,
    prdRef: "F7",
  },
  {
    id: "antimicrobianos",
    label: "Antimicrobianos",
    description: "Esquemas empíricos por foco infeccioso.",
    icon: Bug,
    prdRef: "F8",
  },
  {
    id: "exames",
    label: "Exames",
    description: "Compactador de laboratoriais para evolução.",
    icon: FlaskConical,
    prdRef: "F9",
  },
  {
    id: "guias",
    label: "Guias",
    description: "Revisão por doença, 5 áreas das provas.",
    icon: BookOpen,
    prdRef: "F10",
  },
] as const;
