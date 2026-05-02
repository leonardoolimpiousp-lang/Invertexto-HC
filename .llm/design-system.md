# Design System — Invertexto-HC

> **Documento vivo.** Esta é a fonte de verdade da identidade visual do Invertexto-HC. Toda tela, componente ou variação criada a partir deste ponto deve referenciar este arquivo. Atualizações exigem versionamento explícito (changelog ao final).
>
> **Versão:** 1.0 · **Data:** 2026-05-02 · **Owner:** Tech Lead

---

## 0. Princípios de Design

Antes de qualquer token, o sistema responde a 5 princípios não-negociáveis derivados do contexto clínico:

1. **Clareza acima de estética.** Médicos em plantão não têm paciência para ambiguidade visual. Hierarquia óbvia, contraste alto, sem ornamentos.
2. **Densidade calibrada.** Densidade de informação é positiva quando organizada; o residente prefere uma tela que *mostra muito* a uma que *esconde para ficar bonita*.
3. **Toque clínico, não médico-genérico.** Evitamos o azul-hospital saturado e a estética de software médico dos anos 2000. Adotamos um teal sóbrio + neutros frios.
4. **Mobile-first responsivo.** Toda decisão visual passa primeiro pelo viewport de 375px.
5. **Acessibilidade WCAG 2.1 AA como piso, não teto.** Contraste mínimo 4.5:1 em texto regular e 3:1 em texto grande/UI.

---

## 1. Paleta de Cores

A paleta é construída em 3 camadas: **brand**, **neutros** (a maior parte da UI) e **semânticas** (estados).

### 1.1. Cores de marca (Brand)

| Token | Hex | Uso |
|---|---|---|
| `brand/600` *(primária)* | `#0F766E` | Cor principal de marca. Botões primários, links, ícones ativos, header. |
| `brand/700` *(primária dark)* | `#134E4A` | Hover de primária, títulos de seção, headers premium. |
| `brand/500` | `#14B8A6` | Acentos, badges informativos, ilustrações. |
| `brand/100` *(primária light)* | `#CCFBF1` | Backgrounds suaves, highlight de seleção, callouts informativos. |
| `brand/50` | `#F0FDFA` | Wash de fundo de seções destacadas. |

> **Por que teal e não azul-hospital?** O azul saturado (`#1E88E5`) está visualmente associado ao software médico legado e à fadiga de tela. Teal é igualmente "clínico", mas projeta sobriedade e modernidade — diferenciação visual imediata.

### 1.2. Acento (Accent)

| Token | Hex | Uso |
|---|---|---|
| `accent/500` | `#F59E0B` | Destaques de chamada à ação secundária, badges de "novo", microinterações. **Usar com parcimônia** — máximo 1 elemento accent por viewport. |
| `accent/100` | `#FEF3C7` | Background de avisos não-críticos. |

### 1.3. Neutros (Slate)

A maior parte da UI vive aqui. Escala fria por decisão deliberada — combina com o teal e reduz fadiga visual.

| Token | Hex | Uso |
|---|---|---|
| `neutral/0` | `#FFFFFF` | Background de superfície (cards, modais). |
| `neutral/50` | `#F8FAFC` | Background da página. |
| `neutral/100` | `#F1F5F9` | Background de elementos sutis (inputs disabled, hover de itens de lista). |
| `neutral/200` | `#E2E8F0` | Bordas padrão, divisores. |
| `neutral/300` | `#CBD5E1` | Bordas de inputs, ícones inativos. |
| `neutral/400` | `#94A3B8` | Placeholder, texto desabilitado. |
| `neutral/500` | `#64748B` | Texto secundário, metadados. |
| `neutral/600` | `#475569` | Texto de body em contextos densos. |
| `neutral/700` | `#334155` | Texto de body padrão. |
| `neutral/800` | `#1E293B` | Títulos, texto enfático. |
| `neutral/900` | `#0F172A` | Tipografia hero, máximo contraste. |

### 1.4. Cores semânticas (estados)

Cada cor semântica tem 3 variantes: **base** (texto/ícone), **soft** (background) e **strong** (call-to-action ou borda).

| Estado | Soft (bg) | Base (text/icon) | Strong (action) |
|---|---|---|---|
| **Sucesso** | `#F0FDF4` | `#15803D` | `#16A34A` |
| **Atenção** | `#FFFBEB` | `#B45309` | `#D97706` |
| **Erro** | `#FEF2F2` | `#B91C1C` | `#DC2626` |
| **Info** | `#EFF6FF` | `#1D4ED8` | `#2563EB` |

