# Phase 3 (Build) — Tooling Research

_Date: 2026-04-26_
_Scope: Solo PM building a Next.js portfolio site. Looking for complementary or alternative tools to existing stack (superpowers, codex, gemini, tdd-guard, rubber-duck, playwright)._

## Summary table

| Tool | Type | Sub-section | Stars / Signal | Why it's interesting |
|---|---|---|---|---|
| `serena` (oraios/serena) | MCP server | 3.2, 3.3 | ~23k stars, active | Symbol-aware LSP-backed code retrieval, rename, cross-file refactor |
| `mcp-language-server` (isaacphi) | MCP server | 3.2, 3.3 | active | Definition / references / rename / diagnostics via LSP |
| `ast-grep-mcp` (ast-grep/ast-grep-mcp) | MCP server | 3.3 | core ast-grep ~13k stars | AST pattern search & rule-driven structural refactor |
| `refactor-mcp` (myuon) | MCP server | 3.3 | low stars, on npm, recent | Regex-based project-wide search/replace as MCP tool |
| `context7` (upstash) | MCP server / plugin | 3.2 | ~20k stars, on Anthropic marketplace | Always-fresh, version-pinned library docs injected into prompts |
| `superpowers-lab` (obra) | plugin (skills) | 3.1, 3.2, 3.3 | obra-endorsed, active | Experimental superpowers skills — natural complement to installed `superpowers` |
| `wshobson/agents` | subagent collection | 3.1 | ~34k stars, active | 85 specialized subagents + workflow orchestrators |
| `VoltAgent/awesome-claude-code-subagents` | subagent collection | 3.1 | active list | 100+ curated subagents to cherry-pick from |
| `claude-code-router` (musistudio) | standalone CLI / proxy | 3.1 | ~26k stars | Route background / planning / long-context turns to cheaper models |

## 3.1 Plan & delegate

User already runs `superpowers:writing-plans` + `superpowers:subagent-driven-development` plus `codex:rescue` / `gemini:rescue`. Complementary picks:

- **wshobson/agents** — `https://github.com/wshobson/agents`. Subagent collection (~34k stars, updated April 2026). Drop individual subagents into `.claude/agents/` (e.g. `frontend-developer`, `test-automator`) as named delegates the planner can dispatch to. Install: copy chosen `.md` files from the repo into `.claude/agents/`.
- **VoltAgent/awesome-claude-code-subagents** — `https://github.com/VoltAgent/awesome-claude-code-subagents`. Curated index of 100+ subagents; use as a menu, not a bulk install.
- **claude-code-router** — `https://github.com/musistudio/claude-code-router`. Lets you route the planning / "background" turns of Claude Code to a cheaper provider (DeepSeek, Gemini Flash, Ollama) while keeping Sonnet/Opus on the implementation hot loop. Install: `npm i -g @musistudio/claude-code-router` then `ccr` wrapper.
- **claude-flow / ruflo** — _excluded_. Heavy queen/worker swarm framework; overkill for a solo portfolio site and adds opaque routing on top of an already-orchestrated stack.

## 3.2 Implement

Claude Code itself is the writer. Complementary tools that feed it better context or symbol-level edits:

- **context7** — `https://github.com/upstash/context7` (Anthropic marketplace plugin). Pulls version-correct docs for Next.js 16, React 19, Tailwind v4, etc. on demand — directly addresses the "this is NOT the Next.js you know" warning in `AGENTS.md`. Install: `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`, or `/plugin install context7`.
- **serena** — `https://github.com/oraios/serena`. LSP-backed semantic retrieval & editing — closes Claude Code's blind spot on cross-file symbol moves in TypeScript. Install: `uvx --from git+https://github.com/oraios/serena serena-mcp-server` (then register in Claude Code MCP config).
- **mcp-language-server** — `https://github.com/isaacphi/mcp-language-server`. Lighter alternative to Serena: exposes raw LSP `definition` / `references` / `rename` / `diagnostics` to the agent. Install: `go install github.com/isaacphi/mcp-language-server@latest`, register with `typescript-language-server`.
- **superpowers-lab** — `https://github.com/obra/superpowers-lab`. Experimental skills from the `superpowers` author; same install pattern as the installed `superpowers` plugin. Worth scanning for new implement-phase skills before they graduate.

## 3.3 Refactor

User already has `superpowers:simplify` + `codex:rescue`. Add structural / semantic muscle:

- **ast-grep-mcp** — `https://github.com/ast-grep/ast-grep-mcp`. Structural codemods via AST patterns; ideal for portfolio-scale Next.js cleanups ("rewrite all `useEffect` fetches to RSC"). Install: clone repo, `cargo run`, register MCP entry. Supports TS/TSX out of the box.
- **serena** — _(see 3.2)_. Same install; symbol-level rename/move is the refactor sweet spot.
- **mcp-language-server** — _(see 3.2)_. Use `rename_symbol` for safe, type-aware renames Claude can't do reliably with text edits.
- **refactor-mcp** (myuon) — `https://github.com/myuon/refactor-mcp`. Regex search/replace as MCP tools. Lower-power than ast-grep but trivial to install: `npx -y @myuon/refactor-mcp`. Marginal — only include if ast-grep feels heavy.
- **dave-hillier/refactor-mcp** — _excluded_. C# / Roslyn-only; not relevant to a Next.js TS stack.

## Gaps

- No qualifying gap; every sub-section has at least one strong candidate.
- Caveat: most "implement" gains for this project come from better **context** (context7) and **symbol awareness** (serena / mcp-language-server), not from new code-writers — Claude Code is the code-writer.
