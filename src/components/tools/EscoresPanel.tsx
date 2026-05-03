"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function ResultBox({ result, badge }: { result: string; badge?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative mt-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-brand-200 px-2.5 py-0.5 text-xs font-bold text-brand-800">
          {badge}
        </span>
      )}
      <p className="text-small text-brand-900 whitespace-pre-wrap">{result}</p>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(result);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

// ── qSOFA ─────────────────────────────────────────────────────────────────

function EscoreQSOFA() {
  const [fr, setFr] = useState(false);
  const [alteracao, setAlteracao] = useState(false);
  const [pas, setPas] = useState(false);
  const score = [fr, alteracao, pas].filter(Boolean).length;
  const risk = score >= 2 ? "ALTO — alto risco de sepse (considere UTI)" : score === 1 ? "INTERMEDIÁRIO" : "BAIXO";
  const result = `qSOFA: ${score}/3\nRisco: ${risk}\nCritérios positivos: ${[fr && "FR ≥ 22 irpm", alteracao && "Alteração mental (GCS < 15)", pas && "PAS ≤ 100 mmHg"].filter(Boolean).join("; ") || "nenhum"}\n\nRef: Singer et al. JAMA 2016.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">qSOFA (sepse)</h3>
      {[
        { label: "FR ≥ 22 irpm", value: fr, setter: setFr },
        { label: "Alteração do estado mental (GCS < 15)", value: alteracao, setter: setAlteracao },
        { label: "PAS ≤ 100 mmHg", value: pas, setter: setPas },
      ].map(({ label, value, setter }) => (
        <label key={label} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-brand-300">
          <input type="checkbox" checked={value} onChange={(e) => setter(e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
          <span className="text-small text-neutral-700">{label}</span>
        </label>
      ))}
      <ResultBox result={result} badge={`${score}/3`} />
    </div>
  );
}

// ── Glasgow ────────────────────────────────────────────────────────────────

function EscoreGlasgow() {
  const [eyes, setEyes] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const score = eyes + verbal + motor;
  const severity = score >= 13 ? "Leve" : score >= 9 ? "Moderado" : "Grave";
  const result = `Glasgow: ${score}/15 — TCE ${severity}\nOlhos: ${eyes} | Verbal: ${verbal} | Motor: ${motor}\n\nRef: Teasdale & Jennett 1974.`;

  const select = (label: string, value: number, setter: (v: number) => void, options: [number, string][]) => (
    <div>
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      <select
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{v} — {l}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">Glasgow Coma Scale</h3>
      {select("Abertura Ocular (E)", eyes, setEyes, [
        [4, "Espontânea"], [3, "À voz"], [2, "À dor"], [1, "Nenhuma"],
      ])}
      {select("Resposta Verbal (V)", verbal, setVerbal, [
        [5, "Orientado"], [4, "Confuso"], [3, "Palavras inapropriadas"], [2, "Sons incompreensíveis"], [1, "Nenhuma"],
      ])}
      {select("Resposta Motora (M)", motor, setMotor, [
        [6, "Obedece comandos"], [5, "Localiza dor"], [4, "Flexão ao estímulo"], [3, "Flexão anormal (decorticação)"], [2, "Extensão (descerebração)"], [1, "Nenhuma"],
      ])}
      <ResultBox result={result} badge={`${score}/15 — ${severity}`} />
    </div>
  );
}

// ── Wells TEP ─────────────────────────────────────────────────────────────

function EscoreWellsTEP() {
  const criteria = [
    { label: "Sinais/sintomas de TVP clínica", points: 3 },
    { label: "TEP mais provável que diagnóstico alternativo", points: 3 },
    { label: "FC > 100 bpm", points: 1.5 },
    { label: "Imobilização ≥ 3 dias ou cirurgia nas últimas 4 semanas", points: 1.5 },
    { label: "TEP ou TVP prévia", points: 1.5 },
    { label: "Hemoptise", points: 1 },
    { label: "Neoplasia ativa (tto. nos últimos 6 meses ou paliativa)", points: 1 },
  ];

  const [checked, setChecked] = useState<boolean[]>(criteria.map(() => false));
  const score = criteria.reduce((acc, c, i) => acc + (checked[i] ? c.points : 0), 0);
  const prob = score > 6 ? "Alta (>60%)" : score >= 2 ? "Moderada (20–60%)" : "Baixa (<20%)";
  const result = `Wells-TEP: ${score} pontos\nProbabilidade pré-teste: ${prob}\n\nRef: Wells et al. Ann Intern Med 2001.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">Wells — TEP</h3>
      {criteria.map((c, i) => (
        <label key={c.label} className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-brand-300">
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={(e) => {
              const n = [...checked];
              n[i] = e.target.checked;
              setChecked(n);
            }}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-600"
          />
          <span className="flex-1 text-small text-neutral-700">{c.label}</span>
          <span className="text-small font-bold text-brand-700">+{c.points}</span>
        </label>
      ))}
      <ResultBox result={result} badge={`${score} pts`} />
    </div>
  );
}

