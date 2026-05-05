import type { DiseaseGuideItem } from "@/lib/disease-guides/types";

/**
 * Catálogo inicial para o Guia Completo por Doença.
 * Conteúdo em formato resumido/estruturado para uso operacional no plantão.
 */
export const localDiseaseGuidesCatalog: readonly DiseaseGuideItem[] = [
  {
    id: "sepsis-septic-shock",
    disease: "Sepse e Choque Séptico",
    contexts: ["PS", "UTI", "Sala de Emergencia", "Enfermaria"],
    hdTags: [
      { name: "sepse", weight: 10 },
      { name: "choque septico", weight: 10 },
      { name: "foco infeccioso", weight: 6 },
      { name: "lactato elevado", weight: 6 },
    ],
    sections: [
      {
        title: "Lista Inicial",
        content: [
          "Avaliar ABC e necessidade de UTI.",
          "Coletar culturas antes do antibiótico se não houver atraso terapêutico.",
          "Iniciar antibiótico de amplo espectro precocemente.",
          "Reposição volêmica guiada por perfusão e resposta clínica.",
        ],
      },
      {
        title: "Avaliação Diagnóstica",
        content: [
          "Sinais de disfunção orgânica e hipoperfusão.",
          "Pesquisar foco: pulmonar, urinário, abdominal, pele/partes moles, SNC, corrente sanguínea.",
          "Trend de lactato, função renal, hemograma e marcadores de inflamação.",
        ],
      },
      {
        title: "Plano",
        content: [
          "Reavaliar necessidade de vasopressor para manter PAM alvo.",
          "Ajustar antibiótico com base em cultura e epidemiologia local.",
          "Controle de foco quando indicado (drenagem, retirada de dispositivos, etc).",
        ],
      },
    ],
    source: {
      name: "Point of Care Medicine",
      url: "https://www.pointofcaremedicine.com/inpatient/sepsis-and-septic-shock",
      updatedAt: "2023-09-01",
    },
  },
  {
    id: "dka",
    disease: "Cetoacidose Diabética (DKA)",
    contexts: ["PS", "UTI", "Sala de Emergencia"],
    hdTags: [
      { name: "cetoacidose diabetica", weight: 10 },
      { name: "hiperglicemia", weight: 6 },
      { name: "acidose metabolica", weight: 6 },
    ],
    sections: [
      {
        title: "Lista Inicial",
        content: [
          "Confirmar critérios de DKA e gravidade.",
          "Iniciar hidratação intravenosa e monitorização contínua.",
          "Programar insulinoterapia EV e reposição de potássio conforme protocolo.",
        ],
      },
      {
        title: "Avaliação Diagnóstica",
        content: [
          "Gasometria, eletrólitos, cetonas, função renal e gap aniônico.",
          "Identificar fator precipitante: infecção, omissão de insulina, IAM, AVC, etc.",
        ],
      },
      {
        title: "Plano",
        content: [
          "Controle glicêmico progressivo com segurança.",
          "Correção de distúrbios hidroeletrolíticos.",
          "Transição para esquema subcutâneo após resolução da cetoacidose.",
        ],
      },
    ],
    source: {
      name: "Point of Care Medicine",
      url: "https://www.pointofcaremedicine.com/templates",
    },
  },
  {
    id: "cap",
    disease: "Pneumonia Adquirida na Comunidade (PAC)",
    contexts: ["PS", "Enfermaria", "Ambulatorio"],
    hdTags: [
      { name: "pneumonia", weight: 10 },
      { name: "infeccao respiratoria", weight: 6 },
      { name: "dispneia febril", weight: 6 },
    ],
    sections: [
      {
        title: "Lista Inicial",
        content: [
          "Estratificar gravidade e necessidade de internação.",
          "Iniciar antibiótico empírico conforme perfil clínico.",
          "Suporte respiratório conforme saturação e desconforto.",
        ],
      },
      {
        title: "Avaliação Diagnóstica",
        content: [
          "Radiografia/TC de tórax quando indicado.",
          "Laboratórios e pesquisa etiológica conforme gravidade.",
        ],
      },
      {
        title: "Plano",
        content: [
          "Reavaliação clínica em 48-72h.",
          "Descalonamento quando possível e definição de duração total do esquema.",
        ],
      },
    ],
    source: {
      name: "Point of Care Medicine",
      url: "https://www.pointofcaremedicine.com/templates",
    },
  },
] as const;
