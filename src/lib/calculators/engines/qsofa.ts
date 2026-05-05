import type { CalculatorEngine } from "../types";

type QsofaInput = {
  respiratoryRate: number;
  systolicBloodPressure: number;
  glasgow: number;
};

export const qsofaEngine: CalculatorEngine<QsofaInput, number> = {
  name: "qSOFA",
  calculate: ({ respiratoryRate, systolicBloodPressure, glasgow }) => {
    const rr = respiratoryRate >= 22 ? 1 : 0;
    const sbp = systolicBloodPressure <= 100 ? 1 : 0;
    const gcs = glasgow < 15 ? 1 : 0;
    return rr + sbp + gcs;
  },
  interpret: (result) =>
    result >= 2
      ? "qSOFA alto risco (>= 2): maior risco de desfecho desfavoravel."
      : "qSOFA baixo risco (< 2).",
};