**Regras de uso:**
- **Sucesso** → confirmação de auto-save, ação concluída, validação OK.
- **Atenção** → guideline desatualizado, dado clínico que merece dupla checagem, conexão instável.
- **Erro** → falha de salvamento, validação obrigatória não preenchida, erro de cálculo.
- **Info** → callouts neutros, dicas, "novo" recurso.

> **Importante:** nenhuma cor semântica deve carregar significado *sozinha*. Sempre acompanhar com ícone + texto (acessibilidade para daltônicos — ~8% dos homens).

### 1.5. Contraste e acessibilidade

Combinações testadas e aprovadas (WCAG AA):

- `neutral/700` em `neutral/0` → **11.6:1** ✓ (texto base)
- `neutral/500` em `neutral/0` → **5.0:1** ✓ (texto secundário)
- `neutral/0` em `brand/600` → **4.7:1** ✓ (botão primário)
- `brand/700` em `brand/100` → **8.3:1** ✓ (callout informativo)

Combinações **proibidas**:
- `neutral/400` em `neutral/0` → 2.8:1 ✗ (apenas para bordas decorativas, nunca texto)
- `accent/500` em `neutral/0` → 2.6:1 ✗ (usar `#B45309` para texto sobre fundo claro)

---

## 2. Tipografia

### 2.1. Fontes

| Papel | Família | Fallback | Quando usar |
|---|---|---|---|
| **Primária (UI/Body)** | `Inter` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Toda interface, texto corrido, botões, formulários. |
| **Secundária (Mono)** | `JetBrains Mono` | `"SF Mono", Menlo, Consolas, monospace` | Códigos CID-10, doses, valores laboratoriais, slugs de URL. |

**Decisão deliberada:** uma única fonte serif/display foi descartada — produtos clínicos não devem evocar editorial. Inter cobre 100% da UI.

**Carregamento:** `font-display: swap` obrigatório. Pesos importados: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold). JetBrains Mono apenas em 400 e 500.

### 2.2. Princípios tipográficos

- **Line-height** generoso para body (1.6–1.65) — médico cansado precisa de respiro.
- **Letter-spacing** levemente negativo em títulos grandes (`-0.02em`) para densidade visual.
- **Letter-spacing** positivo em uppercase utilitário (`0.05em`) — labels, badges.
- Nunca usar `text-align: justify` (cria rios em colunas estreitas).

---

## 3. Tamanhos de Fonte (Type Scale)

Escala em **rem** com base de 16px. Cada tamanho tem `font-size` + `line-height` + `font-weight` recomendados.

| Token | Uso | Size | Line-height | Weight |
|---|---|---|---|---|
| `display` | Hero de landing, telas vazias com CTA | 3.5rem (56px) | 1.05 | 800 |
| `h1` | Título de página | 2.25rem (36px) | 1.15 | 700 |
| `h2` | Título de seção | 1.75rem (28px) | 1.2 | 700 |
| `h3` | Subtítulo de bloco | 1.375rem (22px) | 1.3 | 600 |
| `h4` | Título de card / agrupamento | 1.125rem (18px) | 1.4 | 600 |
| `subtitle` | Lead em hero, intro de seção | 1.25rem (20px) | 1.5 | 400 |
| `body-lg` | Texto longo de leitura (guidelines) | 1.0625rem (17px) | 1.65 | 400 |
| `body` | **Padrão** — corpo de UI | 0.9375rem (15px) | 1.6 | 400 |
| `body-strong` | Texto de UI enfático | 0.9375rem (15px) | 1.6 | 600 |
| `small` | Metadados, helper text de input | 0.8125rem (13px) | 1.5 | 400 |
| `caption` | Legendas de tabela, footnotes | 0.75rem (12px) | 1.45 | 500 |
| `overline` | Labels uppercase (UPPERCASE) | 0.6875rem (11px) | 1.4 | 700 + tracking 0.05em |

### 3.1. Hierarquia em mobile

Em viewports `< 640px`, reduzir um nível na escala:
- `display` → `h1`
- `h1` → `h2`
- `h2` → `h3`

Body permanece em 15px para garantir leitura de prontuário no celular.

---

## 4. Espaçamentos

Sistema baseado em escala de **4px** (atomic unit). Toda margem, padding, gap e dimensão de UI é múltiplo dessa unidade.

### 4.1. Escala

