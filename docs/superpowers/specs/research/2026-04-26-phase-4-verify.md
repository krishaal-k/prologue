# Phase 4 (Verify) — Tooling Research

**Date:** 2026-04-26
**Scope:** Solo PM building a Next.js 16 portfolio. Existing Verify stack: `superpowers:test-driven-development` + `tdd-guard` on Vitest, Playwright + `mcp__playwright`, ESLint 9.

## Summary table

| Tool | Type | Sub-section | Stars | Last active | Install |
|---|---|---|---|---|---|
| chrome-devtools-mcp | MCP | 4.3 | 37.2k | Apr 22 2026 | `npx chrome-devtools-mcp@latest` |
| Lighthouse MCP (priyankark) | MCP | 4.3 | 135 | recent | `npx lighthouse-mcp` |
| Lighthouse MCP (danielsogl) | MCP | 4.3 | 56 | Apr 5 2026 | `npx @danielsogl/lighthouse-mcp@latest` |
| a11y-mcp (priyankark) | MCP | 4.3 | 40 | active | `npx a11y-mcp` |
| Axe MCP Server (Deque, official) | MCP | 4.3 | low | active | Docker + Deque API key |
| Unlighthouse | CLI | 4.3 | 3.4k+ | active | `npx unlighthouse --site …` |
| OneRedOak design-review workflow | Skill/agent set | 4.3 / 4.2 | 3.8k | active | clone + copy to `.claude/` |
| playwright-cli-agents (yusuftayman) | Plugin (agents+skills) | 4.2 | 19 | active | `/plugin marketplace add yusuftayman/playwright-cli-agents` |
| Storybook MCP (`@storybook/addon-mcp`) | MCP (addon) | 4.1 / 4.2 | (official Storybook) | active | `npx storybook add @storybook/addon-mcp` |
| Playwright `toHaveScreenshot()` | Built-in | 4.2 | n/a | n/a | already installed via Playwright |

Inclusion filter passed via either ≥100 stars, official/recognized author (Anthropic, Google ChromeDevTools, Deque, Storybook, Playwright), or active commits in last 90 days.

---

## 4.1 TDD inner loop

Already covered by `superpowers:test-driven-development` + `tdd-guard-vitest`. **No additional standalone tool clears the bar as a complement here.** The one adjacent option worth flagging only if Storybook is adopted later:

- **Storybook MCP addon** (`@storybook/addon-mcp`, official) — exposes component metadata, stories, and the Test Runner to Claude. Useful for component-level TDD if a Storybook workshop is adopted; otherwise overkill for a portfolio. Source: https://storybook.js.org/addons/@storybook/addon-mcp

## 4.2 Regression / E2E

Existing Playwright + Playwright MCP already covers the core. Complements:

- **playwright-cli-agents** — Claude Code plugin (Planner / Generator / Healer agents + `playwright-cli` and `e2e` skills) that drives Page Object Model E2E generation and self-heals failing specs. Pairs cleanly with Playwright MCP. 19 stars but recent, recognized pattern. Install: `/plugin marketplace add yusuftayman/playwright-cli-agents` then `/plugin install playwright-cli-agents@playwright-cli-agents`. Source: https://github.com/yusuftayman/playwright-cli-agents
- **Playwright built-in `toHaveScreenshot()`** — visual regression with pixelmatch, mask/threshold/maxDiffPixels options. Zero new dependency, baselines committed to repo. Strongest fit for a solo portfolio (free, no SaaS). Already callable from existing Playwright install.
- **OneRedOak `design-review`** (also in 4.3) — drives Playwright through specialized Claude agents to catch visual + UX regressions. 3.8k stars. Source: https://github.com/OneRedOak/claude-code-workflows/tree/main/design-review

Skipped (commercial / heavyweight for a solo portfolio): Chromatic MCP, Percy, Applitools, BackstopJS.

## 4.3 UI-UX QA & perf

Most candidates live here. Recommended primaries:

- **chrome-devtools-mcp** (Google ChromeDevTools, 37.2k stars, v0.23.0 Apr 22 2026) — single MCP that gives Claude trace recording, Lighthouse audits, CrUX field data, network/console inspection, screenshots, DOM snapshots, and emulation. **Top pick** — broadest coverage, official, actively shipped. Source: https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Lighthouse MCP — priyankark/lighthouse-mcp** (135 stars) — focused Lighthouse runner for an agentic optimize-and-rerun loop. Lighter alternative if Chrome DevTools MCP feels too broad. Source: https://github.com/priyankark/lighthouse-mcp
- **Lighthouse MCP — danielsogl/lighthouse-mcp-server** (56 stars, Apr 5 2026, 13+ tools incl. SEO + security) — picks if you want deeper categorical breakdowns. Source: https://github.com/danielsogl/lighthouse-mcp-server
- **a11y-mcp** (priyankark, 40 stars) — axe-core-powered accessibility audits exposed as MCP tools, designed for an agentic remediation loop. Free; sufficient for a portfolio. Source: https://github.com/priyankark/a11y-mcp
- **Axe MCP Server (Deque, official)** — enterprise-grade axe with remediation guidance. Requires Axe DevTools subscription + Docker. Mention only — overkill for solo PM. Source: https://github.com/dequelabs/axe-mcp-server-public
- **Unlighthouse** (standalone CLI) — site-wide parallel Lighthouse from sitemap/crawl, dashboard output. Best for pre-launch sweeps across all portfolio routes. Run via `npx unlighthouse --site http://localhost:3000`. Source: https://unlighthouse.dev/
- **OneRedOak `design-review` workflow** (3.8k stars) — opinionated Claude agents that run Playwright + accessibility + visual checks against a design spec. Source: https://github.com/OneRedOak/claude-code-workflows

**Skipped / failed filter:** `AgentDeskAI/browser-tools-mcp` (7.2k stars but explicitly archived, "NO LONGER ACTIVE — use a different solution"); `ncosentino/google-psi-mcp` (1 star, fails filter).

---

## Recommended minimal addition for this project

1. `chrome-devtools-mcp` (covers Lighthouse + perf + a11y traces in one official MCP).
2. `a11y-mcp` (cheap dedicated axe loop; complements 1).
3. Adopt Playwright `toHaveScreenshot()` natively for visual regression — no new tool needed.
4. Optional: `unlighthouse` via `pnpm dlx` for pre-deploy site-wide sweeps.
5. Optional: `playwright-cli-agents` if E2E backlog grows.
