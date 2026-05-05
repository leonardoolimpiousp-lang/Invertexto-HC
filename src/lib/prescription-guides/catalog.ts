import type { PrescriptionGuideItem } from "@/lib/prescription-guides/types";

export const localPrescriptionGuideCatalog: readonly PrescriptionGuideItem[] = [
  {
    id: "sepse_pacote_inicial",
    name: "Sepse - Pacote Inicial",
    contexts: ["PS", "UTI", "Sala de Emergencia", "Enfermaria"],
    tags: [
      { name: "sepse", weight: 10 },
      { name: "choque septico", weight: 10 },
      { name: "foco infeccioso", weight: 6 },
    ],
    prescription: `Prescrição inicial:
- Coletar lactato e culturas antes do ATB (se não atrasar antibiótico)
- Iniciar antibiótico empírico em até 1h
- Cristaloide 30 mL/kg se hipotensão ou lactato >= 4
- Reavaliar PAM, diurese, perfusão`,
  },
  {
    id: "cetoacidose_diabetica",
    name: "Cetoacidose Diabética - Adulto",
    contexts: ["PS", "UTI", "Sala de Emergencia"],
    tags: [
      { name: "cetoacidose", weight: 10 },
      { name: "hiperglicemia", weight: 6 },
      { name: "diabetes descompensada", weight: 6 },
    ],
    prescription: `Prescrição inicial:
- SF 0,9% 15-20 mL/kg na 1ª hora
- Insulina regular EV contínua 0,1 U/kg/h (após reposição inicial)
- Potássio conforme K sérico e diurese
- Gasometria, glicemia capilar horária, eletrólitos seriados`,
  },
  {
    id: "pneumonia_comunitaria_enfermaria",
    name: "Pneumonia Comunitária - Enfermaria",
    contexts: ["Enfermaria", "Ambulatorio", "PS"],
    tags: [
      { name: "pneumonia", weight: 10 },
      { name: "infeccao respiratoria", weight: 6 },
    ],
    prescription: `Prescrição sugerida:
- Ceftriaxona 1-2 g EV 1x/dia + Azitromicina 500 mg EV/VO 1x/dia
- Antitérmico se febre
- Oxigenoterapia se SatO2 < 92%
- Reavaliar em 48-72h`,
  },
  {
    id: "insuficiencia_cardiaca_aguda",
    name: "Insuficiência Cardíaca Aguda",
    contexts: ["PS", "UTI", "Enfermaria", "Sala de Emergencia"],
    tags: [
      { name: "edema agudo de pulmao", weight: 10 },
      { name: "insuficiencia cardiaca", weight: 10 },
      { name: "congestao", weight: 6 },
    ],
    prescription: `Prescrição sugerida:
- Furosemida EV (dose inicial conforme uso prévio)
- Vasodilatador (se PAS permitir)
- Oxigenoterapia / VNI conforme desconforto respiratório
- Controle rigoroso de balanço hídrico`,
  },
] as const;
