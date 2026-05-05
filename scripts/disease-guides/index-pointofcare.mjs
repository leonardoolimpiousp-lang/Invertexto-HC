#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.pointofcaremedicine.com";
const INDEX_URL = `${BASE_URL}/templates`;
const OUTPUT_DIR = path.resolve("data/disease-guides/raw");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pointofcare.index.json");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeCategory(raw) {
  return raw.replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(href) {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("/")) return `${BASE_URL}${href}`;
  return null;
}

function isLikelyTemplatePath(pathname) {
  const blockedPrefixes = ["/blog", "/podcast", "/about", "/contact", "/hq-page", "/privacy", "/terms"];
  if (pathname === "/" || pathname === "/templates") return false;
  if (blockedPrefixes.some((prefix) => pathname.startsWith(prefix))) return false;
  if (pathname.includes("/search")) return false;

  const templatePrefixes = [
    "/inpatient/",
    "/outpatient/",
    "/rapid-response/",
    "/cardiology/",
    "/pulmonology-and-critical-care/",
    "/gastroenterology/",
    "/nephrology/",
    "/hematology-and-oncology/",
    "/infectious-disease/",
    "/endocrinology/",
    "/rheumatology-immunology/",
    "/neurology/",
  ];

  return templatePrefixes.some((prefix) => pathname.startsWith(prefix));
}

function inferSettingFromPath(pathname, fallback = "Unknown") {
  if (pathname.startsWith("/inpatient/")) return "Inpatient";
  if (pathname.startsWith("/outpatient/")) return "Outpatient";
  if (pathname.startsWith("/rapid-response/")) return "Rapid Response";
  return fallback;
}

async function main() {
  const response = await fetch(INDEX_URL);
  if (!response.ok) {
    throw new Error(`Falha ao baixar ${INDEX_URL}: ${response.status}`);
  }
  const html = await response.text();

  const lines = html.split("\n");
  const entries = [];
  let currentCategory = "Geral";
  let currentSetting = "Unknown";

  for (const line of lines) {
    const categoryMatch = line.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (categoryMatch) {
      currentCategory = normalizeCategory(categoryMatch[1].replace(/<[^>]+>/g, ""));
    }

    if (/Inpatient/i.test(line)) currentSetting = "Inpatient";
    if (/Outpatient/i.test(line)) currentSetting = "Outpatient";
    if (/Rapid Response/i.test(line)) currentSetting = "Rapid Response";

    const linkRegex = /href="(\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let m;
    while ((m = linkRegex.exec(line)) !== null) {
      const href = m[1];
      const title = m[2].replace(/\s+/g, " ").trim();
      if (!href || !title) continue;

      const absoluteUrl = toAbsoluteUrl(href);
      if (!absoluteUrl) {
        continue;
      }

      let pathname = "";
      try {
        pathname = new URL(absoluteUrl).pathname;
      } catch {
        continue;
      }
      if (!isLikelyTemplatePath(pathname)) continue;

      entries.push({
        title,
        url: absoluteUrl,
        category: currentCategory,
        setting: inferSettingFromPath(pathname, currentSetting),
      });
    }
  }

  const deduped = Array.from(
    new Map(entries.map((e) => [`${e.title}::${e.url}`, e])).values(),
  );

  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        source: INDEX_URL,
        generatedAt: new Date().toISOString(),
        total: deduped.length,
        templates: deduped,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Index salvo em ${OUTPUT_FILE} (${deduped.length} templates).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
