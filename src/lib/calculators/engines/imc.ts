import type { CalculatorEngine } from "../types";

type ImcInput = {
  weightKg: number;
  heightM: number;
};

export const imcEngine: CalculatorEngine<ImcInput, number> = {
  name: "IMC",
  calculate: ({ weightKg, heightM }) => weightKg / (heightM * heightM),
  interpret: (result) => {
    if (result < 18.5) return "Baixo peso.";
    if (result < 25) return "Eutrofia.";
    if (result < 30) return "Sobrepeso.";
    if (result < 35) return "Obesidade grau I.";
    if (result < 40) return "Obesidade grau II.";
    return "Obesidade grau III.";
  },
};
