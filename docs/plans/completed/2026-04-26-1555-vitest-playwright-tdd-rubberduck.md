# Plan: docs/plans convention + Vitest + Playwright + TDD-Guard + rubberduck swap

## Context

Five things in execution order. Ordered so the only step requiring a Claude Code restart (the MCP swap) is **last**, meaning all prior work is captured on disk and can be resumed by a new session via the persisted plan file.

1. **Plans convention**: set up `docs/plans/{active,completed,abandoned}/` in the repo, seed it with this plan, and add a CLAUDE.md line. Solves the gap that plans previously had no durable, status-tracked home — restart killed conversation context with no breadcrumb to resume.
2. **Vitest + TDD-Guard**: TDD-Guard is enabled (`.claude/tdd-guard/data/instructions.md` populated) but dormant. Wire up Vitest with the `tdd-guard-vitest` reporter so Red-Green-Refactor is hook-enforced on every edit.
3. **Playwright e2e**: parallel slow-loop runner. **Important caveat**: TDD-Guard does NOT publish a Playwright reporter (only Vitest/Jest/Storybook/pytest/PHPUnit/Go/Rust/RSpec). Playwright runs via the standard `@playwright/test` runner, separate from TDD-Guard's hook enforcement. The TDD *discipline* still applies (write a failing e2e first), but as a manual habit, not a hook gate. Correct by design — gating edits on full browser runs would be too slow.
4. **CLAUDE.md update**: reflect new test commands, TDD-Guard scope (unit only), project-scoped Codex plugin, rubberduck swap, plans convention.
5. **Rubberduck MCP swap**: replace the human↔AI back-channel `rubberduck-mcp` (npm global, Homebrew-symlinked) with `mcp-rubber-duck` ([nesquikm/mcp-rubber-duck](https://github.com/nesquikm/mcp-rubber-duck)) — same name, different purpose: lets Claude consult other LLM CLIs as "ducks" for second opinions. **Last** because it requires a Claude Code restart to take effect.

## Decisions confirmed

- **Plans**: project-local `docs/plans/{active,completed,abandoned}/`. Filenames `YYYY-MM-DD-HHMM-{slug}.md`. Subfolders for status (no frontmatter). Only `active/` auto-loads.
- **Rubberduck**: switch fully to `mcp-rubber-duck` (per nesquikm). Remove the existing `rubberduck-mcp` binary.
- **Vitest scope**: minimal/unit-test ready. No scaffolded smoke test.
- **Playwright scope**: minimal — runner + config + `e2e/` dir + `pnpm test:e2e` scripts + Chromium only (other browsers added later if needed). No scaffolded test. Webserver uses `pnpm dev` with `reuseExistingServer` in non-CI runs.
- **TDD-Guard scope**: gates on Vitest only. E2e is a separate command, deliberately ungated.
- **Execution order**: MCP swap is last so a single restart at the end picks it up; everything before is plain bash + file edits and survives restart via the persisted plan.

## Phase 1 — Plans convention

### 1a. Create the directory structure

```bash
mkdir -p /Users/kk-mac/prologue/docs/plans/active
mkdir -p /Users/kk-mac/prologue/docs/plans/completed
mkdir -p /Users/kk-mac/prologue/docs/plans/abandoned
```

### 1b. Seed `active/` with this plan

This plan currently lives at `/Users/kk-mac/.claude/plans/i-ve-installed-a-few-buzzing-ritchie.md` (auto-generated location). Copy it to the canonical location:

```bash
cp /Users/kk-mac/.claude/plans/i-ve-installed-a-few-buzzing-ritchie.md \
   /Users/kk-mac/prologue/docs/plans/active/2026-04-26-1530-vitest-playwright-tdd-rubberduck.md
```

Adjust the `1530` to the actual time when execution runs. Both files coexist for this session — the auto-generated copy is what plan mode reads from; the canonical copy is what survives across sessions and gets committed. The auto-generated copy can be deleted after Phase 5 completes (or left to be overwritten by the next plan-mode session).

### 1c. CLAUDE.md update

Handled in Phase 4b — adding a `## Plans` section. Phase 1 only sets up the filesystem; the convention becomes binding once CLAUDE.md ships the rule.

## Phase 2 — Vitest + TDD-Guard

### 2a. Install dev deps

```bash
pnpm add -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  tdd-guard-vitest
```

- `vitest` — runner.
- `@vitejs/plugin-react` — JSX/Fast Refresh in tests.
- `vite-tsconfig-paths` — picks up the `@/*` alias from `tsconfig.json` so tests can import like the app does.
- `jsdom` — DOM environment for component tests.
- `@testing-library/{react,jest-dom,user-event}` — standard React component testing kit.
- `tdd-guard-vitest` — TDD-Guard reporter (writes results to `.claude/tdd-guard/data/test.json`).

### 2b. Create `vitest.config.ts` at repo root

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    reporters: [
      'default',
      ['tdd-guard-vitest', { projectRoot: '/Users/kk-mac/prologue' }],
    ],
  },
})
```

Absolute `projectRoot` is required by tdd-guard-vitest per the plugin's setup skill.

### 2c. Create `vitest.setup.ts` at repo root

```typescript
import '@testing-library/jest-dom/vitest'
```

That's it — registers jest-dom matchers (`.toBeInTheDocument()` etc.) on Vitest's `expect`.

### 2d. Add scripts to `package.json`

Add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run",
"test:ui": "vitest --ui"
```

