import { localCalculatorCatalog } from "@/lib/calculators/catalog";
import type {
  ContextName,
  RecommendationInput,
  RecommendationOutput,
} from "@/lib/calculators/types";
import { normalizeText } from "@/lib/calculators/text";

function matchesNormalized(a: string, b: string): boolean {
  const left = normalizeText(a);
  const right = normalizeText(b);
  return left === right || left.includes(right) || right.includes(left);
}

export function rankLocalCalculators(input: RecommendationInput): RecommendationOutput[] {
  const normalizedContexts = (Array.isArray(input.context) ? input.context : [input.context]).map((context) =>
    normalizeText(context),
  );
  const normalizedHypotheses = input.hypotheses.map((hypothesis) => normalizeText(hypothesis));

  const recommendations: RecommendationOutput[] = [];

  for (const calculator of localCalculatorCatalog) {
    let score = 0;
    let boostApplied = false;
    const matchedTags = new Set<string>();
    const matchedContexts = new Set<ContextName>();

    for (const context of calculator.contexts) {
      const normalizedContext = normalizeText(context);
      if (normalizedContexts.some((inputContext) => matchesNormalized(inputContext, normalizedContext))) {
        matchedContexts.add(context);
      }
    }

    if (matchedContexts.size > 0) {
      score += 5;
    }

    for (const tag of calculator.tags) {
      const normalizedTag = normalizeText(tag.name);

      for (const hypothesis of normalizedHypotheses) {
        const exact = hypothesis === normalizedTag;
        const partial = !exact && matchesNormalized(hypothesis, normalizedTag);

        if (!exact && !partial) {
          continue;
        }

        score += exact ? tag.weight : tag.weight / 2;
        matchedTags.add(normalizedTag);

        if (!boostApplied && tag.weight >= 10) {
          score += 20;
          boostApplied = true;
        }
      }
    }

    if (score > 0) {
      recommendations.push({
        name: calculator.name,
        score,
        matchedTags: Array.from(matchedTags),
        matchedContexts: Array.from(matchedContexts),
      });
    }
  }

  const limit = input.limit ?? 5;

  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
}