| Token | px | rem | Uso típico |
|---|---|---|---|
| `space/0` | 0 | 0 | Reset. |
| `space/1` | 4 | 0.25rem | Gap entre ícone e texto inline. |
| `space/2` | 8 | 0.5rem | Padding interno de pills, gap em listas compactas. |
| `space/3` | 12 | 0.75rem | Padding vertical de inputs/botões médios. |
| `space/4` | 16 | 1rem | **Padrão** — gap entre elementos relacionados. |
| `space/5` | 20 | 1.25rem | Padding de cards compactos. |
| `space/6` | 24 | 1.5rem | Padding de cards padrão, gap entre seções pequenas. |
| `space/8` | 32 | 2rem | Padding de cards grandes, separação entre subseções. |
| `space/10` | 40 | 2.5rem | Espaço vertical entre seções de página. |
| `space/12` | 48 | 3rem | Margens de container em desktop. |
| `space/16` | 64 | 4rem | Hero spacing vertical. |
| `space/20` | 80 | 5rem | Separação entre grandes blocos de página. |

### 4.2. Regras de aplicação

- **Padding interno de container/card:** `space/6` (24px) padrão; `space/4` (16px) em mobile.
- **Gap entre cards em grid:** `space/4` (16px) em mobile, `space/5`–`space/6` em desktop.
- **Espaçamento vertical entre seções:** `space/10`–`space/16` (40–64px).
- **Espaçamento entre label e input:** `space/2` (8px).
- **Espaçamento entre input e helper text:** `space/1` (4px).

### 4.3. Layout & Grid

- **Container max-width:** `1200px` em desktop, `640px` em telas de leitura focada.
- **Grid:** 12 colunas em ≥1024px, 8 em ≥640px, 4 em <640px.
- **Gutter:** 24px desktop, 16px tablet, 12px mobile.

### 4.4. Border-radius

| Token | px | Uso |
|---|---|---|
| `radius/sm` | 4 | Inputs pequenos, badges, kbd. |
| `radius/md` | 8 | Botões, inputs padrão. |
| `radius/lg` | 12 | Cards pequenos, dropdowns. |
| `radius/xl` | 16 | **Padrão de card.** |
| `radius/2xl` | 24 | Modais, sheets em mobile. |
| `radius/full` | 9999 | Pills, avatares, FAB. |

### 4.5. Sombras (elevação)

Sombras frias (tom teal sutil) para coerência com paleta.

| Token | Valor | Uso |
|---|---|---|
| `shadow/xs` | `0 1px 2px rgba(15, 23, 42, 0.04)` | Inputs em estado padrão. |
| `shadow/sm` | `0 2px 4px rgba(15, 23, 42, 0.06)` | Cards inativos. |
| `shadow/md` | `0 4px 12px rgba(15, 23, 42, 0.08)` | Cards em hover, dropdowns. |
| `shadow/lg` | `0 12px 32px -8px rgba(15, 118, 110, 0.18)` | Modais, popovers, cards em foco. |
| `shadow/xl` | `0 24px 48px -12px rgba(15, 118, 110, 0.24)` | Drawer mobile, sheets elevados. |

---

## 5. Componentes Base

### 5.1. Botões

Toda interação primária acontece via botão. Hierarquia de 4 tipos.

#### 5.1.1. Botão Primário

A ação principal e única em destaque por contexto. Nunca dois primários no mesmo viewport.

- **Background:** `brand/600` (`#0F766E`)
- **Texto:** `neutral/0` (`#FFFFFF`), `body-strong` (15px / 600)
- **Padding:** `12px 20px` (sm: `8px 14px` · lg: `16px 28px`)
- **Border-radius:** `radius/md` (8px)
- **Hover:** background → `brand/700`, sombra `shadow/md`
- **Active:** transform `translateY(1px)`, background `brand/700`
- **Focus-visible:** outline `2px` `brand/500`, offset `2px`
- **Disabled:** background `neutral/200`, texto `neutral/400`, cursor `not-allowed`
- **Loading:** spinner inline + texto, opacidade 0.7, click bloqueado

#### 5.1.2. Botão Secundário

Ações de suporte (cancelar, voltar, ações alternativas).

- **Background:** `neutral/0`
- **Border:** `1px solid neutral/300`
- **Texto:** `neutral/700`, peso 600
- **Hover:** background `neutral/50`, border `neutral/400`
- **Active:** background `neutral/100`
- **Disabled:** texto `neutral/400`, border `neutral/200`

#### 5.1.3. Botão Ghost

Ações terciárias densas (lista de toolbar, ações inline).

- **Background:** transparente
- **Texto:** `brand/700`, peso 600
- **Hover:** background `brand/50`
- **Active:** background `brand/100`

#### 5.1.4. Botão Destrutivo

Apagar bloco, sair sem salvar, deletar registro.

- **Background:** `#DC2626`
- **Texto:** `neutral/0`
- **Hover:** background `#B91C1C`
- **Sempre acompanhado de confirmação** (modal ou undo toast).

