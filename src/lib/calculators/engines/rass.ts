import type { CalculatorEngine } from "../types";

type RassInput = {
  score: number;
};

export const rassEngine: CalculatorEngine<RassInput, number> = {
  name: "RASS",
  calculate: ({ score }) => score,
  interpret: (result) => {
    if (result <= -4) return "Sedacao profunda.";
    if (result <= -1) return "Sedacao leve a moderada.";
    if (result === 0) return "Alerta e calmo.";
    return "Agitacao presente.";
  },
};
