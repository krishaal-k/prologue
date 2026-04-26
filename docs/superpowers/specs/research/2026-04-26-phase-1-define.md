# Phase 1 — Define: Tool Research

_Researched: 2026-04-26 · Filter: ≥100 stars OR recognized author OR commits in last 90 days_

## Summary table

| Sub-section | Top pick | Type | Notes |
|---|---|---|---|
| 1.1 Ideation | **`superpowers:brainstorming`** (already installed) | skill | Hook-enforced exploration before code; primary fit |
| 1.1 Ideation (alt) | `EveryInc/compound-engineering` `/ce-ideate` + `/ce-brainstorm` | plugin | 15.5k stars, active April 2026 |
| 1.2 Research | **`exa-mcp-server`** | MCP | 4.3k stars; semantic web search |
| 1.2 Research (alt) | `firecrawl-claude-plugin` | plugin | Official `/plugin` install; scrape/crawl competitors |
| 1.3 PRDs | **`anombyte93/prd-taskmaster`** | skill | 198 stars, Feb 2026, 13 quality checks |
| 1.3 PRDs (alt) | `Slashworks-biz/idea-os` | skill | Bundles 1.1+1.2+1.3 into one pipeline |

---

## 1.1 Ideation

**Primary candidate — `superpowers:brainstorming`** (already installed via `obra/superpowers`)
- Source: https://github.com/obra/superpowers (~168k stars, very active)
- Type: skill (bundled in `superpowers` plugin)
- Why it fits: hook-activates before any creative/design work; refines rough ideas through Q&A, explores alternatives, saves a design doc to `docs/superpowers/specs/`. Already wired into project.
- Install: already installed (no action).

**Alternative — Compound Engineering plugin** (`EveryInc/compound-engineering-plugin`)
- Source: https://github.com/EveryInc/compound-engineering-plugin (15.5k stars, v3.1.0 on 2026-04-24)
- Type: plugin (36 skills, 51 agents)
- Why it fits: `/ce-ideate` *generates and critically evaluates* grounded ideas, then routes into `/ce-brainstorm` for an interactive Q&A. Stronger divergent-thinking front-end than superpowers' single brainstorm step. Could also cover 1.3 (writes a "right-sized requirements doc") and 3.1 (`/ce-plan`).
- Install: `/plugin marketplace add EveryInc/compound-engineering-plugin` then `/plugin install compound-engineering`

**Alternative — `MadeByTokens/claude-brainstorm`**
- Source: https://github.com/MadeByTokens/claude-brainstorm (1 star, 13 commits — fails filter)
- Skipped: doesn't meet inclusion bar.

---

## 1.2 Research (competitive analysis, market scans)

**Primary candidate — Exa MCP server** (`exa-labs/exa-mcp-server`)
- Source: https://github.com/exa-labs/exa-mcp-server (4.3k stars, MIT)
- Type: MCP server (official Exa)
- Why it fits: semantic web search beats keyword search for "find competitors to X" / "what's the state of Y in 2026"; benchmarks show 81% on WebWalker vs Tavily 71%. Has dedicated `web_search_exa` and `github_search` tools.
- Install: `claude mcp add --transport http exa "https://mcp.exa.ai/mcp"` (then set `EXA_API_KEY`)

**Alternative — Tavily MCP** (`tavily-ai/tavily-mcp`)
- Source: https://github.com/tavily-ai/tavily-mcp (1.8k stars, MIT)
- Why it fits: full pipeline (search + extract + map + crawl) in one server; good for "research a competitor's whole site". Caveat: acquired by Nebius Feb 2026 — roadmap uncertainty.
- Install: `claude mcp add --transport http tavily "https://mcp.tavily.com/mcp/?tavilyApiKey=<key>"`

**Alternative — Firecrawl Claude plugin** (`firecrawl/firecrawl-claude-plugin`)
- Source: https://github.com/firecrawl/firecrawl-claude-plugin (60 stars but Firecrawl org has 112k on main repo — endorsed-author pass)
- Why it fits: scraping-first; pulls structured data from competitor pricing pages, changelogs, etc. Complements Exa (search) with deep extraction.
- Install: `/plugin` then search firecrawl; `npm install -g firecrawl-cli`

**Alternative — `mcp-omnisearch`** (`spences10/mcp-omnisearch`, 296 stars)
- Why considered: unified Tavily+Brave+Kagi+Exa+Firecrawl behind one MCP. Useful if you want to mix providers without juggling N installs.
- Caveat: last commit March 2025 — fails 90-day rule but passes star bar.

---

## 1.3 Product requirements (PRDs)

**Primary candidate — `anombyte93/prd-taskmaster`**
- Source: https://github.com/anombyte93/prd-taskmaster (198 stars, MIT, v3.0.0 Feb 2026)
- Type: skill
- Why it fits: discovery interview → codebase analysis → detailed spec with 13 automated quality checks. Generates structured directories with task breakdowns and dependency mapping — bridges naturally into 3.1 (plan).
- Install: `cd ~/.claude/skills && git clone https://github.com/anombyte93/prd-taskmaster.git`

**Alternative — `Slashworks-biz/idea-os`**
- Source: https://github.com/Slashworks-biz/idea-os (0 stars but cited in awesome-list / antigravity-awesome-skills v10.4.0 release notes — endorsement pass)
- Type: skill
- Why it fits: covers 1.1+1.2+1.3 as one pipeline (triage → clarify → research → PRD → plan); writes `questions.md`, `research.md`, `PRD.md`, `plan.md`. Compelling if you want a single-skill front door for the whole Define phase.
- Install: `git clone https://github.com/Slashworks-biz/idea-os.git ~/.claude/skills/idea-os`

**Alternative — `dredozubov/prd-generator`** (`/create-prd`)
- Source: https://github.com/dredozubov/prd-generator (43 stars, MIT — listed in `awesome-claude-code` curation = endorsement pass)
- Why it fits: lighter than prd-taskmaster — produces a single comprehensive PRD from conversation context. Good if you don't want the taskmaster integration overhead.
- Install: `git clone https://github.com/dredozubov/prd-generator ~/.claude/plugins/prd-generator`

**Alternative — `Yassinello/claude-plugin-prd-workflow`**
- Source: https://github.com/Yassinello/claude-plugin-prd-workflow (10 stars, Nov 2025 — fails filter; mentioned for completeness)

---

## Gaps

None. Every sub-section has at least one strong qualifying candidate. Optional consolidation: `idea-os` could collapse all three sub-sections into one skill if the user prefers a single entry point over three composed tools.
