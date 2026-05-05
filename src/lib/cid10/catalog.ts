import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { CID10_DATA } from "@/lib/constants/cid10";
import type { Cid10Entry } from "@/lib/cid10/types";

type RawCid10Row = Partial<{
  code: string;
  codigo: string;
  CAT: string;
  description: string;
  descricao: string;
  DESCRICAO: string;
}>;

let cachedCsvCatalog: Cid10Entry[] | null = null;

function dedupeByCode(entries: Cid10Entry[]): Cid10Entry[] {
  const map = new Map<string, Cid10Entry>();

  for (const entry of entries) {
    if (!entry?.code || !entry?.description) continue;
    const code = entry.code.trim().toUpperCase();
    if (!map.has(code)) {
      map.set(code, { code, description: entry.description.trim() });
    }
  }

  return Array.from(map.values());
}

function readCsvCatalog(): Cid10Entry[] {
  try {
    const csvPath = path.join(process.cwd(), "cid10.csv");
    if (!fs.existsSync(csvPath)) {
      return [];
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const parsedRows = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as RawCid10Row[];

    return parsedRows
      .map((row) => ({
        code: row.code || row.codigo || row.CAT || "",
        description: row.description || row.descricao || row.DESCRICAO || "",
      }))
      .filter((row) => row.code && row.description)
      .map((row) => ({ code: row.code.trim().toUpperCase(), description: row.description.trim() }));
  } catch {
    return [];
  }
}

export function getLocalCidCatalog(): Cid10Entry[] {
  if (cachedCsvCatalog) {
    return cachedCsvCatalog;
  }

  const csvCatalog = readCsvCatalog();
  cachedCsvCatalog = dedupeByCode([...csvCatalog, ...CID10_DATA]);
  return cachedCsvCatalog;
}

export function mergeCidCatalogs(...catalogs: Cid10Entry[][]): Cid10Entry[] {
  return dedupeByCode(catalogs.flat());
}
