#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const INPUT_FILE = path.resolve("data/disease-guides/raw/pointofcare.index.json");
const OUTPUT_DIR = path.resolve("data/disease-guides/review");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "drafts.pointofcare.json");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferContexts(template) {
  const s = `${template.setting} ${template.title}`.toLowerCase();
  const contexts = new Set();

  if (s.includes("inpatient")) {
    contexts.add("PS");
    contexts.add("Enfermaria");
  }
  if (s.includes("outpatient")) {
    contexts.add("Ambulatorio");
  }
  if (s.includes("rapid response") || s.includes("shock") || s.includes("intubation")) {
    contexts.add("Sala de Emergencia");
    contexts.add("UTI");
  }
  if (contexts.size === 0) contexts.add("PS");
  return Array.from(contexts);
}

function inferTags(title) {
  return Array.from(
    new Set(
      title
        .toLowerCase()
        .replace(/[()]/g, " ")
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2),
    ),
  )
    .slice(0, 6)
    .map((name, idx) => ({ name, weight: idx === 0 ? 10 : 6 }));
}

function extractListAfterHeader(lines, header, limit = 6) {
  const idx = lines.findIndex((line) => line.toLowerCase().includes(header.toLowerCase()));
  if (idx === -1) return [];

  const out = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^(Plan|Assessment|Checklist|Clinical Pearls|Trials)/i.test(line)) break;
    if (line.startsWith("--")) {
      out.push(line.replace(/^--\s*/, "").trim());
    }
    if (out.length >= limit) break;
  }
  return out;
}

async function fetchDraftContent(url) {
  const response = await fetch(url);
  if (!response.ok) {
    return {
      sections: [
        { title: "Lista Inicial", content: ["Falha ao extrair automaticamente. Revisão manual necessária."] },
        { title: "Avaliação Diagnóstica", content: ["Preencher manualmente."] },
        { title: "Plano", content: ["Preencher manualmente."] },
      ],
    };
  }

  const html = await response.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const checklist = extractListAfterHeader(text, "Checklist", 8);
  const assessment = extractListAfterHeader(text, "Assessment", 8);
  const plan = extractListAfterHeader(text, "Plan", 8);

  return {
    sections: [
      { title: "Lista Inicial", content: checklist.length ? checklist : ["Revisar e preencher manualmente."] },
      { title: "Avaliação Diagnóstica", content: assessment.length ? assessment : ["Revisar e preencher manualmente."] },
      { title: "Plano", content: plan.length ? plan : ["Revisar e preencher manualmente."] },
    ],
  };
}

async function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`Arquivo não encontrado: ${INPUT_FILE}. Rode antes: npm run guides:index:pointofcare`);
  }

  const raw = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  const templates = Array.isArray(raw.templates) ? raw.templates : [];

  const drafts = [];
  for (const template of templates) {
    const extracted = await fetchDraftContent(template.url);

    drafts.push({
      id: slugify(template.title),
      disease: template.title,
      contexts: inferContexts(template),
      hdTags: inferTags(template.title),
      sections: extracted.sections,
      source: {
        name: "Point of Care Medicine",
        url: template.url,
      },
      review: {
        status: "pending",
        notes: "Revisar contexto/tags e reescrever conteúdo para versão final interna.",
      },
      metadata: {
        category: template.category,
        setting: template.setting,
        ingestedAt: new Date().toISOString(),
      },
    });
  }

  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: drafts.length,
        drafts,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Drafts salvos em ${OUTPUT_FILE} (${drafts.length} itens).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
