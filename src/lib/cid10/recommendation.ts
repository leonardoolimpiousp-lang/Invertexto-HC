import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeText, tokenizeText } from "@/lib/calculators/text";
import type {
  Cid10Entry,
  Cid10RecommendationInput,
  Cid10RecommendationOutput,
} from "@/lib/cid10/types";
import { getLocalCidCatalog, mergeCidCatalogs } from "@/lib/cid10/catalog";

async function fetchCidCatalogFromDatabase(): Promise<Cid10Entry[]> {
  const { data, error } = await supabaseAdmin
    .from("cid10")
    .select("code, description")
    .limit(3000);

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data
    .filter((row): row is { code: string; description: string } =>
      typeof row?.code === "string" && typeof row?.description === "string",
    )
    .map((row) => ({
      code: row.code,
      description: row.description,
    }));
}

function scoreCid(
  cid: Cid10Entry,
  hypotheses: string[],
): Cid10RecommendationOutput | null {
  const code = normalizeText(cid.code);
  const description = normalizeText(cid.description);

  let score = 0;
  const matchedTerms = new Set<string>();

  for (const hypothesis of hypotheses) {
    const normalizedHd = normalizeText(hypothesis);
    if (!normalizedHd) continue;

    if (description.includes(normalizedHd)) {
      score += 18;
      matchedTerms.add(normalizedHd);
    }

    const terms = tokenizeText(normalizedHd).filter((token) => token.length >= 4);

    for (const term of terms) {
      const exactTerm = description.split(/[^a-z0-9]+/i).includes(term);
      const partialTerm = !exactTerm && description.includes(term);

      if (exactTerm) {
        score += 8;
        matchedTerms.add(term);
      } else if (partialTerm) {
        score += 4;
        matchedTerms.add(term);
      }
    }

    if (code === normalizedHd || code.includes(normalizedHd)) {
      score += 12;
      matchedTerms.add(normalizedHd);
    }
  }

  if (score <= 0) return null;

  return {
    code: cid.code,
    description: cid.description,
    score,
    matchedTerms: Array.from(matchedTerms),
  };
}

export async function recommendCid10(
  input: Cid10RecommendationInput,
): Promise<Cid10RecommendationOutput[]> {
  const normalizedHypotheses = input.hypotheses
    .map((item) => item.trim())
    .filter(Boolean);

  if (!normalizedHypotheses.length) {
    return [];
  }

  const dbCatalog = await fetchCidCatalogFromDatabase();
  const localCatalog = getLocalCidCatalog();
  const catalog = mergeCidCatalogs(dbCatalog, localCatalog);

  const ranked = catalog
    .map((cid) => scoreCid(cid, normalizedHypotheses))
    .filter((item): item is Cid10RecommendationOutput => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.code.localeCompare(b.code, "pt-BR");
    });

  return ranked.slice(0, input.limit ?? 6);
}