(`test:ui` is harmless — it errors politely if `@vitest/ui` isn't installed; user can add later if they want it.)

### 2e. Verify TDD-Guard wires up

```bash
pnpm test:run --reporter=verbose 2>&1 | head -20
```

Expected: "No test files found" (clean exit). Then create a trivial passing test in a scratch file to confirm `.claude/tdd-guard/data/test.json` gets written, then delete the scratch test. (Doing this manually rather than scaffolding a permanent smoke test, per the chosen scope.)

## Phase 3 — Playwright (e2e, parallel slow loop)

### 3a. Install dev deps

```bash
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Just Chromium for now — Firefox/WebKit can be added later with `pnpm exec playwright install firefox webkit`. Each browser is ~150 MB so adding all three by default would be wasteful.

### 3b. Create `playwright.config.ts` at repo root

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

`reuseExistingServer: !process.env.CI` means: in local dev, if `pnpm dev` is already running, Playwright reuses it; in CI, always start fresh.

### 3c. Create `e2e/` directory

```bash
mkdir /Users/kk-mac/prologue/e2e
```

Empty — first test gets written TDD-style when the user starts an e2e flow. (No scaffolded sample, per the minimal scope decision.)

### 3d. Add scripts to `package.json`

Add to `"scripts"`:
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:debug": "playwright test --debug"
```

### 3e. Update `.gitignore`

Append:
```
# Playwright
/playwright-report/
/test-results/
/blob-report/
/playwright/.cache/
```

### 3f. Note on TDD-Guard interaction

Playwright runs through its own `@playwright/test` runner — TDD-Guard's hook does **not** see e2e test runs and will not block edits based on e2e state. This is intentional: e2e is the slow-loop verification layer, the unit suite is the fast-loop gate. Apply TDD discipline to e2e manually (write the failing flow first, implement minimally), but treat it as a separate cadence from the inner Vitest loop.

## Phase 4 — Update `/Users/kk-mac/prologue/CLAUDE.md`

Three edits:

### 4a. Update Commands block

Replace:
```markdown
```bash
pnpm dev       # start dev server on http://localhost:3000
pnpm build     # production build
pnpm lint      # ESLint (v9 flat config)
```

No test framework is configured yet.
```

With:
```markdown
```bash
pnpm dev            # start dev server on http://localhost:3000
pnpm build          # production build
pnpm lint           # ESLint (v9 flat config)
pnpm test           # Vitest in watch mode (unit/component, TDD-Guard gates this loop)
pnpm test:run       # Vitest single run (use this for CI-style checks)
pnpm test:e2e       # Playwright e2e (parallel slow loop, not gated by TDD-Guard)
pnpm test:e2e:ui    # Playwright in UI mode for debugging
```
```

### 4b. Append a `## Tooling` section after `## Architecture`

```markdown
## Tooling

Project-scoped agent tooling beyond the global config:

- **Testing**: Vitest for unit/component tests (`pnpm test`), Playwright for e2e (`pnpm test:e2e`). Configs at `vitest.config.ts` and `playwright.config.ts`. E2e specs live in `e2e/`.
- **TDD-Guard is active** (`.claude/tdd-guard/data/instructions.md`) and wired to Vitest via `tdd-guard-vitest`. Red-Green-Refactor is hook-enforced on the Vitest loop: one failing test at a time, minimal implementation, refactor only with tests green. **It does NOT gate Playwright runs** — apply TDD discipline manually at the e2e layer (write the failing flow first), but treat it as a separate cadence from the inner unit loop.
- **Codex plugin** (`codex@openai-codex`, project-scoped) — `/codex:rescue` to hand a stuck task or deeper investigation to GPT-5/Codex; `/codex:review` and `/codex:adversarial-review` for second-opinion review of pending changes. The `codex-rescue` subagent is also available via the Agent tool.
- **Rubber Duck MCP** (`mcp-rubber-duck`) — exposes MCP tools that let Claude consult Claude/Codex/Gemini CLIs as "ducks" for quick second opinions inline (lighter-weight than spawning the rescue subagent).
```

### 4c. Append a `## Plans` section after `## Tooling`

```markdown
## Plans

Implementation plans live in `docs/plans/{active,completed,abandoned}/` with filenames `YYYY-MM-DD-HHMM-{slug}.md`. When entering plan mode for new work, save there (not the Claude Code default `~/.claude/plans/` location). Move between subfolders to update status. Only `active/` is auto-loaded into context; `completed/` and `abandoned/` are reference-only — read on request.
```

Rationale for the bigger CLAUDE.md: still concise relative to what it documents — four tooling bullets, one plans paragraph. Each line earns its place because future sessions need it to behave correctly without the user re-explaining.

## Phase 5 — Swap rubberduck MCPs (last — requires restart)

### 5a. Uninstall the old binary

```bash
npm uninstall -g rubberduck-mcp
```

It's a global npm install (`/opt/homebrew/bin/rubberduck-mcp` → `../lib/node_modules/rubberduck-mcp/bin/rubberduck`). Removes the symlink and the package.

### 5b. Replace `~/.claude/.mcp.json`

Current content:
```json
{
  "rubberduck": {
    "command": "/opt/homebrew/bin/rubberduck-mcp",
    "args": []
  }
}
```

New content (per nesquikm/mcp-rubber-duck's README):
```json
{
  "mcpServers": {
    "rubberduck": {
      "command": "npx",
      "args": ["mcp-rubber-duck"],
      "env": {
        "CLI_CLAUDE_ENABLED": "true",
        "CLI_CODEX_ENABLED": "true",
        "CLI_GEMINI_ENABLED": "true",
        "MCP_SERVER": "true"
      }
    }
  }
}
```

Note: the existing file is missing the `mcpServers` wrapper that Claude Code expects. Fixing that as part of the swap.

### 5c. Pre-warm the npm package

```bash
npx --yes mcp-rubber-duck --help
```

So the first MCP startup isn't blocked on a download. Permissions allowlist already covers `npx` for rubberduck-style invocations.

### 5d. Restart Claude Code

This is the only step requiring a restart. After restart, the new session loads:
- The updated `~/.claude/.mcp.json` → `mcp-rubber-duck` MCP tools become available.
- The updated `CLAUDE.md` → including the new `## Plans` rule.
- The seeded `docs/plans/active/2026-04-26-1530-vitest-playwright-tdd-rubberduck.md` is on disk for reference (move to `completed/` once the user confirms everything works).

## Critical files

- `/Users/kk-mac/prologue/docs/plans/{active,completed,abandoned}/` — create (Phase 1a).
- `/Users/kk-mac/prologue/docs/plans/active/2026-04-26-1530-vitest-playwright-tdd-rubberduck.md` — create as a copy of this plan (Phase 1b).
- `/Users/kk-mac/prologue/package.json` — `pnpm add -D` updates `devDependencies` across Phases 2a + 3a; manually add Vitest scripts (Phase 2d) and Playwright scripts (Phase 3d).
- `/Users/kk-mac/prologue/vitest.config.ts` — create (Phase 2b).
- `/Users/kk-mac/prologue/vitest.setup.ts` — create (Phase 2c).
- `/Users/kk-mac/prologue/playwright.config.ts` — create (Phase 3b).
- `/Users/kk-mac/prologue/e2e/` — create empty directory (Phase 3c).
- `/Users/kk-mac/prologue/.gitignore` — append Playwright outputs (Phase 3e).
- `/Users/kk-mac/prologue/CLAUDE.md` — three edits (Phase 4a, 4b, 4c).
- `~/.claude/.mcp.json` — replace contents (Phase 5b).

No changes to `/Users/kk-mac/prologue/.claude/tdd-guard/data/instructions.md` (already correct) or to `/Users/kk-mac/prologue/.claude/settings.json` (codex plugin enablement is already correct).

## Verification

End-to-end check after execution:

1. **Plans structure**:
   ```bash
   ls /Users/kk-mac/prologue/docs/plans/active/
   ```
   Should list this plan with the date-prefixed filename. `completed/` and `abandoned/` exist and are empty.

2. **Vitest**:
   ```bash
   pnpm test:run                          # exits 0 with "no test files found"
   ls -la .claude/tdd-guard/data/         # test.json absent until first run
   ```
   Then write a trivial `app/page.test.tsx` (render Home, expect heading) and run `pnpm test:run`:
   - Test passes.
   - `.claude/tdd-guard/data/test.json` gets written.
   - Delete the scratch test (or keep it — user's call).

3. **Playwright**:
   ```bash
   pnpm test:e2e --list    # lists 0 tests, exits 0
   pnpm exec playwright --version
   ```
   Then write a trivial `e2e/home.spec.ts` (visit `/`, assert title), run `pnpm test:e2e`:
   - Webserver auto-starts via `pnpm dev`.
   - Test passes against Chromium.
   - Delete the scratch test.

4. **CLAUDE.md**:
   ```bash
   cat /Users/kk-mac/prologue/CLAUDE.md
   ```
   Confirm Commands block shows the new `pnpm test*` lines and the `## Tooling` + `## Plans` sections are appended cleanly.

5. **Rubberduck swap**:
   ```bash
   which rubberduck-mcp        # should print nothing (uninstalled)
   cat ~/.claude/.mcp.json     # should show mcp-rubber-duck config
   ```
   Restart Claude Code session. New session should:
   - Show `mcp__rubberduck__*` tools (the duck-consultation MCP) instead of the old `rubberduck-mcp` CLI.
   - Pick up the new `## Plans` rule from CLAUDE.md.

6. **TDD-Guard live**: in the post-restart session, attempt to write implementation code without a failing Vitest test → TDD-Guard should block the edit. Confirms enforcement is wired through. (Edits made while a Playwright test exists but no Vitest test will still be blocked — TDD-Guard only counts Vitest as the gate.)

7. **Move plan to `completed/`** (manual, after the above passes):
   ```bash
   mv /Users/kk-mac/prologue/docs/plans/active/2026-04-26-1530-vitest-playwright-tdd-rubberduck.md \
      /Users/kk-mac/prologue/docs/plans/completed/
   ```
