/**
 * regex.ts
 * Padrões regex para extração de texto farmacêutico em português.
 * Mantidos centralizados aqui para facilitar ajuste fino sem tocar na lógica.
 */

// ---------------------------------------------------------------------------
// Doses e concentrações
// ---------------------------------------------------------------------------

/** Captura valores numéricos com unidade farmacêutica.
 * Ex: "500 mg", "50mg", "2,5 mL", "10.000 UI", "1 g"
 * Grupo 1 = número | Grupo 2 = unidade
 */
export const DOSE_VALUE = /(\d+(?:[.,]\d+)?(?:\.\d+)?)\s*(mg|g|mcg|µg|μg|mL|ml|L|UI|U|%)/gi

/** Concentrações compostas (numerador/denominador).
 * Ex: "250 mg/5 mL", "50 mg/mL", "10 mg/kg"
 */
export const CONCENTRATION_RATIO = /(\d+(?:[.,]\d+)?)\s*(mg|g|mcg|mL|ml|L|UI|U)\s*\/\s*(\d+(?:[.,]\d+)?)?\s*(mg|g|mcg|mL|ml|L|UI|U|kg|dose|dia)/gi

/** Dose pediátrica por kg.
 * Ex: "50 mg/kg/dia", "40 mg/kg/dose", "10 mcg/kg/dose"
 */
export const DOSE_PER_KG = /(\d+(?:[.,]\d+)?)\s*(mg|g|mcg|UI)\s*\/\s*kg\s*\/?\s*(dia|dose)/gi

/** Dose máxima mencionada.
 * Ex: "máximo 2400 mg/dia", "não ultrapassar 4 g/dia", "dose máx: 60 mg"
 */
export const MAX_DOSE = /(?:m[aá]ximo?|dose\s+m[aá]x(?:ima)?|n[ãa]o\s+ultrapas(?:sar)?)[:\s]+(\d+(?:[.,]\d+)?)\s*(mg|g|mcg|mL|UI)(?:\s*\/\s*(dia|dose))?/gi

/** Range de dose.
 * Ex: "400-600 mg", "25 a 50 mg", "25–50 mg"
 */
export const DOSE_RANGE = /(\d+(?:[.,]\d+)?)\s*(?:[-–—]|a\s+)(\d+(?:[.,]\d+)?)\s*(mg|g|mcg|mL|UI)/gi

// ---------------------------------------------------------------------------
// Apresentações farmacêuticas
// ---------------------------------------------------------------------------

/** Forma farmacêutica. */
export const DOSAGE_FORM = /\b(comprimidos?|c[aá]psulas?|c(?:p|pr|aps)\.?|suspens[ãa]o\s+oral|solu[çc][ãa]o\s+oral|xarope|gotas?|ampolas?|fr(?:asco)?[- ]ampolas?|seringas?\s+pr[eé][- ]?preenchidas?|pomadas?|cremes?|g[eé]is?|lo[çc][õo]es?|spray|aeross[oó]l|inal(?:ador)?|col[íi]rios?|supositórios?|adesivos?\s+transd[eé]rmicos?|p[oó]\s+para\s+solu[çc][ãa]o)\b/gi

/** Via de administração. */
export const ROUTE = /\b(v(?:ia\s+)?o(?:ral)?|v\.?o\.?|oral(?:mente)?|endov(?:enoso)?|intravenoso?|i\.?v\.?|intramus(?:cular)?|i\.?m\.?|subcut(?:[âa]neo)?|s\.?c\.?|t[oó]pico?|inala(?:t[oó]rio?)?|subling(?:ual)?|retal|vaginal|nas(?:al|almente)?|of(?:t[aá]lmico?|[aá]lmico?)|[oó]tico?|transd[eé]rmico?)\b/gi

// ---------------------------------------------------------------------------
// Posologia — frequência e duração
// ---------------------------------------------------------------------------

/** Intervalos de administração. */
export const INTERVAL = /\b(?:(\d+)\s*\/\s*(\d+)\s*h(?:oras?)?|de\s+(\d+)\s+em\s+\3\s+horas?|(\d+)\s+em\s*\d+\s*h(?:oras?)?|(?:1|uma)\s*(?:vez|x)\s*(?:ao|por)\s*dia|(?:2|duas)\s*(?:vezes?|x)\s*(?:ao|por)\s*dia|(?:3|tr[eê]s)\s*(?:vezes?|x)\s*(?:ao|por)\s*dia|(?:4|quatro)\s*(?:vezes?|x)\s*(?:ao|por)\s*dia|(?:a\s+cada\s+)?(\d+)\s*h(?:oras?)?|dose\s+[uú]nica|SOS|se\s+necess[áa]rio)\b/gi

