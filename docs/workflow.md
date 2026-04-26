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
