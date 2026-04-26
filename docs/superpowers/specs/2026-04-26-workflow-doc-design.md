# Workflow Documentation Redesign — Spec

_Created: 2026-04-26_

## Context

`docs/agent-tooling.md` is currently a tool-organized inventory: plugins → slash commands → skills → subagents → MCP servers → config. It answers "what do I have installed?" well. It does not answer the more frequent day-to-day question: "I'm at step X — what should I reach for?"

The user is a PM building their first software portfolio (the "Launchpad" project). They are early in the roadmap (Track 1 just scaffolded; first Lab experiment still ahead) and want a workflow-shaped reference that maps each phase of building (ideation → ship) to a concrete primary tool plus a couple of vetted alternatives. They also have a saved preference: **prefer well-reviewed community skills/tools over hand-rolled custom code** — search awesome-lists / marketplaces before building.

**Outcome:** Two complementary docs, each answering one question:
- `docs/workflow.md` → *"what should I use right now?"* (lean, activity-mapped, day-to-day reference)
- `docs/agent-tooling.md` → *"where does this tool live and how is it configured?"* (pure registry; no usage guidance)

## Files affected

| File | Action |
|---|---|
| `docs/workflow.md` | **Create.** Activity-mapped, primary + alternatives, lean. |
| `docs/agent-tooling.md` | **Rewrite.** Stripped to a toolkit registry (no "when to use" prose). |
| `CLAUDE.md` | **Edit.** Update "Agent tooling reference" line to point at both files with a one-line steer. |
| `docs/prds/` | **Create folder** with a stub README explaining intent + filename convention. |
| `docs/runbooks/` | **Create folder** with a stub README. |
| `docs/superpowers/specs/` | Exists by `superpowers:brainstorming` convention. No action. |
| `docs/plans/{active,completed,abandoned}/` | No change. Already established. |

## `workflow.md` — structure

### Top of file
1. Title + 1-paragraph intro: *"At step X, reach for tool Y. For where tools live, see agent-tooling.md."*
2. **Cross-cutting tools callout** — a small block listing rescue/duck tools (`codex:rescue`, `gemini:rescue`, `mcp-rubber-duck`) with one line: *valid in any phase; not duplicated below.*
3. Table of contents.

### Five phases
```
1. Define          → 1.1 Ideation · 1.2 Research · 1.3 Product requirements (PRDs)
2. Design          → 2.1 UI/UX & prototyping · 2.2 Architecture, technical requirements & specs
3. Build           → 3.1 Plan & delegate · 3.2 Implement · 3.3 Refactor
4. Verify          → 4.1 TDD inner loop · 4.2 Regression / E2E · 4.3 UI-UX QA & perf
5. Ship & operate  → 5.1 Integration & deploy · 5.2 Monitor & maintain (incl. runbooks)
```

