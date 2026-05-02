import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white"
        aria-hidden
      />
      <div className="container-app py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="brand" className="mx-auto mb-6">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Beta fechado · HC-FMUSP
          </Badge>

          <h1 className="text-h1 md:text-display text-neutral-900">
            O navegador clínico do{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              residente médico
            </span>
            .
          </h1>

          <p className="mt-5 text-subtitle text-neutral-600 md:text-body-lg">
            Um notepad clínico de URL pública com auto-save — e ao lado, todas as ferramentas que
            você abre em 8 abas diferentes durante a consulta. Sem login, sem fricção, sem custo.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/cadastro">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Criar meu notepad
              </Button>
            </Link>
            <Link href="#como-funciona">
              <Button size="lg" variant="secondary">
                Como funciona
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-small text-neutral-500">
            Gratuito · Sem cadastro de senha · Funciona em qualquer dispositivo
          </p>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
        {/* fake browser chrome */}
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-error-soft border border-error-strong/40" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-warning-soft border border-warning-strong/40" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-success-soft border border-success-strong/40" aria-hidden />
          <div className="ml-4 flex-1 rounded-md border border-neutral-200 bg-white px-3 py-1 font-mono text-small text-neutral-500">
            invertexto-hc.com.br/<span className="text-brand-700">joao-silva</span>
          </div>
        </div>

        <div className="grid grid-cols-12 min-h-[320px]">
          {/* sidebar mock */}
          <aside className="col-span-2 border-r border-neutral-200 bg-neutral-50 p-3">
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-10 rounded-md ${i === 0 ? "bg-brand-100" : "bg-white border border-neutral-200"}`}
                />
              ))}
            </div>
          </aside>

          {/* notepad mock */}
          <div className="col-span-10 p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-overline uppercase text-brand-700">Bloco do plantão</p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-caption text-success-base">
                <span className="h-1.5 w-1.5 rounded-full bg-success-strong" aria-hidden />
                Salvo às 14:32
              </span>
            </div>
            <div className="space-y-2 font-mono text-small text-neutral-700">
              <p># Paciente 03 · 67a · HAS, DM2</p>
              <p>Queixa: dispneia há 3 dias, ortopneia.</p>
              <p>Exame: FC 102, PA 142x88, SatO₂ 91% AA.</p>
              <p>Ausculta: estertores bibasais.</p>
              <p className="text-brand-700">→ Wells modificado: <span className="rounded bg-brand-50 px-1.5">3.5 · risco moderado</span></p>
              <p className="text-neutral-400">_</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
