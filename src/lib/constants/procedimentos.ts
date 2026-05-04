import type { ContextType } from "@/lib/constants/specialties";

export interface ProcedimentoStep {
  text: string;
}

export interface ProcedimentoInfo {
  indicacoes: string[];
  contraindicacoes: string[];
  complicacoes: string[];
  bizus: string;
}

export interface Procedimento {
  id: string;
  name: string;
  context: ContextType[];
  /** HD keywords that trigger a suggestion for this procedure */
  hdTags: string[];
  steps: ProcedimentoStep[];
  info?: ProcedimentoInfo;
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
    info: {
      indicacoes: [
        "Medicações hiperosmolares/vesicantes (ex: G50%, KCl)",
        "Vasopressores",
        "Nutrição parenteral",
        "Falência de acesso periférico",
        "Monitorização hemodinâmica",
        "Hemodiálise",
        "Marcapasso provisório transvenoso",
      ],
      contraindicacoes: [],
      complicacoes: [],
      bizus: `Em qual sítio puncionar? Janelar USG em todos. Verificar anatomia, presença de trombos, distância pele-vaso.

1º) Subclávia – preferencial, menos infecção de todos, mais complicações (pneumotórax, pegar artéria, não compressível). Se optar, deixar USG longitudinal; clavícula faz sombra acústica, pleura logo abaixo.

2º) VJID – trajeto menor. VJIE tem ducto torácico.

3º) VJIE – se houver chance de precisar de Shilley, deixar VJID livre.

4º) Femoral – preferível no trauma/choque com ABCDE em andamento (controverso: mais infecção; só se diarreia ou obeso).

Shilley: sítio preferencial (mais calibroso) VJID > femoral > subclávia.`,
    },
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
  {
    id: "passagem_pai",
    name: "Passagem de PAI",
    context: ["sala_de_emergencia", "uti"],
    hdTags: ["choque"],
    steps: [
      { text: "Sítio: __ (AFE, AFD, ARE, ARD). Complicações: nenhuma." },
      { text: "Antissepsia + assepsia." },
      { text: "Anestesia local com lidocaína a 2%." },
      { text: "Canulação da ___ guiada por USG e passagem de fio guia." },
      { text: "Passado cateter monolúmen." },
      { text: "Refluxo de sangue arterial, com boa pulsação." },
      { text: "Conexão do cateter ao sistema de PAI e lavagem da via." },
      { text: "Zerado sistema. Boa curva ao monitor." },
      { text: "Fixação com curativo." },
    ],
  },
  {
    id: "toracocentese",
    name: "Toracocentese Diagnóstica e de Alívio",
    context: ["sala_de_emergencia", "enfermaria", "uti"],
    hdTags: ["derrame pleural", "pneumotorax", "insuficiencia respiratoria"],
    steps: [
      { text: "Paciente sentado e confortável." },
      {
        text: "USG com transdutor curvo, identificando local de punção mais favorável em hemitórax D.",
      },
      { text: "Antissepsia e assepsia + campos estéreis." },
      {
        text: "Infundo cerca de 10ml de Lidocaína 2% sem vaso em subcutâneo e pleura.",
      },
      {
        text: "Posiciono jelco 14 e punciono local, com saída de secreção sero-hemático claro.",
      },
      {
        text: "Coleto 1 seringa de 20ml para análise bioquímica e biológica.",
      },
      { text: "Fixo equipo e conecto-o ao sistema coletor aberto." },
      { text: "Encaminho amostras das seringas ao laboratório." },
      {
        text: "Acompanho paciente por cerca de 10min com drenagem estimada de 300mL de conteúdo pleural sero-hemático claro.",
      },
      { text: "Realizo curativo simples com gaze e esparadrapo." },
      { text: "Rx de tórax de controle após." },
    ],
  },
] as const;
