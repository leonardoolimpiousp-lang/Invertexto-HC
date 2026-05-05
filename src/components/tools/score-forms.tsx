"use client";

import { useState } from "react";
import { ChevronDown, Check, Copy } from "lucide-react";

type ClinicalTag = {
  label: string;
  value: string;
};

type InfoSection = {
  title: string;
  items: string[];
};

type ScoreClinicalInfo = {
  tags: ClinicalTag[];
  sections: InfoSection[];
};

const SCORE_CLINICAL_INFO: Record<string, ScoreClinicalInfo> = {
  qsofa: {
    tags: [
      { label: "Especialidade/doença", value: "Infectologia" },
      { label: "Rastreio", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Adulto com infecção suspeita ou confirmada, especialmente no PS, enfermaria ou avaliação fora da UTI.",
          "Triagem rápida à beira-leito quando ainda não há exames laboratoriais disponíveis.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Ajuda a reconhecer pacientes que precisam de avaliação urgente para disfunção orgânica.",
          "Um escore >= 2 deve acelerar investigação com lactato, exames e avaliação clínica estruturada.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "É ferramenta de rastreio, não de diagnóstico, exclusão, prognóstico formal, tratamento ou algoritmo definitivo.",
          "qSOFA baixo não exclui sepse; julgamento clínico, protocolos locais e SOFA/lactato continuam essenciais.",
        ],
      },
    ],
  },
  sofa: {
    tags: [
      { label: "Especialidade/doença", value: "Infectologia" },
      { label: "Prognóstico", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Paciente crítico, especialmente em UTI ou suspeita de sepse com possível disfunção orgânica.",
          "Avaliação seriada de função respiratória, coagulação, fígado, cardiovascular, neurológica e renal.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Quantifica gravidade e evolução de disfunção orgânica em múltiplos sistemas.",
          "Na definição Sepsis-3, aumento agudo de SOFA >= 2 em contexto infeccioso sugere disfunção orgânica relacionada à sepse.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "É principalmente prognóstico e de acompanhamento; não substitui diagnóstico clínico da causa da disfunção.",
          "Use tendência e delta SOFA quando possível; valores isolados podem refletir doença crônica prévia.",
        ],
      },
    ],
  },
  news2: {
    tags: [
      { label: "Especialidade/doença", value: "Infectologia" },
      { label: "Rastreio", value: "Ativo" },
      { label: "Prognóstico", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Adultos hospitalizados ou em avaliação aguda com risco de deterioração clínica.",
          "Monitorização seriada em PS, enfermaria e transições de cuidado.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Padroniza sinais vitais em um sistema de alerta precoce para deterioração.",
          "Ajuda a definir frequência de monitorização e necessidade de escalonamento.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "A escala 2 de SpO2 deve ser usada apenas em insuficiência respiratória hipercápnica documentada e por decisão clínica competente.",
          "Um único parâmetro com 3 pontos já é sinal de alerta, mesmo que o total pareça moderado.",
        ],
      },
    ],
  },
  rass: {
    tags: [
      { label: "Especialidade/doença", value: "Neurologia" },
      { label: "Tratamento", value: "Ativo" },
      { label: "Diagnóstico", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Paciente em UTI, ventilação mecânica, uso de sedativos, agitação, delirium ou alteração flutuante de consciência.",
          "Reavaliação seriada para titular sedação e comunicar estado de alerta/agitação.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Padroniza a profundidade de sedação e agitação em uma escala de -5 a +4.",
          "Facilita metas de sedação, desmame, rastreio de delirium e segurança da equipe.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "Interprete sempre em relação à meta de sedação prescrita para o paciente.",
          "Dor, hipóxia, delirium, abstinência, tubo/ventilador e contenções podem explicar agitação antes de aumentar sedativo.",
        ],
      },
    ],
  },
  glasgow: {
    tags: [
      { label: "Especialidade/doença", value: "Cirurgia e Neurologia" },
      { label: "Diagnóstico", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Alteração do nível de consciência, trauma cranioencefálico, AVC, intoxicação ou monitorização neurológica seriada.",
          "Comunicação objetiva do exame neurológico em emergência, enfermaria e UTI.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Padroniza a descrição da resposta ocular, verbal e motora.",
          "Permite acompanhar tendência clínica e classificar gravidade, sobretudo em TCE.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "Registre os componentes separadamente, não apenas o total.",
          "Intubação, sedação, intoxicação, barreira de linguagem, trauma facial ou déficit neurológico prévio podem distorcer a pontuação.",
        ],
      },
    ],
  },
  "wells-tep": {
    tags: [
      { label: "Especialidade/doença", value: "Tromboembolismo pulmonar" },
      { label: "Diagnóstico", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Paciente com suspeita clínica de embolia pulmonar, como dispneia, dor torácica, síncope ou sinais de TVP.",
          "Antes de escolher entre D-dímero, angio-TC ou investigação direta conforme risco.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Objetiva a probabilidade pré-teste de TEP.",
          "Ajuda a reduzir exames de imagem desnecessários em pacientes de menor risco.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "Não diagnostica TEP sozinho; organiza a próxima etapa da investigação.",
          "O critério 'TEP mais provável' é subjetivo e deve considerar experiência clínica e diagnósticos alternativos.",
        ],
      },
    ],
  },
  "wells-tvp": {
    tags: [
      { label: "Especialidade/doença", value: "Tromboembolismo pulmonar" },
      { label: "Diagnóstico", value: "Ativo" },
    ],
    sections: [],
  },
  "cha2ds2-vasc": {
    tags: [
      { label: "Especialidade/doença", value: "Tromboembolismo pulmonar e cardiovascular" },
      { label: "Diagnóstico", value: "Ativo" },
      { label: "Tratamento", value: "Ativo" },
    ],
    sections: [
      {
        title: "Quando usar",
        items: [
          "Adultos com fibrilação atrial não valvar, paroxística, persistente ou permanente.",
          "Recalcular em consultas de seguimento, pois idade e novas comorbidades mudam a conduta.",
        ],
      },
      {
        title: "Por que usar",
        items: [
          "Estratifica risco de AVC e tromboembolismo em FA.",
          "Apoia a decisão de iniciar, considerar ou evitar anticoagulação oral.",
        ],
      },
      {
        title: "Considerações",
        items: [
          "Não use para FA valvar com estenose mitral moderada/grave ou válvula mecânica.",
          "Cardiomiopatia hipertrófica, amiloidose cardíaca e outros fatores trombóticos podem exigir anticoagulação apesar do escore.",
        ],
      },
    ],
  },
};

