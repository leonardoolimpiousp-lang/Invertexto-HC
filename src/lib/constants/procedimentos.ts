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
  {
    id: "cvc_3_vias",
    name: "Passagem de Cateter Venoso Central 3 Vias",
    context: ["ps", "uti", "sala_de_emergencia", "cirurgia"],
    hdTags: ["choque", "npt", "falha de acesso", "dhe"],
    steps: [
      {
        text: "Assepsia do paciente, escovação de mãos, paramentação com gorro, capote estéril e luva estéril",
      },
      {
        text: "Antissepsia e colocação de campos estéreis por sobre o paciente",
      },
      { text: "Avaliação do sítio de punção com USG novamente" },
      {
        text: "Anestesia com lidocaína 5% - 1 ml sobre sítio de punção",
      },
      { text: "Salinizado 3 vias do cateter" },
      {
        text: "Punção de veia femoral em primeira tentativa, confirmada através da visualização do fio guia dentro do trajeto venoso nos planos transversal e longitudinal",
      },
      { text: "Dilatação de pele e subcutâneo" },
      {
        text: "Passagem de cateter pelo fio guia sem intercorrências",
      },
      {
        text: "Realizado teste com refluxo nas três vias e lavado após",
      },
      {
        text: "Sutura após anestesia com mais 2ml de Lidocaína 5% sobre pontos de fixação de fábrica do cateter (4 pontos)",
      },
      { text: "Curativo com gaze estéril bem locado" },
      { text: "Radiografia de controle após" },
    ],
  },
  {
    id: "gasometria_arterial",
    name: "Coleta de Gasometria Arterial",
    context: ["ps", "uti", "sala_de_emergencia"],
    hdTags: ["dhe", "insuficiencia respiratoria", "cetoacidose diabetica"],
    steps: [
      {
        text: "O paciente foi preparado e posicionado com campos estéreis de maneira habitual, utilizando antissepsia com clorexidina. Lidocaína a 1% foi utilizada para anestesiar a região.",
      },
      {
        text: "A artéria radial <ESQUERDA/DIREITA> foi palpada e canulada com sucesso na primeira tentativa. Foi visualizado sangue arterial pulsátil e, em seguida, a artéria foi cateterizada utilizando a técnica de Seldinger, com o cateter sendo fixado no local por sutura.",
      },
      {
        text: "Foi obtida boa forma de onda. O paciente tolerou bem o procedimento, sem complicações imediatas. A área foi limpa e aplicado curativo com Tegaderm.",
      },
    ],
  },
] as const;
