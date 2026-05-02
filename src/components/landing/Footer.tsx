import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-app py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Logo size="sm" />
            <p className="text-small text-neutral-500">
              Apoio à decisão clínica · não substitui julgamento médico.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-small text-neutral-500" aria-label="Rodapé">
            <Link href="#features" className="hover:text-brand-700">Ferramentas</Link>
            <Link href="#como-funciona" className="hover:text-brand-700">Como funciona</Link>
            <Link href="/termos" className="hover:text-brand-700">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand-700">Privacidade</Link>
          </nav>
        </div>
        <p className="mt-6 text-caption text-neutral-400">
          © {new Date().getFullYear()} Invertexto-HC · Beta fechado · v0.1
        </p>
      </div>
    </footer>
  );
}
