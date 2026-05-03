"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyTextArea({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative mt-2">
      <textarea
        readOnly
        value={value}
        rows={value.split("\n").length + 2}
        className="w-full rounded-xl border border-brand-200 bg-brand-50 p-4 font-mono text-xs text-brand-900 focus:outline-none resize-none"
      />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-brand-700 shadow-sm hover:bg-brand-50"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

const TEMPLATES = {
  simples: {
    label: "Receituário Simples",
    fields: ["Paciente", "Medicamento", "Dose", "Via", "Frequência", "Duração", "Médico", "CRM"],
    generate: (v: Record<string, string>) =>
      `RECEITUÁRIO SIMPLES
Data: ${new Date().toLocaleDateString("pt-BR")}

Paciente: ${v.Paciente || "_______________________"}

Rx:
  ${v.Medicamento || "_______________________"} ${v.Dose || "____"}
  Via ${v.Via || "____"} — ${v.Frequência || "____"} por ${v.Duração || "____"}

____________________________
${v.Médico || "Nome do Médico"}
CRM: ${v.CRM || "______/UF"}`,
  },
  controlado: {
    label: "Receituário Controlado (B1/B2)",
    fields: ["Paciente", "CPF paciente", "Endereço", "Medicamento", "Concentração", "Quantidade", "Via", "Frequência", "Médico", "CRM"],
    generate: (v: Record<string, string>) =>
      `RECEITUÁRIO DE CONTROLE ESPECIAL — 2 VIAS
Data: ${new Date().toLocaleDateString("pt-BR")}

IDENTIFICAÇÃO DO PACIENTE
Nome: ${v.Paciente || "________________________"}
CPF: ${v["CPF paciente"] || "___.___.___-__"}
Endereço: ${v.Endereço || "________________________"}

PRESCRIÇÃO
${v.Medicamento || "________________________"} ${v.Concentração || "____"}
Quantidade: ${v.Quantidade || "____"}
Via ${v.Via || "____"} — ${v.Frequência || "____"}

____________________________
${v.Médico || "Nome do Médico"}
CRM: ${v.CRM || "______/UF"}

1ª via — Farmácia   2ª via — Retenção`,
  },
};

export function ReceituariosPanel() {
  const [tipo, setTipo] = useState<keyof typeof TEMPLATES>("simples");
  const template = TEMPLATES[tipo];
  const [values, setValues] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState("");

  const handleChange = (field: string, val: string) =>
    setValues((prev) => ({ ...prev, [field]: val }));

  const handleGenerate = () => setGenerated(template.generate(values));

  return (
    <div className="space-y-4">
      {/* tipo selector */}
      <div className="flex gap-2">
        {(Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => { setTipo(k); setGenerated(""); }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tipo === k ? "bg-brand-100 text-brand-700" : "text-neutral-500 hover:bg-neutral-100"
            }`}
          >
            {TEMPLATES[k].label}
          </button>
        ))}
      </div>

      {/* fields */}
      <div className="grid grid-cols-2 gap-3">
        {template.fields.map((field) => (
          <div key={field} className={field.startsWith("Endereço") ? "col-span-2" : ""}>
            <label className="text-xs font-medium text-neutral-500">{field}</label>
            <input
              type="text"
              value={values[field] ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-small font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        Gerar receituário
      </button>

      {generated && <CopyTextArea value={generated} />}

      <p className="text-xs text-neutral-400">
        Template apenas — não possui assinatura digital. Confirmação e assinatura são de responsabilidade do prescritor.
      </p>
    </div>
  );
}
