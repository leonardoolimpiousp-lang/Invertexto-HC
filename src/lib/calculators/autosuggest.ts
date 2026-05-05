import { extractContextsFromNote, extractHypothesesFromNote } from "@/lib/calculators/keywords";
import { recommendCalculators } from "@/lib/calculators/recommendation";
import type {
  AutoSuggestInput,
  ContextName,
  RecommendationOutput,
} from "@/lib/calculators/types";

type AutoSuggestResult = {
  suggestions: RecommendationOutput[];
  extractedHypotheses: string[];
  extractedContexts: ContextName[];
};

function dedupeContexts(contexts: ContextName[]): ContextName[] {
  const seen = new Set<string>();
  const deduped: ContextName[] = [];

  for (const context of contexts) {
    const key = context.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(context);
  }

  return deduped;
}

export async function suggestCalculatorsFromNote(
  input: AutoSuggestInput,
): Promise<AutoSuggestResult> {
  const extractedHypotheses = extractHypothesesFromNote(input.note);
  const extractedContexts = extractContextsFromNote(input.note);

  const inputContexts = Array.isArray(input.context) ? input.context : [input.context];
  const mergedContexts = dedupeContexts([...inputContexts, ...extractedContexts]);

  const suggestions = await recommendCalculators({
    context: mergedContexts,
    hypotheses: extractedHypotheses,
    limit: input.limit,
  });

  return {
    suggestions,
    extractedHypotheses,
    extractedContexts,
  };
}
