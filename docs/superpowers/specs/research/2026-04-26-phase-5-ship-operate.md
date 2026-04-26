# Phase 5: Ship & Operate — Tooling Research

**Date:** 2026-04-26
**Stage note:** User is **pre-production** (Next.js portfolio, solo PM, already on Vercel). Recommendations skewed toward "install one starter that pays off the moment you hit prod, defer everything else." Less is more.

## Summary

- **5.1 Integration & deploy:** Install **Vercel MCP** now. The user is already on Vercel; this gives Claude Code direct read access to deployments and build logs without hand-pasting URLs. Tiny install, immediate payoff once `pnpm build` starts shipping to a remote.
- **5.2 Monitor & maintain:** **Defer.** Sentry MCP is the obvious future pick (official, ~667 stars, OAuth, no local install), but installing observability tooling before there are users or errors is pure noise. Revisit the day Sentry is wired into the Next.js app.

---

## 5.1 Integration & deploy

### Vercel MCP (official)

- **Type:** MCP server (remote, hosted by Vercel)
- **Source:** https://vercel.com/docs/agent-resources/vercel-mcp · announcement: https://vercel.com/blog/introducing-vercel-mcp-connect-vercel-to-your-ai-tools
- **Why:** Official Vercel-maintained remote MCP. OAuth, read-only by default. Lets Claude Code search Vercel docs, list projects/deployments, and pull build + runtime logs — exactly the loop a solo PM hits when a Vercel deploy goes red. Zero local process to manage.
- **Inclusion filter:** Endorsed by Anthropic + Vercel (announced as official integration); actively maintained on `mcp.vercel.com`.
- **Install:**
  ```bash
  claude mcp add --transport http vercel https://mcp.vercel.com
  ```
  Then authenticate via OAuth on first use. Scope to project-level if/when write actions are needed.

---

## 5.2 Monitor & maintain

**(defer until production-stage)**

No tool earns its keep here pre-prod. The portfolio site has no users, no traffic, no error stream, and no SLO. Installing uptime/log/APM tooling now adds setup cost and dashboard clutter for zero signal.

**When this changes — pre-vetted pick to install on day one of prod:**

- **Sentry MCP** — https://github.com/getsentry/sentry-mcp (~667 stars, official `getsentry` org, production-ready, hosted at `https://mcp.sentry.dev/mcp`).
- Install (deferred):
  ```bash
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
  ```
  Or as a plugin for subagent delegation:
  ```bash
  claude plugin marketplace add getsentry/sentry-mcp
  claude plugin install sentry-mcp@sentry-mcp
  ```
- **Trigger to install:** the moment `@sentry/nextjs` lands in `package.json` and a real DSN is set. Until then, no value.

Other categories considered and skipped pre-prod: Datadog MCP (overkill + paid), uptime monitors (Vercel already pings deployments), log aggregators (Vercel log drains cover the portfolio's volume), runbook generators (premature — no incidents to template from yet).
