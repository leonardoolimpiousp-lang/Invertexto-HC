export type ContextName =
  | "PS"
  | "UTI"
  | "Sala de Emergencia"
  | "Enfermaria"
  | "Ambulatorio";

export type CalculatorTag = {
  name: string;
  weight: 6 | 10;
};

export type CalculatorCatalogItem = {
  name: string;
  slug: string;
  contexts: ContextName[];
  tags: CalculatorTag[];
};

export type RecommendationInput = {
  context: ContextName | ContextName[];
  hypotheses: string[];
  limit?: number;
};

export type RecommendationOutput = {
  name: string;
  score: number;
  matchedTags: string[];
  matchedContexts: ContextName[];
};

export type AutoSuggestInput = {
  context: ContextName | ContextName[];
  note: string;
  limit?: number;
};

export type CalculatorEngine<TInput, TResult> = {
  name: string;
  calculate: (input: TInput) => TResult;
  interpret: (result: TResult, input: TInput) => string;
};
