const STEPS = [
  {
    n: "01",
    title: "Crie seu slug em 30 segundos",
    body: "Nome, nível de formação e hospital. Sem senha, sem e-mail de confirmação. Você sai com sua URL pronta.",
  },
  {
    n: "02",
    title: "Anote durante a consulta",
    body: "Abra invertexto-hc/seu-slug em qualquer dispositivo. O que você digita é salvo automaticamente, a cada 500 ms.",
  },
  {
    n: "03",
    title: "Apresente ao preceptor",
    body: "Abra a mesma URL no computador da preceptoria. Sem PDF, sem e-mail, sem impressão.",
  },
  {
    n: "04",
    title: "Use as ferramentas integradas",
    body: "Sidebar com calculadoras, escores, CID-10 e guidelines — colando o resultado direto no seu bloco.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-neutral-50">
      <div className="container-app py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline uppercase text-brand-700">Fluxo de uso</p>
          <h2 className="mt-3 text-h2 text-neutral-900">Como funciona, em 4 passos.</h2>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span className="font-mono text-h2 text-brand-600">{step.n}</span>
              <h3 className="mt-3 text-h4 text-neutral-800">{step.title}</h3>
              <p className="mt-2 text-body text-neutral-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