function ClinicalTags({ tags }: { tags: ClinicalTag[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={`${tag.label}-${tag.value}`}
          className="rounded-full border border-brand-200 bg-white px-2.5 py-1 text-[11px] font-medium text-brand-700"
          title={tag.label}
        >
          {tag.value === "Ativo" ? tag.label : `${tag.label}: ${tag.value}`}
        </span>
      ))}
    </div>
  );
}

function InfoToggles({ sections }: { sections: InfoSection[] }) {
  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <details
          key={section.title}
          className="group rounded-lg border border-neutral-200 bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-small font-semibold text-neutral-700">
            {section.title}
            <ChevronDown className="h-4 w-4 text-neutral-400 transition-transform group-open:rotate-180" />
          </summary>
          <ul className="space-y-1 border-t border-neutral-100 px-3 py-2">
            {section.items.map((item) => (
              <li key={item} className="text-caption leading-relaxed text-neutral-600">
                {item}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

function ScoreClinicalContext({ slug }: { slug: string }) {
  const info = SCORE_CLINICAL_INFO[slug];
  if (!info) return null;

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
      <ClinicalTags tags={info.tags} />
      <InfoToggles sections={info.sections} />
    </div>
  );
}

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

function SelectField<TValue extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: { label: string; value: TValue }[];
}) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      <select
        value={value}
        onChange={(event) => {
          const selected = options.find((option) => String(option.value) === event.target.value);
          if (selected) onChange(selected.value);
        }}
        className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const sofaOptions = {
  respiratory: [
    { value: 0, label: "0 - PaO2/FiO2 >= 400" },
    { value: 1, label: "1 - PaO2/FiO2 < 400" },
    { value: 2, label: "2 - PaO2/FiO2 < 300" },
    { value: 3, label: "3 - PaO2/FiO2 < 200 com suporte respiratorio" },
    { value: 4, label: "4 - PaO2/FiO2 < 100 com suporte respiratorio" },
  ],
  coagulation: [
    { value: 0, label: "0 - Plaquetas >= 150 mil/mcL" },
    { value: 1, label: "1 - Plaquetas < 150 mil/mcL" },
    { value: 2, label: "2 - Plaquetas < 100 mil/mcL" },
    { value: 3, label: "3 - Plaquetas < 50 mil/mcL" },
    { value: 4, label: "4 - Plaquetas < 20 mil/mcL" },
  ],
  liver: [
    { value: 0, label: "0 - Bilirrubina < 1,2 mg/dL" },
    { value: 1, label: "1 - Bilirrubina 1,2-1,9 mg/dL" },
    { value: 2, label: "2 - Bilirrubina 2,0-5,9 mg/dL" },
    { value: 3, label: "3 - Bilirrubina 6,0-11,9 mg/dL" },
    { value: 4, label: "4 - Bilirrubina >= 12 mg/dL" },
  ],
  cardiovascular: [
    { value: 0, label: "0 - PAM >= 70 mmHg" },
    { value: 1, label: "1 - PAM < 70 mmHg" },
    { value: 2, label: "2 - Dopamina <= 5 ou dobutamina qualquer dose" },
    { value: 3, label: "3 - Dopamina 5,1-15 ou noradrenalina/adrenalina <= 0,1" },
    { value: 4, label: "4 - Dopamina > 15 ou noradrenalina/adrenalina > 0,1" },
  ],
  cns: [
    { value: 0, label: "0 - Glasgow 15" },
    { value: 1, label: "1 - Glasgow 13-14" },
    { value: 2, label: "2 - Glasgow 10-12" },
    { value: 3, label: "3 - Glasgow 6-9" },
    { value: 4, label: "4 - Glasgow < 6" },
  ],
  renal: [
    { value: 0, label: "0 - Creatinina < 1,2 mg/dL" },
    { value: 1, label: "1 - Creatinina 1,2-1,9 mg/dL" },
    { value: 2, label: "2 - Creatinina 2,0-3,4 mg/dL" },
    { value: 3, label: "3 - Creatinina 3,5-4,9 ou diurese < 500 mL/dia" },
    { value: 4, label: "4 - Creatinina >= 5,0 ou diurese < 200 mL/dia" },
  ],
} as const;

function ScoreFormSOFA() {
  const [respiratory, setRespiratory] = useState(0);
  const [coagulation, setCoagulation] = useState(0);
  const [liver, setLiver] = useState(0);
  const [cardiovascular, setCardiovascular] = useState(0);
  const [cns, setCns] = useState(0);
  const [renal, setRenal] = useState(0);
  const score = respiratory + coagulation + liver + cardiovascular + cns + renal;
  const interpretation =
    score >= 12
      ? "Disfuncao organica muito grave; alto risco e necessidade de suporte intensivo."
      : score >= 8
        ? "Disfuncao organica importante; acompanhar tendencia e suporte por sistemas."
        : score >= 2
          ? "Disfuncao organica presente; em contexto infeccioso, considere sepse conforme quadro clinico."
          : "Baixa carga de disfuncao organica no momento.";
  const result = `SOFA: ${score}/24\n${interpretation}\n\nComponentes: respiratorio ${respiratory}, coagulacao ${coagulation}, hepatico ${liver}, cardiovascular ${cardiovascular}, SNC ${cns}, renal ${renal}.\n\nRef: Vincent et al. Intensive Care Med 1996; Sepsis-3 JAMA 2016.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">SOFA</h3>
      <ScoreClinicalContext slug="sofa" />
      <SelectField label="Respiratorio" value={respiratory} onChange={setRespiratory} options={[...sofaOptions.respiratory]} />
      <SelectField label="Coagulacao" value={coagulation} onChange={setCoagulation} options={[...sofaOptions.coagulation]} />
      <SelectField label="Hepatico" value={liver} onChange={setLiver} options={[...sofaOptions.liver]} />
      <SelectField label="Cardiovascular" value={cardiovascular} onChange={setCardiovascular} options={[...sofaOptions.cardiovascular]} />
      <SelectField label="Neurologico" value={cns} onChange={setCns} options={[...sofaOptions.cns]} />
      <SelectField label="Renal" value={renal} onChange={setRenal} options={[...sofaOptions.renal]} />
      <ResultBox result={result} badge={`${score}/24`} />
    </div>
  );
}

function scoreNews2RespiratoryRate(value: number): number {
  if (value <= 8 || value >= 25) return 3;
  if (value >= 21) return 2;
  if (value >= 9 && value <= 11) return 1;
  return 0;
}

function scoreNews2Spo2(value: number, scale: "scale1" | "scale2", supplementalOxygen: boolean): number {
  if (scale === "scale1") {
    if (value <= 91) return 3;
    if (value <= 93) return 2;
    if (value <= 95) return 1;
    return 0;
  }

  if (value <= 83) return 3;
  if (value <= 85) return 2;
  if (value <= 87) return 1;
  if (value <= 92) return 0;
  if (!supplementalOxygen) return 0;
  if (value <= 94) return 1;
  if (value <= 96) return 2;
  return 3;
}

function scoreNews2Sbp(value: number): number {
  if (value <= 90 || value >= 220) return 3;
  if (value <= 100) return 2;
  if (value <= 110) return 1;
  return 0;
}

function scoreNews2HeartRate(value: number): number {
  if (value <= 40 || value >= 131) return 3;
  if (value >= 111) return 2;
  if (value <= 50 || value >= 91) return 1;
  return 0;
}

function scoreNews2Temperature(value: number): number {
  if (value <= 35) return 3;
  if (value >= 39.1) return 2;
  if (value <= 36 || value >= 38.1) return 1;
  return 0;
}

function ScoreFormNEWS2() {
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [spo2, setSpo2] = useState(98);
  const [spo2Scale, setSpo2Scale] = useState<"scale1" | "scale2">("scale1");
  const [supplementalOxygen, setSupplementalOxygen] = useState(false);
  const [systolicBp, setSystolicBp] = useState(120);
  const [heartRate, setHeartRate] = useState(80);
  const [consciousness, setConsciousness] = useState<"alert" | "cvpu">("alert");
  const [temperature, setTemperature] = useState(36.8);

  const componentScores = {
    respiratory: scoreNews2RespiratoryRate(respiratoryRate),
    spo2: scoreNews2Spo2(spo2, spo2Scale, supplementalOxygen),
    oxygen: supplementalOxygen ? 2 : 0,
    systolicBp: scoreNews2Sbp(systolicBp),
    heartRate: scoreNews2HeartRate(heartRate),
    consciousness: consciousness === "alert" ? 0 : 3,
    temperature: scoreNews2Temperature(temperature),
  };
  const score = Object.values(componentScores).reduce((acc, value) => acc + value, 0);
  const hasSingleThree = Object.values(componentScores).some((value) => value === 3);
  const risk =
    score >= 7
      ? "Alto risco - resposta de emergencia / avaliacao imediata."
      : score >= 5
        ? "Risco medio - revisao clinica urgente."
        : hasSingleThree
          ? "Alerta por parametro extremo - escalonar mesmo com total baixo."
          : score >= 1
            ? "Baixo risco - aumentar frequencia de monitorizacao conforme protocolo."
            : "Muito baixo risco no momento.";
  const result = `NEWS2: ${score}\n${risk}\n\nComponentes: FR ${componentScores.respiratory}, SpO2 ${componentScores.spo2}, O2 ${componentScores.oxygen}, PAS ${componentScores.systolicBp}, FC ${componentScores.heartRate}, consciencia ${componentScores.consciousness}, temperatura ${componentScores.temperature}.\n\nRef: Royal College of Physicians NEWS2, 2017.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">NEWS2</h3>
      <ScoreClinicalContext slug="news2" />
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="FR" value={respiratoryRate} onChange={setRespiratoryRate} unit="irpm" min={0} />
        <NumberField label="SpO2" value={spo2} onChange={setSpo2} unit="%" min={0} max={100} />
      </div>
      <SelectField
        label="Escala de SpO2"
        value={spo2Scale}
        onChange={setSpo2Scale}
        options={[
          { value: "scale1", label: "Escala 1 - padrao" },
          { value: "scale2", label: "Escala 2 - hipercapnia documentada / alvo 88-92%" },
        ]}
      />
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-brand-300">
        <input
          type="checkbox"
          checked={supplementalOxygen}
          onChange={(event) => setSupplementalOxygen(event.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-brand-600"
        />
        <span className="text-small text-neutral-700">Em oxigenio suplementar</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="PAS" value={systolicBp} onChange={setSystolicBp} unit="mmHg" min={0} />
        <NumberField label="FC" value={heartRate} onChange={setHeartRate} unit="bpm" min={0} />
      </div>
      <SelectField
        label="Consciencia"
        value={consciousness}
        onChange={setConsciousness}
        options={[
          { value: "alert", label: "Alerta" },
          { value: "cvpu", label: "Nova confusao, voz, dor ou irresponsivo (CVPU)" },
        ]}
      />
      <NumberField label="Temperatura" value={temperature} onChange={setTemperature} unit="°C" min={25} max={45} step={0.1} />
      <ResultBox result={result} badge={`${score} pts`} />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-500">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        {unit && <span className="text-caption text-neutral-500">{unit}</span>}
      </div>
    </div>
  );
}

function ScoreFormRASS() {
  const rassLevels = [
    { value: 4, label: "+4 - Combativo: violento, perigo imediato para equipe" },
    { value: 3, label: "+3 - Muito agitado: remove tubos/cateteres, agressivo" },
    { value: 2, label: "+2 - Agitado: movimentos frequentes, briga com ventilador" },
    { value: 1, label: "+1 - Inquieto: ansioso, sem agressividade" },
    { value: 0, label: "0 - Alerta e calmo" },
    { value: -1, label: "-1 - Sonolento: contato visual > 10 s ao chamado" },
    { value: -2, label: "-2 - Sedacao leve: contato visual < 10 s ao chamado" },
    { value: -3, label: "-3 - Sedacao moderada: movimento ao chamado, sem contato visual" },
    { value: -4, label: "-4 - Sedacao profunda: responde apenas a estimulo fisico" },
    { value: -5, label: "-5 - Inarousable: sem resposta a voz ou estimulo fisico" },
  ];
  const [score, setScore] = useState(0);
  const interpretation =
    score >= 2
      ? "Agitacao importante: avaliar dor, delirium, hipoxemia, abstinencia e seguranca."
      : score === 1
        ? "Inquietacao leve: investigar desconforto e necessidade de ajuste terapeutico."
        : score === 0
          ? "Alvo frequente em sedacao leve: alerta e calmo."
          : score >= -2
            ? "Sedacao leve: geralmente compativel com estrategias de despertar e avaliacao de delirium."
            : score >= -3
              ? "Sedacao moderada: revisar meta e necessidade de sedativos."
              : "Sedacao profunda: adequada apenas se houver indicacao especifica e meta documentada.";
  const result = `RASS: ${score > 0 ? `+${score}` : score}\n${interpretation}\n\nRef: Sessler et al. Am J Respir Crit Care Med 2002.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">RASS</h3>
      <ScoreClinicalContext slug="rass" />
      <SelectField label="Estado observado" value={score} onChange={setScore} options={rassLevels} />
      <ResultBox result={result} badge={score > 0 ? `+${score}` : String(score)} />
    </div>
  );
}

function ScoreFormQSOFA() {
  const [fr, setFr] = useState(false);
  const [alteracao, setAlteracao] = useState(false);
  const [pas, setPas] = useState(false);
  const score = [fr, alteracao, pas].filter(Boolean).length;
  const risk = score >= 2 ? "ALTO — alto risco de sepse (considere UTI)" : score === 1 ? "INTERMEDIÁRIO" : "BAIXO";
  const result = `qSOFA: ${score}/3\nRisco: ${risk}\nCritérios positivos: ${[fr && "FR ≥ 22 irpm", alteracao && "Alteração mental (GCS < 15)", pas && "PAS ≤ 100 mmHg"].filter(Boolean).join("; ") || "nenhum"}\n\nRef: Singer et al. JAMA 2016.`;

  return (
    <div className="space-y-3">
      <h3 className="text-small font-bold uppercase tracking-wider text-neutral-400">qSOFA (sepse)</h3>
      <ScoreClinicalContext slug="qsofa" />
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

function ScoreFormGlasgow() {
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
      <ScoreClinicalContext slug="glasgow" />
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

function ScoreFormWellsTEP() {
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
      <ScoreClinicalContext slug="wells-tep" />
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

function ScoreFormCHADSVASc() {
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
      <ScoreClinicalContext slug="cha2ds2-vasc" />
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

const SCORE_FORM_MAP: Record<string, () => JSX.Element> = {
  qsofa: ScoreFormQSOFA,
  sofa: ScoreFormSOFA,
  news2: ScoreFormNEWS2,
  glasgow: ScoreFormGlasgow,
  rass: ScoreFormRASS,
  "wells-tep": ScoreFormWellsTEP,
  "cha2ds2-vasc": ScoreFormCHADSVASc,
};

export const SCORE_FORM_SLUGS = Object.keys(SCORE_FORM_MAP);

export function getScoreClinicalTags(slug: string): ClinicalTag[] {
  return (SCORE_CLINICAL_INFO[slug]?.tags ?? []).filter(
    (tag) => tag.label !== "Especialidade/doença",
  );
}

export function hasScoreForm(slug: string): boolean {
  return slug in SCORE_FORM_MAP;
}

export function ScoreForm({ slug }: { slug: string }) {
  const Component = SCORE_FORM_MAP[slug];
  if (!Component) return null;
  return <Component />;
}
