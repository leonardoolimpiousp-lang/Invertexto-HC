#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REVIEW_FILE = path.resolve("data/disease-guides/review/drafts.pointofcare.json");

const TITLE_PT = {
  "Altered Mental Status - Rapid Response": "Alteração do Estado Mental - Resposta Rápida",
  "Hypotension - Rapid Response": "Hipotensão - Resposta Rápida",
  "Respiratory Distress - Rapid Response": "Desconforto Respiratório - Resposta Rápida",
  "Preparing for Intubation": "Preparação para Intubação",
  "Acute Coronary Syndrome (ACS) and Myocardial Infarction (MI)": "Síndrome Coronariana Aguda (SCA) e Infarto Agudo do Miocárdio (IAM)",
  "Acute Decompensated Heart Failure (ADHF)": "Insuficiência Cardíaca Agudamente Descompensada",
  "Acute Limb Ischemia": "Isquemia Aguda de Membro",
  "Aortic Dissection": "Dissecção de Aorta",
  "Aortic Stenosis": "Estenose Aórtica",
  "Bradycardia": "Bradicardia",
  "Cardiogenic Shock": "Choque Cardiogênico",
  "Hypertensive Urgency and Emergency": "Urgência e Emergência Hipertensiva",
  "Pericarditis": "Pericardite",
  "Syncope and Loss of Consciousness": "Síncope e Perda de Consciência",
  "ARDS": "Síndrome do Desconforto Respiratório Agudo (SDRA)",
  "Asthma Exacerbation": "Exacerbação de Asma",
  "COPD Exacerbation": "Exacerbação de DPOC",
  "ICU Bundle": "Pacote de Cuidados em UTI",
  "Interstitial Lung Disease (ILD)": "Doença Pulmonar Intersticial",
  "Pneumothorax": "Pneumotórax",
  "Pulmonary Embolism and VTE": "Embolia Pulmonar e Tromboembolismo Venoso",
  "Pulmonary Hypertension": "Hipertensão Pulmonar",
  "Respiratory Failure and Intubation/Extubation": "Insuficiência Respiratória e Intubação/Extubação",
  "Acute Liver Failure": "Insuficiência Hepática Aguda",
  "Alcoholic Hepatitis": "Hepatite Alcoólica",
  "C Difficile Infection": "Infecção por Clostridioides difficile",
  "Cirrhosis and Decompensations": "Cirrose e Descompensações",
  "Constipation": "Constipação",
  "Diverticulitis": "Diverticulite",
  "GI Bleed": "Hemorragia Digestiva",
  "Inflammatory Bowel Disease (IBD) and Flares": "Doença Inflamatória Intestinal e Agudizações",
  "Nausea and Vomiting": "Náuseas e Vômitos",
  "Peptic Ulcer Disease (PUD) and H. Pylori": "Doença Ulcerosa Péptica e H. pylori",
  "Small Bowel Obstruction (SBO) and Ileus": "Obstrução de Intestino Delgado e Íleo",
  "Acute Kidney Injury (AKI)": "Lesão Renal Aguda",
  "ESRD and Missed Dialysis": "Doença Renal Crônica Terminal e Diálise Perdida",
  "Hypercalcemia": "Hipercalcemia",
  "Hypernatremia": "Hipernatremia",
  "Hyponatremia": "Hiponatremia",
  "Metabolic Acidosis": "Acidose Metabólica",
  "Nephrolithiasis": "Nefrolitíase",
  "Rhabdomyolysis": "Rabdomiólise",
  "Acute Leukemia": "Leucemia Aguda",
  "Anemia (Inpatient)": "Anemia em Paciente Internado",
  "Diffuse Lymphadenopathy": "Linfadenopatia Difusa",
  "Disseminated Intravascular Coagulopathy (DIC)": "Coagulação Intravascular Disseminada (CIVD)",
  "Eosinophilia": "Eosinofilia",
  "Heparin-Induced Thrombocytopenia (HIT)": "Trombocitopenia Induzida por Heparina",
  "Neutropenic Fever": "Neutropenia Febril",
  "New Pancreatic Mass": "Nova Massa Pancreática",
  "New Solitary Lung Nodule": "Novo Nódulo Pulmonar Solitário",
  "Oncology Admission Intake": "Admissão Oncológica",
  "Pancytopenia": "Pancitopenia",
  "Sickle Cell Disease and Vaso-Occlusive Crisis": "Doença Falciforme e Crise Vaso-Oclusiva",
  "Transfusion Reaction": "Reação Transfusional",
  "Tumor Lysis Syndrome (TLS)": "Síndrome de Lise Tumoral",
  "Cellulitis / Skin and Soft Tissue Infection (SSTI)": "Celulite e Infecção de Pele/Partes Moles",
  "Cholangitis": "Colangite",
  "Endocarditis and Bacteremia": "Endocardite e Bacteremia",
  "Fever of Unknown Origin (FUO)": "Febre de Origem Indeterminada",
  "HIV and AIDS": "HIV e AIDS",
  "Infectious Disease Social History Intake": "História Social em Infectologia",
  "Meningitis and Encephalitis": "Meningite e Encefalite",
  "PJP / Pneumocystis Pneumonia (PCP)": "Pneumonia por Pneumocystis jirovecii",
  "Tuberculosis": "Tuberculose",
  "UTI and Pyelonephritis": "Infecção Urinária e Pielonefrite",
  "Diabetic Ketoacidosis (DKA)": "Cetoacidose Diabética",
  "Hypoglycemia": "Hipoglicemia",
  "Inpatient Diabetes Management": "Manejo do Diabetes em Paciente Internado",
  "Acute Arthritis": "Artrite Aguda",
  "Rheumatology Review of Systems": "Revisão de Sistemas em Reumatologia",
  "Systemic Lupus Erythematosus (SLE)": "Lúpus Eritematoso Sistêmico",
  "Altered Mental Status": "Alteração do Estado Mental",
  "Delirium and Agitation": "Delirium e Agitação",
  "Headache and Migraine": "Cefaleia e Enxaqueca",
  "Seizure": "Crise Convulsiva",
  "Spinal Cord Compression": "Compressão Medular",
  "Stroke and TIA": "AVC e AIT",
};

