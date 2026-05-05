import { normalizeText } from "@/lib/calculators/text";
import { localDiseaseGuidesCatalog } from "@/lib/disease-guides/catalog";
import type {
  DiseaseGuideItem,
  DiseaseGuideRecommendationInput,
  DiseaseGuideRecommendationOutput,
} from "@/lib/disease-guides/types";

function matchesNormalized(a: string, b: string): boolean {
  const left = normalizeText(a);
  const right = normalizeText(b);
  return left === right || left.includes(right) || right.includes(left);
}

function rankGuide(
  guide: DiseaseGuideItem,
  normalizedContexts: string[],
  normalizedHypotheses: string[],
): DiseaseGuideRecommendationOutput | null {
  let score = 0;
  let boostApplied = false;
  const matchedTags = new Set<string>();
  const matchedContexts = new Set<(typeof guide.contexts)[number]>();

  for (const context of guide.contexts) {
    const normalizedContext = normalizeText(context);
    if (normalizedContexts.some((inputContext) => matchesNormalized(inputContext, normalizedContext))) {
      matchedContexts.add(context);
    }
  }

  if (matchedContexts.size > 0) {
    score += 5;
  }

  for (const tag of guide.hdTags) {
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

  if (score === 0) {
    return null;
  }

  return {
    id: guide.id,
    disease: guide.disease,
    score,
    matchedTags: Array.from(matchedTags),
    matchedContexts: Array.from(matchedContexts),
  };
}

export function recommendDiseaseGuides(
  input: DiseaseGuideRecommendationInput,
): DiseaseGuideRecommendationOutput[] {
  const normalizedContexts = (Array.isArray(input.context) ? input.context : [input.context]).map((context) =>
    normalizeText(context),
  );
  const normalizedHypotheses = input.hypotheses.map((hypothesis) => normalizeText(hypothesis));

  const ranked = localDiseaseGuidesCatalog
    .map((guide) => rankGuide(guide, normalizedContexts, normalizedHypotheses))
    .filter((item): item is DiseaseGuideRecommendationOutput => item !== null)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, input.limit ?? 5);
}
