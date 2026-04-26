# Agent Tooling Registry

_Last updated: 2026-04-26_

The **"where it lives"** doc. For **"when to use"**, see [`workflow.md`](workflow.md).

**Update rule (extends CLAUDE.md):** when a plugin / skill / MCP / subagent is added, removed, or reconfigured, update both `workflow.md` and this file in the same change, and bump each file's `Last updated` date.

## Plugins / Skills / Subagents

| Tool | Type | Scope | Source | Notes |
|---|---|---|---|---|
| `superpowers` | plugin | user | `claude-plugins-official` | TDD / debug / collaboration skills library |
| `tdd-guard` | plugin | user | `tdd-guard` | Hook-enforced RED-GREEN-REFACTOR on Vitest (`pnpm test`) |
| `gemini` | plugin | user | `abiswas97-gemini` | Delegate to Gemini CLI; review / rescue commands |
| `codex` | plugin | project | `openai-codex` | Delegate to Codex / GPT-5; review / rescue commands |

## MCP servers

| Server | Source | Config | Notes |
|---|---|---|---|
| `rubberduck-mcp` | `mcp-rubber-duck` (npm, `/opt/homebrew/bin/mcp-rubber-duck`) | env: `CLI_CODEX_ENABLED=true`, `CLI_GEMINI_ENABLED=true` | Inline ducks for Codex / Gemini |
| `playwright` | Microsoft Playwright MCP | (default) | Browser automation, screenshots, console / network capture |
| `ide` | Built-in | (default) | `executeCode`, `getDiagnostics` for active IDE |
| Gmail / Google Calendar / Google Drive | claude.ai connectors | OAuth | Authed read / write of personal Google data |

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
