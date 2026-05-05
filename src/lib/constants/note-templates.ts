import type { ContextType } from "@/types/database";

const PS_AMBULATORIO_TEMPLATE = `# ID:

# QD:

# HMA:

# AP:
Comorbidades:
MUC:
Cirurgias prévias:
Alergias:
HV:

# EF:
Estado geral:
Sinais vitais: PA, FC, FR, SATO2, T

ACV:
AR:
ABD:
Pele/Extremidades:

# Exames complementares:

# HD:

# CD:

# REAV:
`;

const ENF_TEMPLATE = `# ID

# LP
1.
2.
3.

# EVOL
Evolução clínica:

# EF
Estado geral:
Sinais vitais: PA, FC, FR, SATO2, T

ACV:
AR:
Abdome:
Extremidades:

# EXM
Exames relevantes:

# CD
Condutas por problema:

1.
2.
3.

# REAV
Reavaliação:

# INTERC
Intercorrências:`;

const UTI_TEMPLATE = `# ID:

Data de internação:
Motivo da internação:
Motivo da UTI:
Intercorrencias:

# AP
Comorbidades:
MUC:
Antecedentes oncológicos:
Cirurgias prévias:
Alergias:
HV:

# Lista de problemas e pendências:
1.
2.
3.

# NEURO
Nível de consciência:
RASS:
Delirium:
Pupilas:
Déficit neurológico:

Analgesia/Sedação:

# RESP
Via aérea:
Metas ventilatorias:

FR:
SatO2:
Ausculta:
Adjuvantes:
Prevenção de PAV:

# CARDIO
FC:
PAM:
Ritmo:
Ausculta:
Sinais de congestão:
Sinais de hipoperfusão:

DVA/inotrópicos/corticoide:
Metas hemodinâmicas:
Outros:

# RENAL
Debito urinario:
Via:
Balanço hídrico:
Diuretico?
HD?
Labs:
Reposições:

# TGI
Dieta:
Aceitação alimentar/Meta progressão:

Abdome:
Ultima evacuação:
Drenos:
Dextros:
Insulinoterapia:
Labs:

# HEMATO
T.Max (últimas 24h):
Labs:

Antimicrobianos:
Culturas:
Medicamentos:

# DISP
Invasões:

# PROF
TEV:
Úlcera de estresse:
Outras:

# EXAMES

# CD por METAS:`;

const CONTEXT_NOTE_TEMPLATES: Record<ContextType, string> = {
  ps: PS_AMBULATORIO_TEMPLATE,
  ambulatorial: PS_AMBULATORIO_TEMPLATE,
  sala_de_emergencia: PS_AMBULATORIO_TEMPLATE,
  cirurgia: PS_AMBULATORIO_TEMPLATE,
  enfermaria: ENF_TEMPLATE,
  uti: UTI_TEMPLATE,
};

export function getNoteTemplateByContext(context: ContextType): string {
  return CONTEXT_NOTE_TEMPLATES[context];
}
