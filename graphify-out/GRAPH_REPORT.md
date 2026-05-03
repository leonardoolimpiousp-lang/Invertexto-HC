# Graph Report - invertexto-hc  (2026-05-03)

## Corpus Check
- 43 files · ~10,437 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 82 nodes · 87 edges · 6 communities detected
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 9 edges
2. `createProfile()` - 7 edges
3. `Logo()` - 6 edges
4. `isValidSlug()` - 5 edges
5. `createSupabaseServerClient()` - 5 edges
6. `WorkspacePage()` - 4 edges
7. `Badge()` - 4 edges
8. `CardTitle()` - 3 edges
9. `CardBody()` - 3 edges
10. `Notepad()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `WorkspacePage()` --calls--> `NotFound()`  [INFERRED]
  src/app/[username]/page.tsx → src/app/[username]/not-found.tsx
- `createProfile()` --calls--> `normalizeSlug()`  [INFERRED]
  src/app/cadastro/actions.ts → src/lib/utils/slug.ts
- `createProfile()` --calls--> `generateRandomSlug()`  [INFERRED]
  src/app/cadastro/actions.ts → src/lib/utils/slug.ts
- `createProfile()` --calls--> `isValidSlug()`  [INFERRED]
  src/app/cadastro/actions.ts → src/lib/utils/slug.ts
- `createProfile()` --calls--> `isReservedSlug()`  [INFERRED]
  src/app/cadastro/actions.ts → src/lib/utils/slug.ts

## Communities (20 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.29
Nodes (7): createProfile(), createSupabaseServerClient(), WorkspacePage(), generateRandomSlug(), isReservedSlug(), isValidSlug(), normalizeSlug()

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (3): Logo(), NotFound(), cn()

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (4): Footer(), ForWhom(), Header(), HowItWorks()

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (3): Badge(), ToolPanel(), WelcomeBanner()

### Community 6 - "Community 6"
Cohesion: 0.38
Nodes (4): createSupabaseBrowserClient(), Notepad(), formatTime(), SaveStatus()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.282) - this node is a cross-community bridge._
- **Why does `Logo()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **Why does `NotFound()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `createProfile()` (e.g. with `normalizeSlug()` and `generateRandomSlug()`) actually correct?**
  _`createProfile()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `isValidSlug()` (e.g. with `createProfile()` and `WorkspacePage()`) actually correct?**
  _`isValidSlug()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `createSupabaseServerClient()` (e.g. with `createProfile()` and `WorkspacePage()`) actually correct?**
  _`createSupabaseServerClient()` has 2 INFERRED edges - model-reasoned connections that need verification._