#!/usr/bin/env node
/**
 * Organiza uma lista exportada de templates do Point of Care Medicine
 * para o formato do catálogo interno de guias por doença.
 *
 * Uso:
 * node scripts/organize-pointofcare-guides.mjs ./pointofcare-templates.json > ./disease-guides-seed.json
 *
 * Formato esperado do JSON de entrada:
 * [
 *   {
 *     "title": "Sepsis and Septic Shock",
 *     "category": "Infectious Disease",
 *     "setting": "Inpatient",
 *     "url": "https://..."
 *   }
 * ]
 */

import fs from "node:fs";

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferContexts(setting = "", title = "") {
  const s = `${setting} ${title}`.toLowerCase();
  const contexts = new Set();

  if (s.includes("inpatient") || s.includes("icu") || s.includes("rapid response")) {
    contexts.add("UTI");
    contexts.add("Enfermaria");
    contexts.add("PS");
  }
  if (s.includes("outpatient")) {
    contexts.add("Ambulatorio");
  }
  if (s.includes("emergency") || s.includes("rapid response")) {
    contexts.add("Sala de Emergencia");
    contexts.add("PS");
  }

  if (contexts.size === 0) {
    contexts.add("PS");
  }

  return Array.from(contexts);
}

function inferTags(title) {
  const normalized = title.toLowerCase();
  const base = normalized
    .replace(/[()/]/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);

  const unique = Array.from(new Set(base));
  return unique.slice(0, 6).map((name, index) => ({
    name,
    weight: index === 0 ? 10 : 6,
  }));
}

function toGuideTemplate(item) {
  const title = String(item.title || "").trim();
  return {
    id: slugify(title),
    disease: title,
    contexts: inferContexts(item.setting, title),
    hdTags: inferTags(title),
    sections: [
      {
        title: "Checklist Inicial",
        content: ["Preencher manualmente com conteúdo validado pela equipe clínica."],
      },
      {
        title: "Avaliação Diagnóstica",
        content: ["Preencher manualmente com conteúdo validado pela equipe clínica."],
      },
      {
        title: "Plano",
        content: ["Preencher manualmente com conteúdo validado pela equipe clínica."],
      },
    ],
    source: {
      name: "Point of Care Medicine",
      url: item.url || "https://www.pointofcaremedicine.com/templates",
    },
  };
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Uso: node scripts/organize-pointofcare-guides.mjs <arquivo.json>");
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const data = JSON.parse(raw);
if (!Array.isArray(data)) {
  console.error("Entrada inválida: esperado um array JSON.");
  process.exit(1);
}

const guides = data
  .filter((item) => item && typeof item.title === "string" && item.title.trim())
  .map(toGuideTemplate);

process.stdout.write(`${JSON.stringify(guides, null, 2)}\n`);
