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
**Primary:** `superpowers:brainstorming` — hook-activates before creative work; refines a rough idea through Q&A and saves a design doc to `docs/superpowers/specs/`.
**When to use:** You have a feature, change, or experiment in mind but haven't pinned down requirements, scope, or alternatives.
**Alternatives:**
- `compound-engineering` `/ce-ideate` + `/ce-brainstorm` — divergent generation + critique then interactive refinement; better when you want the system to surface candidate ideas first.
- Plain conversation — fine for trivial / obvious changes that don't warrant a spec.
**Registry:** [`superpowers`](agent-tooling.md#superpowers)

### 1.2 Research
**Primary:** `compound-engineering` `ce-web-researcher` sub-agent — iterative web research that returns structured external grounding (prior art, market signals, cross-domain analogies) instead of a raw link list.
**When to use:** You need synthesized external context — competitor scans, prior art, or "what's the state of X in 2026" — to inform ideation, planning, or framing.
**Alternatives:**
- Built-in `WebSearch` + `WebFetch` — ad-hoc queries when you need links, not synthesis.
- Exa / Tavily / Firecrawl MCPs — *(not installed; require paid API keys, declined per project preference)*.
**Registry:** [`compound-engineering`](agent-tooling.md#compound-engineering)

### 1.3 Product requirements (PRDs)
**Primary:** `prd-taskmaster` skill — discovery interview → codebase analysis → detailed PRD with 13 quality checks; bridges naturally into a task breakdown for Build (3.1).
**When to use:** A product-shaped change that's big enough that "what to build" isn't obvious from the issue title — real users, success metrics, multiple stakeholders. Save output to `docs/prds/`.
**Alternatives:**
- `compound-engineering` `/ce-brainstorm` → `/ce-plan` — lighter loop; better for solo / internal work where ceremony around a full PRD is overhead.
- Skip the PRD — small fixes, refactors, and obvious features don't need one (per `docs/prds/README.md`).
**Registry:** [`prd-taskmaster`](agent-tooling.md#prd-taskmaster)

## 2. Design

### 2.1 UI/UX & prototyping
**Primary:** `compound-engineering` `ce-frontend-design` — opinionated builder for distinctive web interfaces (composition, typography, color, motion, copy); detects existing design system, verifies via screenshots before declaring done.
**When to use:** Any frontend work — landing page, page section, interactive component, or visual refresh — where "looks generically AI-ish" is a real risk.
**Alternatives:**
- `frontend-design:frontend-design` (Anthropic plugin) — same problem space, simpler scope; reach for it when you want one-shot polish on a single component.
- `magicui` MCP — when you specifically want animated React + Tailwind primitives (marquees, blur fades, beams) to drop into a hero / showcase.
- Plain conversation + Tailwind v4 — for tiny tweaks where invoking a design skill is overkill.
**Registry:** [`compound-engineering`](agent-tooling.md#compound-engineering) · [`frontend-design`](agent-tooling.md#frontend-design) · [`magicui`](agent-tooling.md#magicui)

### 2.2 Architecture, technical requirements & specs
**Primary:** `superpowers:writing-plans` — produces a structured implementation plan with files, steps, and verification before code; pairs directly with `superpowers:subagent-driven-development` and `superpowers:executing-plans`.
**When to use:** A non-trivial change with >2 steps, multiple files, or any architectural choice. Save output to `docs/plans/active/` per project convention.
**Alternatives:**
- `compound-engineering` `/ce-plan` — better when the plan is non-software (research workflows, study plans) or when you want to deepen an existing plan with parallel sub-agent review.
- `c4-architecture:c4-architecture` — when you specifically need C4 diagrams (Context / Container / Component / Code) for a system you're documenting or onboarding to.
- `superpowers:brainstorming` first if the spec / requirements aren't clear yet.
**Registry:** [`superpowers`](agent-tooling.md#superpowers) · [`compound-engineering`](agent-tooling.md#compound-engineering) · [`c4-architecture`](agent-tooling.md#c4-architecture)

## 3. Build

### 3.1 Plan & delegate
**Primary:** `superpowers:writing-plans` + `superpowers:subagent-driven-development` — produces a structured plan in `docs/plans/active/`, then dispatches a fresh subagent per task with two-stage review (spec compliance → code quality).
**When to use:** Default for any non-trivial implementation. The pair gives you scoped context per task and an automatic review gate before each commit.
**Alternatives:**
- `compound-engineering` `/ce-plan` + `/ce-work` — newer alternative with deepening passes and parallel sub-agent review; reach for non-software plans or when you want a different orchestration style.
- `codex:rescue` / `gemini:rescue` — when one task is stuck and you want a second-opinion implementation pass.
**Registry:** [`superpowers`](agent-tooling.md#superpowers) · [`compound-engineering`](agent-tooling.md#compound-engineering)

### 3.2 Implement
**Primary:** Claude Code itself — the writer. The complement that matters most is fresh, version-correct documentation.
**When to use:** Any time you write code. Pull `context7` proactively when touching Next.js 16, React 19, or Tailwind v4 surfaces (per `AGENTS.md`).
**Alternatives:**
- `context7` MCP — version-pinned framework docs on demand; counters the "this is NOT the Next.js you know" warning.
- `serena` MCP — symbol-aware retrieval and cross-file edits when you're navigating an unfamiliar area or moving symbols.
- `superpowers:test-driven-development` — for any feature or bugfix, before writing implementation code (TDD-Guard hooks gate `pnpm test`).
**Registry:** [`context7`](agent-tooling.md#context7) · [`serena`](agent-tooling.md#serena) · [`superpowers`](agent-tooling.md#superpowers)

### 3.3 Refactor
**Primary:** `serena` MCP — LSP-backed rename and reference lookup; safer than text-level edits for type-aware moves.
**When to use:** Any non-trivial rename, symbol move, or cross-file restructure. Also when you need a reference list before deleting something.
**Alternatives:**
- `superpowers:simplify` — review-driven pass to reduce a recently-changed area to its minimum.
- `codex:rescue` — second-opinion pass when a refactor is stuck or has subtle correctness implications.
- `ast-grep-mcp` — *(not installed; deferred until codebase-wide pattern rewrites become necessary)*.
**Registry:** [`serena`](agent-tooling.md#serena) · [`superpowers`](agent-tooling.md#superpowers) · [`codex`](agent-tooling.md#codex)

## 4. Verify

### 4.1 TDD inner loop
**Primary:** `superpowers:test-driven-development` + `tdd-guard` — Red-Green-Refactor is hook-enforced on the Vitest loop (`pnpm test`). One failing test at a time, minimal implementation, refactor only with tests green.
**When to use:** Implementing any feature or bugfix at the unit / component level. Before writing implementation code.
**Alternatives:**
- Manual TDD discipline at the e2e layer — TDD-Guard does NOT gate Playwright; write the failing flow first, treat as a separate cadence.
- Storybook MCP `@storybook/addon-mcp` — *(not installed; revisit if a Storybook workshop is adopted for component-level TDD)*.
**Registry:** [`superpowers`](agent-tooling.md#superpowers) · [`tdd-guard`](agent-tooling.md#tdd-guard)

### 4.2 Regression / E2E
**Primary:** Playwright + Playwright MCP with built-in `toHaveScreenshot()` for visual regression — baselines committed to repo, free, no SaaS dependency. Specs live in `e2e/`.
**When to use:** A user-facing flow is shipping; capture the golden path as an e2e spec, and capture key screens as visual baselines. Re-run after refactors or design changes.
**Alternatives:**
- `playwright-cli-agents` plugin — *(not installed; reconsider if the e2e backlog grows enough that planner / generator / healer agents pay off)*.
- Chromatic / Percy / Applitools — *(not installed; commercial visual-regression services, excluded by project preference)*.
**Registry:** [`playwright`](agent-tooling.md#playwright)

### 4.3 UI-UX QA & perf
**Primary:** `chrome-devtools` MCP — official Google ChromeDevTools server giving Lighthouse audits, perf traces, CrUX field data, console / network inspection, screenshots, and emulation through one server.
**When to use:** Pre-merge perf or accessibility check on a changed page; hunting an LCP regression; verifying a fix landed against the metric you care about. Pair with `mcp__playwright__browser_navigate` to reach the URL.
**Alternatives:**
- `a11y-mcp` (axe-core MCP) — *(not installed; chrome-devtools-mcp's a11y coverage is sufficient for a portfolio's scale)*.
- `unlighthouse` via `pnpm dlx unlighthouse --site http://localhost:3000` — site-wide pre-launch sweep across all routes; on-demand, no install.
- Manual DevTools session in browser — when the MCP is overkill or you need a flame chart only humans can read.
**Registry:** [`chrome-devtools`](agent-tooling.md#chrome-devtools) · [`playwright`](agent-tooling.md#playwright)

## 5. Ship & operate

> **Active-stage emphasis:** this phase stays brief until you actually have something running in production. Each sub-section names the activity and one starter tool; expand when production-stage.

### 5.1 Integration & deploy

_(filled in Task 10)_

### 5.2 Monitor & maintain

_(filled in Task 10)_
