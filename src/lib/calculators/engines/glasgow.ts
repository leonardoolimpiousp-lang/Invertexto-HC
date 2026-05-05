import type { CalculatorEngine } from "../types";

type GlasgowInput = {
  eye: number;
  verbal: number;
  motor: number;
};

export const glasgowEngine: CalculatorEngine<GlasgowInput, number> = {
  name: "Glasgow",
  calculate: ({ eye, verbal, motor }) => eye + verbal + motor,
  interpret: (result) => {
    if (result <= 8) return "TCE grave (ECG <= 8).";
    if (result <= 12) return "TCE moderado (ECG 9-12).";
    return "TCE leve (ECG 13-15).";
  },
};