(Documentation is not a phase — it's distributed: PRDs in 1.3, specs in 2.2, plans in 3.1, runbooks in 5.2, READMEs/inline throughout Build.)

### Per-subsection template — fixed four fields, in order

```markdown
### N.N <name>
**Primary:** <tool/skill> — <one-line context>
**When to use:** <trigger / typical scenario>
**Alternatives:**
- <option> — <one-line tradeoff>
- (gap) — <only used when no qualifying community option exists>
**Registry:** [<tool>](agent-tooling.md#<anchor>)
```

No extra fields. Install paths, sources, versions are banned from this file — they live in the registry.

### Active-stage emphasis
Phases 1–4 carry full primary + 1–2 alternatives.
Phase 5 is brief: name the activity, suggest one starter (e.g. Vercel for deploy), explicitly mark *"expand when production-stage."* Avoids stale aspirational content.

## `agent-tooling.md` (registry) — structure

```markdown
# Agent Tooling Registry
_Last updated: YYYY-MM-DD_

> The "where it lives" doc. For "when to use", see [workflow.md](workflow.md).

## Plugins / Skills / Subagents
| Tool | Type | Scope | Source | Notes |

## MCP servers
| Server | Source | Config | Notes |

## Project-local config
- `.claude/settings.local.json` — ...
- `.claude/tdd-guard/data/instructions.md` — ...
- `vitest.config.ts`, `playwright.config.ts` — ...
- `docs/plans/{active,completed,abandoned}/` — ...

## External docs
- (consolidated link list)
```

Headings carry stable anchors (`#tdd-guard`, `#superpowers-brainstorming`, etc.) so `workflow.md` can deep-link.

## Doc taxonomy (folded-in "Document" phase)

| Type | Lives at | Created by | Hands off to |
|---|---|---|---|
| **PRD** | `docs/prds/YYYY-MM-DD-<slug>.md` | Manual + Claude Q&A | Spec |
| **Spec** (design) | `docs/superpowers/specs/YYYY-MM-DD-<slug>-design.md` | `superpowers:brainstorming` | Plan |
| **Plan** | `docs/plans/{active,completed,abandoned}/YYYY-MM-DD-HHMM-<slug>.md` | `superpowers:writing-plans` | Code |
| **Issue** | GitHub Issues | Manual | Plan or direct fix |
| **Runbook** | `docs/runbooks/<slug>.md` | Manual, after first incident | — |
| **README / inline** | In code tree | During Build | — |

**Lifecycle:** idea → PRD → Spec → Plan → Code → Runbook. Each successor links back via front-matter (e.g. `spec_for: prds/2026-04-26-foo.md`).

ADRs intentionally excluded — overkill for solo work; specs already capture decisions. Easy to add later.

## Cross-cutting tools

`codex:rescue`, `gemini:rescue`, `mcp-rubber-duck` (and future router-style tools) appear in the registry **once**. Surfaced in `workflow.md` via the top-of-file callout so they aren't listed as a default alternative in every sub-section. Per-section entries should mention them only when they're the *primary* fit for that specific activity (e.g. "rescue from a stuck refactor" might list `codex:rescue` as primary).

## Maintenance

One rule, both files:
> When a plugin / skill / MCP / subagent is added, removed, or reconfigured, update **`workflow.md` AND `agent-tooling.md`** in the same change, and bump each file's `Last updated` date.

The existing CLAUDE.md update rule will be amended to cover both files.

## Research plan (executed during implementation)

The follow-on implementation plan dispatches Explore agents to find well-reviewed community tools per phase, in this priority order:

1. **Trusted ecosystems already installed:** `claude-plugins-official`, `abiswas97/gemini`, `openai/codex`, `modelcontextprotocol/servers`
2. **Awesome lists:** `awesome-claude-code`, `awesome-mcp-servers`, `awesome-anthropic`, `awesome-claude-prompts`
3. **GitHub topic searches:** `claude-code`, `claude-skill`, `model-context-protocol` — active in last 90 days
4. **Recent signal:** HN, Reddit r/ClaudeAI, 2025–2026 blog roundups

**Inclusion filter (strict):** ≥100 ⭐ **OR** endorsed by recognized author/Anthropic **OR** commits in last 90 days. Each candidate gets a one-line "why this fits phase X" justification before landing in the doc.

For sub-sections where nothing qualifies after the search: mark `(gap)` explicitly rather than recommend a weak option.

## Selection & installation (in scope)

After research yields candidates per phase, the implementation proceeds in this order:

1. **Selection gate, per phase.** Present a shortlist of *new* tools that would become primaries or replace current ones. For each: name, source, why it fits this phase, what it replaces or augments, install type (plugin / MCP server / standalone CLI).
2. **User confirms install** — per-tool approval, or batch "yes to all in this phase". Defaults to nothing installed without explicit approval.
3. **Install** in dependency order, by type:
   - **Plugins:** `/plugin install <marketplace>/<plugin>` and enable in settings.
   - **MCP servers:** edit `.mcp.json` (project) or `~/.claude/.mcp.json` (user), restart Claude Code, confirm with `claude mcp list`.
   - **Skills:** usually bundled with plugins; if standalone, drop into the appropriate skills directory.
   - **Standalone CLIs:** `pnpm add` / `brew install` / etc. as appropriate.
4. **Verify each install.** Confirm visible via `/plugin`, `/skills`, `/agents`, or `claude mcp list` (whichever applies), then run a basic invocation (e.g. trigger the skill, call a tool) and confirm it works.
5. **Reflect reality in docs.** Both `workflow.md` (primary entries) and `agent-tooling.md` (registry rows) get written *after* installs complete, so they describe what's actually present.

Recommendations the user declines to install still appear in `workflow.md` as **Alternatives** with a `(not installed)` marker — they remain on the radar without polluting the registry.

**Rollback rule:** if a new install breaks an existing workflow (e.g. a hook conflict, an MCP that crashes), uninstall and revert before proceeding to the next install.

## Verification (how to know it's done)

1. `docs/workflow.md` exists with all 5 phases and 13 sub-sections present, each carrying the four-field template (or marked `(gap)`).
2. `docs/agent-tooling.md` rewritten as registry: no "when to use" prose; pure inventory tables + config pointers + link list.
3. **Link resolution test:** every `[tool](agent-tooling.md#anchor)` in `workflow.md` lands on a real anchor in the registry. (Run a quick markdown link checker or grep.)
4. `docs/prds/` and `docs/runbooks/` directories exist with stub READMEs explaining intent and filename convention.
5. `CLAUDE.md` "Agent tooling reference" line updated to reference both files with the one-line steer (when vs where).
6. **Walkthrough test:** starting from a representative task ("I'm about to start Lab Experiment 1"), the user opens `workflow.md`, picks the matching sub-section, lands on the Primary tool, and (if curious) follows the registry link to install/source info — without confusion about which file to consult.
7. **Installs verified.** Every newly-installed plugin / MCP server / skill / CLI is visible via the appropriate listing command and passes a basic invocation test. Declined recommendations are tagged `(not installed)` in `workflow.md`.
8. `Last updated: 2026-04-26` on both rewritten files.

## Out of scope

- Writing the PRDs, runbooks, or specs themselves (only folder + stub READMEs created).
- Migrating existing entries in `docs/plans/` into a new format.
- Authoring ADRs (deferred — specs cover this for now).
- Building new custom skills / subagents from scratch — per saved preference, only well-reviewed community options are evaluated. Custom builds are a separate future spec if a `(gap)` proves blocking.
