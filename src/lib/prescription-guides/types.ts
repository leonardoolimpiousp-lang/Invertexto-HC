import type { ContextName } from "@/lib/calculators/types";

export type PrescriptionGuideTag = {
  name: string;
  weight: 6 | 10;
};

export type PrescriptionGuideItem = {
  id: string;
  name: string;
  contexts: ContextName[];
  tags: PrescriptionGuideTag[];
  prescription: string;
};

export type PrescriptionGuideRecommendationInput = {
  context: ContextName | ContextName[];
  hypotheses: string[];
  limit?: number;
};

export type PrescriptionGuideRecommendationOutput = {
  id: string;
  name: string;
  score: number;
  matchedTags: string[];
  matchedContexts: ContextName[];
};
