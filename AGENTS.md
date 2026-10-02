<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Code conventions (Codelog)

## Folder layout

```
app/                  Routes only: compose feature components, no business logic
components/ui/        Shared, feature-agnostic UI (Button, Card, Container, Input, ...)
components/layout/    Site chrome (header, footer, logo, skip link)
components/providers/ App-wide client providers (TanStack Query)
config/               App-wide constants: routes, navigation, site info, fonts
lib/                  Generic helpers and hooks with no feature knowledge (env, supabase, markdown, format, utils)
features/<name>/
  constants.ts        Named values: cache tags, limits, labels, error codes
  types.ts            DTOs that leave the server
  rows.ts             Shapes of database rows returned by selects
  selects.ts          PostgREST select strings
  mappers.ts          Row -> DTO
  schemas.ts          zod schemas
  queries.ts          Reads (server-only)
  actions.ts          Writes (Server Actions); a folder actions/ when there are several groups
  services/           Server-only steps shared by several actions (e.g. syncing tags, cache refresh)
  api.ts              Browser-side fetchers for this feature's /api routes
  utils/              Pure helpers, one concern per file
  hooks/              Client hooks
  components/         Components for this feature
types/database.ts     Generated from Supabase
```

## Rules

- One concern per file. Constants, types, helpers, hooks, schemas and mappers never live inline in a component, page or query file.
- No magic strings or numbers: routes come from `config/routes.ts`, cache tags and limits from the feature's `constants.ts`, env var names from `lib/env-keys.ts`.
- UI that appears in more than one place becomes a component in `components/ui`; feature components compose those instead of repeating class strings.
- Features may import from `components`, `config`, `lib` and `types`, and from another feature's `types.ts`, `constants.ts` or `components/`. Never from another feature's `queries.ts` or `actions.ts`.
- The browser never calls Supabase. Anything that reaches the browser is a DTO.
- Pure helpers get a colocated `*.test.ts`.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **blog** (3652 symbols, 9170 relationships, 288 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/blog/context` | Codebase overview, check index freshness |
| `gitnexus://repo/blog/clusters` | All functional areas |
| `gitnexus://repo/blog/processes` | All execution flows |
| `gitnexus://repo/blog/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
