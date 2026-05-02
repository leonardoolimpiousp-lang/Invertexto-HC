import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-app flex h-16 items-center justify-between">
        <Logo href="/" />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          <Link href="#features"     className="text-body text-neutral-600 transition-colors hover:text-brand-700">Ferramentas</Link>
          <Link href="#como-funciona" className="text-body text-neutral-600 transition-colors hover:text-brand-700">Como funciona</Link>
          <Link href="#para-quem"     className="text-body text-neutral-600 transition-colors hover:text-brand-700">Para quem</Link>
        </nav>

        <Link href="/cadastro">
          <Button size="sm">Começar grátis</Button>
        </Link>
      </div>
    </header>
  );
}
