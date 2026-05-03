"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-neutral-100 last:border-0 gap-4">
      <span className="text-small text-neutral-500 shrink-0">{label}</span>
      <span className="text-small font-semibold text-neutral-800 text-right">{value}</span>
    </div>
  );
}

function ResultBox({ result }: { result: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4">
      <p className="text-small font-medium text-brand-800 whitespace-pre-wrap">{result}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
        aria-label="Copiar resultado"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

function NumInput({
  label,
  value,
  onChange,
  unit,
  min,
  step = "1",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="text-small font-medium text-neutral-700">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          step={step}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-body text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        />
        {unit && <span className="text-small text-neutral-500 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

// ── Calculadora: Clearance de Creatinina (CG) ─────────────────────────────

function CalcCreatinina() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [sex, setSex] = useState<"M" | "F">("M");
  const [result, setResult] = useState("");

  const calculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const cr = parseFloat(creatinine);
    if (!a || !w || !cr) return;
    let clcr = ((140 - a) * w) / (72 * cr);
    if (sex === "F") clcr *= 0.85;
    const stage =
      clcr >= 90 ? "G1 — Normal ou aumentado (≥90)" :
      clcr >= 60 ? "G2 — Levemente reduzido (60–89)" :
      clcr >= 45 ? "G3a — Leve a moderadamente reduzido (45–59)" :
      clcr >= 30 ? "G3b — Moderada a gravemente reduzido (30–44)" :
      clcr >= 15 ? "G4 — Gravemente reduzido (15–29)" :
                   "G5 — Falência renal (<15)";
    setResult(
      `ClCr (Cockcroft-Gault): ${clcr.toFixed(1)} mL/min\n` +
      `Estágio DRC: ${stage}\n\n` +
      `⚠ Referência: Cockcroft & Gault (1976). Use eGFR CKD-EPI para estadiamento formal.`
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">Clearance de Creatinina</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Idade" value={age} onChange={setAge} unit="anos" min="1" />
        <NumInput label="Peso" value={weight} onChange={setWeight} unit="kg" min="1" step="0.1" />
      </div>
      <NumInput label="Creatinina sérica" value={creatinine} onChange={setCreatinine} unit="mg/dL" min="0.1" step="0.1" />
      <div>
        <label className="text-small font-medium text-neutral-700">Sexo</label>
        <div className="mt-1 flex gap-2">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSex(s)}
              className={`rounded-lg border px-4 py-2 text-small font-medium transition-colors ${
                sex === s
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-neutral-200 text-neutral-600 hover:border-brand-300"
              }`}
            >
              {s === "M" ? "Masculino" : "Feminino"}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={calculate}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Calcular
      </button>
      {result && <ResultBox result={result} />}
    </div>
  );
}

// ── Calculadora: IMC ───────────────────────────────────────────────────────

function CalcIMC() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;
    const imc = w / (h * h);
    const class_ =
      imc < 18.5 ? "Baixo peso" :
      imc < 25 ? "Peso normal" :
      imc < 30 ? "Sobrepeso" :
      imc < 35 ? "Obesidade grau I" :
      imc < 40 ? "Obesidade grau II" :
               "Obesidade grau III (mórbida)";
    const pesoideal_m = 50 + 0.9 * ((parseFloat(height)) - 152);
    setResult(
      `IMC: ${imc.toFixed(1)} kg/m²\nClassificação: ${class_}\nPeso ideal (Devine, masc.): ≈${pesoideal_m.toFixed(0)} kg\n\n` +
      `Referência: OMS 2000.`
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">IMC & Peso Ideal</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Peso" value={weight} onChange={setWeight} unit="kg" min="1" step="0.1" />
        <NumInput label="Altura" value={height} onChange={setHeight} unit="cm" min="100" />
      </div>
      <button
        type="button"
        onClick={calculate}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Calcular
      </button>
      {result && <ResultBox result={result} />}
    </div>
  );
}

// ── Calculadora: Dose Pediátrica ───────────────────────────────────────────

function CalcDosePed() {
  const [weight, setWeight] = useState("");
  const [dose, setDose] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    if (!w || !d) return;
    const totalDose = w * d;
    setResult(
      `Dose total: ${totalDose.toFixed(2)} mg\n(${w} kg × ${d} mg/kg)\n\n` +
      `⚠ Confirme sempre a dose máxima absoluta para a idade e a droga.`
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">Dose Pediátrica por Peso</h3>
      <NumInput label="Peso da criança" value={weight} onChange={setWeight} unit="kg" min="0.5" step="0.1" />
      <NumInput label="Dose prescrita" value={dose} onChange={setDose} unit="mg/kg" min="0.01" step="0.01" />
      <button
        type="button"
        onClick={calculate}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Calcular
      </button>
      {result && <ResultBox result={result} />}
    </div>
  );
}

// ── Calculadora: Balanço Hídrico ───────────────────────────────────────────

function CalcBalancoHidrico() {
  const [entradas, setEntradas] = useState("");
  const [saidas, setSaidas] = useState("");
  const [result, setResult] = useState("");

  const calculate = () => {
    const e = parseFloat(entradas) || 0;
    const s = parseFloat(saidas) || 0;
    const bh = e - s;
    const status = bh > 0 ? "Balanço POSITIVO → risco de sobrecarga hídrica" :
                   bh < 0 ? "Balanço NEGATIVO → risco de hipovolemia" :
                             "Balanço NEUTRO";
    setResult(`Entradas: ${e} mL\nSaídas: ${s} mL\nBalanço Hídrico: ${bh >= 0 ? "+" : ""}${bh} mL\n\n${status}`);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">Balanço Hídrico</h3>
      <NumInput label="Entradas totais (EV + VO + SNG)" value={entradas} onChange={setEntradas} unit="mL" min="0" />
      <NumInput label="Saídas totais (diurese + drenos + outros)" value={saidas} onChange={setSaidas} unit="mL" min="0" />
      <button
        type="button"
        onClick={calculate}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Calcular
      </button>
      {result && <ResultBox result={result} />}
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────

const CALC_TABS = [
  { id: "creatinina", label: "Clearance Cr" },
  { id: "imc", label: "IMC" },
  { id: "dose-ped", label: "Dose Pediátrica" },
  { id: "bh", label: "Balanço Hídrico" },
] as const;

type CalcTab = (typeof CALC_TABS)[number]["id"];

export function CalculadorasPanel() {
  const [tab, setTab] = useState<CalcTab>("creatinina");

  return (
    <div className="space-y-4">
      {/* tab bar */}
      <div className="flex flex-wrap gap-1.5">
        {CALC_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? "bg-brand-100 text-brand-700"
                : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        {tab === "creatinina" && <CalcCreatinina />}
        {tab === "imc" && <CalcIMC />}
        {tab === "dose-ped" && <CalcDosePed />}
        {tab === "bh" && <CalcBalancoHidrico />}
      </div>

      <p className="text-xs text-neutral-400">
        Ferramenta de apoio à decisão. Confirme com literatura e julgamento clínico.
      </p>
    </div>
  );
}
