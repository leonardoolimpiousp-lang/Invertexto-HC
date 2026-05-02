import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { RegistrationForm } from "@/components/cadastro/RegistrationForm";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie seu notepad clínico em 30 segundos. Sem senha, sem cartão.",
};

const HIGHLIGHTS = [
  { icon: Zap,         title: "30 segundos",       body: "Você sai com sua URL pronta para uso." },
  { icon: Lock,        title: "Sem senha",         body: "Identidade pelo slug — recuperação por confiança." },
  { icon: ShieldCheck, title: "Compromisso clínico", body: "Sem dados identificáveis. Não substitui prontuário." },
];

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-app flex h-16 items-center justify-between">
          <Logo href="/" size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-small font-semibold text-neutral-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
          </Link>
        </div>
      </header>

      <main className="container-app py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          {/* Form */}
          <section className="md:col-span-7">
            <p className="text-overline uppercase text-brand-700">Cadastro</p>
            <h1 className="mt-2 text-h1 text-neutral-900">Crie seu notepad clínico</h1>
            <p className="mt-3 text-body-lg text-neutral-600">
              Três campos. Sem senha. Sua URL é gerada automaticamente — você pode personalizar
              depois se quiser.
            </p>

            <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
              <RegistrationForm />
            </div>
          </section>

          {/* Side panel */}
          <aside className="md:col-span-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:sticky md:top-8">
              <p className="text-overline uppercase text-brand-700">O que esperar</p>
              <h2 className="mt-2 text-h3 text-neutral-800">Adoção em segundos.</h2>

              <ul className="mt-6 space-y-5">
                {HIGHLIGHTS.map((h) => (
                  <li key={h.title} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-100 text-brand-700">
                      <h.icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="text-body font-semibold text-neutral-800">{h.title}</p>
                      <p className="text-small text-neutral-600">{h.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-md border-l-4 border-warning-strong bg-warning-soft p-4">
                <p className="text-small text-warning-base">
                  <strong className="font-semibold">Aviso LGPD/CFM.</strong> O notepad é público
                  pela URL. Não inclua nome, RG, CPF ou prontuário identificável. Use iniciais ou
                  códigos internos.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
