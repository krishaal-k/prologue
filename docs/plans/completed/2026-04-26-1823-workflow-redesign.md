# Workflow Documentation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `docs/agent-tooling.md` with two complementary docs (`docs/workflow.md` activity-mapped reference + `docs/agent-tooling.md` slimmed to a pure registry), backed by deep community research and per-phase user-gated tool installation, plus PRD and runbook folder scaffolding.

**Architecture:** Five-phase activity-mapped `workflow.md` (Define / Design / Build / Verify / Ship & operate), with a fixed four-field per-sub-section template (Primary · When to use · Alternatives · Registry link). The registry holds install metadata only. Research phase fans out parallel Explore agents across the five phases under a strict ≥100⭐ / 90-day-active filter. Each phase has a user-gated selection step before any install; doc content is written *after* installs reflect what's actually present.

**Tech Stack:** Markdown docs (workflow.md, agent-tooling.md, CLAUDE.md, stub READMEs); Claude Code plugin / MCP / skill installs via `/plugin`, `.mcp.json`, and standalone CLIs (`pnpm` / `brew`); Explore agents for research.

**Spec:** [`docs/superpowers/specs/2026-04-26-workflow-doc-design.md`](../../superpowers/specs/2026-04-26-workflow-doc-design.md)

---

## Task 1: Scaffold `docs/prds/` with stub README

**Files:**
- Create: `docs/prds/README.md`

**Steps:**

- [ ] **Step 1: Create the directory and stub README**

```bash
mkdir -p docs/prds
```

Then write `docs/prds/README.md`:

```markdown
# Product Requirement Documents (PRDs)

PRDs answer **what** problem we're solving, for whom, and what success looks like — *before* design or implementation.

## When to write one
Big enough that "what to build" isn't obvious from the issue title. Small fixes, refactors, and obvious features don't need a PRD.

## Filename convention
`YYYY-MM-DD-<slug>.md` — e.g. `2026-04-26-newsletter-signup.md`.

## Lifecycle
PRD → Spec (`docs/superpowers/specs/`) → Plan (`docs/plans/active/`) → Code → optional Runbook.

Front-matter on the spec should reference the PRD: `prd_for: prds/2026-04-26-newsletter-signup.md`.
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la docs/prds/README.md && wc -l docs/prds/README.md`
Expected: file present, ~12 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/prds/README.md
git commit -m "docs: scaffold docs/prds/ for product requirement documents"
```

---

## Task 2: Scaffold `docs/runbooks/` with stub README

**Files:**
- Create: `docs/runbooks/README.md`

**Steps:**

- [ ] **Step 1: Create the directory and stub README**

```bash
mkdir -p docs/runbooks
```

Then write `docs/runbooks/README.md`:

```markdown
# Runbooks

Runbooks answer **how to operate or debug** something that's already running. Written after the first time it broke (or was at risk of breaking).

## When to write one
You've been paged, debugged a prod issue, or set up a non-obvious operational workflow. Capture the steps before you forget.

## Filename convention
`<slug>.md` — no date prefix; runbooks are evergreen, updated in place. E.g. `vercel-deploy-rollback.md`, `tdd-guard-debugging.md`.

## What goes in
1. **Symptom** — how do you know this runbook applies?
2. **Likely causes** — short list, in order of probability.
3. **Resolution steps** — exact commands.
4. **Verification** — how to know it's actually fixed.
5. **Prevention** (optional) — links to issue / PR that addresses root cause.
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la docs/runbooks/README.md && wc -l docs/runbooks/README.md`
Expected: file present, ~17 lines.

- [ ] **Step 3: Commit**

```bash
git add docs/runbooks/README.md
git commit -m "docs: scaffold docs/runbooks/ for operational runbooks"
```

---

## Task 3: Write `workflow.md` skeleton (empty phase headers)

**Files:**
- Create: `docs/workflow.md`

**Steps:**

- [ ] **Step 1: Write the skeleton with all phase / sub-section headers and the cross-cutting callout, but no per-section content yet**

Write `docs/workflow.md`:

```markdown
# Agent Workflow Reference

_Last updated: 2026-04-26_

When you're at step **X**, reach for tool **Y**. For where each tool lives and how it's installed, see [`agent-tooling.md`](agent-tooling.md).

