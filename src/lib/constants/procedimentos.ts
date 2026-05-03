import type { ContextType } from "@/lib/constants/specialties";

export interface ProcedimentoStep {
  text: string;
}

export interface Procedimento {
  id: string;
  name: string;
  context: ContextType[];
  /** HD keywords that trigger a suggestion for this procedure */
  hdTags: string[];
  steps: ProcedimentoStep[];
}

export const PROCEDIMENTOS: readonly Procedimento[] = [
  {
    id: "paracentese_alivio",
    name: "Paracentese de Alívio",
    context: ["ps"],
    hdTags: ["cirrose", "ascite"],
    steps: [
      { text: "Posiciono paciente em DDH" },
      {
        text: "Com Transdutor linear, realizo USG de abdome, identificando local de punção mais favorável em quadrante inferior esquerdo",
      },
      { text: "Realizo antissepsia e assepsia" },
      { text: "Posiciono campos" },
      { text: "Infundo cerca de 5ml de Lidocaína subcutânea" },
      {
        text: "Posiciono jelco 14 e punciono local, com saída de secreção amarela-citrino",
      },
      {
        text: "Coleto 3 seringas de 20ml para análise bioquímica e biológica",
      },
      { text: "Fixo equipo e conecto-o ao sistema coletor aberto" },
      { text: "Encaminho amostras das seringas ao laboratório" },
      {
        text: "Acompanho paciente por cerca de ___h com drenagem estimada de ___mL de conteúdo ascítico amarelo-citrino",
      },
      {
        text: "Realizo curativo simples com gaze e esparadrapo",
      },
      {
        text: "Retorno paciente em bom estado geral, sem queixas, à ala ___ onde está internada",
      },
    ],
  },
] as const;
