import type { ContextName } from "@/lib/calculators/types";

export type DiseaseGuideTag = {
  name: string;
  weight: 6 | 10;
};

export type DiseaseGuideSection = {
  title: string;
  content: string[];
};

export type DiseaseGuideItem = {
  id: string;
  disease: string;
  contexts: ContextName[];
  hdTags: DiseaseGuideTag[];
  sections: DiseaseGuideSection[];
  source?: {
    name: string;
    url: string;
    updatedAt?: string;
  };
};

export type DiseaseGuideRecommendationInput = {
  context: ContextName | ContextName[];
  hypotheses: string[];
  limit?: number;
};

export type DiseaseGuideRecommendationOutput = {
  id: string;
  disease: string;
  score: number;
  matchedTags: string[];
  matchedContexts: ContextName[];
};
