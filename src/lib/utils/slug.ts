/**
 * Slug utilities — design intent (§Riscos R1 do PRD):
 * O slug é a "credencial" do MVP. Default = entropia alta para evitar
 * descoberta acidental. Usuário pode opt-in num slug amigável depois.
 */

const SAFE_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // sem 0, O, l, 1, o
const RESERVED_SLUGS = new Set([
  "cadastro",
  "api",
  "sobre",
  "termos",
  "privacidade",
  "admin",
  "login",
  "logout",
  "_next",
  "favicon.ico",
]);

/**
 * Gera slug aleatório de alta entropia (12 chars).
 * Usa crypto.getRandomValues para randomness criptograficamente forte.
 */
export function generateRandomSlug(length = 12): string {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => SAFE_ALPHABET[n % SAFE_ALPHABET.length]).join("");
}

/**
 * Normaliza slug informado pelo usuário.
 * - lowercase, sem acentos
 * - apenas a-z, 0-9, hífen
 * - hífens colapsados, sem hífens nas pontas
 */
export function normalizeSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (slug.length < 3 || slug.length > 48) return false;
  if (RESERVED_SLUGS.has(slug)) return false;
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug);
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}
