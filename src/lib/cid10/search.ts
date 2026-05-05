import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeText } from "@/lib/calculators/text";
import type { Cid10Entry, Cid10SearchInput } from "@/lib/cid10/types";
import { getLocalCidCatalog, mergeCidCatalogs } from "@/lib/cid10/catalog";

function localSearch(query: string, limit: number, catalog: Cid10Entry[]): Cid10Entry[] {
  const normalizedQuery = normalizeText(query);

  return catalog
    .filter((item) => {
      if (!normalizedQuery) return true;
      return (
        normalizeText(item.code).includes(normalizedQuery) ||
        normalizeText(item.description).includes(normalizedQuery)
      );
    })
    .sort((a, b) => a.code.localeCompare(b.code, "pt-BR"))
    .slice(0, limit);
}

export async function searchCid10(input: Cid10SearchInput): Promise<Cid10Entry[]> {
  const query = (input.query ?? "").trim();
  const limit = Math.min(Math.max(input.limit ?? 10000, 1), 10000);

  const localCatalog = getLocalCidCatalog();
  const base = supabaseAdmin.from("cid10").select("code, description").limit(limit);
  const request = query
    ? base.or(`code.ilike.%${query}%,description.ilike.%${query}%`)
    : base.order("code", { ascending: true });

  const { data, error } = await request;

  if (error || !Array.isArray(data)) {
    return localSearch(query, limit, localCatalog);
  }

  const dbRows: Cid10Entry[] = data
    .filter((row): row is { code: string; description: string } =>
      typeof row?.code === "string" && typeof row?.description === "string",
    )
    .map((row) => ({ code: row.code, description: row.description }));

  const merged = mergeCidCatalogs(dbRows, localCatalog);

  return merged.slice(0, limit);
}
