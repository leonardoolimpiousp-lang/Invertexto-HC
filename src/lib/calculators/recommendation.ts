import { localCalculatorCatalog } from "@/lib/calculators/catalog";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  type CalculatorCatalogItem,
  type CalculatorTag,
  type ContextName,
  type RecommendationInput,
  type RecommendationOutput,
} from "@/lib/calculators/types";
import { normalizeText } from "@/lib/calculators/text";

type CalculatorCatalogRpcRow = {
  name: string;
  slug: string;
  contexts: unknown;
  tags: unknown;
};

function isContextName(value: string): value is ContextName {
  return (
    value === "PS" ||
    value === "UTI" ||
    value === "Sala de Emergencia" ||
    value === "Enfermaria" ||
    value === "Ambulatorio"
  );
}

function toContextArray(value: unknown): ContextName[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .filter((item): item is ContextName => isContextName(item));
}

function toTagArray(value: unknown): CalculatorTag[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const parsed: CalculatorTag[] = [];

  for (const item of value) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const candidate = item as { name?: unknown; weight?: unknown };
    if (typeof candidate.name !== "string") {
      continue;
    }

    const weight = Number(candidate.weight);
    const normalizedWeight: 6 | 10 = weight >= 10 ? 10 : 6;

    parsed.push({
      name: candidate.name,
      weight: normalizedWeight,
    });
  }

  return parsed;
}

export async function fetchCatalogFromDatabase(): Promise<CalculatorCatalogItem[]> {
  const { data, error } = await supabaseAdmin.rpc("get_calculator_catalog");

  if (error || !Array.isArray(data)) {
    return [];
  }

  const rows = data as CalculatorCatalogRpcRow[];

  return rows
    .filter((row) => typeof row?.name === "string" && typeof row?.slug === "string")
    .map((row) => ({
      name: row.name,
      slug: row.slug,
      contexts: toContextArray(row.contexts),
      tags: toTagArray(row.tags),
    }));
}

function mergeContexts(a: ContextName[], b: ContextName[]): ContextName[] {
  const byNormalized = new Map<string, ContextName>();

  for (const context of [...a, ...b]) {
    const key = normalizeText(context);
    if (!byNormalized.has(key)) {
      byNormalized.set(key, context);
    }
  }

  return Array.from(byNormalized.values());
}

function mergeTags(a: CalculatorTag[], b: CalculatorTag[]): CalculatorTag[] {
  const byTag = new Map<string, CalculatorTag>();

  for (const tag of [...a, ...b]) {
    const normalizedTag = normalizeText(tag.name);
    const existing = byTag.get(normalizedTag);

    if (!existing || tag.weight > existing.weight) {
      byTag.set(normalizedTag, {
        name: normalizedTag,
        weight: tag.weight,
      });
    }
  }

  return Array.from(byTag.values());
}

export function mergeCatalogs(
  dbCatalog: CalculatorCatalogItem[],
  localCatalog: CalculatorCatalogItem[],
): CalculatorCatalogItem[] {
  const merged = new Map<string, CalculatorCatalogItem>();

  for (const item of [...localCatalog, ...dbCatalog]) {
    const slugKey = normalizeText(item.slug);
    const existing = merged.get(slugKey);

    if (!existing) {
      merged.set(slugKey, {
        name: item.name,
        slug: item.slug,
        contexts: [...item.contexts],
        tags: item.tags.map((tag) => ({
          name: normalizeText(tag.name),
          weight: tag.weight,
        })),
      });
      continue;
    }

    merged.set(slugKey, {
      name: item.name || existing.name,
      slug: existing.slug,
      contexts: mergeContexts(existing.contexts, item.contexts),
      tags: mergeTags(existing.tags, item.tags),
    });
  }

  return Array.from(merged.values());
}

export function matchesNormalized(a: string, b: string): boolean {
  const left = normalizeText(a);
  const right = normalizeText(b);
  return left === right || left.includes(right) || right.includes(left);
}

export async function recommendCalculators(
  input: RecommendationInput,
): Promise<RecommendationOutput[]> {
  const dbCatalog = await fetchCatalogFromDatabase();
  const catalog = mergeCatalogs(dbCatalog, localCalculatorCatalog);

  const normalizedContexts = (Array.isArray(input.context) ? input.context : [input.context]).map((context) =>
    normalizeText(context),
  );
  const normalizedHypotheses = input.hypotheses.map((hypothesis) => normalizeText(hypothesis));

  const recommendations: RecommendationOutput[] = [];

  for (const calculator of catalog) {
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
      for (const hypothesis of normalizedHypotheses) {
        const exact = hypothesis === tag.name;
        const partial = !exact && matchesNormalized(hypothesis, tag.name);

        if (!exact && !partial) {
          continue;
        }

        score += exact ? tag.weight : tag.weight / 2;
        matchedTags.add(tag.name);

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
