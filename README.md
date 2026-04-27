# prologue

A portfolio in motion by Krishaal Kumar. Live at **[www.krishaal.dev](https://www.krishaal.dev)**.

Built with Next.js 16, React 19, Tailwind v4, and TypeScript. Blog posts and project entries live as MDX under `content/`. Tested with Vitest (unit / component, TDD-Guard hook-enforced) and Playwright (e2e). Deployed on Vercel — pushes to `main` deploy to production; branch pushes get preview URLs.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # Vitest watch (TDD-Guard gates this loop)
pnpm test:run     # Vitest single run
pnpm test:e2e     # Playwright e2e
pnpm build        # production build
pnpm lint         # ESLint v9 flat config
```

## Layout

- `app/` — App Router routes (no `/src` wrapper). `app/page.tsx` is the cinematic landing; `app/home/` is the actual home page.
- `content/blogs/*.mdx`, `content/projects/*.mdx` — content collections, parsed by `lib/content.ts`.
- `components/{shell,content,landing}/` — UI building blocks.
- `e2e/` — Playwright specs.
- `public/landing/` — landing video + poster.

## Authoring posts

Drafts live in `content/blogs/_drafts/` and are invisible to the live site (`lib/content.ts` only reads top-level `*.mdx`). The flow:

1. Write the post in Obsidian as `<slug>.md` inside `_drafts/`. Embedded links and drag-dropped images survive natively.
2. Tell Claude "publish the latest draft" — it adds frontmatter, moves any images to `public/blog-assets/<slug>/`, and writes the final `content/blogs/<slug>.mdx`.

See [`content/blogs/_drafts/README.md`](content/blogs/_drafts/README.md) for the full workflow.

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — commands, stack, and architecture briefing for AI agents working in this repo.
- [`docs/workflow.md`](docs/workflow.md) — agent workflow reference: when to reach for which tool.
- [`docs/agent-tooling.md`](docs/agent-tooling.md) — registry of installed plugins / skills / MCP servers / subagents.
- [`docs/plans/`](docs/plans) — implementation plans (`active/`, `completed/`, `abandoned/`).
- [`docs/superpowers/specs/`](docs/superpowers/specs) — design specs from `superpowers:brainstorming`.
