import type { CalculatorCatalogItem } from "@/lib/calculators/types";

export const localCalculatorCatalog: CalculatorCatalogItem[] = [
  {
    name: "qSOFA",
    slug: "qsofa",
    contexts: ["PS", "Sala de Emergencia", "Enfermaria"],
    tags: [
      { name: "sepse", weight: 10 },
      { name: "choque septico", weight: 10 },
      { name: "infeccao", weight: 6 },
    ],
  },
  {
    name: "SOFA",
    slug: "sofa",
    contexts: ["UTI", "Sala de Emergencia"],
    tags: [
      { name: "sepse", weight: 10 },
      { name: "disfuncao organica", weight: 10 },
      { name: "falencia multipla", weight: 6 },
    ],
  },
  {
    name: "NEWS2",
    slug: "news2",
    contexts: ["PS", "Enfermaria"],
    tags: [
      { name: "deterioracao clinica", weight: 10 },
      { name: "instabilidade", weight: 6 },
      { name: "sinais vitais alterados", weight: 6 },
    ],
  },
  {
    name: "Glasgow",
    slug: "glasgow",
    contexts: ["PS", "UTI"],
    tags: [
      { name: "tce", weight: 10 },
      { name: "rebaixamento consciencia", weight: 10 },
      { name: "avc", weight: 6 },
    ],
  },
  {
    name: "RASS",
    slug: "rass",
    contexts: ["UTI"],
    tags: [
      { name: "sedacao", weight: 10 },
      { name: "delirium", weight: 6 },
      { name: "agitacao", weight: 6 },
    ],
  },
  {
    name: "Wells_TEP",
    slug: "wells-tep",
    contexts: ["PS", "Ambulatorio"],
    tags: [
      { name: "tep", weight: 10 },
      { name: "dispneia", weight: 6 },
      { name: "dor toracica", weight: 6 },
    ],
  },
  {
    name: "Wells_TVP",
    slug: "wells-tvp",
    contexts: ["PS", "Ambulatorio"],
    tags: [
      { name: "tvp", weight: 10 },
      { name: "edema unilateral", weight: 6 },
      { name: "dor em panturrilha", weight: 6 },
    ],
  },
  {
    name: "PAM",
    slug: "pam",
    contexts: ["UTI", "PS"],
    tags: [
      { name: "choque", weight: 10 },
      { name: "hipotensao", weight: 10 },
      { name: "perfusao", weight: 6 },
    ],
  },
  {
    name: "IMC",
    slug: "imc",
    contexts: ["Ambulatorio"],
    tags: [
      { name: "obesidade", weight: 10 },
      { name: "avaliacao nutricional", weight: 6 },
      { name: "sobrepeso", weight: 6 },
    ],
  },
  {
    name: "CHA2DS2-VASc",
    slug: "cha2ds2-vasc",
    contexts: ["Ambulatorio", "PS", "Sala de Emergencia", "Enfermaria", "UTI"],
    tags: [
      { name: "fibrilacao atrial", weight: 10 },
      { name: "fibrilacao atrial nao valvar", weight: 10 },
      { name: "fa", weight: 10 },
      { name: "avc", weight: 6 },
    ],
  },
];
