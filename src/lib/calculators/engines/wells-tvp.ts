import type { CalculatorEngine } from "../types";

type WellsTvpInput = {
  activeCancer: boolean;
  paralysisOrImmobilization: boolean;
  bedriddenOrRecentSurgery: boolean;
  localizedTenderness: boolean;
  entireLegSwollen: boolean;
  calfSwellingOver3cm: boolean;
  pittingEdema: boolean;
  collateralSuperficialVeins: boolean;
  previousDvt: boolean;
  alternativeDiagnosisAsLikely: boolean;
};

export const wellsTvpEngine: CalculatorEngine<WellsTvpInput, number> = {
  name: "Wells_TVP",
  calculate: ({
    activeCancer,
    paralysisOrImmobilization,
    bedriddenOrRecentSurgery,
    localizedTenderness,
    entireLegSwollen,
    calfSwellingOver3cm,
    pittingEdema,
    collateralSuperficialVeins,
    previousDvt,
    alternativeDiagnosisAsLikely,
  }) => {
    let score = 0;
    if (activeCancer) score += 1;
    if (paralysisOrImmobilization) score += 1;
    if (bedriddenOrRecentSurgery) score += 1;
    if (localizedTenderness) score += 1;
    if (entireLegSwollen) score += 1;
    if (calfSwellingOver3cm) score += 1;
    if (pittingEdema) score += 1;
    if (collateralSuperficialVeins) score += 1;
    if (previousDvt) score += 1;
    if (alternativeDiagnosisAsLikely) score -= 2;
    return score;
  },
  interpret: (result) => {
    if (result >= 3) return "Alta probabilidade de TVP.";
    if (result >= 1) return "Probabilidade moderada de TVP.";
    return "Baixa probabilidade de TVP.";
  },
};
