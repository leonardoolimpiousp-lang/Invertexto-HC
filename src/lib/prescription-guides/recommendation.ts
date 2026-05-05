import { normalizeText } from "@/lib/calculators/text";
import { localPrescriptionGuideCatalog } from "@/lib/prescription-guides/catalog";
import type {
  PrescriptionGuideItem,
  PrescriptionGuideRecommendationInput,
  PrescriptionGuideRecommendationOutput,
} from "@/lib/prescription-guides/types";

function matchesNormalized(a: string, b: string): boolean {
  const left = normalizeText(a);
  const right = normalizeText(b);
  return left === right || left.includes(right) || right.includes(left);
}

function scoreGuide(
  guide: PrescriptionGuideItem,
  normalizedContexts: string[],
  normalizedHypotheses: string[],
): PrescriptionGuideRecommendationOutput | null {
  let score = 0;
  let boostApplied = false;
  const matchedTags = new Set<string>();
  const matchedContexts = new Set<(typeof guide.contexts)[number]>();

  for (const context of guide.contexts) {
    const normalized = normalizeText(context);
    if (normalizedContexts.some((c) => matchesNormalized(c, normalized))) {
      matchedContexts.add(context);
    }
  }

  if (matchedContexts.size > 0) {
    score += 5;
  }

  for (const tag of guide.tags) {
    const normalizedTag = normalizeText(tag.name);
    for (const hd of normalizedHypotheses) {
      const exact = hd === normalizedTag;
      const partial = !exact && matchesNormalized(hd, normalizedTag);
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
    name: guide.name,
    score,
    matchedTags: Array.from(matchedTags),
    matchedContexts: Array.from(matchedContexts),
  };
}

export async function recommendPrescriptionGuides(
  input: PrescriptionGuideRecommendationInput,
): Promise<PrescriptionGuideRecommendationOutput[]> {
  const normalizedContexts = (Array.isArray(input.context) ? input.context : [input.context]).map((context) =>
    normalizeText(context),
  );
  const normalizedHypotheses = input.hypotheses.map((hypothesis) => normalizeText(hypothesis));

  const ranked = localPrescriptionGuideCatalog
    .map((guide) => scoreGuide(guide, normalizedContexts, normalizedHypotheses))
    .filter((item): item is PrescriptionGuideRecommendationOutput => item !== null)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, input.limit ?? 5);
}
