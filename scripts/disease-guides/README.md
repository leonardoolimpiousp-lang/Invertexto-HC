# Pipeline de Ingestão Assistida — Guia Completo por Doença

Fluxo recomendado:

1. Indexar templates do Point of Care Medicine
`npm run guides:index:pointofcare`

2. Gerar rascunhos estruturados para revisão clínica
`npm run guides:draft:pointofcare`

3. Converter rascunhos para português
`npm run guides:pt`

4. Revisar manualmente `data/disease-guides/review/drafts.pointofcare.json` ou pela tela `/admin/guides-review`
- ajustar contexto clínico
- ajustar tags de HD
- resumir/reescrever texto para uso interno
- definir `review.status = "approved"` nos itens aprovados

5. Compilar catálogo final a partir dos aprovados
`npm run guides:compile`

6. Copiar/mesclar conteúdo de `data/disease-guides/compiled/catalog.generated.json`
para `src/lib/disease-guides/catalog.ts`.

## Observações

- A pipeline é assistida: não publica automaticamente no produto.
- Sempre mantenha atribuição de fonte no campo `source`.
- Evite copiar texto integral de fonte externa sem revisão jurídica/editorial.