// ── CHA2DS2-VASc ──────────────────────────────────────────────────────────

function EscoreCHADSVASc() {
  const criteria = [
    { label: "IC ou FEVE <40% (C)", points: 1 },
    { label: "Hipertensão arterial (H)", points: 1 },
    { label: "Idade ≥ 75 anos (A2)", points: 2 },
    { label: "DM (D)", points: 1 },
    { label: "AVC/AIT/embolia prévia (S2)", points: 2 },
    { label: "Doença vascular (DCV, IAM, placa aórtica) (V)", points: 1 },
    { label: "Idade 65–74 anos (A)", points: 1 },
    { label: "Sexo feminino (Sc)", points: 1 },
  ];

  const [checked, setChecked] = useState<boolean[]>(criteria.map(() => false));
  const score = criteria.reduce((acc, c, i) => acc + (checked[i] ? c.points : 0), 0);
  const rec =
    score >= 2 ? "Anticoagulação recomendada" :
    score === 1 ? "Considerar anticoagulação (avaliar caso a caso)" :
    "Anticoagulação não recomendada";
  const result = `CHA₂DS₂-VASc: ${score}\n${rec}\n\nRef: Kirchhof et al. ESC Guidelines 2016.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">CHA₂DS₂-VASc (FA)</h3>
      {criteria.map((c, i) => (
        <label key={c.label} className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-brand-300">
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={(e) => {
              const n = [...checked];
              n[i] = e.target.checked;
              setChecked(n);
            }}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-600"
          />
          <span className="flex-1 text-small text-neutral-700">{c.label}</span>
          <span className="text-small font-bold text-brand-700">+{c.points}</span>
        </label>
      ))}
      <ResultBox result={result} badge={`${score} pts`} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────

const ESCORE_TABS = [
  { id: "qsofa", label: "qSOFA" },
  { id: "glasgow", label: "Glasgow" },
  { id: "wells-tep", label: "Wells-TEP" },
  { id: "chadsvasc", label: "CHA₂DS₂-VASc" },
] as const;

type EscoreTab = (typeof ESCORE_TABS)[number]["id"];

export function EscoresPanel() {
  const [tab, setTab] = useState<EscoreTab>("qsofa");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {ESCORE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id ? "bg-brand-100 text-brand-700" : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        {tab === "qsofa" && <EscoreQSOFA />}
        {tab === "glasgow" && <EscoreGlasgow />}
        {tab === "wells-tep" && <EscoreWellsTEP />}
        {tab === "chadsvasc" && <EscoreCHADSVASc />}
      </div>
      <p className="text-xs text-neutral-400">Escores para apoio diagnóstico. Não substituem julgamento clínico.</p>
    </div>
  );
}
