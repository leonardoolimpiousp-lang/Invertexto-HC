import type { CalculatorEngine } from "../types";

type WellsTepInput = {
  clinicalDvtSigns: boolean;
  pulmonaryEmbolismMostLikely: boolean;
  heartRateOver100: boolean;
  recentSurgeryOrImmobilization: boolean;
  previousDvtOrPe: boolean;
  hemoptysis: boolean;
  activeCancer: boolean;
};

export const wellsTepEngine: CalculatorEngine<WellsTepInput, number> = {
  name: "Wells_TEP",
  calculate: ({
    clinicalDvtSigns,
    pulmonaryEmbolismMostLikely,
    heartRateOver100,
    recentSurgeryOrImmobilization,
    previousDvtOrPe,
    hemoptysis,
    activeCancer,
  }) => {
    let score = 0;
    if (clinicalDvtSigns) score += 3;
    if (pulmonaryEmbolismMostLikely) score += 3;
    if (heartRateOver100) score += 1.5;
    if (recentSurgeryOrImmobilization) score += 1.5;
    if (previousDvtOrPe) score += 1.5;
    if (hemoptysis) score += 1;
    if (activeCancer) score += 1;
    return score;
  },
  interpret: (result) =>
    result > 4
      ? "TEP provavel (Wells > 4)."
      : "TEP improvavel (Wells <= 4).",
};
