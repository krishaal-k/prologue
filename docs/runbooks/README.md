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
