# Agent Tooling Registry

_Last updated: 2026-04-26_

The **"where it lives"** doc. For **"when to use"**, see [`workflow.md`](workflow.md).

**Update rule (extends CLAUDE.md):** when a plugin / skill / MCP / subagent is added, removed, or reconfigured, update both `workflow.md` and this file in the same change, and bump each file's `Last updated` date.

## Plugins / Skills / Subagents

### `superpowers`
- Type: plugin · scope: user · source: `claude-plugins-official`
- TDD / debug / collaboration skills library. Surfaces `superpowers:brainstorming`, `superpowers:writing-plans`, `superpowers:subagent-driven-development`, `superpowers:test-driven-development`, `superpowers:simplify`, etc.

### `tdd-guard`
- Type: plugin · scope: user · source: `tdd-guard`
- Hook-enforced RED-GREEN-REFACTOR on Vitest (`pnpm test`). Project rules in `.claude/tdd-guard/data/instructions.md`.

### `gemini`
- Type: plugin · scope: user · source: `abiswas97-gemini`
- Delegate to Gemini CLI; `/gemini:rescue`, `/gemini:setup`, review commands. Subagent: `gemini:gemini-rescue`.

### `codex`
- Type: plugin · scope: project · source: `openai-codex`
- Delegate to Codex / GPT-5; `/codex:rescue`, `/codex:review`, `/codex:adversarial-review`. Subagent: `codex:codex-rescue`.

### `compound-engineering`
- Type: plugin · scope: user · source: `EveryInc/compound-engineering-plugin` (v3.1.0)
- Bundle of `/ce-*` skills + sub-agents: `ce-ideate`, `ce-brainstorm`, `ce-plan`, `ce-work`, `ce-debug`, `ce-code-review`, `ce-frontend-design`, `ce-web-researcher`, `ce-resolve-pr-feedback`, etc.

### `prd-taskmaster`
- Type: skill · scope: user · source: `anombyte93/prd-taskmaster` (cloned to `~/.claude/skills/prd-taskmaster`)
- Discovery interview → codebase analysis → detailed PRD with 13 automated quality checks; bridges to TaskMaster task breakdown.

### `frontend-design`
- Type: plugin · scope: user · source: `claude-plugins-official`
- Anthropic's official frontend-design skill. Forces distinctive aesthetic, typography, palettes — antidote to generic AI look. Surfaces `frontend-design:frontend-design`.

### `c4-architecture`
- Type: plugin · scope: user · source: `wshobson/agents` (added as `claude-code-workflows` marketplace)
- Generates C4 architecture documentation (Context, Container, Component, Code) from a codebase via four coordinated agents.

## MCP servers

### `rubberduck-mcp`
- Source: `mcp-rubber-duck` (npm, `/opt/homebrew/bin/mcp-rubber-duck`)
- Config env: `CLI_CODEX_ENABLED=true`, `CLI_GEMINI_ENABLED=true`
- Inline second-opinion ducks for Codex / Gemini. Tools: `ask_duck`, `chat_with_duck`, `compare_ducks`, `duck_council`.

### `playwright`
- Source: Microsoft Playwright MCP (default config)
- Browser automation, screenshots, console / network capture, snapshots, navigation.

### `magicui`
- Source: `@magicuidesign/mcp` (npm, official, registered via `claude mcp add magicui`)
- Magic UI component metadata + scaffolds for animated React + Tailwind primitives (marquees, blur fades, beams, etc.).

### `ide`
- Source: built-in (default config)
- `executeCode`, `getDiagnostics` for the active IDE.

### Google connectors (Gmail, Calendar, Drive)
- Source: claude.ai connectors · OAuth
- Authenticated read / write of personal Google data.

## Cross-cutting tools

These appear once here; surfaced in `workflow.md`'s top-of-file callout (not per sub-section):

- **`codex:rescue`** — `/codex:rescue`, or via Agent tool with `subagent_type: codex:codex-rescue`
- **`gemini:rescue`** — `/gemini:rescue`, or via Agent tool with `subagent_type: gemini:gemini-rescue`
- **`mcp-rubber-duck`** — MCP server `rubberduck-mcp`; tools include `ask_duck`, `chat_with_duck`, `compare_ducks`, `duck_council`

## Project-local config

- `.claude/settings.local.json` — project permission allowlist
- `.claude/settings.json` — enabled plugins (e.g. `codex@openai-codex`)
- `.claude/tdd-guard/data/instructions.md` — TDD-Guard project rules
- `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts` — test runner configs
- `docs/plans/{active,completed,abandoned}/` — implementation plans (only `active/` auto-loads)
- `docs/superpowers/specs/` — design specs from `superpowers:brainstorming`
- `docs/prds/` — product requirement documents
- `docs/runbooks/` — operational runbooks

## External docs

- Superpowers — https://github.com/obra/superpowers
- TDD-Guard — https://github.com/nizos/tdd-guard
- Codex plugin — https://github.com/openai/codex-plugin-cc
- Gemini plugin — https://github.com/abiswas97/gemini-plugin-cc
- Rubber Duck MCP — https://github.com/nesquikm/mcp-rubber-duck
- Playwright MCP — https://github.com/microsoft/playwright-mcp
- Compound Engineering — https://github.com/EveryInc/compound-engineering-plugin
- prd-taskmaster — https://github.com/anombyte93/prd-taskmaster
- frontend-design — https://github.com/anthropics/claude-plugins-official
- wshobson/agents (c4-architecture host) — https://github.com/wshobson/agents
- Magic UI MCP — https://github.com/magicuidesign/magicui
