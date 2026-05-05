export interface Cid10RecommendationInput {
  hypotheses: string[];
  limit?: number;
}

export interface Cid10RecommendationOutput {
  code: string;
  description: string;
  score: number;
  matchedTerms: string[];
}

export interface Cid10SearchInput {
  query?: string;
  limit?: number;
}

export interface Cid10Entry {
  code: string;
  description: string;
}
