# Graph Report - invertexto-hc  (2026-05-05)

## Corpus Check
- 123 files · ~45,653 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 327 nodes · 432 edges · 19 communities detected
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `normalizeText()` - 23 edges
2. `createSupabaseServerClient()` - 16 edges
3. `cn()` - 12 edges
4. `POST()` - 9 edges
5. `recommendCalculators()` - 9 edges
6. `createProfile()` - 7 edges
7. `createSupabaseBrowserClient()` - 7 edges
8. `suggestCalculatorsFromNote()` - 7 edges
9. `searchCid10()` - 7 edges
10. `recommendCid10()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `recommendCid10()`  [INFERRED]
  src/app/api/prescription-guides/recommend/route.ts → src/lib/cid10/recommendation.ts
- `GET()` --calls--> `searchCid10()`  [INFERRED]
  src/app/api/cid10/search/route.ts → src/lib/cid10/search.ts
- `getFoldersBySlug()` --calls--> `createSupabaseServerClient()`  [INFERRED]
  src/lib/supabase/clinical-folders.ts → src/lib/supabase/server.ts
- `createFolder()` --calls--> `createSupabaseServerClient()`  [INFERRED]
  src/lib/supabase/clinical-folders.ts → src/lib/supabase/server.ts
- `updateFolder()` --calls--> `createSupabaseServerClient()`  [INFERRED]
  src/lib/supabase/clinical-folders.ts → src/lib/supabase/server.ts

## Communities (62 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (14): getNoteEncounterClosedAt(), getNotePatientDestination(), getNotePlantaoRegistro(), getVisibleHdList(), isNoteEncounterClosed(), parseClinicalNoteMetadata(), withClinicalNoteMetadata(), buildUpdatePayload() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (11): matchesNormalized(), rankLocalCalculators(), dedupeNormalized(), normalizeText(), tokenizeText(), scoreCid(), matchesNormalized(), rankGuide() (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (8): Footer(), ForWhom(), Header(), HowItWorks(), CardBody(), CardTitle(), Logo(), cn()

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (17): createProfile(), createFolder(), deleteFolder(), getFoldersBySlug(), updateFolder(), createNote(), deleteNote(), getNote() (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.19
Nodes (10): fetchCatalogFromDatabase(), matchesNormalized(), mergeCatalogs(), mergeContexts(), mergeTags(), recommendCalculators(), recommendDiseaseGuides(), recommendPrescriptionGuides() (+2 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (6): CidPanel(), DuvidasPlantaoPanel(), PlantonistaPanel(), Badge(), ToolPanel(), WelcomeBanner()

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (7): createSupabaseBrowserClient(), getString(), isContextType(), parseInitialDraft(), Notepad(), formatTime(), SaveStatus()

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (11): dedupeByCode(), getLocalCidCatalog(), mergeCidCatalogs(), readCsvCatalog(), dedupeByCode(), fetchCidCatalogFromDatabase(), recommendCid10(), dedupeByCode() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (8): getNoteTemplateByContext(), Date(), createFolder(), createNote(), getFolderNoteCount(), hasMissingColumnError(), renderFolderRow(), updateNote()

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (10): deleteLog(), formatTrainingYear(), getGroupStats(), getLocalStorageKey(), handleSubmit(), loadLogs(), persistLocal(), readLocalLogs() (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.36
Nodes (7): dedupeContexts(), suggestCalculatorsFromNote(), dedupeContexts(), extractContextsFromNote(), extractHypothesesFromNote(), isValidBody(), POST()

### Community 11 - "Community 11"
Cohesion: 0.46
Nodes (7): ensureDir(), extractListAfterHeader(), fetchDraftContent(), inferContexts(), inferTags(), main(), slugify()

### Community 12 - "Community 12"
Cohesion: 0.52
Nodes (6): ensureDir(), inferSettingFromPath(), isLikelyTemplatePath(), main(), normalizeCategory(), toAbsoluteUrl()

### Community 14 - "Community 14"
Cohesion: 0.7
Nodes (4): inferContexts(), inferTags(), slugify(), toGuideTemplate()

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 0`, `Community 5`, `Community 6`, `Community 8`, `Community 9`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Logo()` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `normalizeText()` (e.g. with `matchesNormalized()` and `rankLocalCalculators()`) actually correct?**
  _`normalizeText()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `createSupabaseServerClient()` (e.g. with `createProfile()` and `WorkspacePage()`) actually correct?**
  _`createSupabaseServerClient()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `POST()` (e.g. with `recommendDiseaseGuides()` and `recommendCalculators()`) actually correct?**
  _`POST()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `recommendCalculators()` (e.g. with `POST()` and `suggestCalculatorsFromNote()`) actually correct?**
  _`recommendCalculators()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._