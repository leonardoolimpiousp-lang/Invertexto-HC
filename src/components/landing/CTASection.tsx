import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-[#042f2e] text-white">
      <div className="container-app py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-h2 md:text-h1">
          Pronto para abrir uma aba a menos no plantão?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-body-lg text-brand-100">
          Crie seu slug agora — em 30 segundos você está anotando.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Começar grátis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
