import type { ContextName } from "@/lib/calculators/types";

export type CalculatorsToolSeed = {
  context?: ContextName;
  hypotheses?: string[];
  note?: string;
};

export type ToolSelectionPayload = {
  calculators?: CalculatorsToolSeed;
  prescriptionGuides?: {
    contexts?: ContextName[];
    hypotheses?: string[];
  };
};
