import { TOOLS } from "@/lib/constants/tools";
import { Card, CardTitle, CardBody } from "@/components/ui/Card";

export function Features() {
  return (
    <section id="features" className="bg-white">
      <div className="container-app py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-brand-700">Ferramentas integradas</p>
          <h2 className="mt-3 text-h2 text-neutral-900">
            Tudo que você abre em 8 abas, em uma única tela.
          </h2>
          <p className="mt-4 text-body-lg text-neutral-600">
            Curadoria mensal por preceptores. Atualizado até 2026. Sem ads, sem rodapé poluído.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Card key={tool.id} variant="default" interactive>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <tool.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <CardTitle>{tool.label}</CardTitle>
                    <span className="font-mono text-caption text-neutral-400">{tool.prdRef}</span>
                  </div>
                  <CardBody className="mt-1">{tool.description}</CardBody>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
