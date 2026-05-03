"use client";

import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";

export function PlantonistaPanel() {
  const [especialidade, setEspecialidade] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [turno, setTurno] = useState("Manhã");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [copied, setCopied] = useState(false);

  const result = `RESIDENTE DE PLANTÃO
Especialidade: ${especialidade || "________________"}
Data: ${data.split("-").reverse().join("/")}
Turno: ${turno}
Nome: ${nome || "________________"}
Telefone: ${telefone || "________________"}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-neutral-500">Especialidade</label>
          <input
            type="text"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            placeholder="Ex: Clínica Médica"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Turno</label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          >
            <option>Manhã</option>
            <option>Tarde</option>
            <option>Noite</option>
            <option>24h</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500">Nome do Residente</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-neutral-500">Telefone / Ramal</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="relative rounded-xl border border-brand-200 bg-brand-50 p-4">
        <pre className="whitespace-pre-wrap font-mono text-xs text-brand-900">{result}</pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-medium text-brand-700 shadow-sm hover:bg-brand-50"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <p className="text-xs text-neutral-400">
        Use este card para se identificar em passagens de plantão ou discussões de caso.
      </p>
    </div>
  );
}
