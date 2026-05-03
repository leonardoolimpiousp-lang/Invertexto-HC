# Invertexto-HC

Plataforma web operacional para médicos, residentes e internos do Hospital das Clínicas — notepad clínico de URL pública com auto-save, e arsenal de ferramentas clínicas integradas (calculadoras, escores, CID-10, antimicrobianos, etc.).

> Documentação de produto e identidade visual: ver `.llm/invertexto-hc-prd.html` e `.llm/design-system.md`.

## Stack

- **Next.js 14** (App Router, TypeScript strict)
- **Tailwind CSS** com tokens espelhados do design system
- **Supabase** (Postgres) — sem auth no MVP, RLS aberto + rate-limit
- **Lucide React** (iconografia)
- **Vercel** (hospedagem)

## Setup local

```bash
# 1) Instalar dependências
npm install

# 2) Configurar variáveis de ambiente
cp .env.local.example .env.local
# preencha os valores (URL e anon key do Supabase)

# 3) Aplicar schema no Supabase (SQL Editor)
# ver supabase/schema.sql

# 4) Rodar dev server
npm run dev
```

## Estrutura

```
src/
  app/                    rotas (App Router)
    (marketing)/          landing pública
    cadastro/             criação de slug
    [username]/           workspace do residente (notepad + sidebar)
  components/             UI por domínio
    ui/                   primitives (Button, Card, Input...)
    landing/              seções da landing
    workspace/            sidebar, notepad, tool panels
  lib/                    supabase clients, utils, constants
  types/                  tipos compartilhados
supabase/
  schema.sql              migration inicial
.llm/                     PRD + design system (fonte de verdade)
```

## Princípios não-negociáveis

1. **Zero fricção de adoção.** Sem login no MVP. Slug aleatório de 12+ chars como default.
2. **Auto-save imperceptível.** Debounce 500ms, sem botão "salvar".
3. **Mobile-first.** Sidebar colapsa em drawer abaixo de 768px.
4. **Aderência ao design system.** Tokens em `tailwind.config.ts` espelham `.llm/design-system.md`.

## Roadmap

- **Fase 1 (atual)**: MVP — notepad + sidebar de ferramentas (stub).
- **Fase 2**: Auth opcional, PWA, compartilhamento residente↔preceptor.
- **Fase 3**: IA (sumarização, extração estruturada), expansão multi-hospital.
# Invertexto-HC
# Invertexto-HC
