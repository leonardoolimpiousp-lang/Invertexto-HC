import type { ContextName } from "@/lib/calculators/types";
import { dedupeNormalized } from "@/lib/calculators/text";

export type SuggestionRule = {
  regex: RegExp;
  hypotheses: string[];
  contexts: ContextName[];
};

export const suggestionRules: SuggestionRule[] = [
  {
    regex: /\b(sepse|sepsis|choque\s+septico)\b/i,
    hypotheses: ["sepse", "choque septico"],
    contexts: ["PS", "UTI", "Sala de Emergencia"],
  },
  {
    regex: /\b(hipotensao|pa\s*baixa|pressao\s*baixa|choque)\b/i,
    hypotheses: ["hipotensao", "choque"],
    contexts: ["PS", "UTI"],
  },
  {
    regex: /\b(disfuncao\s+organica|falencia\s+organica|insuficiencia\s+organica)\b/i,
    hypotheses: ["disfuncao organica"],
    contexts: ["UTI", "Sala de Emergencia"],
  },
  {
    regex: /\b(tce|traumatismo\s+cranioencefalico|rebaixamento\s+de\s+consciencia)\b/i,
    hypotheses: ["tce", "rebaixamento consciencia"],
    contexts: ["PS", "UTI"],
  },
  {
    regex: /\b(sedacao|delirium|agitado|agitacao)\b/i,
    hypotheses: ["sedacao", "delirium"],
    contexts: ["UTI"],
  },
  {
    regex: /\b(tep|embolia\s+pulmonar|dispneia|dor\s+toracica)\b/i,
    hypotheses: ["tep", "dispneia", "dor toracica"],
    contexts: ["PS", "Ambulatorio", "Sala de Emergencia"],
  },
  {
    regex: /\b(tvp|trombose\s+venosa\s+profunda|edema\s+unilateral)\b/i,
    hypotheses: ["tvp", "edema unilateral"],
    contexts: ["PS", "Ambulatorio"],
  },
  {
    regex: /\b(obesidade|sobrepeso|nutricional|imc)\b/i,
    hypotheses: ["obesidade", "avaliacao nutricional"],
    contexts: ["Ambulatorio", "Enfermaria"],
  },
  {
    regex: /\b(deterioracao\s+clinica|instabilidade\s+hemodinamica|instabilidade\s+clinica)\b/i,
    hypotheses: ["deterioracao clinica", "instabilidade"],
    contexts: ["PS", "Enfermaria"],
  },
  {
    regex: /\b(glasgow|avc|intoxicacao)\b/i,
    hypotheses: ["rebaixamento consciencia", "avc", "intoxicacao"],
    contexts: ["PS", "UTI", "Sala de Emergencia"],
  },
];

function dedupeContexts(contexts: ContextName[]): ContextName[] {
  const seen = new Set<string>();
  const result: ContextName[] = [];

  for (const context of contexts) {
    const key = context.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(context);
  }

  return result;
}

export function extractHypothesesFromNote(note: string): string[] {
  const hypotheses: string[] = [];

  for (const rule of suggestionRules) {
    if (rule.regex.test(note)) {
      hypotheses.push(...rule.hypotheses);
    }
  }

  return dedupeNormalized(hypotheses);
}

export function extractContextsFromNote(note: string): ContextName[] {
  const contexts: ContextName[] = [];

  for (const rule of suggestionRules) {
    if (rule.regex.test(note)) {
      contexts.push(...rule.contexts);
    }
  }

  return dedupeContexts(contexts);
}
