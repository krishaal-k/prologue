# Product Requirement Documents (PRDs)

PRDs answer **what** problem we're solving, for whom, and what success looks like — *before* design or implementation.

## When to write one
Big enough that "what to build" isn't obvious from the issue title. Small fixes, refactors, and obvious features don't need a PRD.

## Filename convention
`YYYY-MM-DD-<slug>.md` — e.g. `2026-04-26-newsletter-signup.md`.

## Lifecycle
PRD → Spec (`docs/superpowers/specs/`) → Plan (`docs/plans/active/`) → Code → optional Runbook.

Front-matter on the spec should reference the PRD: `prd_for: prds/2026-04-26-newsletter-signup.md`.
