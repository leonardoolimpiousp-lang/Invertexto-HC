import Link from "next/link";
import { ArrowRight, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-app flex h-16 items-center">
          <Logo href="/" size="sm" />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <FileQuestion className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-6 text-h2 text-neutral-900">Notepad não encontrado</h1>
          <p className="mt-3 text-body text-neutral-600">
            Esse slug ainda não foi criado. Você pode reservá-lo agora — gratuitamente, em 30
            segundos.
          </p>
          <div className="mt-8">
            <Link href="/cadastro">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Criar este notepad
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
