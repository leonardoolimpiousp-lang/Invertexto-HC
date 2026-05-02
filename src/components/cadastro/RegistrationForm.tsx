"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EDUCATION_LEVELS, SUGGESTED_HOSPITALS } from "@/lib/constants/levels";
import { createProfile, type CadastroState } from "@/app/cadastro/actions";

const initialState: CadastroState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      fullWidth
      loading={pending}
      rightIcon={!pending ? <ArrowRight className="h-4 w-4" /> : undefined}
    >
      Criar meu notepad
    </Button>
  );
}

export function RegistrationForm() {
  const [state, formAction] = useFormState(createProfile, initialState);
  const [showCustomSlug, setShowCustomSlug] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        label="Nome completo"
        name="fullName"
        autoComplete="name"
        required
        placeholder="Ex.: Maria Souza"
        error={state.fieldErrors?.fullName}
      />

      <Select
        label="Nível de formação"
        name="level"
        required
        defaultValue=""
        placeholder="Selecione seu nível"
        options={EDUCATION_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
        error={state.fieldErrors?.level}
      />

      <Input
        label="Hospital ou instituição"
        name="hospital"
        list="hospitals"
        autoComplete="organization"
        required
        placeholder="Ex.: HCFMUSP — Hospital das Clínicas FMUSP"
        helperText="Você pode digitar livremente; usamos as sugestões apenas para acelerar."
        error={state.fieldErrors?.hospital}
      />
      <datalist id="hospitals">
        {SUGGESTED_HOSPITALS.map((h) => (
          <option key={h} value={h} />
        ))}
      </datalist>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowCustomSlug((v) => !v)}
          className="self-start text-small font-semibold text-brand-700 hover:text-brand-600"
        >
          {showCustomSlug
            ? "← usar slug aleatório (recomendado)"
            : "personalizar minha URL"}
        </button>

        {showCustomSlug && (
          <Input
            label="Sua URL personalizada"
            name="slug"
            placeholder="ex.: maria-souza"
            helperText="invertexto-hc.com.br/<sua-url> · letras, números e hífens."
            error={state.fieldErrors?.slug}
          />
        )}
      </div>

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-error-strong/30 bg-error-soft p-3 text-small text-error-base"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{state.message}</span>
        </div>
      )}

      <SubmitButton />

      <p className="text-small text-neutral-500">
        Ao continuar você concorda com nosso compromisso clínico:{" "}
        <strong className="text-neutral-700">
          não inserir dados identificáveis de pacientes
        </strong>{" "}
        no notepad. Esta plataforma é apoio à decisão e não substitui prontuário.
      </p>
    </form>
  );
}
