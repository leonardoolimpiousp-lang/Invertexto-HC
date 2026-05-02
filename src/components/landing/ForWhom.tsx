import { Stethoscope, GraduationCap, UserCog } from "lucide-react";
import { Card, CardTitle, CardBody } from "@/components/ui/Card";

const PROFILES = [
  {
    icon: Stethoscope,
    title: "Residentes",
    body: "Reduza o tempo entre atendimento e apresentação ao preceptor. Mantenha o raciocínio clínico em uma única tela.",
  },
  {
    icon: GraduationCap,
    title: "Internos",
    body: "Construa repertório de escores, guidelines e CID-10 com curadoria de preceptores reais do HC.",
  },
  {
    icon: UserCog,
    title: "Preceptores",
    body: "Receba o caso pronto na sua tela. Beneficiário direto da redução de fricção da equipe.",
  },
];

export function ForWhom() {
  return (
    <section id="para-quem" className="bg-white">
      <div className="container-app py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-brand-700">Para quem é</p>
          <h2 className="mt-3 text-h2 text-neutral-900">
            Construído para o fluxo operacional do hospital-escola.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PROFILES.map((p) => (
            <Card key={p.title} variant="accent-brand">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <p.icon className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="mt-4">{p.title}</CardTitle>
              <CardBody className="mt-2">{p.body}</CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