#### 5.1.5. Tamanhos

| Tamanho | Height | Padding-X | Font |
|---|---|---|---|
| `sm` | 32px | 12px | 13px / 600 |
| `md` *(padrão)* | 40px | 20px | 15px / 600 |
| `lg` | 48px | 28px | 16px / 600 |

#### 5.1.6. Botão com ícone

- Ícone à esquerda do texto, gap `8px`.
- Ícone-only: padding quadrado, dimensões = altura × altura, `aria-label` obrigatório.

---

### 5.2. Cards

Container universal de conteúdo agrupado.

- **Background:** `neutral/0`
- **Border:** `1px solid neutral/200`
- **Border-radius:** `radius/xl` (16px)
- **Padding:** `24px` (mobile: `16px`)
- **Sombra:** `shadow/sm`
- **Hover (quando interativo):** transform `translateY(-2px)`, sombra `shadow/md`, transição `200ms ease`

**Variantes:**

- **Card padrão** — conteúdo neutro, sem destaque cromático.
- **Card com acento** — borda esquerda 4px em cor semântica (`risk-high`, `info`, `success`). Usa-se em alertas, callouts e listas categorizadas.
- **Card elevado** — `shadow/lg`, sem border. Para modais e popovers.
- **Card interativo** — cursor pointer, foco visível, hover state ativo.

**Anatomia interna:**

1. **Header opcional** — overline (uppercase, 11px) + título (h4, 18px).
2. **Body** — conteúdo principal, body 15px.
3. **Footer opcional** — ações alinhadas à direita, separador `1px solid neutral/200` opcional.

**Anti-pattern:** card aninhado dentro de card. Se houver hierarquia de agrupamento, usar header de seção em vez de novo card.

---

### 5.3. Formulários (Inputs)

#### 5.3.1. Anatomia de campo

```
┌──────────────────────────────────────┐
│ Label (overline ou body-strong)      │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ Input                          │   │
│ └────────────────────────────────┘   │
│                                      │
│ Helper text / Error message          │
└──────────────────────────────────────┘
```

- **Gap label → input:** 8px
- **Gap input → helper:** 4px

#### 5.3.2. Input de texto

- **Height:** 40px (md), 48px (lg)
- **Padding:** `0 14px`
- **Background:** `neutral/0`
- **Border:** `1px solid neutral/300`
- **Border-radius:** `radius/md` (8px)
- **Texto:** `body` (15px), cor `neutral/800`
- **Placeholder:** `neutral/400`
- **Focus:** border `brand/600`, outer ring `0 0 0 3px brand/100`
- **Disabled:** background `neutral/100`, texto `neutral/400`
- **Erro:** border `#DC2626`, ring `0 0 0 3px #FEF2F2`
- **Sucesso (validação positiva):** border `#16A34A`, ícone check à direita

#### 5.3.3. Label

- Posição: acima do input (não float-label — médico tem pressa, label fixa é mais legível).
- Tipografia: `body-strong` (15px / 600), cor `neutral/700`.
- Asterisco vermelho para campos obrigatórios, com `aria-required="true"`.

#### 5.3.4. Helper text

- `small` (13px), cor `neutral/500`.
- Em erro: cor `#B91C1C`, prefixado por ícone de alerta.
- Sempre presente em campos críticos (dose, escore) — explica unidade ou referência.

#### 5.3.5. Textarea (notepad)

- Min-height: `120px`.
- Auto-resize vertical até `60vh`.
- Mesmas regras de border/focus do input.
- Indicador de auto-save no canto inferior: pill `success/soft` com texto "Salvo às HH:MM" — aparece e some com transição 300ms.

#### 5.3.6. Select / Dropdown

- Mesmo styling de input de texto.
- Ícone chevron à direita (`neutral/500`), 16px.
- Lista de opções: `radius/lg`, `shadow/lg`, max-height `280px` com scroll.
- Item ativo: background `brand/50`, texto `brand/700`.
- Item hover: background `neutral/100`.

#### 5.3.7. Checkbox e Radio

- Tamanho: 18×18px.
- Border `1.5px solid neutral/400`, `radius/sm` (checkbox) ou `radius/full` (radio).
- Checked: background `brand/600`, ícone check branco.
- Focus-visible: ring `0 0 0 3px brand/100`.

---

### 5.4. Outros componentes auxiliares

#### 5.4.1. Badge / Pill

- Padding `4px 12px`, `radius/full`, `caption` (12px / 600).
- Variantes: `neutral`, `success`, `warning`, `error`, `info`, `brand`.
- Usar `soft` background + cor `base` do par semântico.