/** Duração do tratamento. */
export const DURATION = /(?:por|durante|por\s+(?:um\s+per[íi]odo\s+de)?)?\s*(\d+)(?:\s*(?:a|-)\s*(\d+))?\s*(dias?|semanas?|meses?|anos?)|(?:uso\s+cont[íi]nuo|tratamento\s+longo\s+prazo|indefinidamente)/gi

// ---------------------------------------------------------------------------
// Nome do medicamento
// ---------------------------------------------------------------------------

export const DRUG_NAME_CANDIDATE = /^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+)*)/m

export const BRAND_NAME = /(?:nome(?:s)?\s+comerci(?:al|ais)[:\s]+|nomes?[:\s]+)([^\n\r.;]+)|^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+(?:\s+[A-Z][a-z]+)*)\s*\(([^)]+)\)/gm

// ---------------------------------------------------------------------------
// Segurança
// ---------------------------------------------------------------------------

export const SIDE_EFFECT_MARKER = /(?:e(?:feitos?)?[\s._-]*(?:adversos?|colaterais?)|rea[çc][õo]es?\s+adversas?|EA|ADR)\s*[:=\-–]/gi

export const CONTRAINDICATION_MARKER = /(?:contra(?:indica[çc][õo]es?|indicado\s+(?:em|para|a))|CI)\s*[:=\-–]/gi

// ---------------------------------------------------------------------------
// Populações especiais
// ---------------------------------------------------------------------------

export const PREGNANCY = /\b(?:grávidas?|gestantes?|gesta[çc][ãa]o|gravidez|pr[eé]-natal|categoria\s+[A-DX](?:\s+(?:FDA|ANVISA))?)\b/gi

export const LACTATION = /\b(?:lactantes?|lacta[çc][ãa]o|amamentação|amamentando|aleitamento\s+materno|leite\s+materno)\b/gi

export const RENAL = /\b(?:insufici[eê]ncia\s+renal|IR|IRC|IRA|DRC|ClCr|creatinina|di[aá]lise|nefrop(?:ata|atia|ático)|TFG|hemodiálise)\b/gi

export const HEPATIC = /\b(?:insufici[eê]ncia\s+hep[aá]tica|IH|hepatop(?:ata|atia|ático)|cirrose|Child\s*[-–]?\s*Pugh|hepatotóxico)\b/gi

export const ELDERLY = /\b(?:idosos?|geri[aá]trico?|> ?65\s*anos?|acima\s+de\s+65|pacientes?\s+idosos?)\b/gi

export const PEDIATRIC = /\b(?:pedi[aá]trico?|crianças?|lactentes?|neonatos?|rec[eé]m\s*[-–]?\s*nascidos?|< ?12\s*anos?|< ?18\s*anos?)\b/gi

// ---------------------------------------------------------------------------
// Classe terapêutica
// ---------------------------------------------------------------------------

export const DRUG_CLASS_HINT = /\b(IECA|BRA|bloqueador(?:es)?\s+(?:do\s+)?(?:canal(?:es)?\s+de\s+c[aá]lcio|beta|AT1)|betabloqueador(?:es)?|AINE|anti[- ]?inflamat[oó]rio(?:s)?\s*n[ãa]o\s*esteroid(?:al|ais)|estatina|diur[eé]tico|antibi[oó]tico|antifúngico|antiviral|anticoagulante|antiagreg(?:ante)?|antidiab[eé]tico|imunossupressor|corticoide|ansiol[íi]tico|antidepressivo|antipsic[oó]tico|opioid(?:e|es)?|ISRS|IRSN|IMAO)\b/gi

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

export const NORMALIZE_WHITESPACE = /\s{2,}/g

export const LIST_SEPARATOR = /[;,]\s*/g

export const AND_SEPARATOR = /\s+e\s+/gi

export const SECTION_HEADER = /^(?:posologia|doses?|indica[çc][õo]es?|contra(?:indica[çc][õo]es?)?|efeitos?\s+(?:adversos?|colaterais?)|rea[çc][õo]es?\s+adversas?|EA|CI|apresenta[çc][õo]es?|nomes?\s+comerci(?:al|ais)|via\s+(?:de\s+)?administra[çc][ãa]o|interações?\s+(?:medicamentosas?)?|precau[çc][õo]es?|observa[çc][õo]es?)\s*[:=\-–]/gim