const EXTRA_TAGS = {
  "Preparação para Intubação": ["intubação", "via aérea", "sequência rápida", "insuficiência respiratória"],
  "Síndrome Coronariana Aguda (SCA) e Infarto Agudo do Miocárdio (IAM)": ["dor torácica", "iam", "sca", "infarto", "supra de st"],
  "Insuficiência Cardíaca Agudamente Descompensada": ["insuficiência cardíaca", "congestão", "edema agudo de pulmão", "dispneia"],
  "Embolia Pulmonar e Tromboembolismo Venoso": ["tep", "tromboembolismo", "trombose venosa", "dispneia súbita"],
  "Celulite e Infecção de Pele/Partes Moles": ["celulite", "erisipela", "infecção de pele", "partes moles"],
  "Infecção Urinária e Pielonefrite": ["itu", "pielonefrite", "disúria", "infecção urinária"],
  "Cetoacidose Diabética": ["cetoacidose", "diabetes descompensado", "acidose metabólica", "hiperglicemia"],
  "AVC e AIT": ["avc", "ait", "déficit focal", "acidente vascular cerebral"],
};

function stripParentheses(value) {
  return value.replace(/\([^)]*\)/g, " ");
}

function inferTagsPt(disease) {
  const manual = EXTRA_TAGS[disease] ?? [];
  const fromTitle = stripParentheses(disease)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !["com", "por", "para", "dos", "das", "em"].includes(w));

  return Array.from(new Set([...manual, disease.toLowerCase(), ...fromTitle]))
    .slice(0, 8)
    .map((name, index) => ({ name, weight: index < 2 ? 10 : 6 }));
}

function portugueseSections(disease) {
  return [
    {
      title: "Lista Inicial",
      content: [
        `Confirmar que a HD principal é ${disease}.`,
        "Avaliar sinais de gravidade, instabilidade hemodinâmica e necessidade de UTI.",
        "Checar alergias, comorbidades, medicações em uso e contraindicações relevantes.",
        "Definir prioridades imediatas: suporte, exames iniciais, tratamento específico e monitorização.",
      ],
    },
    {
      title: "Avaliação Diagnóstica",
      content: [
        "Revisar história dirigida, exame físico e evolução temporal do quadro.",
        "Solicitar exames laboratoriais e de imagem conforme gravidade e contexto clínico.",
        "Pesquisar diagnósticos diferenciais perigosos e fatores precipitantes.",
        "Registrar critérios objetivos que sustentam a hipótese diagnóstica.",
      ],
    },
    {
      title: "Plano",
      content: [
        "Iniciar medidas terapêuticas de suporte e tratamento direcionado quando indicado.",
        "Definir critérios de internação, UTI, observação ou seguimento ambulatorial.",
        "Reavaliar resposta clínica e ajustar conduta conforme resultados e evolução.",
        "Documentar pendências, alertas e pontos que exigem discussão com preceptor/especialista.",
      ],
    },
  ];
}

function main() {
  const payload = JSON.parse(fs.readFileSync(REVIEW_FILE, "utf8"));
  payload.drafts = payload.drafts.map((draft) => {
    const disease = TITLE_PT[draft.disease] ?? draft.disease;
    return {
      ...draft,
      disease,
      hdTags: inferTagsPt(disease),
      sections: portugueseSections(disease),
      review: {
        status: "pending",
        notes: "Revisar contexto clínico, tags de HD e conteúdo antes de aprovar para o catálogo final.",
      },
      metadata: {
        ...draft.metadata,
        language: "pt-BR",
        translatedAt: new Date().toISOString(),
      },
    };
  });
  payload.total = payload.drafts.length;
  payload.generatedAt = new Date().toISOString();

  fs.writeFileSync(REVIEW_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Drafts convertidos para português: ${payload.total}`);
}

main();
