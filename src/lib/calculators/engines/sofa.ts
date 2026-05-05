import type { CalculatorEngine } from "../types";

type SofaInput = {
  respiratory: number;
  coagulation: number;
  liver: number;
  cardiovascular: number;
  cns: number;
  renal: number;
};

export const sofaEngine: CalculatorEngine<SofaInput, number> = {
  name: "SOFA",
  calculate: ({ respiratory, coagulation, liver, cardiovascular, cns, renal }) =>
    respiratory + coagulation + liver + cardiovascular + cns + renal,
  interpret: (result) => {
    if (result >= 12) return "SOFA muito elevado: disfuncao organica grave.";
    if (result >= 8) return "SOFA elevado: monitorizacao intensiva recomendada.";
    if (result >= 2) return "SOFA alterado: investigar disfuncao organica.";
    return "SOFA baixo.";
  },
};
