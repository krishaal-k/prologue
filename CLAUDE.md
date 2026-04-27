# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev            # start dev server on http://localhost:3000
pnpm build          # production build
pnpm lint           # ESLint (v9 flat config)
pnpm test           # Vitest in watch mode (unit/component, TDD-Guard gates this loop)
pnpm test:run       # Vitest single run (use this for CI-style checks)
pnpm test:e2e       # Playwright e2e (parallel slow loop, not gated by TDD-Guard)
pnpm test:e2e:ui    # Playwright in UI mode for debugging
```

## Stack

- **Next.js 16** — App Router only (no Pages Router). Read `node_modules/next/dist/docs/` before writing Next.js-specific code.
- **React 19**
- **TypeScript 5** — strict mode, path alias `@/*` → project root
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` in `postcss.config.mjs`. There is no `tailwind.config.*` file; all theme customization goes through CSS `@theme` blocks. The `globals.css` uses `@import "tailwindcss"`, not `@tailwind base/components/utilities`. The `@tailwindcss/typography` plugin is loaded via `@plugin` in `globals.css`; the `.prose-prologue` class there overrides prose tokens to the site palette and Fraunces serif. Apply `prose prose-prologue` to any MDX surface for consistent long-form styling.
- **ESLint 9** — flat config in `eslint.config.mjs`
- **pnpm** — use `pnpm` for all package operations

## Architecture

- App lives in `/app` (no `/src` wrapper). Route segments are directories under `/app`.
- `app/layout.tsx` — root layout, loads Geist + Fraunces fonts, wraps all pages.
- `app/page.tsx` — cinematic landing (click/keyboard anywhere → `/home`). Not the home page.
- `app/home/page.tsx` — actual home: sidebar + mission + recent posts.
- `app/{blog,projects,about}/` — content routes; `[slug]` pages render MDX.
- `app/globals.css` — Tailwind v4 `@import` + theme tokens (paper / accent / surface / bg / muted / border) under `@theme`.
- `content/blogs/*.mdx` and `content/projects/*.mdx` — MDX collections, parsed by `lib/content.ts` (gray-matter + next-mdx-remote). No CMS.
- `content/blogs/_drafts/` — Obsidian-authored `.md` drafts. Invisible to the site (only top-level `.mdx` is read). To publish, transform a draft into `content/blogs/<slug>.mdx` with frontmatter and move any images into `public/blog-assets/<slug>/`. See `content/blogs/_drafts/README.md` for the full workflow.
- `components/{shell,content,landing}/` — UI building blocks; `hooks/` — shared hooks (e.g. `usePrefersReducedMotion`).
- No state management library is installed.

## Tooling

Project-scoped agent tooling beyond the global config:

- **Testing**: Vitest for unit/component tests (`pnpm test`), Playwright for e2e (`pnpm test:e2e`). Configs at `vitest.config.ts` and `playwright.config.ts`. E2e specs live in `e2e/`.
- **TDD-Guard is active** (`.claude/tdd-guard/data/instructions.md`) and wired to Vitest via `tdd-guard-vitest`. Red-Green-Refactor is hook-enforced on the Vitest loop: one failing test at a time, minimal implementation, refactor only with tests green. **It does NOT gate Playwright runs** — apply TDD discipline manually at the e2e layer (write the failing flow first), but treat it as a separate cadence from the inner unit loop.
- **Codex plugin** (`codex@openai-codex`, project-scoped) — `/codex:rescue` to hand a stuck task or deeper investigation to GPT-5/Codex; `/codex:review` and `/codex:adversarial-review` for second-opinion review of pending changes. The `codex-rescue` subagent is also available via the Agent tool.
- **Rubber Duck MCP** (`mcp-rubber-duck`) — exposes MCP tools that let Claude consult Claude/Codex/Gemini CLIs as "ducks" for quick second opinions inline (lighter-weight than spawning the rescue subagent).

## Deploy

Hosted on Vercel, linked to GitHub at `krishaal-k/prologue`:

- Pushes to `main` → production at [`www.krishaal.dev`](https://www.krishaal.dev) (also `prologue-rho.vercel.app`).
- Pushes to any other branch → automatic preview URL (visible in the Vercel dashboard's "Active Branches").
- No `vercel.json` or `.vercel/` checked in — Vercel auto-detects Next.js. If a deploy fails, the dashboard at vercel.com is the source of truth for build / runtime logs. The `vercel` MCP can pull those logs once authenticated.

## Plans

Implementation plans live in `docs/plans/{active,completed,abandoned}/` with filenames `YYYY-MM-DD-HHMM-{slug}.md`. When entering plan mode for new work, save there (not the Claude Code default `~/.claude/plans/` location). Move between subfolders to update status. Only `active/` is auto-loaded into context; `completed/` and `abandoned/` are reference-only — read on request.

## Agent tooling reference

Two complementary docs:
- [`docs/workflow.md`](docs/workflow.md) — **when** to reach for a tool (activity-mapped, day-to-day reference).
- [`docs/agent-tooling.md`](docs/agent-tooling.md) — **where** each tool lives (registry: source, scope, install, config).

**Update rule:** when a plugin / skill / MCP server / subagent is added, removed, or reconfigured, update **both** files in the same change and bump each file's `Last updated` date.