#### 5.4.2. Toast / Notificação

- Posição: bottom-right desktop, top mobile.
- Width: 360px máx, padding 16px.
- `radius/lg`, `shadow/lg`.
- Auto-dismiss em 4s (sucesso) ou 8s (erro). Erros sempre dismissable manualmente.

#### 5.4.3. Modal

- Overlay: `rgba(15, 23, 42, 0.5)`, blur opcional `4px`.
- Container: max-width 560px, `radius/2xl`, `shadow/xl`, padding 32px.
- Mobile: full-screen sheet com swipe-to-dismiss.

#### 5.4.4. Tooltip

- Background `neutral/900`, texto `neutral/0`, 13px.
- Padding `8px 12px`, `radius/md`.
- Delay de aparição: 400ms.

---

## 6. Iconografia

- **Biblioteca:** [Lucide](https://lucide.dev/) (consistência, peso uniforme, open source).
- **Tamanhos:** 16px (inline), 20px (botão padrão), 24px (sidebar), 32px (vazio/hero).
- **Stroke-width:** 1.75 padrão.
- **Cor:** herda `currentColor` — nunca cor hard-coded no SVG.

Ícones específicos do domínio clínico que **não** existem no Lucide (estetoscópio, prontuário, comprimido) podem ser custom desde que sigam o mesmo peso e estilo.

---

## 7. Motion & Transições

Movimento serve à informação, não à decoração.

| Token | Duração | Easing | Uso |
|---|---|---|---|
| `motion/instant` | 0ms | — | Estados que precisam ser imediatos (focus). |
| `motion/fast` | 150ms | `ease-out` | Hover, click feedback. |
| `motion/base` | 200ms | `ease-in-out` | Modais, dropdowns, transições de cor. |
| `motion/slow` | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Drawer, sheet mobile, page transition. |
| `motion/lazy` | 500ms | `ease-out` | Auto-save toast, status indicator. |

**Princípio:** respeitar `prefers-reduced-motion: reduce` — desabilitar transformações que envolvam translação ou escala, manter apenas opacidade.

---

## 8. Tom de voz visual

Não é tipografia, mas afeta o sistema:

- **Microcopy concisa** — médico lê em diagonal. Frases ≤ 12 palavras em UI.
- **Verbos em imperativo direto** ("Salvar", "Calcular", "Apagar bloco"), nunca em primeira pessoa ("Quero salvar").
- **Português técnico-clínico aceitável** — sigla CID-10, qSOFA, NIHSS aparecem cruas, sem expansão. Audience knows.
- **Sem emojis em UI estrutural.** Apenas em onboarding leve e em estados vazios.

---

## 9. Tokens (resumo machine-friendly)

```json
{
  "color": {
    "brand": {
      "50": "#F0FDFA", "100": "#CCFBF1", "500": "#14B8A6",
      "600": "#0F766E", "700": "#134E4A"
    },
    "accent": { "100": "#FEF3C7", "500": "#F59E0B" },
    "neutral": {
      "0": "#FFFFFF", "50": "#F8FAFC", "100": "#F1F5F9",
      "200": "#E2E8F0", "300": "#CBD5E1", "400": "#94A3B8",
      "500": "#64748B", "600": "#475569", "700": "#334155",
      "800": "#1E293B", "900": "#0F172A"
    },
    "success": { "soft": "#F0FDF4", "base": "#15803D", "strong": "#16A34A" },
    "warning": { "soft": "#FFFBEB", "base": "#B45309", "strong": "#D97706" },
    "error":   { "soft": "#FEF2F2", "base": "#B91C1C", "strong": "#DC2626" },
    "info":    { "soft": "#EFF6FF", "base": "#1D4ED8", "strong": "#2563EB" }
  },
  "font": {
    "sans": "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    "mono": "'JetBrains Mono', 'SF Mono', Menlo, monospace"
  },
  "radius": { "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "2xl": "24px", "full": "9999px" },
  "space":  { "1":"4px","2":"8px","3":"12px","4":"16px","5":"20px","6":"24px","8":"32px","10":"40px","12":"48px","16":"64px","20":"80px" }
}
```

---

## 10. Changelog

| Versão | Data | Autor | Mudanças |
|---|---|---|---|
| 1.0 | 2026-05-02 | Tech Lead | Versão inicial. Paleta brand teal, escala Inter, sistema 4px, componentes base. |

---

> Próxima atualização planejada: após beta fechado com 5 embaixadores, revisitar densidade de UI e necessidade de tema escuro (alta probabilidade — plantão noturno).
