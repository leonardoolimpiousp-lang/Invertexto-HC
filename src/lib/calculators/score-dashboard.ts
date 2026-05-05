export const SCORE_SPECIALTIES = [
  "Tromboembolismo",
  "Cardiovascular",
  "Neurologia",
  "Trauma",
  "Infectologia",
  "Gastroenterologia",
  "Nefrologia",
  "Psiquiatria",
  "Cirurgia",
  "Pediatria",
  "Oncologia",
] as const;

export type ScoreSpecialty = (typeof SCORE_SPECIALTIES)[number];

export type ClinicalScoreProject = {
  name: string;
  slug: string;
  specialties: ScoreSpecialty[];
  status: "developed" | "planned";
};

export const clinicalScoreProjects: ClinicalScoreProject[] = [
  { name: "qSOFA", slug: "qsofa", specialties: ["Infectologia"], status: "developed" },
  { name: "SOFA", slug: "sofa", specialties: ["Infectologia"], status: "developed" },
  { name: "NEWS2", slug: "news2", specialties: ["Infectologia"], status: "developed" },
  { name: "Glasgow", slug: "glasgow", specialties: ["Neurologia", "Cirurgia"], status: "developed" },
  { name: "RASS", slug: "rass", specialties: ["Neurologia"], status: "developed" },
  { name: "Wells para TEP", slug: "wells-tep", specialties: ["Tromboembolismo"], status: "developed" },
  { name: "Wells para TVP", slug: "wells-tvp", specialties: ["Tromboembolismo"], status: "planned" },
  {
    name: "CHA2DS2-VASc (FA)",
    slug: "cha2ds2-vasc",
    specialties: ["Cardiovascular", "Tromboembolismo"],
    status: "developed",
  },
  { name: "HESTIA", slug: "hestia", specialties: ["Tromboembolismo"], status: "planned" },
  { name: "PADUA", slug: "padua", specialties: ["Tromboembolismo"], status: "planned" },
  {
    name: "Geneva Revisado",
    slug: "geneva-revisado",
    specialties: ["Tromboembolismo"],
    status: "planned",
  },
  {
    name: "YEARS Algorithm",
    slug: "years-algorithm",
    specialties: ["Tromboembolismo"],
    status: "planned",
  },
  { name: "PERC Rule", slug: "perc-rule", specialties: ["Tromboembolismo"], status: "planned" },
  { name: "PESI", slug: "pesi", specialties: ["Tromboembolismo"], status: "planned" },
  {
    name: "PESI Simplificado",
    slug: "pesi-simplificado",
    specialties: ["Tromboembolismo"],
    status: "planned",
  },
  { name: "ABCD2 Score", slug: "abcd2", specialties: ["Neurologia"], status: "planned" },
  {
    name: "Modified Rankin Scale",
    slug: "modified-rankin",
    specialties: ["Neurologia"],
    status: "planned",
  },
  { name: "NIHSS", slug: "nihss", specialties: ["Neurologia"], status: "planned" },
  { name: "PECARN", slug: "pecarn", specialties: ["Pediatria", "Trauma"], status: "planned" },
  { name: "Score de Downes", slug: "downes", specialties: ["Pediatria"], status: "planned" },
  { name: "MASCC Index", slug: "mascc-index", specialties: ["Oncologia"], status: "planned" },
  { name: "Score de Alvarado", slug: "alvarado", specialties: ["Cirurgia"], status: "planned" },
  { name: "CIVA-R", slug: "civa-r", specialties: ["Psiquiatria"], status: "planned" },
  { name: "MELD Score", slug: "meld", specialties: ["Gastroenterologia"], status: "planned" },
  { name: "Child-Pugh", slug: "child-pugh", specialties: ["Gastroenterologia"], status: "planned" },
  {
    name: "Critérios de Ranson",
    slug: "ranson",
    specialties: ["Gastroenterologia"],
    status: "planned",
  },
  {
    name: "Glasgow-Blatchford Score",
    slug: "glasgow-blatchford",
    specialties: ["Gastroenterologia"],
    status: "planned",
  },
  { name: "CURB-65", slug: "curb-65", specialties: ["Infectologia"], status: "planned" },
  { name: "APACHE II", slug: "apache-ii", specialties: ["Infectologia"], status: "planned" },
  { name: "PSI/PORT Score", slug: "psi-port", specialties: ["Infectologia"], status: "planned" },
  {
    name: "Canadian CT Head Rule",
    slug: "canadian-ct-head-rule",
    specialties: ["Trauma"],
    status: "planned",
  },
  {
    name: "Nexus Criteria for C-Spine Imaging",
    slug: "nexus-c-spine",
    specialties: ["Trauma"],
    status: "planned",
  },
  { name: "HEART Score", slug: "heart", specialties: ["Cardiovascular"], status: "planned" },
  { name: "ADDRS Score", slug: "addrs", specialties: ["Cardiovascular"], status: "planned" },
  { name: "GRACE Score", slug: "grace", specialties: ["Cardiovascular"], status: "planned" },
  {
    name: "San Francisco 5-Rule",
    slug: "san-francisco-5-rule",
    specialties: ["Cardiovascular"],
    status: "planned",
  },
  {
    name: "OESIL Score for Syncope",
    slug: "oesil",
    specialties: ["Cardiovascular"],
    status: "planned",
  },
  { name: "HAS-BLED Score", slug: "has-bled", specialties: ["Cardiovascular"], status: "planned" },
  { name: "EDACS", slug: "edacs", specialties: ["Cardiovascular"], status: "planned" },
  { name: "CRUSADE", slug: "crusade", specialties: ["Cardiovascular"], status: "planned" },
  { name: "Calculadora de QTc", slug: "qtc", specialties: ["Cardiovascular"], status: "planned" },
  { name: "Gasometria arterial", slug: "gasometria-arterial", specialties: ["Nefrologia"], status: "planned" },
  {
    name: "Clearance de Cr (Cockcroft-Gault)",
    slug: "cockcroft-gault",
    specialties: ["Nefrologia"],
    status: "planned",
  },
  { name: "CKD-EPI", slug: "ckd-epi", specialties: ["Nefrologia"], status: "planned" },
  {
    name: "Correção de Cálcio para Hipoalbuminemia",
    slug: "calcio-corrigido",
    specialties: ["Nefrologia"],
    status: "planned",
  },
  { name: "Stone Score", slug: "stone-score", specialties: ["Nefrologia"], status: "planned" },
];
