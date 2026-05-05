"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { localCalculatorCatalog } from "@/lib/calculators/catalog";
import {
  clinicalScoreProjects,
  SCORE_SPECIALTIES,
  type ClinicalScoreProject,
  type ScoreSpecialty,
} from "@/lib/calculators/score-dashboard";
import { ScoreForm, getScoreClinicalTags, hasScoreForm } from "@/components/tools/score-forms";

const ROOT_CALCULATOR_SLUGS = new Set(["pam", "imc"]);

function CalculatorCatalog({ initialSlug }: { initialSlug?: string }) {
  const [activeScoreSlug, setActiveScoreSlug] = useState<string | null>(
    initialSlug && hasScoreForm(initialSlug) ? initialSlug : null,
  );
  const [activeSpecialty, setActiveSpecialty] = useState<ScoreSpecialty | "Todas">("Todas");

  const rootCalculators = localCalculatorCatalog.filter((calculator) =>
    ROOT_CALCULATOR_SLUGS.has(calculator.slug),
  );
  const filteredScores =
    activeSpecialty === "Todas"
      ? clinicalScoreProjects
      : clinicalScoreProjects.filter((score) => score.specialties.includes(activeSpecialty));

  const specialtyCounts = SCORE_SPECIALTIES.reduce<Record<ScoreSpecialty, number>>((acc, specialty) => {
    acc[specialty] = clinicalScoreProjects.filter((score) =>
      score.specialties.includes(specialty),
    ).length;
    return acc;
  }, {} as Record<ScoreSpecialty, number>);

  const renderCalculatorCard = (calculator: (typeof localCalculatorCatalog)[number]) => {
    const clickable = hasScoreForm(calculator.slug);
    const clinicalTags = getScoreClinicalTags(calculator.slug);
    const baseClass = `rounded-xl border border-neutral-200 bg-white p-3${
      clickable ? " w-full text-left transition-colors hover:border-brand-400 hover:bg-brand-50" : ""
    }`;

    const inner = (
      <>
        <h4 className="text-body font-semibold text-neutral-800">{calculator.name}</h4>
        <p className="mt-1 text-caption text-neutral-500">
          Contextos: {calculator.contexts.join(", ")}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {calculator.tags.map((tag) => (
            <span
              key={tag.name}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500"
            >
              {tag.name}
            </span>
          ))}
        </div>
        {clinicalTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {clinicalTags.map((tag) => (
              <span
                key={`${calculator.slug}-${tag.label}`}
                className="rounded-full border border-brand-200 px-2 py-0.5 text-[11px] text-brand-700"
                title={tag.value === "Ativo" ? tag.label : `${tag.label}: ${tag.value}`}
              >
                {tag.value === "Ativo" ? tag.label : tag.value}
              </span>
            ))}
          </div>
        )}
      </>
    );

    if (clickable) {
      return (
        <button
          key={calculator.slug}
          type="button"
          onClick={() => setActiveScoreSlug(calculator.slug)}
          className={baseClass}
        >
          {inner}
        </button>
      );
    }

    return (
      <article key={calculator.slug} className={baseClass}>
        {inner}
      </article>
    );
  };

  const renderScoreProjectCard = (score: ClinicalScoreProject) => {
    const clickable = hasScoreForm(score.slug);
    const clinicalTags = getScoreClinicalTags(score.slug);

    return (
      <button
        key={score.slug}
        type="button"
        onClick={() => {
          if (clickable) {
            setActiveScoreSlug(score.slug);
          }
        }}
        disabled={!clickable}
        className={`rounded-xl border bg-white p-3 text-left transition-colors ${
          clickable
            ? "border-neutral-200 hover:border-brand-400 hover:bg-brand-50"
            : "cursor-default border-neutral-100 opacity-80"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-body font-semibold text-neutral-800">{score.name}</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {score.specialties.map((specialty) => (
                <span
                  key={`${score.slug}-${specialty}`}
                  className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              score.status === "developed"
                ? "bg-brand-100 text-brand-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {score.status === "developed" ? "Desenvolvida" : "Planejada"}
          </span>
        </div>

        {clinicalTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {clinicalTags.map((tag) => (
              <span
                key={`${score.slug}-${tag.label}`}
                className="rounded-full border border-brand-200 px-2 py-0.5 text-[11px] text-brand-700"
                title={tag.value === "Ativo" ? tag.label : `${tag.label}: ${tag.value}`}
              >
                {tag.value === "Ativo" ? tag.label : tag.value}
              </span>
            ))}
          </div>
        )}

        {clickable && (
          <div className="mt-3 flex items-center gap-1 text-caption font-medium text-brand-700">
            Abrir calculadora
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </div>
        )}
      </button>
    );
  };

  if (activeScoreSlug) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveScoreSlug(null)}
          className="inline-flex items-center gap-1.5 text-caption text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar aos escores clínicos
        </button>
        <section className="rounded-xl border border-neutral-200 bg-white p-4">
          <ScoreForm slug={activeScoreSlug} />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <div>
          <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">
            Escores Clínicos
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSpecialty("Todas")}
            className={`rounded-full border px-3 py-1 text-caption font-medium transition-colors ${
              activeSpecialty === "Todas"
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300"
            }`}
          >
            Todas ({clinicalScoreProjects.length})
          </button>

          {SCORE_SPECIALTIES.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => setActiveSpecialty(specialty)}
              className={`rounded-full border px-3 py-1 text-caption font-medium transition-colors ${
                activeSpecialty === specialty
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300"
              }`}
            >
              {specialty} ({specialtyCounts[specialty]})
            </button>
          ))}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {filteredScores.map((score) => renderScoreProjectCard(score))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">
          Calculadoras gerais
        </h3>

        {rootCalculators.map((calculator) => renderCalculatorCard(calculator))}
      </section>
    </div>
  );
}

interface CalculadorasPanelProps {
  initialSlug?: string;
}

export function CalculadorasPanel({ initialSlug }: CalculadorasPanelProps = {}) {
  return (
    <div className="space-y-4">
      <CalculatorCatalog initialSlug={initialSlug} />
      <p className="text-xs text-neutral-400">
        Ferramenta de apoio à decisão. Confirme com literatura e julgamento clínico.
      </p>
    </div>
  );
}
