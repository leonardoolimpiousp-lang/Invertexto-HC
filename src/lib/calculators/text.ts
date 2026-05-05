export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function tokenizeText(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 0);
}

export function dedupeNormalized(array: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const item of array) {
    const normalized = normalizeText(item);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(item.trim());
  }

  return deduped;
}
