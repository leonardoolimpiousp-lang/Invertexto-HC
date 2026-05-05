import type { CalculatorEngine } from "../types";

type PamInput = {
  systolic: number;
  diastolic: number;
};

export const pamEngine: CalculatorEngine<PamInput, number> = {
  name: "PAM",
  calculate: ({ systolic, diastolic }) => (systolic + 2 * diastolic) / 3,
  interpret: (result) => {
    if (result < 65) return "PAM baixa (< 65): perfusao possivelmente inadequada.";
    return "PAM adequada (>= 65).";
  },
};
