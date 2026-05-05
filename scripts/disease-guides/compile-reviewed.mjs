#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const INPUT_FILE = path.resolve("data/disease-guides/review/drafts.pointofcare.json");
const OUTPUT_DIR = path.resolve("data/disease-guides/compiled");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "catalog.generated.json");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function isContextName(value) {
  return ["PS", "UTI", "Sala de Emergencia", "Enfermaria", "Ambulatorio"].includes(value);
}

function sanitizeGuide(guide) {
  const contexts = Array.isArray(guide.contexts) ? guide.contexts.filter(isContextName) : [];
  const hdTags = Array.isArray(guide.hdTags)
    ? guide.hdTags
        .filter((t) => t && typeof t.name === "string")
        .map((t) => ({
          name: t.name.trim().toLowerCase(),
          weight: Number(t.weight) >= 10 ? 10 : 6,
        }))
    : [];

  const sections = Array.isArray(guide.sections)
    ? guide.sections
        .filter((s) => s && typeof s.title === "string" && Array.isArray(s.content))
        .map((s) => ({
          title: s.title.trim(),
          content: s.content.map((c) => String(c).trim()).filter(Boolean),
        }))
        .filter((s) => s.title && s.content.length > 0)
    : [];

  return {
    id: String(guide.id || "").trim(),
    disease: String(guide.disease || "").trim(),
    contexts,
    hdTags,
    sections,
    source: guide.source && typeof guide.source.url === "string"
      ? {
          name: String(guide.source.name || "Fonte externa"),
          url: guide.source.url,
          updatedAt: guide.source.updatedAt ? String(guide.source.updatedAt) : undefined,
        }
      : undefined,
  };
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Arquivo não encontrado: ${INPUT_FILE}. Rode antes: npm run guides:draft:pointofcare`);
  }

  const payload = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const drafts = Array.isArray(payload.drafts) ? payload.drafts : [];

  const approved = drafts
    .filter((d) => d?.review?.status === "approved")
    .map(sanitizeGuide)
    .filter((g) => g.id && g.disease && g.contexts.length > 0 && g.hdTags.length > 0 && g.sections.length > 0);

  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        approvedTotal: approved.length,
        catalog: approved,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Catálogo compilado em ${OUTPUT_FILE} (${approved.length} itens aprovados).`);
}

main();