> **Cross-cutting tools** — valid in any phase, not duplicated per sub-section:
> - `codex:rescue` — second-opinion / stuck-task delegation to GPT-5
> - `gemini:rescue` — large-context / multimodal / web-grounding delegation
> - `mcp-rubber-duck` — inline lightweight second-opinion ducks
>
> See registry: [Cross-cutting tools](agent-tooling.md#cross-cutting-tools).

## Contents

1. [Define](#1-define) — Ideation · Research · Product requirements
2. [Design](#2-design) — UI/UX & prototyping · Architecture, technical requirements & specs
3. [Build](#3-build) — Plan & delegate · Implement · Refactor
4. [Verify](#4-verify) — TDD inner loop · Regression / E2E · UI-UX QA & perf
5. [Ship & operate](#5-ship--operate) — Integration & deploy · Monitor & maintain

---

## 1. Define

### 1.1 Ideation

_(filled in Task 6)_

### 1.2 Research

_(filled in Task 6)_

### 1.3 Product requirements (PRDs)

_(filled in Task 6)_

## 2. Design

### 2.1 UI/UX & prototyping

_(filled in Task 7)_

### 2.2 Architecture, technical requirements & specs

_(filled in Task 7)_

## 3. Build

### 3.1 Plan & delegate

_(filled in Task 8)_

### 3.2 Implement

_(filled in Task 8)_

### 3.3 Refactor

_(filled in Task 8)_

## 4. Verify

### 4.1 TDD inner loop

_(filled in Task 9)_

### 4.2 Regression / E2E

_(filled in Task 9)_

### 4.3 UI-UX QA & perf

_(filled in Task 9)_

## 5. Ship & operate

> **Active-stage emphasis:** this phase stays brief until you actually have something running in production. Each sub-section names the activity and one starter tool; expand when production-stage.

### 5.1 Integration & deploy

_(filled in Task 10)_

### 5.2 Monitor & maintain

_(filled in Task 10)_
```

- [ ] **Step 2: Verify structure**

Run: `grep -E '^(##|###) ' docs/workflow.md | wc -l`
Expected: 5 phase headers (`## 1.`...`## 5.`) + 13 sub-sections (`### N.N`) = **18 headers**.

Run: `grep -c "_(filled in Task" docs/workflow.md`
Expected: 13.

- [ ] **Step 3: Commit**

```bash
git add docs/workflow.md
git commit -m "docs: add workflow.md skeleton (5 phases, 13 sub-sections)"
```

---

## Task 4: Write `agent-tooling.md` registry skeleton (replace existing content)

**Files:**
- Modify: `docs/agent-tooling.md` (full rewrite — replace existing content)

**Steps:**

- [ ] **Step 1: Replace the existing tool-organized doc with a registry skeleton (empty body rows; populated as installs land in Tasks 6–10)**

Replace the entire contents of `docs/agent-tooling.md` with:

```markdown
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
```

- [ ] **Step 2: Verify the rewrite — no "when to use" prose remains**

Run: `grep -i "when to use\|primary:" docs/agent-tooling.md`
Expected: no output (registry is install info only).

Run: `grep -E '^## ' docs/agent-tooling.md | wc -l`
Expected: 5 sections (Plugins/Skills/Subagents, MCP servers, Cross-cutting tools, Project-local config, External docs).

- [ ] **Step 3: Commit**

```bash
git add docs/agent-tooling.md
git commit -m "docs: rewrite agent-tooling.md as a pure tooling registry"
```

---

## Task 5: Research candidate tools across all 5 phases (parallel Explore agents)

**Files:**
- Create: `docs/superpowers/specs/research/2026-04-26-phase-1-define.md`
- Create: `docs/superpowers/specs/research/2026-04-26-phase-2-design.md`
- Create: `docs/superpowers/specs/research/2026-04-26-phase-3-build.md`
- Create: `docs/superpowers/specs/research/2026-04-26-phase-4-verify.md`
- Create: `docs/superpowers/specs/research/2026-04-26-phase-5-ship-operate.md`

**Steps:**

- [ ] **Step 1: Create the research output directory**

```bash
mkdir -p docs/superpowers/specs/research
```

- [ ] **Step 2: Dispatch FIVE Explore agents in parallel (single message, five Agent tool calls)**

Use this template per agent, substituting the phase-specific block. All five share the same sources, filter, and output schema:

```
Task: Research well-reviewed Claude Code skills, plugins, MCP servers, and CLIs for the {PHASE_NAME} phase of building software.

{PHASE_SPECIFIC_CONTEXT}

Sources to scan (priority order):
1. Trusted ecosystems: claude-plugins-official, abiswas97/gemini, openai/codex, modelcontextprotocol/servers
2. Awesome lists: awesome-claude-code, awesome-mcp-servers, awesome-anthropic, awesome-claude-prompts
3. GitHub topic searches: claude-code, claude-skill, model-context-protocol — active in last 90 days
4. Recent signal: HN, Reddit r/ClaudeAI, blog roundups from 2025–2026

Strict inclusion filter: ≥100 GitHub stars OR endorsed by recognized author/Anthropic OR commits in last 90 days.

For each candidate that passes the filter, return:
- name (and slug if it's an installable plugin/MCP)
- source URL
- type: plugin / skill / MCP server / standalone CLI
- which sub-section this fits (e.g. "1.1 Ideation")
- one-line "why this fits {PHASE_NAME}"
- install method: /plugin install <slug>, edit .mcp.json, pnpm/brew install, etc.

If a sub-section has NO qualifying candidate after the search, say so explicitly — that becomes a "(gap)" in the workflow doc.

Save output as a markdown file at the path I'll give you. Format as a section per sub-section with a candidate list under each. Aim for under 800 words total.
```

Per-agent dispatch (five Agent tool calls in ONE message, all `subagent_type: Explore`, thoroughness `"very thorough"`):

| Phase | Sub-sections | Output path |
|---|---|---|
| 1. Define | 1.1 Ideation, 1.2 Research, 1.3 Product requirements (PRDs) | `docs/superpowers/specs/research/2026-04-26-phase-1-define.md` |
| 2. Design | 2.1 UI/UX & prototyping, 2.2 Architecture / technical requirements / specs | `docs/superpowers/specs/research/2026-04-26-phase-2-design.md` |
| 3. Build | 3.1 Plan & delegate, 3.2 Implement, 3.3 Refactor | `docs/superpowers/specs/research/2026-04-26-phase-3-build.md` |
| 4. Verify | 4.1 TDD inner loop, 4.2 Regression / E2E, 4.3 UI-UX QA & perf | `docs/superpowers/specs/research/2026-04-26-phase-4-verify.md` |
| 5. Ship & operate (light pass) | 5.1 Integration & deploy, 5.2 Monitor & maintain | `docs/superpowers/specs/research/2026-04-26-phase-5-ship-operate.md` |

For Phase 5, add to the agent prompt: *"Active-stage note: the user is pre-production. Recommend ONE strong starter per sub-section, not a full menu."*

- [ ] **Step 3: Verify all five research files exist with content**

Run: `ls -la docs/superpowers/specs/research/ && wc -l docs/superpowers/specs/research/*.md`
Expected: 5 files, each non-trivial in length (>20 lines).

- [ ] **Step 4: Commit research artifacts**

```bash
git add docs/superpowers/specs/research/
git commit -m "research: phase 1-5 tool candidates for workflow redesign"
```

---

## Task 6: Phase 1 (Define) — selection gate, install, fill `workflow.md` 1.1–1.3

**Files:**
- Read: `docs/superpowers/specs/research/2026-04-26-phase-1-define.md`
- Modify: `docs/workflow.md` (sub-sections 1.1, 1.2, 1.3)
- Modify: `docs/agent-tooling.md` (add registry rows for any new installs)
- Possibly modify: `~/.claude/.mcp.json`, `.claude/settings.json`, `package.json`, `.mcp.json`

**Steps:**

- [ ] **Step 1: Read the research output for Phase 1**

Run: `cat docs/superpowers/specs/research/2026-04-26-phase-1-define.md`

- [ ] **Step 2: Build a candidates table for the user, one row per qualifying tool**

Format:

```
| Sub-section | Candidate | Source | Why it fits | Replaces / augments | Install type |
|---|---|---|---|---|---|
| 1.1 Ideation | <name> | <url> | <one-liner> | <existing tool or "new" | plugin / MCP / CLI |
| ... |
```

If a sub-section has NO qualifying candidate, write `(gap)` in the candidate column.

- [ ] **Step 3: Use AskUserQuestion to gate installs**

Present the table, then ask one multi-select question per sub-section that has candidates:

```
Question: "Phase 1.1 Ideation — which to install?"
Header: "1.1 install"
multiSelect: true
Options:
- "Install <candidate-A>" — description: "<source / why fits>"
- "Install <candidate-B>" — description: "..."
- "Install none for 1.1" — description: "Use existing setup; 1.1 may end up as (gap)."
```

Repeat for 1.2 and 1.3 if they have candidates. Skip the question if a sub-section has no candidates.

- [ ] **Step 4: Install each user-approved candidate per its install type**

Use the appropriate command per type. Examples:

```bash
# Plugin
/plugin install <marketplace>/<plugin>

# MCP server (project-scoped) — edit .mcp.json
# (use Edit tool to add the stanza, then restart Claude Code by asking the user to /mcp restart or to relaunch)

# Standalone CLI
pnpm add -D <package>     # or
brew install <formula>
```

For MCP edits, after the file change run: `claude mcp list` and confirm the new server appears.

- [ ] **Step 5: Verify each install with an invocation test**

For each newly-installed tool, run a basic invocation:
- Plugin/skill: trigger via `Skill` tool or relevant slash command; confirm it loads.
- MCP: call one of its tools (e.g. via the `mcp__<server>__<tool>` namespace) and confirm a non-error response.
- CLI: run `<bin> --version` or `<bin> --help`.

If any verification fails: **rollback** by reversing the install (`/plugin uninstall`, revert `.mcp.json` change, `pnpm remove`) and proceed without that tool. Mark it `(declined: install failed)` in the doc later.

- [ ] **Step 6: Fill `workflow.md` sub-sections 1.1, 1.2, 1.3 using the four-field template**

Replace the three `_(filled in Task 6)_` placeholders in `docs/workflow.md` with content of the form:

```markdown
### 1.1 Ideation
**Primary:** `<installed-tool-or-existing-tool>` — <one-line context>
**When to use:** <trigger / typical scenario>
**Alternatives:**
- `<alt-tool>` — <one-line tradeoff>
- `<declined-or-not-installed-tool>` — <tradeoff> *(not installed)*
**Registry:** [<tool>](agent-tooling.md#<anchor>)
```

Rules for filling:
- **Primary** is whatever was installed and verified for that sub-section. If nothing was installed AND nothing pre-existing fits, write `Primary: (gap) — no qualifying community option found`.
- **When to use** is one sentence; what triggers reaching for this tool.
- **Alternatives** lists 1–2 options. Tools the user declined to install get a `*(not installed)*` tag.
- **Registry** link must use an anchor that exists in `agent-tooling.md`. If the tool was newly installed, add the anchor in Step 7.

- [ ] **Step 7: Add registry rows in `agent-tooling.md` for each newly installed tool**

For each install, append a row to the appropriate table (Plugins/Skills/Subagents OR MCP servers) in `agent-tooling.md`. Bump `_Last updated: 2026-04-26_` (already today's date).

- [ ] **Step 8: Verify cross-links resolve**

Run:
```bash
grep -oE '\[[^]]+\]\(agent-tooling\.md#[^)]+\)' docs/workflow.md \
  | sed -E 's|.*#([^)]+)\).*|\1|' \
  | while read anchor; do
      grep -qiE "^#+\s.*${anchor//-/[- ]}" docs/agent-tooling.md \
        || echo "BROKEN: $anchor"
    done
```

Expected: no `BROKEN:` lines.

- [ ] **Step 9: Commit Phase 1 (workflow + registry + any settings/mcp/package changes)**

```bash
# Stage only the files that actually changed (the list below is permissive — git skips ones that don't exist or didn't change)
git add docs/workflow.md docs/agent-tooling.md .mcp.json .claude/settings.json package.json pnpm-lock.yaml 2>/dev/null
git status   # confirm no surprise files
git commit -m "docs(workflow): fill Phase 1 (Define) + install approved tools"
```

> **Note on `~/.claude/.mcp.json`:** if you edited the user-level MCP config (outside the repo), it's *not* committed here — that's a host-machine config change. Mention it in the commit message body if it matters.

---

## Task 7: Phase 2 (Design) — selection gate, install, fill `workflow.md` 2.1–2.2

Same pattern as Task 6, applied to Phase 2.

**Files:**
- Read: `docs/superpowers/specs/research/2026-04-26-phase-2-design.md`
- Modify: `docs/workflow.md` (sub-sections 2.1, 2.2)
- Modify: `docs/agent-tooling.md`
- Possibly modify: settings / mcp / package files

**Steps:**

- [ ] **Step 1: Read research output**

Run: `cat docs/superpowers/specs/research/2026-04-26-phase-2-design.md`

- [ ] **Step 2: Build candidates table** (same format as Task 6 Step 2; sub-sections 2.1 and 2.2)

- [ ] **Step 3: AskUserQuestion gate per sub-section** (same shape as Task 6 Step 3)

- [ ] **Step 4: Install approved candidates** (same commands as Task 6 Step 4)

- [ ] **Step 5: Verify each install** (same as Task 6 Step 5)

- [ ] **Step 6: Replace `_(filled in Task 7)_` placeholders for 2.1 and 2.2 in `docs/workflow.md`** using the four-field template (see Task 6 Step 6 for the template and rules)

- [ ] **Step 7: Add registry rows in `agent-tooling.md` for new installs**

- [ ] **Step 8: Verify cross-links resolve** (re-run the grep loop from Task 6 Step 8)

- [ ] **Step 9: Commit**

```bash
git add docs/workflow.md docs/agent-tooling.md .mcp.json .claude/settings.json package.json pnpm-lock.yaml 2>/dev/null
git commit -m "docs(workflow): fill Phase 2 (Design) + install approved tools"
```

---

## Task 8: Phase 3 (Build) — selection gate, install, fill `workflow.md` 3.1–3.3

Same pattern as Task 6, applied to Phase 3.

**Files:**
- Read: `docs/superpowers/specs/research/2026-04-26-phase-3-build.md`
- Modify: `docs/workflow.md` (sub-sections 3.1, 3.2, 3.3)
- Modify: `docs/agent-tooling.md`
- Possibly modify: settings / mcp / package files

**Steps:**

- [ ] **Step 1: Read research output**

Run: `cat docs/superpowers/specs/research/2026-04-26-phase-3-build.md`

- [ ] **Step 2: Build candidates table** (same format as Task 6 Step 2)

- [ ] **Step 3: AskUserQuestion gate per sub-section** (one question each for 3.1, 3.2, 3.3 if they have candidates)

- [ ] **Step 4: Install approved candidates** (same commands as Task 6 Step 4)

- [ ] **Step 5: Verify each install** (same as Task 6 Step 5)

- [ ] **Step 6: Replace `_(filled in Task 8)_` placeholders for 3.1, 3.2, 3.3 in `docs/workflow.md`** using the four-field template

Notes for this phase:
- 3.1 Plan & delegate — `superpowers:writing-plans` and `superpowers:subagent-driven-development` are strong existing primaries; keep unless research surfaces something demonstrably better.
- 3.2 Implement — Claude Code itself is the platform; this sub-section is mostly about complementary tools (refactor helpers, Cursor/Copilot-style extras).
- 3.3 Refactor — `superpowers:simplify` and `codex:rescue` are existing options; new candidates only if they pass the filter.

- [ ] **Step 7: Add registry rows for new installs**

- [ ] **Step 8: Verify cross-links resolve**

- [ ] **Step 9: Commit**

```bash
git add docs/workflow.md docs/agent-tooling.md .mcp.json .claude/settings.json package.json pnpm-lock.yaml 2>/dev/null
git commit -m "docs(workflow): fill Phase 3 (Build) + install approved tools"
```

---

## Task 9: Phase 4 (Verify) — selection gate, install, fill `workflow.md` 4.1–4.3

Same pattern as Task 6, applied to Phase 4.

**Files:**
- Read: `docs/superpowers/specs/research/2026-04-26-phase-4-verify.md`
- Modify: `docs/workflow.md` (sub-sections 4.1, 4.2, 4.3)
- Modify: `docs/agent-tooling.md`
- Possibly modify: settings / mcp / package files

**Steps:**

- [ ] **Step 1: Read research output**

Run: `cat docs/superpowers/specs/research/2026-04-26-phase-4-verify.md`

- [ ] **Step 2: Build candidates table**

- [ ] **Step 3: AskUserQuestion gate** (one question each for 4.1, 4.2, 4.3 if they have candidates)

- [ ] **Step 4: Install approved candidates**

- [ ] **Step 5: Verify each install**

- [ ] **Step 6: Replace `_(filled in Task 9)_` placeholders for 4.1, 4.2, 4.3 in `docs/workflow.md`** using the four-field template

Notes for this phase:
- 4.1 TDD inner loop — strong existing primary: `superpowers:test-driven-development` + `tdd-guard`. Keep.
- 4.2 Regression / E2E — Playwright MCP exists. Look for community helpers that build on it.
- 4.3 UI-UX QA & perf — likely the area with the most room for new tooling (visual regression, Lighthouse-style perf, accessibility checks). Mark `(gap)` if nothing qualifies.

- [ ] **Step 7: Add registry rows for new installs**

- [ ] **Step 8: Verify cross-links resolve**

- [ ] **Step 9: Commit**

```bash
git add docs/workflow.md docs/agent-tooling.md .mcp.json .claude/settings.json package.json pnpm-lock.yaml 2>/dev/null
git commit -m "docs(workflow): fill Phase 4 (Verify) + install approved tools"
```

---

## Task 10: Phase 5 (Ship & operate) — light selection gate, fill `workflow.md` 5.1–5.2

Lighter-touch version of the per-phase pattern. Spec says: name the activity, suggest one starter, expand later.

**Files:**
- Read: `docs/superpowers/specs/research/2026-04-26-phase-5-ship-operate.md`
- Modify: `docs/workflow.md` (sub-sections 5.1, 5.2)
- Modify: `docs/agent-tooling.md` (only if a new install lands)

**Steps:**

- [ ] **Step 1: Read research output**

Run: `cat docs/superpowers/specs/research/2026-04-26-phase-5-ship-operate.md`

- [ ] **Step 2: Build a starter table** — at most ONE candidate per sub-section, not a full menu

- [ ] **Step 3: AskUserQuestion gate** — single question:

```
Question: "Phase 5 (Ship & operate) — install any starters now, or defer?"
Header: "Phase 5"
multiSelect: true
Options:
- "Install <5.1 starter>" — description: "<source / why fits>"
- "Install <5.2 starter>" — description: "..."
- "Defer all Phase 5 installs" — description: "Document the recommended starters in workflow.md without installing; revisit when you actually deploy."
```

- [ ] **Step 4: Install any approved starters** (same install commands as Task 6 Step 4)

- [ ] **Step 5: Verify any installs**

- [ ] **Step 6: Replace `_(filled in Task 10)_` placeholders for 5.1 and 5.2 with brief entries**

Use a *trimmed* version of the four-field template — Primary may be `(deferred)` and Alternatives may be a single line:

```markdown
### 5.1 Integration & deploy
**Primary:** Vercel — frictionless Next.js deploy from Git, current Launchpad target
**When to use:** Pushing changes to main; preview deploys for PRs.
**Alternatives:**
- (deferred) — expand when production-stage
**Registry:** [Vercel](agent-tooling.md#vercel) *(if installed)* or omit registry link if no install
```

- [ ] **Step 7: Add registry rows for any new installs**

- [ ] **Step 8: Verify cross-links resolve**

- [ ] **Step 9: Commit**

```bash
git add docs/workflow.md docs/agent-tooling.md .mcp.json .claude/settings.json package.json pnpm-lock.yaml 2>/dev/null
git commit -m "docs(workflow): fill Phase 5 (Ship & operate) — light pass"
```

---

## Task 11: Update CLAUDE.md "Agent tooling reference" line to point at both files

**Files:**
- Modify: `CLAUDE.md` (the "Agent tooling reference" section near the bottom)

**Steps:**

- [ ] **Step 1: Read the current section to confirm exact text**

Run: `grep -n "Agent tooling reference" CLAUDE.md`

(Current text from baseline:
```
## Agent tooling reference

A cheat sheet of installed plugins, skills, MCPs, and subagents lives at `docs/agent-tooling.md`. **Whenever a plugin, skill, MCP server, or subagent is added, removed, or reconfigured, update that file in the same change and bump its `Last updated` date.**
```
)

- [ ] **Step 2: Replace the section with the two-file pointer**

Use the Edit tool to replace the section above with:

```markdown
## Agent tooling reference

Two complementary docs:
- [`docs/workflow.md`](docs/workflow.md) — **when** to reach for a tool (activity-mapped, day-to-day reference).
- [`docs/agent-tooling.md`](docs/agent-tooling.md) — **where** each tool lives (registry: source, scope, install, config).

**Update rule:** when a plugin / skill / MCP server / subagent is added, removed, or reconfigured, update **both** files in the same change and bump each file's `Last updated` date.
```

- [ ] **Step 3: Verify the edit landed**

Run: `grep -A6 "Agent tooling reference" CLAUDE.md`
Expected: section now references both `workflow.md` and `agent-tooling.md` with the "when vs where" steer, and the update rule mentions both files.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE): point Agent tooling reference at workflow.md + registry"
```

---

## Task 12: Final verification — link resolution test + walkthrough

**Files:**
- Read: `docs/workflow.md`, `docs/agent-tooling.md`

**Steps:**

- [ ] **Step 1: Run the full link resolution test across `workflow.md` → `agent-tooling.md`**

```bash
grep -oE '\[[^]]+\]\(agent-tooling\.md#[^)]+\)' docs/workflow.md \
  | sed -E 's|.*#([^)]+)\).*|\1|' \
  | sort -u \
  | while read anchor; do
      # Convert markdown header text → GitHub-style anchor (lowercase, spaces→dashes, drop punctuation)
      if grep -iE "^#+\s" docs/agent-tooling.md \
           | sed -E 's/^#+\s+//; s/[^a-zA-Z0-9 -]//g; s/ /-/g' \
           | tr 'A-Z' 'a-z' \
           | grep -qx "$anchor"; then
        echo "OK:     $anchor"
      else
        echo "BROKEN: $anchor"
      fi
    done
```

Expected: every line starts with `OK:`. If any `BROKEN:` lines, fix the corresponding header in `agent-tooling.md` (or the link in `workflow.md`) and re-run.

- [ ] **Step 2: Verify all 13 sub-sections in `workflow.md` are populated (no leftover placeholders)**

Run: `grep -c "_(filled in Task" docs/workflow.md`
Expected: `0`.

- [ ] **Step 3: Verify the four-field template is present in every sub-section**

Run:
```bash
awk '/^### [0-9]/{section=$0; primary=when=alt=reg=0; next}
     /\*\*Primary:\*\*/{primary=1}
     /\*\*When to use:\*\*/{when=1}
     /\*\*Alternatives:\*\*/{alt=1}
     /\*\*Registry:\*\*/{reg=1}
     /^### [0-9]|^## [0-9]/{
       if (section!="" && (primary+when+alt+reg)<4) print "INCOMPLETE:", section, "primary="primary" when="when" alt="alt" reg="reg
     }
     END{if (section!="" && (primary+when+alt+reg)<4) print "INCOMPLETE:", section}' docs/workflow.md
```

Expected: no output (every sub-section has all four fields).

Note: Phase 5 sub-sections may legitimately have abbreviated entries; if so, accept "INCOMPLETE" lines for `### 5.1` and `### 5.2` and verify them manually.

- [ ] **Step 4: Walkthrough test — pretend you're starting Lab Experiment 1 (AI Conversational App)**

Manual check (no command):
1. Open `docs/workflow.md`.
2. Walk down the phases as if planning Experiment 1: Define → Design → Build → Verify.
3. At each sub-section, confirm the Primary tool reads as actionable ("I'd know what to do") and the Registry link goes somewhere useful.
4. If any sub-section is confusing or the link is dead, fix and re-run Step 1.

- [ ] **Step 5: Move the active plan to completed**

```bash
mkdir -p docs/plans/completed
mv docs/plans/active/2026-04-26-1823-workflow-redesign.md docs/plans/completed/
```

- [ ] **Step 6: Final commit**

```bash
git add CLAUDE.md docs/workflow.md docs/agent-tooling.md docs/plans/
git status   # sanity check
git commit -m "docs: complete workflow + registry redesign; verify cross-links"
```

---

## Summary

12 tasks. Tasks 1–4 (scaffolding + skeletons) are mechanical and fast. Task 5 fans out 5 parallel research agents. Tasks 6–10 are the core loop: per-phase research-read → user gate → install → verify → fill workflow.md + registry → commit. Tasks 11–12 wrap with the CLAUDE.md pointer update and final verification.

Each phase task (6–10) requires user input at Step 3 (the AskUserQuestion gate). All other steps are deterministic.
