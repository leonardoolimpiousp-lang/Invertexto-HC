import type { CalculatorEngine } from "../types";

type News2Input = {
  respirationRate: number;
  oxygenSaturation: number;
  supplementalOxygen: boolean;
  temperatureC: number;
  systolicBloodPressure: number;
  heartRate: number;
  consciousnessAltered: boolean;
};

export const news2Engine: CalculatorEngine<News2Input, number> = {
  name: "NEWS2",
  calculate: ({
    respirationRate,
    oxygenSaturation,
    supplementalOxygen,
    temperatureC,
    systolicBloodPressure,
    heartRate,
    consciousnessAltered,
  }) => {
    const rrScore = respirationRate >= 25 ? 3 : respirationRate >= 21 ? 2 : respirationRate <= 8 ? 3 : 0;
    const satScore = oxygenSaturation <= 91 ? 3 : oxygenSaturation <= 93 ? 2 : oxygenSaturation <= 95 ? 1 : 0;
    const o2Score = supplementalOxygen ? 2 : 0;
    const tempScore = temperatureC >= 39.1 || temperatureC <= 35 ? 3 : temperatureC >= 38.1 || temperatureC <= 36 ? 1 : 0;
    const sbpScore = systolicBloodPressure <= 90 ? 3 : systolicBloodPressure <= 100 ? 2 : systolicBloodPressure <= 110 ? 1 : 0;
    const hrScore = heartRate >= 131 || heartRate <= 40 ? 3 : heartRate >= 111 || heartRate <= 50 ? 2 : heartRate >= 91 ? 1 : 0;
    const cnsScore = consciousnessAltered ? 3 : 0;
    return rrScore + satScore + o2Score + tempScore + sbpScore + hrScore + cnsScore;
  },
  interpret: (result) => {
    if (result >= 7) return "NEWS2 alto risco: acao urgente.";
    if (result >= 5) return "NEWS2 risco moderado: avaliacao medica rapida.";
    return "NEWS2 baixo risco.";
  },
};
